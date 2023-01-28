import { Migration } from '@mikro-orm/migrations';

export class Migration20230130100608 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `ontology_node` drop foreign key `ontology_node_file_uuid_foreign`;');

    this.addSql('alter table `ontology_node` drop index `ontology_node_file_uuid_index`;');
    this.addSql('alter table `ontology_node` change `file_uuid` `ontology_file_uuid` varchar(255) not null;');
    this.addSql('alter table `ontology_node` add constraint `ontology_node_ontology_file_uuid_foreign` foreign key (`ontology_file_uuid`) references `ontology_file` (`uuid`) on update cascade;');
    this.addSql('alter table `ontology_node` add index `ontology_node_ontology_file_uuid_index`(`ontology_file_uuid`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `ontology_node` drop foreign key `ontology_node_ontology_file_uuid_foreign`;');

    this.addSql('alter table `ontology_node` drop index `ontology_node_ontology_file_uuid_index`;');
    this.addSql('alter table `ontology_node` change `ontology_file_uuid` `file_uuid` varchar(255) not null;');
    this.addSql('alter table `ontology_node` add constraint `ontology_node_file_uuid_foreign` foreign key (`file_uuid`) references `ontology_file` (`uuid`) on update cascade;');
    this.addSql('alter table `ontology_node` add index `ontology_node_file_uuid_index`(`file_uuid`);');
  }

}
