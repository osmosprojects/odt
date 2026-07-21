"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async login(credentials) {
        const { username, password } = credentials;
        if (!username || !password) {
            throw new common_1.BadRequestException('Username and password are required');
        }
        const user = {
            userId: 101,
            loginId: username,
            userCode: 'EMP' + Math.floor(1000 + Math.random() * 9000),
            fullName: username === 'admin' ? 'System Admin' : 'John Doe',
            email: `${username}@castrol-odt.com`,
            role: username === 'admin' ? 'Admin' : 'Sales Representative',
            stream: 'B2B',
            channel: 'HD',
            territoryCode: 'TERR_NORTH_01',
        };
        const payload = {
            sub: user.userId,
            loginId: user.loginId,
            userCode: user.userCode,
            email: user.email,
            role: user.role,
            stream: user.stream,
            channel: user.channel,
        };
        const token = this.jwtService.sign(payload);
        return {
            message: 'Login successful',
            accessToken: token,
            user: {
                id: user.userId,
                name: user.fullName,
                email: user.email,
                role: user.role,
                stream: user.stream,
                channel: user.channel,
            },
        };
    }
    async getProfile(userPayload) {
        return {
            userId: userPayload.sub,
            loginId: userPayload.loginId,
            userCode: userPayload.userCode,
            email: userPayload.email,
            role: userPayload.role,
            stream: userPayload.stream,
            channel: userPayload.channel,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map