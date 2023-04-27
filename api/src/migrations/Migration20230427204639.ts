import { Migration } from '@mikro-orm/migrations';

export class Migration20230427204639 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `project` drop foreign key `project_template_uuid_foreign`;');

    this.addSql('alter table `project` drop index `project_template_uuid_index`;');
    this.addSql('alter table `project` change `template_uuid` `template_version_uuid` varchar(255) not null;');
    this.addSql('alter table `project` add constraint `project_template_version_uuid_foreign` foreign key (`template_version_uuid`) references `template_version` (`uuid`) on update cascade;');
    this.addSql('alter table `project` add index `project_template_version_uuid_index`(`template_version_uuid`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `project` drop foreign key `project_template_version_uuid_foreign`;');

    this.addSql('alter table `project` drop index `project_template_version_uuid_index`;');
    this.addSql('alter table `project` change `template_version_uuid` `template_uuid` varchar(255) not null;');
    this.addSql('alter table `project` add constraint `project_template_uuid_foreign` foreign key (`template_uuid`) references `template` (`uuid`) on update cascade;');
    this.addSql('alter table `project` add index `project_template_uuid_index`(`template_uuid`);');
  }

}
