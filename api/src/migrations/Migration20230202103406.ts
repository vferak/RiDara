import { Migration } from '@mikro-orm/migrations';

export class Migration20230202103406 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `template` (`uuid` varchar(255) not null, `name` varchar(255) not null, `author` varchar(255) not null, `create_date` datetime not null, `ontology_file_uuid` varchar(255) not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `template` add index `template_ontology_file_uuid_index`(`ontology_file_uuid`);');

    this.addSql('alter table `template` add constraint `template_ontology_file_uuid_foreign` foreign key (`ontology_file_uuid`) references `ontology_file` (`uuid`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `template`;');
  }

}
