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

@Controller('workspace')
export class WorkspaceController {
    constructor(
        private readonly workspaceService: WorkspaceService,
        private readonly userService: UserService,
    ) {}

    @Get()
    public async getAll(): Promise<Workspace[]> {
        return this.workspaceService.findAll();
    }

    @Post('')
    public async create(
        @Body() createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<Workspace> {
        const user = await this.userService.getOneByUuid(
            createWorkspaceDto.user,
        );
        return this.workspaceService.create(createWorkspaceDto, user);
    }

    @Get(':uuid')
    public async getByUuid(
        @Param('uuid', WorkspaceByUuidPipe) workspace: Workspace,
    ): Promise<Workspace> {
        return workspace;
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
        await this.workspaceService.remove(workspace);
    }

    @Post('add_user')
    public async addUser(
        @Body() addUserToWorkspaceDto: AddUserToWorkspaceDto,
    ): Promise<void> {
        const user = await this.userService.getOneByUuid(
            addUserToWorkspaceDto.usersUuid,
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
}
