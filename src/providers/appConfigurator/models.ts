export type ApplicationMode = 'live' | 'edit';
export type ConfigurationItemsViewMode = 'live' | 'ready' | 'latest';

export interface IComponentSettingsDictionary {
    [key: string]: IComponentSettings;
}

export interface IComponentSettings {
    id?: string;
    name?: string;
    description?: string;
    settings: object;
}