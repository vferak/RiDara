import { Migration } from '@mikro-orm/migrations';

export class Migration20230324144151 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `template_version` (`uuid` varchar(255) not null, `template_uuid` varchar(255) not null, `file_name` varchar(255) not null, `create_date` datetime not null, `state` enum(\'published\', \'draft\', \'history\') not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `template_version` add index `template_version_template_uuid_index`(`template_uuid`);');

    this.addSql('alter table `template_version` add constraint `template_version_template_uuid_foreign` foreign key (`template_uuid`) references `template` (`uuid`) on update cascade;');

    this.addSql('alter table `template_node` drop foreign key `template_node_template_uuid_foreign`;');

    this.addSql('alter table `template` drop `file_name`;');

    this.addSql('alter table `template_node` drop index `template_node_template_uuid_index`;');
    this.addSql('alter table `template_node` change `template_uuid` `template_version_uuid` varchar(255) not null;');
    this.addSql('alter table `template_node` add constraint `template_node_template_version_uuid_foreign` foreign key (`template_version_uuid`) references `template_version` (`uuid`) on update cascade;');
    this.addSql('alter table `template_node` add index `template_node_template_version_uuid_index`(`template_version_uuid`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `template_node` drop foreign key `template_node_template_version_uuid_foreign`;');

    this.addSql('drop table if exists `template_version`;');

    this.addSql('alter table `template` add `file_name` varchar(255) not null;');

    this.addSql('alter table `template_node` drop index `template_node_template_version_uuid_index`;');
    this.addSql('alter table `template_node` change `template_version_uuid` `template_uuid` varchar(255) not null;');
    this.addSql('alter table `template_node` add constraint `template_node_template_uuid_foreign` foreign key (`template_uuid`) references `template` (`uuid`) on update cascade;');
    this.addSql('alter table `template_node` add index `template_node_template_uuid_index`(`template_uuid`);');
  }

}
