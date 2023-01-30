import { Migration } from '@mikro-orm/migrations';

export class Migration20230130155533 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `project` (`uuid` varchar(255) not null, `name` varchar(255) not null, `create_date` datetime not null, `owner_uuid` varchar(255) not null, `workspace_uuid` varchar(255) not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `project` add index `project_owner_uuid_index`(`owner_uuid`);');
    this.addSql('alter table `project` add index `project_workspace_uuid_index`(`workspace_uuid`);');

    this.addSql('alter table `project` add constraint `project_owner_uuid_foreign` foreign key (`owner_uuid`) references `user` (`uuid`) on update cascade;');
    this.addSql('alter table `project` add constraint `project_workspace_uuid_foreign` foreign key (`workspace_uuid`) references `workspace` (`uuid`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `project`;');
  }

}
