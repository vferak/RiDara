export type Workspace = {
    uuid: string,
    name: string,
    owner: User,
}

export type User = {
    uuid: string,
    email: string,
    password: string,
    userWorkspaces: string[],
}
