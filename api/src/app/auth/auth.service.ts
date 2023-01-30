import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../shared/user/user.entity';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(user: User): Promise<string> {
        const payload = { uuid: user.getUuid(), username: user.getEmail() };

        return this.jwtService.sign(payload);
    }
}
