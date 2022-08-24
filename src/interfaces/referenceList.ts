export interface IReferenceList {
    name: string;
    items: IReferenceListItem[];
}

export interface IReferenceListItem {
    id?: string;
    item?: string | null;
    itemValue?: number;
    description?: string | null;
    orderIndex?: number;
}