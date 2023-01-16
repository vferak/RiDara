import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './providers/api-config.service';
import { ConfigModule } from '@nestjs/config';
import { BcryptService } from './providers/bcrypt.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [ApiConfigService, BcryptService],
    exports: [ApiConfigService, BcryptService],
})
export class CommonModule {}
