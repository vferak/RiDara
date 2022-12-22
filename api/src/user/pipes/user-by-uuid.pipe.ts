import { Injectable, PipeTransform } from '@nestjs/common';
import { User } from '../user.entity';
import { UserService } from '../user.service';

@Injectable()
export class UserByUuidPipe implements PipeTransform<string, Promise<User>> {
    public constructor(private readonly userService: UserService) {}

    public async transform(value: string): Promise<User> {
        return this.userService.getOneByUuid(value);
    }
}
