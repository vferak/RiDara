import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './providers/api-config.service';
import { ConfigModule } from '@nestjs/config';
import { BcryptService } from './providers/bcrypt.service';
import { FileModule } from './file/file.module';

@Global()
@Module({
    imports: [ConfigModule, FileModule],
    providers: [ApiConfigService, BcryptService],
    exports: [FileModule, ApiConfigService, BcryptService],
})
export class CommonModule {}
