import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '../../common/providers/bcrypt.service';

@Injectable()
export class UserService {
    public constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
    ) {}

    public async register(createUserDto: CreateUserDto): Promise<boolean> {
        createUserDto.password = await this.bcryptService.hash(
            createUserDto.password,
        );

        const userExists = await this.findOneByEmail(createUserDto.email);

        if (userExists === null) {
            const user = User.create(createUserDto);
            await this.userRepository.persistAndFlush(user);
            return true;
        } else {
            return false;
        }
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
        user.update(updateUserDto);
        await this.userRepository.flush();

        return user;
    }

    public async updatePasword(
        user: User,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        updateUserDto.password = await this.bcryptService.hash(
            updateUserDto.password,
        );
        user.updatePassword(updateUserDto);
        await this.userRepository.flush();

        return user;
    }

    public async remove(user: User): Promise<void> {
        await this.userRepository.removeAndFlush(user);
    }
}
