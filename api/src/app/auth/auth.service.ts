import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(user: User): Promise<string> {
        const payload = { username: user.getEmail(), sub: user.getPassword() };

        return this.jwtService.sign(payload);
    }
}
