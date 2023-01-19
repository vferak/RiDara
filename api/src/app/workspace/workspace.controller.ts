import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { Workspace } from './workspace.entity';
import { WorkspaceByUuidPipe } from './pipes/workspace-by-uuid.pipe';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UserService } from '../user/user.service';
import { AddUserToWorkspaceDto } from '../userWorkspace/dto/create-userWorkspace.dto';
import { UserWorkspaceService } from '../userWorkspace/userWorkspace.service';
import { DeleteUserWorkspaceDto } from '../userWorkspace/dto/delete-userWorkspace.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../user/user.entity';
import { EntityManager } from '@mikro-orm/mariadb';

@Controller('workspace')
export class WorkspaceController {
    constructor(
        private readonly workspaceService: WorkspaceService,
        private readonly userService: UserService,
        private readonly userWorkspaceService: UserWorkspaceService,

        private readonly entityManager: EntityManager,
    ) {}

    @Get('all')
    public async getAll(): Promise<Workspace[]> {
        return this.workspaceService.findAll();
    }

    @Post('')
    public async create(
        @Body() createWorkspaceDto: CreateWorkspaceDto,
        @CurrentUser() user: User,
    ): Promise<Workspace> {
        return this.workspaceService.create(createWorkspaceDto, user);
    }

    @Get(':uuid/settings')
    public async getByUuid(
        @Param('uuid', WorkspaceByUuidPipe) workspace: Workspace,
    ): Promise<Workspace> {
        return workspace;
    }

    @Get(':uuid/users')
    public async getUsersByWorkspace(
        @Param('uuid', WorkspaceByUuidPipe) workspace: Workspace,
    ): Promise<User[]> {
        return workspace.getUsers();
    }

    @Get(':uuid/usersNotInWorkspace')
    public async getUsersNotInWorkspace(
        @Param('uuid', WorkspaceByUuidPipe) workspace: Workspace,
    ): Promise<User[]> {
        const usersInWorkspace = await workspace.getUsers();
        const allUsers = await this.userService.findAll();

        return allUsers.filter(
            (a) => !usersInWorkspace.find((u) => u.getUuid() === a.getUuid()),
        );
    }

    @Get()
    public async getWorkspaces(
        @CurrentUser() user: User,
    ): Promise<Workspace[]> {
        return await user.getWorkspaces();
    }

    @Patch(':uuid')
    public async update(
        @Param('uuid', WorkspaceByUuidPipe) workspace: Workspace,
        @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<Workspace> {
        return this.workspaceService.update(workspace, updateWorkspaceDto);
    }

    @Delete(':uuid')
    public async remove(
        @Param('uuid', WorkspaceByUuidPipe) workspace: Workspace,
    ): Promise<void> {
        const usersInWorkspace =
            await this.userWorkspaceService.getAllByWorkspace(workspace);
        await this.userWorkspaceService.removeAllUsers(usersInWorkspace);
        await workspace.remove(this.entityManager);
    }

    @Post('add_user')
    public async addUser(
        @Body() addUserToWorkspaceDto: AddUserToWorkspaceDto,
    ): Promise<void> {
        const user = await this.userService.getOneByUuid(
            addUserToWorkspaceDto.userUuid,
        );
        const workspace = await this.workspaceService.getOneByUuid(
            addUserToWorkspaceDto.workspaceUuid,
        );
        return this.workspaceService.addUserToWorkspace(
            workspace,
            user,
            addUserToWorkspaceDto.role,
        );
    }

    @Post('remove_user')
    public async removeUser(
        @Body() deleteUserWorkspaceDto: DeleteUserWorkspaceDto,
    ): Promise<void> {
        const user = await this.userService.getOneByUuid(
            deleteUserWorkspaceDto.userUuid,
        );

        const workspace = await this.workspaceService.getOneByUuid(
            deleteUserWorkspaceDto.workspaceUuid,
        );

        const userWorkspace =
            await this.userWorkspaceService.getOneByUserAndWorkspace(
                user,
                workspace,
            );

        return await this.userWorkspaceService.remove(userWorkspace);
    }
}
