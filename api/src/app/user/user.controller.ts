import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserByUuidPipe } from './pipes/user-by-uuid.pipe';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    public async getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':uuid')
    public async getByUuid(
        @Param('uuid', UserByUuidPipe) user: User,
    ): Promise<User> {
        return user;
    }

    @Patch(':uuid')
    public async update(
        @Param('uuid', UserByUuidPipe) user: User,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(user, updateUserDto);
    }

    @Delete(':uuid')
    public async remove(
        @Param('uuid', UserByUuidPipe) user: User,
    ): Promise<void> {
        await this.userService.remove(user);
    }
}
