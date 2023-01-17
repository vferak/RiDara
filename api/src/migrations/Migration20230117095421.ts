import { Migration } from '@mikro-orm/migrations';

export class Migration20230117095421 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table `user` (`uuid` varchar(255) not null, `email` varchar(255) not null, `password` varchar(255) not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;',
        );

        this.addSql(
            'create table `workspace` (`uuid` varchar(255) not null, `name` varchar(255) not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;',
        );

        this.addSql(
            'create table `user_workspace` (`workspace_uuid` varchar(255) not null, `user_uuid` varchar(255) not null, `role` varchar(255) not null, primary key (`workspace_uuid`, `user_uuid`)) default character set utf8mb4 engine = InnoDB;',
        );
        this.addSql(
            'alter table `user_workspace` add index `user_workspace_workspace_uuid_index`(`workspace_uuid`);',
        );
        this.addSql(
            'alter table `user_workspace` add index `user_workspace_user_uuid_index`(`user_uuid`);',
        );

        this.addSql(
            'alter table `user_workspace` add constraint `user_workspace_workspace_uuid_foreign` foreign key (`workspace_uuid`) references `workspace` (`uuid`) on update cascade;',
        );
        this.addSql(
            'alter table `user_workspace` add constraint `user_workspace_user_uuid_foreign` foreign key (`user_uuid`) references `user` (`uuid`) on update cascade;',
        );
    }
}
