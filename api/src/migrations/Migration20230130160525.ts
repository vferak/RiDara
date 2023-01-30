import { Migration } from '@mikro-orm/migrations';

export class Migration20230130160525 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `project` add `path` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `project` drop `path`;');
  }

}
