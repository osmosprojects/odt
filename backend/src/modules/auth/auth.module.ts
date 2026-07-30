import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtRefreshStrategy } from '../auth/jwt-refresh.strategy';
import { RolesGuard } from '../../common/guards/role.guard';
import { UserEntity } from '../../database/migrations/user.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

const defaultJwtSecret = 'dev-jwt-secret';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', defaultJwtSecret),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '8h') },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController,PermissionsController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, RolesGuard,PermissionsService],
  exports: [AuthService, JwtModule, RolesGuard,PermissionsService],
})
export class AuthModule {}
