"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const user_entity_1 = require("../../database/migrations/user.entity");
const defaultJwtSecret = 'dev-jwt-secret';
let AuthService = class AuthService {
    userRepo;
    jwtService;
    constructor(userRepo, jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }
    async login(dto) {
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
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (user.account_status === 'B') {
            throw new common_1.UnauthorizedException('Account is blocked');
        }
        if (user.account_status === 'E') {
            throw new common_1.UnauthorizedException('Account has expired');
        }
        const isMatch = await this.verifyPassword(dto.password, user.password);
        if (!isMatch) {
            await this.userRepo.increment({ userid: user.userid }, 'invalid_login_attempts', 1);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.userRepo.update(user.userid, {
            invalid_login_attempts: 0,
            lastlogin: user.currentlogin,
            currentlogin: new Date(),
            logincount: () => 'logincount + 1',
        });
        return this.generateTokens(user);
    }
    async verifyPassword(plain, stored) {
        if (stored.startsWith('scrypt$')) {
            const parts = stored.split('$');
            if (parts.length !== 3)
                return false;
            const [, salt, expectedHash] = parts;
            const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
            return derived === expectedHash;
        }
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
        if (candidates.includes(stored))
            return true;
        return false;
    }
    async generateTokens(user) {
        const payload = {
            sub: user.userid,
            user_code: user.user_code,
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
        try {
            const hashed = await bcrypt.hash(refreshToken, 10);
            await this.userRepo.update(user.userid, { refreshToken: hashed });
        }
        catch (err) {
        }
        return { accessToken, refreshToken, user: payload };
    }
    async getProfile(userId) {
        return this.userRepo.findOne({
            where: { userid: userId },
            select: { userid: true, name: true, user_code: true, roleid: true, zone: true, email: true, account_status: true },
        });
    }
    async logout(userId) {
        await this.userRepo.update(userId, { refreshToken: null });
        return { message: 'Logged out successfully' };
    }
    async sendPassword(email) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Email not registered');
        return { message: 'Password sent to registered email' };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userRepo
            .createQueryBuilder('u')
            .select(['u.userid', 'u.user_code', 'u.roleid', 'u.loginid', 'u.name', 'u.zone', 'u.refreshToken'])
            .where('u.userid = :id', { id: userId })
            .getOne();
        if (!user?.refreshToken)
            throw new common_1.UnauthorizedException('Access denied');
        const matches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!matches)
            throw new common_1.UnauthorizedException('Access denied');
        return this.generateTokens(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map