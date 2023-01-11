import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiConfigService } from '../common/providers/api-config.service';
import { JwtModuleAsyncOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { BcryptService } from '../common/providers/bcrypt.service';

const jwtConfig: JwtModuleAsyncOptions = {
    inject: [ApiConfigService],
    useFactory: (config: ApiConfigService) => {
        const jwtConfig = config.getJwt();

        return {
            secret: jwtConfig.secret_key,
            signOptions: {
                expiresIn: jwtConfig.expiration,
            },
        };
    },
};

@Module({
    imports: [PassportModule, JwtModule.registerAsync(jwtConfig), UserModule],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        BcryptService,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
    ],
    controllers: [AuthController],
})
export class AuthModule {}
