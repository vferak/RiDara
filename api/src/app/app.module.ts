import configuration from '../../config/configuration';
import createConfigMicroOrm from "../../mikro-orm.config";

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
import {ApiConfigService} from "./common/providers/api-config.service";
import {MikroOrmModuleOptions} from "@mikro-orm/nestjs/typings";

const configModuleOptions: ConfigModuleOptions = {
    load: [configuration],
    cache: true,
    isGlobal: true,
};

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        CommonModule,
        MikroOrmModule.forRootAsync({
            inject: [ApiConfigService],
            useFactory: (apiConfigService: ApiConfigService): MikroOrmModuleOptions => {
                return createConfigMicroOrm(apiConfigService);
            }
        }),
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
