import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEntity } from '../../database/migrations/user.entity';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtPayload } from '../../modules/auth/jwt.strategy';

const defaultJwtSecret = 'dev-jwt-secret';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // Fetch by loginid OR user_code — PHP uses loginid as the login field
    const login = dto.loginid.trim();
    const user = await this.userRepo
      .createQueryBuilder('u')
      .select([
        'u.userid',
        'u.user_code',
        'u.roleid',
        'u.loginid',
        'u.name',
        'u.email',
        'u.zone',
        'u.account_status',
        'u.invalid_login_attempts',
        'u.password',
      ])
      .where('u.loginid = :login OR u.user_code = :login OR u.email = :login', { login })
      .getOne();

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Account status checks — maps to PHP's account_status enum
    if (user.account_status === 'B') {
      throw new UnauthorizedException('Account is blocked');
    }
    if (user.account_status === 'E') {
      throw new UnauthorizedException('Account has expired');
    }

    const isMatch = await this.verifyPassword(dto.password, user.password);
    if (!isMatch) {
      // Increment invalid login attempts (PHP does this too)
      await this.userRepo.increment(
        { userid: user.userid },
        'invalid_login_attempts',
        1,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset invalid attempts and update login timestamps on success
    await this.userRepo.update(user.userid, {
      invalid_login_attempts: 0,
      lastlogin: user.currentlogin,
      currentlogin: new Date(),
      logincount: () => 'logincount + 1',
    });

    return this.generateTokens(user);
  }

  // PHP password hashing is not bcrypt — inspect your actual hash to confirm.
  // Common patterns in older PHP apps:
  //   md5($password)                     → 32 hex chars
  //   md5(md5($password))                → 32 hex chars
  //   sha1($password)                    → 40 hex chars
  //   md5($password . $salt)             → check if password_history has a salt
  //
  // Check your DB: SELECT LENGTH(password), password FROM econ_customers_drm LIMIT 3;
  // Then update this method accordingly.
  private async verifyPassword(plain: string, stored: string): Promise<boolean> {
    if (stored.startsWith('scrypt$')) {
      const parts = stored.split('$');
      if (parts.length !== 3) return false;

      const [, salt, expectedHash] = parts;
      const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
      return derived === expectedHash;
    }

    // If you've migrated to bcrypt (recommended):
    if (stored.startsWith('$2b$') || stored.startsWith('$2a$')) {
      return bcrypt.compare(plain, stored);
    }

    const normalized = plain.trim();
    const candidates = [
      normalized,
      normalized.toLowerCase(),
      normalized.toUpperCase(),
      crypto.createHash('md5').update(normalized).digest('hex'),
      crypto.createHash('md5').update(normalized.toLowerCase()).digest('hex'),
      crypto.createHash('md5').update(normalized.toUpperCase()).digest('hex'),
      crypto.createHash('md5').update(crypto.createHash('md5').update(normalized).digest('hex')).digest('hex'),
      crypto.createHash('sha1').update(normalized).digest('hex'),
      crypto.createHash('sha1').update(normalized.toLowerCase()).digest('hex'),
    ];

    if (candidates.includes(stored)) return true;

    return false;
  }

  async generateTokens(user: UserEntity) {
    const payload: JwtPayload = {
      sub: user.userid,
      user_code: user.user_code,
      // Use `user_code` (NTid / user code) as the role label so it matches
      // the `Role` enum values used by `@Roles(...)` elsewhere.
      role: user.user_code,
      name: user.name,
      zone: user.zone,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET ?? defaultJwtSecret,
        expiresIn: '8h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? defaultJwtSecret,
        expiresIn: '7d',
      }),
    ]);

    // Persist a hashed copy of the refresh token so refresh flow can verify it later
    try {
      const hashed = await bcrypt.hash(refreshToken, 10);
      await this.userRepo.update(user.userid, { refreshToken: hashed });
    } catch (err) {
      // don't fail login if saving refresh token errors — log could be added later
    }

    return { accessToken, refreshToken, user: payload };
  }

  async getProfile(userId: number) {
    return this.userRepo.findOne({
      where: { userid: userId },
      select: {userid:true, name:true, user_code:true, roleid:true, zone:true, email:true, account_status:true},
    });
  }

  async logout(userId: number) {
    await this.userRepo.update(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  }

  async sendPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Email not registered');
    // TODO: wire MailService here in Phase 7
    return { message: 'Password sent to registered email' };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepo
      .createQueryBuilder('u')
      .select(['u.userid', 'u.user_code', 'u.roleid','u.loginid', 'u.name', 'u.zone', 'u.refreshToken'])
      .where('u.userid = :id', { id: userId })
      .getOne();

    if (!user?.refreshToken) throw new UnauthorizedException('Access denied');

    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) throw new UnauthorizedException('Access denied');

    return this.generateTokens(user);
  }
}
