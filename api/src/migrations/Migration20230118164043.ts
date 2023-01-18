import { Migration } from '@mikro-orm/migrations';

export class Migration20230118164043 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add `create_date` datetime not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop `create_date`;');
  }

}
