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
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Workspace } from '../workspace/workspace.entity';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @Post('register')
    public async register(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.register(createUserDto);
    }
    @Get()
    public async getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('dashboard')
    public async getDashboard(@CurrentUser() user: User): Promise<Workspace[]> {
        return user.getWorkspaces();
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
