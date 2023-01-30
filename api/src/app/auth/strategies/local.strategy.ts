import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BcryptService } from '../../common/providers/bcrypt.service';
import { UserService } from '../../shared/user/user.service';
import { User } from '../../shared/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
        private bcryptService: BcryptService,
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<User> {
        const user = await this.userService.findOneByEmail(username);
        if (
            user === null ||
            !(await this.bcryptService.compare(password, user.getPassword()))
        ) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
