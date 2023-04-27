import { Migration } from '@mikro-orm/migrations';

export class Migration20230427120615 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `template` add `deleted` tinyint(1) not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `template` drop `deleted`;');
  }

}
