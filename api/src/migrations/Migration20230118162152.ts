import { Migration } from '@mikro-orm/migrations';

export class Migration20230118162152 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add `first_name` varchar(255) not null, add `last_name` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop `first_name`;');
    this.addSql('alter table `user` drop `last_name`;');
  }

}
