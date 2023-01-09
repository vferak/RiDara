import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Entity()
export class User {
    @PrimaryKey()
    private uuid: string;

    @Property()
    private email!: string;

    @Property()
    private password!: string;

    private constructor(uuid: string, email: string, password: string) {
        this.uuid = uuid;
        this.email = email;
        this.password = password;
    }

    public static create(createUserDto: CreateUserDto): User {
        const uuid = v4();
        return new User(uuid, createUserDto.email, createUserDto.password);
    }

    public update(updateUserDto: UpdateUserDto): void {
        this.email = updateUserDto.email;
        this.password = updateUserDto.password;
    }
    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }
}
