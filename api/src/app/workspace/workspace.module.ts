import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { Workspace } from './workspace.entity';
import { UserModule } from '../shared/user/user.module';
import { UserWorkspaceModule } from './userWorkspace/userWorkspace.module';

@Module({
    imports: [
        MikroOrmModule.forFeature([Workspace]),
        UserModule,
        UserWorkspaceModule,
    ],
    controllers: [WorkspaceController],
    providers: [WorkspaceService],
    exports: [WorkspaceService, MikroOrmModule],
})
export class WorkspaceModule {}
