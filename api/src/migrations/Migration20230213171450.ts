import { Migration } from '@mikro-orm/migrations';

export class Migration20230213171450 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `ontology_relation` drop foreign key `ontology_relation_ontology_file_uuid_foreign`;');

    this.addSql('alter table `ontology_relation` add `source_ref_uuid` varchar(255) not null, add `target_ref_uuid` varchar(255) not null;');
    this.addSql('alter table `ontology_relation` drop index `ontology_relation_ontology_file_uuid_index`;');
    this.addSql('alter table `ontology_relation` add constraint `ontology_relation_source_ref_uuid_foreign` foreign key (`source_ref_uuid`) references `ontology_node` (`uuid`) on update cascade;');
    this.addSql('alter table `ontology_relation` add constraint `ontology_relation_target_ref_uuid_foreign` foreign key (`target_ref_uuid`) references `ontology_node` (`uuid`) on update cascade;');
    this.addSql('alter table `ontology_relation` drop `source_ref`;');
    this.addSql('alter table `ontology_relation` drop `target_ref`;');
    this.addSql('alter table `ontology_relation` drop `ontology_file_uuid`;');
    this.addSql('alter table `ontology_relation` add index `ontology_relation_source_ref_uuid_index`(`source_ref_uuid`);');
    this.addSql('alter table `ontology_relation` add index `ontology_relation_target_ref_uuid_index`(`target_ref_uuid`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `ontology_relation` drop foreign key `ontology_relation_source_ref_uuid_foreign`;');
    this.addSql('alter table `ontology_relation` drop foreign key `ontology_relation_target_ref_uuid_foreign`;');

    this.addSql('alter table `ontology_relation` add `source_ref` varchar(255) not null, add `target_ref` varchar(255) not null, add `ontology_file_uuid` varchar(255) not null;');
    this.addSql('alter table `ontology_relation` drop index `ontology_relation_source_ref_uuid_index`;');
    this.addSql('alter table `ontology_relation` drop index `ontology_relation_target_ref_uuid_index`;');
    this.addSql('alter table `ontology_relation` add constraint `ontology_relation_ontology_file_uuid_foreign` foreign key (`ontology_file_uuid`) references `ontology_file` (`uuid`) on update cascade;');
    this.addSql('alter table `ontology_relation` drop `source_ref_uuid`;');
    this.addSql('alter table `ontology_relation` drop `target_ref_uuid`;');
    this.addSql('alter table `ontology_relation` add index `ontology_relation_ontology_file_uuid_index`(`ontology_file_uuid`);');
  }

}
