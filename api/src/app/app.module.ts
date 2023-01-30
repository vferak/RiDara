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
import { UserModule } from './shared/user/user.module';

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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
