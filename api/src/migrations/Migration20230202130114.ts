import { Migration } from '@mikro-orm/migrations';

export class Migration20230202130114 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `template` add `file_name` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `template` drop `file_name`;');
  }

}
