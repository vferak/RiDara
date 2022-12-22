import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
    constructor(private configService: ConfigService) {}

    public getDatabase(): Record<string, any> {
        return this.configService.get<Record<string, any>>('database');
    }

    public getJwt(): Record<string, any> {
        return this.configService.get<Record<string, any>>('jwt');
    }
}
