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
    role: string,
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
    template: Template,
}

export type OntologyNode = {
    uuid: string,
    name: string,
}

export type UserWorkspace = {
    uuid: string,
    user: User,
    workspace: Workspace,
    role: string,
}

export type AnalyzedJsonData = {
    percentArray: number[];
    missingMap?: string;
    notRecognizedMap?: string;
    overExtendsMap?: string;
    shapeMap?: string;
    relationErrorJsonData?: RelationErrorJsonData[] | undefined;
}

export type RelationErrorJsonData = {
    upmmId?: string | undefined;
    elementId?: string | undefined;
    errorsRelations?: string[] | undefined;
    missingRelations?: string | undefined;
    overExtendsRelations?: string | undefined;
}

export type RelationErrorDeserializedData = {
    upmmId?: string | undefined;
    elementId?: string | undefined;
    errorsRelations?: string[] | undefined;
    missingRelations?: Map<string, string> | undefined;
    overExtendsRelations?: Map<string, string> | undefined;
}

export type ErrorTemplate = {
    upmmUuid: string | undefined;
    outgoing?: string[] | undefined;
    missing?: string[] | undefined;
    overExtends?: string[] | undefined;
    id?: string | undefined;
}
