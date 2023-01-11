export class AddUserToWorkspaceDto {
    public constructor(
        public workspaceUuid: string,
        public usersUuid: string,
        public role: string,
    ) {}
}
