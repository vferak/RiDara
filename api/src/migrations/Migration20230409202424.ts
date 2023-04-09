import { Migration } from '@mikro-orm/migrations';

export class Migration20230409202424 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `template_node` add `element_id` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `template_node` drop `element_id`;');
  }

}
