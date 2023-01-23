import { Migration } from '@mikro-orm/migrations';

export class Migration20230128122920 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `ontology_file` (`uuid` varchar(255) not null, `name` varchar(255) not null, `create_date` datetime not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `ontology_node` (`uuid` varchar(255) not null, `name` varchar(255) not null, `create_date` datetime not null, `file_uuid` varchar(255) not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `ontology_node` add index `ontology_node_file_uuid_index`(`file_uuid`);');

    this.addSql('alter table `ontology_node` add constraint `ontology_node_file_uuid_foreign` foreign key (`file_uuid`) references `ontology_file` (`uuid`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `ontology_node` drop foreign key `ontology_node_file_uuid_foreign`;');

    this.addSql('drop table if exists `ontology_file`;');

    this.addSql('drop table if exists `ontology_node`;');
  }

}
