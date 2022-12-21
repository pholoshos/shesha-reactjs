import { IReferenceListIdentifier } from "./models";

export const getReferenceListFullName = (refListId: IReferenceListIdentifier): string => {
    if (!refListId)
        return null;
    const fullName = refListId.namespace
        ? `${refListId.namespace}.${refListId.name}`
        : refListId.name;

    return refListId.module
        ? `${refListId.module}/${fullName}`
        : fullName;
}

export const isValidRefListId = (refListId: IReferenceListIdentifier):boolean => {
    return Boolean(refListId && refListId.name && (refListId.namespace || refListId.module));
}