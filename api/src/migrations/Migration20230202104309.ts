import { Migration } from '@mikro-orm/migrations';

export class Migration20230202104309 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `template` change `author` `author_uuid` varchar(255) not null;');
    this.addSql('alter table `template` add constraint `template_author_uuid_foreign` foreign key (`author_uuid`) references `user` (`uuid`) on update cascade;');
    this.addSql('alter table `template` add index `template_author_uuid_index`(`author_uuid`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `template` drop foreign key `template_author_uuid_foreign`;');

    this.addSql('alter table `template` drop index `template_author_uuid_index`;');
    this.addSql('alter table `template` change `author_uuid` `author` varchar(255) not null;');
  }

}
