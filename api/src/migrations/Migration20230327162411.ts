import { Migration } from '@mikro-orm/migrations';

export class Migration20230327162411 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add `role` enum(\'basic\', \'admin\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop `role`;');
  }

}
