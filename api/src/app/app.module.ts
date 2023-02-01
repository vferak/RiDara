import configuration from '../../config/configuration';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { OntologyModule } from './ontology/ontology.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './shared/user/user.module';
import { TemplateModule } from './template/template.module';
import { AnalyzeModule } from './shared/analyze/analyze.module';

const configModuleOptions: ConfigModuleOptions = {
    load: [configuration],
    cache: true,
};

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        MikroOrmModule.forRoot(),
        CommonModule,
        AuthModule,
        UserModule,
        WorkspaceModule,
        OntologyModule,
        ProjectModule,
        TemplateModule,
        AnalyzeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
