import { DataNode } from "antd/lib/tree";

export interface ModuleDto {
    id: string;
    name: string;
    description?: string;
}
export interface ConfigurationItemDto {
    id?: string;
    name: string;
    module?: ModuleDto;
    itemType: string;

    label?: string;
    description?: string;
}

export type IDictionary<TItem> = {
    [key: string]: TItem;
}
export interface IModule {
    id: string;
    name: string;
    description?: string;
    itemTypes: ItemTypeDictionary;
}
export interface IItemType {
    name: string;
    items: IConfigurationItem[];
}
export interface IConfigurationItem {
    id: string;
    name: string;
    label?: string;
    description?: string;
}
export type ItemTypeDictionary = IDictionary<IItemType>;
export type ModulesDictionary = IDictionary<IModule>;

export interface ConfigItemDataNode extends DataNode {
    itemId?: string;
}

export interface DataIndex {
    key: React.Key;
    title: string;
}

export interface ITreeState {
    //modules: ModulesDictionary;
    treeNodes: ConfigItemDataNode[];
    indexes: DataIndex[];
    itemsCount: number;
}