import { Migration } from '@mikro-orm/migrations';

export class Migration20230213161127 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `ontology_relation` (`uuid` varchar(255) not null, `source_ref` varchar(255) not null, `targer_ref` varchar(255) not null, `ontology_file_uuid` varchar(255) not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `ontology_relation` add index `ontology_relation_ontology_file_uuid_index`(`ontology_file_uuid`);');

    this.addSql('alter table `ontology_relation` add constraint `ontology_relation_ontology_file_uuid_foreign` foreign key (`ontology_file_uuid`) references `ontology_file` (`uuid`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `ontology_relation`;');
  }

}
