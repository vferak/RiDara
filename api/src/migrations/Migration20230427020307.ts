import { Migration } from '@mikro-orm/migrations';

export class Migration20230427020307 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `ontology_file` add `deleted` tinyint(1) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `ontology_file` drop `deleted`;');
  }

}
