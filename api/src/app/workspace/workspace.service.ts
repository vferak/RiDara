import { Injectable } from '@nestjs/common';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UserWorkspace } from '../userWorkspace/userWorkspace.entity';
import { User } from '../user/user.entity';
import { WorkspaceRepository } from './workspace.repository';
import { UserWorkspaceRepository } from '../userWorkspace/userWorkspace.repository';
import { EntityManager } from '@mikro-orm/mariadb';

@Injectable()
export class WorkspaceService {
    public constructor(
        private readonly workspaceRepository: WorkspaceRepository,
        private readonly userWorkspaceRepository: UserWorkspaceRepository,
        private readonly entityManager: EntityManager,
    ) {}

    public async create(
        createWorkspaceDto: CreateWorkspaceDto,
        user: User,
    ): Promise<Workspace> {
        const workspace = Workspace.create(createWorkspaceDto, user);
        this.workspaceRepository.persist(workspace);
        await this.workspaceRepository.flush();

        const userWorkspace = await UserWorkspace.create(
            workspace,
            user,
            'admin',
        );

        this.userWorkspaceRepository.persist(userWorkspace);
        await this.workspaceRepository.flush();

        return workspace;
    }

    public async findAll(): Promise<Workspace[]> {
        return this.workspaceRepository.findAll();
    }

    public async getOneByUuid(uuid: string): Promise<Workspace> {
        return this.workspaceRepository.findOneOrFail({ uuid: uuid });
    }

    public async update(
        workspace: Workspace,
        updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<Workspace> {
        workspace.update(updateWorkspaceDto);

        await this.workspaceRepository.flush();

        return workspace;
    }

    public async remove(workspace: Workspace): Promise<void> {
        await this.workspaceRepository.removeAndFlush(workspace);
    }

    public async addUserToWorkspace(
        workspace: Workspace,
        user: User,
        role: string,
    ): Promise<void> {
        const userWorkspace = await UserWorkspace.create(workspace, user, role);
        await this.userWorkspaceRepository.persistAndFlush(userWorkspace);
    }
}
