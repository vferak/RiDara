import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey()
  private uuid: string = v4();

  @Property()
  private email!: string;

  @Property()
  private password!: string;
}
