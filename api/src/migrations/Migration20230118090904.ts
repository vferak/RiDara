import { Migration } from '@mikro-orm/migrations';

export class Migration20230118090904 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `workspace` add `owner` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `workspace` drop `owner`;');
  }

}
