import { Migration } from '@mikro-orm/migrations';

export class Migration20230213161218 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `ontology_relation` change `targer_ref` `target_ref` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `ontology_relation` change `target_ref` `targer_ref` varchar(255) not null;');
  }

}
