import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super();
    }

    async validate(email: string, password: string): Promise<User> {
        const user = await this.userService.findOneByEmail(email);

        if (user === null || !user.validatePassword(password)) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
