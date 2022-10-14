import React, { useMemo, useState, useEffect, ReactNode } from 'react';
import { Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import ShaIcon, { IconType } from '../shaIcon';

export interface IProps<TItem> {
    items: TItem[];
    defaultExpandAll: boolean;
    defaultSelected?: string;
    searchText?: string;
    onChange: (item: TItem) => void;
    idFieldName?: string;
    nameFieldName?: string
    getChildren?: (item: TItem) => TItem[];
    getIsLeaf?: (item: TItem) => boolean;
    getIcon?: (item: TItem) => IconType;
    onRenterItem?: (item: TItem) => ReactNode;
}

interface DataNodeWithObject<TItem> extends DataNode {
    object: TItem;
}

interface NodesWithExpanded<TItem> {
    nodes: DataNodeWithObject<TItem>[],
    expandedKeys: string[],
}

export const ObjectsTree = <TItem,>(props: IProps<TItem>) => {
    
    const [manuallyExpanded, setManuallyExpanded] = useState<string[]>(null);
    const [scrollId, setScrollId] = useState<string>(null);
    
    const getName = (item: TItem) => { return Boolean(props.nameFieldName) ? item[props.nameFieldName] : item['name'] ?? item['className'] ?? item }

    const getTreeData = (item: TItem, onAddItem: (item: TItem) => void): DataNodeWithObject<TItem> => {
        const nested = Boolean(props.getChildren) ? props.getChildren(item) : item['children'];
        const node: DataNodeWithObject<TItem> = {
            key: (Boolean(props.idFieldName) ? item[props.idFieldName] : item['id'] ?? item['key'] ?? item)?.toLowerCase(),
            title: getName(item),
            isLeaf: Boolean(props.getIsLeaf) ? props.getIsLeaf(item) : (!Boolean(nested) || Array.isArray(nested) || nested.length === 0),
            selectable: false,
            object: item,
        };
        if (Boolean(nested) && Array.isArray(nested)) {
            node.children = nested.map<DataNodeWithObject<TItem>>(childObj => getTreeData(childObj, onAddItem));
        }
    
        onAddItem(item);
        return node;
    }
    
    const treeData = useMemo<NodesWithExpanded<TItem>>(() => {
        const expanded: string[] = [];
        const nodes = props.items.map(item => getTreeData(item, (item) => { expanded.push(item['id'] ?? item); }));
        return { nodes: nodes, expandedKeys: expanded } as NodesWithExpanded<TItem> ;
    }, [props.items]);

    useEffect(() => {
        if (props.defaultExpandAll)
            setManuallyExpanded(null);
    }, [props.defaultExpandAll]);

    const getTitle = (item: TItem) => {
        const name = getName(item);
        const index = name.toLowerCase().indexOf(props.searchText);
        if (index === -1)
            return <span>{name}</span>;

        const beforeStr = name.substring(0, index);
        const str = name.substring(index, index + props.searchText.length);
        const afterStr = name.substring(index + props.searchText.length, name.length);
        return (
            <span>
                {beforeStr}
                <span className="site-tree-search-value">{str}</span>
                {afterStr}
            </span>
        );
    }

    const refs = treeData.nodes.reduce((ref, value) => {
      ref[value.key] = React.createRef();
      return ref;
    }, {});

    useEffect(() => {
      // ToDo: find another way to scrolling after expand
      if (scrollId) {
        const timeout = setTimeout(() => {
          refs[scrollId?.toLowerCase()]?.current?.scrollIntoView({
            behavior: "auto",
            block: "center"
          });
          clearTimeout(timeout);
        }, 500);
      }
      return null;
    }, [scrollId]);

    useEffect(() => { if(!scrollId) { setScrollId(props.defaultSelected); }}, [props.defaultSelected])

    const renderTitle = (node: DataNodeWithObject<TItem>): React.ReactNode => {
        const icon = Boolean(props.getIcon) ? props.getIcon(node.object) : 'BookOutlined' as IconType
        const markup = (
            <div className='sha-toolbox-component' key={node.key} ref={refs[node.key]}>
                { props.onRenterItem
                    ? props.onRenterItem(node.object)
                    : <>
                        {icon && <ShaIcon iconName={icon}></ShaIcon>}
                        <span className='sha-component-title'> {getTitle(node.object)}</span>
                    </>
                }
            </div>
        );
        return markup;
    }

    const onExpand = (expandedKeys) => {
        setManuallyExpanded(expandedKeys);
    };

    return (
        <Tree<DataNodeWithObject<TItem>>
            className='sha-datasource-tree'
            showIcon
            treeData={treeData.nodes}
            expandedKeys={props.defaultExpandAll && !Boolean(manuallyExpanded) ? treeData.expandedKeys : manuallyExpanded}
            onExpand={onExpand}
            draggable={false}
            selectable={true}
            titleRender={renderTitle}
            onClick={ (_, node) => { props.onChange(node['object']) } }
            selectedKeys={props.defaultSelected != '' ? [props.defaultSelected?.toLowerCase()] : null}
        />
    );
};
