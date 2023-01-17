import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(user: User): Promise<string> {
        const payload = { uuid: user.getUuid(), username: user.getEmail() };

        return this.jwtService.sign(payload);
    }
}
