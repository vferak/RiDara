import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './providers/api-config.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [ApiConfigService],
    exports: [ApiConfigService],
})
export class CommonModule {}
