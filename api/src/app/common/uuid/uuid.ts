import { v4 } from 'uuid';
import { UuidInterface } from './uuid.interface';

export class Uuid implements UuidInterface {
    private constructor(private readonly identifier: string) {}

    public static createV4(): Uuid {
        return new Uuid(v4());
    }

    public asString(): string {
        return this.identifier;
    }
}
