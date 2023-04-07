import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './providers/api-config.service';
import { BcryptService } from './providers/bcrypt.service';
import { FileModule } from './file/file.module';

@Global()
@Module({
    imports: [FileModule],
    providers: [ApiConfigService, BcryptService],
    exports: [FileModule, ApiConfigService, BcryptService],
})
export class CommonModule {}
