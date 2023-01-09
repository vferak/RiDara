import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { User } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    public constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,
    ) {}

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
