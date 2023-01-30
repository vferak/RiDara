export class CreateUserDto {
    public constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public password: string,
    ) {}
}
