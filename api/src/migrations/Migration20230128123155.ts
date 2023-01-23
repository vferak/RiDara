import { Migration } from '@mikro-orm/migrations';

export class Migration20230128123155 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `ontology_node` drop `create_date`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `ontology_node` add `create_date` datetime not null;');
  }

}
