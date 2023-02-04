export type Workspace = {
    uuid: string,
    name: string,
    owner: User,
}

export type User = {
    uuid: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    userWorkspaces: string[],
}

export type OntologyFile = {
    uuid: string,
    name: string,
}

export type Template = {
    uuid: string,
    name: string,
    ontologyFile: OntologyFile
}

export type Project = {
    uuid: string,
    name: string,
    createDate: string,
    owner: User,
    workspace: Workspace,
    path: string,
}

export type OntologyNode = {
    uuid: string,
    name: string,
}
