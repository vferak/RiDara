export class DeleteUserWorkspaceDto {
    public constructor(
        public workspaceUuid: string,
        public userUuid: string,
    ) {}
}
