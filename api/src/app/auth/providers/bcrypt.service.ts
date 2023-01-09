import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    private static readonly SALT = 12;
    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, BcryptService.SALT);
    }

    async compare(
        password: string,
        databasePassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, databasePassword);
    }
}
