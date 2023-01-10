import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    public constructor(private readonly userRepository: UserRepository) {}

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

    public async remove(user: User): Promise<void> {
        await this.userRepository.removeAndFlush(user);
    }
}
