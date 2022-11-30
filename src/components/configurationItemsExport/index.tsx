import React, { useState, useEffect, useMemo, MutableRefObject } from 'react';
import { FC } from 'react';
import { useGet } from 'restful-react';
import { IAbpWrappedGetEntityListResponse, IGenericGetAllPayload } from '../../interfaces/gql';
import { GENERIC_ENTITIES_ENDPOINT, LEGACY_FORMS_MODULE_NAME } from '../../constants';
import { Divider, Form, Input, notification, Select, Skeleton, Spin, Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { useDebouncedCallback } from 'use-debounce';
import axios from 'axios';
import { useSheshaApplication, ValidationErrors } from '../..';
import FileSaver from 'file-saver';
import { getFileNameFromResponse } from '../../utils/fetchers';
import { IErrorInfo } from '../../interfaces/errorInfo';
import { ConfigurationItemVersionStatus } from '../../utils/configurationFramework/models';

export interface IExportInterface {
    exportExecuter: () => Promise<any>;
    canExport: boolean;
    exportInProgress: boolean;
}

export interface IConfigurationItemsExportProps {
    onCancel?: () => void;
    onExported?: () => void;
    exportRef: MutableRefObject<IExportInterface>;
}

interface ModuleDto {
    id: string;
    name: string;
    description?: string;
}
interface ConfigurationItemDto {
    id?: string;
    name: string;
    module?: ModuleDto;
    itemType: string;

    label?: string;
    description?: string;
}

type IDictionary<TItem> = {
    [key: string]: TItem;
}
interface IModule {
    id: string;
    name: string;
    description?: string;
    itemTypes: ItemTypeDictionary;
}
interface IConfigurationItem {
    id: string;
    name: string;
    label?: string;
    description?: string;
}
interface IItemType {
    name: string;
    items: IConfigurationItem[];
}
type ItemTypeDictionary = IDictionary<IItemType>;
type ModulesDictionary = IDictionary<IModule>;

interface ConfigItemDataNode extends DataNode {
    itemId?: string;
}

interface ITreeState {
    modules: ModulesDictionary;
    treeNodes: ConfigItemDataNode[];
    indexes: DataIndex[];
}

interface DataIndex {
    key: React.Key;
    title: string;
}
const generateIndexesList = (data: DataNode[], indexes: DataIndex[]) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key } = node;
        indexes.push({ key, title: node.title.toString() /*key as string*/ });
        if (node.children) {
            generateIndexesList(node.children, indexes);
        }
    }
};

interface IGetConfigItemsPayload extends IGenericGetAllPayload {
    versionSelectionMode: string;
}

type VerionSelectionMode = 'live' | 'ready' | 'latest';

export const ConfigurationItemsExport: FC<IConfigurationItemsExportProps> = (props) => {

    const { backendUrl, httpHeaders } = useSheshaApplication();
    const [versionsMode, setVersionsMode] = useState<VerionSelectionMode>('live');

    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [checkedIds, setCheckedIds] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [exportInProgress, setExportInProgress] = useState(false);

    const [treeState, setTreeState] = useState<ITreeState>(null);

    const getItemFilterByMode = (mode: VerionSelectionMode): object => {
        switch (mode) {
            case 'live':
                return { '==': [{ 'var': 'versionStatus' }, ConfigurationItemVersionStatus.Live] };
            case 'ready':
                return { and: [{ '==': [{ 'var': 'isLast' }, true] }, { 'in': [{ 'var': 'versionStatus' }, [ConfigurationItemVersionStatus.Live, ConfigurationItemVersionStatus.Ready]] }] };
            case 'latest':
                return { and: [{ '==': [{ 'var': 'isLast' }, true] }, { 'in': [{ 'var': 'versionStatus' }, [ConfigurationItemVersionStatus.Live, ConfigurationItemVersionStatus.Ready, ConfigurationItemVersionStatus.Draft]] }] };
        }
        return null;
    }
    const getListFetcherQueryParams = (mode: VerionSelectionMode): IGetConfigItemsPayload => {
        const tempFilter = { '!=': [{ 'var': 'itemType' }, 'entity'] }; // temporary filter out entity configuration
        const filterByMode = getItemFilterByMode(mode);
        const finalFilter = { and: [tempFilter, filterByMode] };

        return {
            skipCount: 0,
            maxResultCount: -1,
            entityType: 'Shesha.Domain.ConfigurationItems.ConfigurationItem',
            properties: 'id name module { id name description } itemType label description',
            filter: JSON.stringify(finalFilter),
            versionSelectionMode: versionsMode,
            sorting: 'module.name, name',
        };
    };

    const listFetcher = useGet<IAbpWrappedGetEntityListResponse<ConfigurationItemDto>, any, IGenericGetAllPayload>(
        `${GENERIC_ENTITIES_ENDPOINT}/GetAll`,
        {
            lazy: true,
            queryParams: getListFetcherQueryParams(versionsMode),
        }
    );

    useEffect(() => {
        console.log('trigger load');
        listFetcher.refetch({ queryParams: getListFetcherQueryParams(versionsMode) });
    }, [versionsMode]);

    const allItems = listFetcher.data?.result?.items;

    useEffect(() => {
        if (!allItems) {
            setTreeState(null);
            return;
        }

        const modules: ModulesDictionary = {};
        allItems.forEach(item => {
            const itemModule = item.module ?? { id: null, name: LEGACY_FORMS_MODULE_NAME };
            let module: IModule = modules[itemModule.id];
            if (!module) {
                module = { id: itemModule.id, name: itemModule.name, description: itemModule.description, itemTypes: {} };
                modules[itemModule.id] = module;
            }
            let itemType = module.itemTypes[item.itemType];
            if (!itemType) {
                itemType = { name: item.itemType, items: [] };
                module.itemTypes[itemType.name] = itemType;
            }
            const configurationItem: IConfigurationItem = {
                id: item.id,
                name: item.name,
                label: item.label,
                description: item.description,
            };
            itemType.items.push(configurationItem);
        });

        let treeNodes: ConfigItemDataNode[] = [];

        for (const moduleName in modules) {
            const module = modules[moduleName];
            const moduleNode: ConfigItemDataNode = {
                key: module.id ?? '-',
                title: module.name,
                children: [],
                isLeaf: false,
            };
            treeNodes.push(moduleNode);

            for (const itName in module.itemTypes) {
                const itemType = module.itemTypes[itName];
                if (itemType) {
                    const itemTypeNode: ConfigItemDataNode = {
                        key: `${module.id}/${itemType.name}`,
                        title: itemType.name,
                        children: [],
                        isLeaf: false,
                    };
                    moduleNode.children.push(itemTypeNode);

                    itemTypeNode.children = itemType.items.map<ConfigItemDataNode>(item => ({ key: item.id, title: item.name, isLeaf: true, itemId: item.id }));
                }
            }
            moduleNode.children = moduleNode.children.sort((a, b) => a.title < b.title ? -1 : a.title == b.title ? 0 : 1);
        }
        treeNodes = treeNodes.sort((a, b) => a.key === '-'
            ? -1
            : b.key === '-'
                ? 1
                : a < b ? -1 : 1);

        const dataIndexes: DataIndex[] = [];
        generateIndexesList(treeNodes, dataIndexes);

        console.log('tree calculation', { modules: modules, treeNodes: treeNodes, dataIndexes });
        setTreeState({ modules: modules, treeNodes: treeNodes, indexes: dataIndexes });
    }, [allItems]);

    const treeData = useMemo(() => {
        const loop = (data: ConfigItemDataNode[], onMatched: () => void = () => { }): ConfigItemDataNode[] =>
            data.map((item) => {
                const strTitle = item.title as string;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const matched = index > -1;
                const title =
                    matched ? (
                        <span>
                            {beforeStr}
                            <span className="site-tree-search-value">{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{strTitle}</span>
                    );

                if (item.children) {
                    let childMatched = false;
                    const children = loop(item.children, () => childMatched = true);

                    if ((matched || childMatched) && Boolean(onMatched))
                        onMatched();
                    //const filteredCount = item.children.length - children.length;
                    // if (filteredCount > 0)
                    //     children.push({ title: `hidden ${filteredCount} items`, key: item.key + 'hidden', checkable: false });


                    return matched || childMatched
                        ? { title, key: item.key, children: children, itemId: item.itemId }
                        : null;
                }

                if (matched && Boolean(onMatched))
                    onMatched();
                return matched
                    ? {
                        title,
                        key: item.key,
                        itemId: item.itemId,
                    }
                    : null;
            }).filter(node => Boolean(node));
        console.log('tree loop');
        return treeState?.treeNodes
            ? loop(treeState.treeNodes)
            : [];
    }, [treeState?.treeNodes, searchValue]);

    const onExpand = (newExpandedKeys: React.Key[]) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };

    const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
        let parentKey: React.Key;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some((item) => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey!;
    };

    const debouncedSearch = useDebouncedCallback<(value: string) => void>(
        localValue => {
            console.time('filter');
            const newExpandedKeys = treeState.indexes
                .map((item) => {
                    if (item.title.indexOf(localValue) > -1) {
                        return getParentKey(item.key, treeState.treeNodes);
                    }
                    return null;
                })
                .filter((item, i, self) => item && self.indexOf(item) === i);
            console.timeEnd('filter');
            console.log('newExpandedKeys', newExpandedKeys);

            setExpandedKeys(newExpandedKeys as React.Key[]);
            setSearchValue(localValue);
            setAutoExpandParent(true);
        },
        // delay in ms
        100
    );


    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        debouncedSearch(value);
    };

    const onCheck = (_checkedKeysValue: React.Key[], { checkedNodes }) => {
        const checkedItemIds = (checkedNodes as ConfigItemDataNode[] ?? []).map(item => item.itemId).filter(id => Boolean(id));
        setCheckedIds(checkedItemIds);
    };

    const getExportFilter = () => {
        return { "in": [{ "var": "id" }, checkedIds] };
    }

    const displayNotificationError = (message: string, error: IErrorInfo) => {
        notification.error({
            message: message,
            icon: null,
            description: <ValidationErrors error={error} renderMode="raw" defaultMessage={null} />,
        });
    };

    const exportExecuter = () => {
        const filter = getExportFilter();
        const exportUrl = `${backendUrl}/api/services/app/ConfigurationItem/Export`;

        setExportInProgress(true);
        return axios({
            url: exportUrl,
            method: 'POST',
            data: {
                filter: JSON.stringify(filter),
            },
            responseType: 'blob', // important
            headers: httpHeaders,
        })
            .then(response => {
                const fileName = getFileNameFromResponse(response) ?? 'package.zip';
                FileSaver.saveAs(new Blob([response.data]), fileName);
                setExportInProgress(false);
                if (Boolean(props.onExported))
                    props.onExported();
            })
            .catch((e) => {
                displayNotificationError('Failed to export package', e);
                setExportInProgress(false);
            });
    }

    if (props.exportRef)
        props.exportRef.current = {
            exportExecuter: exportExecuter,
            canExport: checkedIds.length === 0,
            exportInProgress: exportInProgress
        };

    return (
        <Spin spinning={exportInProgress} tip="Exporting...">
            <Form>
                <Form.Item
                    label="Versions to include"
                >
                    <Select
                        value={versionsMode}
                        onChange={setVersionsMode}
                        options={[{
                            value: 'live',
                            label: 'Live',
                        },
                        {
                            value: 'ready',
                            label: 'Ready',
                        },
                        {
                            value: 'latest',
                            label: 'Latest',
                        }
                        ]}
                    />
                </Form.Item>
                <Skeleton loading={listFetcher.loading}>
                    {treeState && (
                        <>
                            <Input.Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onSearchChange} allowClear />
                            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <Tree<ConfigItemDataNode>
                                    checkable
                                    onExpand={onExpand}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    treeData={treeData}
                                    onCheck={onCheck}
                                    checkedKeys={checkedIds}
                                />
                            </div>
                            <Divider style={{ margin: '5px 0' }} />
                            <strong>Selected: </strong> {checkedIds.length} of {allItems.length}
                        </>
                    )}
                </Skeleton>
            </Form>
        </Spin>
    );
}

export default ConfigurationItemsExport;