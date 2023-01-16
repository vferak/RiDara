import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { BcryptService } from '../common/providers/bcrypt.service';

@Injectable()
export class UserService {
    public constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
    ) {}

    public async register(createUserDto: CreateUserDto): Promise<User> {
        createUserDto.password = await this.bcryptService.hash(
            createUserDto.password,
        );
        const user = User.create(createUserDto);
        await this.userRepository.persistAndFlush(user);

        return user;
    }

    public async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    public async getOneByUuid(uuid: string): Promise<User> {
        return this.userRepository.findOneOrFail({ uuid: uuid });
    }

    public async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ email: email });
    }

    public async update(
        user: User,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        updateUserDto.password = await this.bcryptService.hash(
            updateUserDto.password,
        );
        user.update(updateUserDto);

        await this.userRepository.flush();

        return user;
    }

    public async remove(user: User): Promise<void> {
        await this.userRepository.removeAndFlush(user);
    }
}
