import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { User } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateUserDto } from './dto/create-user.dto';
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

    public async create(createUserDto: CreateUserDto): Promise<User> {
        const user = User.create(createUserDto);

        await this.userRepository.persistAndFlush(user);

        return user;
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
