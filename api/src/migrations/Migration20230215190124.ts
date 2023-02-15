import { Migration } from '@mikro-orm/migrations';

export class Migration20230215190124 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `template_node` (`uuid` varchar(255) not null, `template_uuid` varchar(255) not null, `ontology_node_uuid` varchar(255) not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `template_node` add index `template_node_template_uuid_index`(`template_uuid`);');
    this.addSql('alter table `template_node` add index `template_node_ontology_node_uuid_index`(`ontology_node_uuid`);');

    this.addSql('alter table `template_node` add constraint `template_node_template_uuid_foreign` foreign key (`template_uuid`) references `template` (`uuid`) on update cascade;');
    this.addSql('alter table `template_node` add constraint `template_node_ontology_node_uuid_foreign` foreign key (`ontology_node_uuid`) references `ontology_node` (`uuid`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `template_node`;');
  }

}
