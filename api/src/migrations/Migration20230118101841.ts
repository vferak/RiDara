import { Migration } from '@mikro-orm/migrations';

export class Migration20230118101841 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `workspace` change `owner` `owner_uuid` varchar(255) not null;');
    this.addSql('alter table `workspace` add constraint `workspace_owner_uuid_foreign` foreign key (`owner_uuid`) references `user` (`uuid`) on update cascade;');
    this.addSql('alter table `workspace` add index `workspace_owner_uuid_index`(`owner_uuid`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `workspace` drop foreign key `workspace_owner_uuid_foreign`;');

    this.addSql('alter table `workspace` drop index `workspace_owner_uuid_index`;');
    this.addSql('alter table `workspace` change `owner_uuid` `owner` varchar(255) not null;');
  }

}
