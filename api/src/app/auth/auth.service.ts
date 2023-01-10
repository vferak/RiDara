import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from './providers/bcrypt.service';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly bcryptService: BcryptService,
        private readonly userRepository: UserRepository,
    ) {}

    async login(user: User): Promise<string> {
        const payload = { username: user.getEmail(), sub: user.getPassword() };

        return this.jwtService.sign(payload);
    }

    public async register(createUserDto: CreateUserDto): Promise<User> {
        createUserDto.password = await this.bcryptService.hash(
            createUserDto.password,
        );
        const user = User.create(createUserDto);
        await this.userRepository.persistAndFlush(user);

        return user;
    }
}
