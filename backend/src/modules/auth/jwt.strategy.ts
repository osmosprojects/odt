import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/migrations/user.entity';

const defaultJwtSecret = 'dev-jwt-secret';

export interface JwtPayload {
  sub: number;      // userid
  user_code: string; // PHP: $_SESSION['usercode_s']
  role: string;     // PHP: $_SESSION['user_rolecode_s']
  name: string;
  zone?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', defaultJwtSecret),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.userRepo.findOne({
      where: { userid: payload.sub, account_status: 'A' },
      select: {userid:true},
    });
    if (!user) throw new UnauthorizedException('User inactive or not found');
    return payload;
  }
}
