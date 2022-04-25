import React, { FC, useEffect, useMemo, useState } from 'react';
import { Collapse, Dropdown, Empty, Menu } from 'antd';
import { useLocalStorage } from '../../hooks';
import SearchBox from '../formDesigner/toolboxSearchBox';
import ObjectsTree from './objectsTree';
import { PermissionedObjectDto, usePermissionedObjectGetAllTree } from '../../apis/permissionedObject';
import { DatabaseFilled } from '@ant-design/icons';

const { Panel } = Collapse;

export interface IToolboxDataSourcesProps {
  type?: string,
  onChange: (id: string) => void;
}

interface GrouppedObjects {
  groupName: string,
  visibleItems: PermissionedObjectDto[],
}

export const ToolboxObjects: FC<IToolboxDataSourcesProps> = (props) => {

  const [openedKeys, setOpenedKeys] = useLocalStorage('shaPermissionedObjects.toolbox.objects.openedKeys.' + props.type, ['']);
  const [searchText, setSearchText] = useLocalStorage('shaPermissionedObjects.toolbox.objects.search.' + props.type, '');

  const [allItems, setAllItems] = useState<PermissionedObjectDto[]>();

  const fetcher = usePermissionedObjectGetAllTree({queryParams: {type: props.type}, lazy: true });
  const { loading: isFetchingData, error: fetchingDataError, data: fetchingDataResponse } = fetcher;

  useEffect(() => {
    fetcher.refetch();
  }, [props])

  useEffect(() => {
    if (!isFetchingData) {
      if (fetchingDataResponse) {
        const fetchedData = fetchingDataResponse?.result;
        if (fetchedData) {
          setAllItems(fetchedData);
        }
      }

      if (fetchingDataError) {
      }
    }
  }, [isFetchingData, fetchingDataError, fetchingDataResponse])

  const getVisibleProperties = (items: PermissionedObjectDto[], searchText: string): PermissionedObjectDto[] => {
    const result: PermissionedObjectDto[] = [];
    if (!items)
      return result;
      
    items.forEach(item => {
      if (!item.hidden){
        const childItems = getVisibleProperties(item.child, searchText);
        const matched = (searchText ?? '') == '' || item.object.toLowerCase().includes(searchText) || item.name?.toLowerCase().includes(searchText);
        
        if (matched || childItems.length > 0){
          const filteredItem: PermissionedObjectDto = { ...item, child: childItems };
          result.push(filteredItem)
        }
      }
    });

    return result;
  }

  const groups = useMemo<GrouppedObjects[]>(() => {
    return [
      {
        groupName: "test",
        visibleItems: getVisibleProperties(allItems, searchText)
      }
    ];
  }, [allItems, searchText])

  /*const datasourcesWithVisible = useMemo<FilteredDataSource[]>(() => {
    const dataSources = allDataSources.map<FilteredDataSource>((ds) => (
      {
        datasource: ds,
        visibleItems: getVisibleProperties(ds.items, searchText),
      }
    ));
    return dataSources;    
  }, [allDataSources, searchText]);*/

  /*const itemContainsText = (item: PermissionedObjectDto, loweredSearchText: string): boolean => {
    if (item.object.toLowerCase().includes(loweredSearchText) || item.name?.toLowerCase().includes(loweredSearchText))
      return true;

    return (item.child ?? []).some(child => itemContainsText(child, loweredSearchText))
  }*/

  if (!allItems || allItems.length === 0)
    return null;

  const onCollapseChange = (key: string | string[]) => {
    setOpenedKeys(Array.isArray(key) ? key : [key]);
  };

  const menu = (
    <Menu>
      <Menu.Item>Module</Menu.Item>
      <Menu.Item>Category</Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className="sha-page-heading">
        <div className="sha-page-heading-left">
          <SearchBox value={searchText} onChange={setSearchText} placeholder='Search objects' />
        </div>
        <div className="sha-page-heading-right">
          <Dropdown.Button icon={<DatabaseFilled />} overlay={menu} title='Group by'/>
        </div>
      </div>
      
      {groups.length > 0 && (
        <Collapse activeKey={openedKeys} onChange={onCollapseChange}>
          {groups.map((ds, dsIndex) => {
            const visibleItems = ds.visibleItems;

            let classes = ['sha-toolbox-panel'];
            //if (ds.datasource.id === activeDataSourceId) classes.push('active');
            
            return visibleItems.length === 0 ? null : (
              <Panel header={ds.groupName} key={dsIndex.toString()} className={classes.reduce((a, c) => a + ' ' + c)}>
                <ObjectsTree 
                  items={visibleItems} 
                  searchText={searchText} 
                  defaultExpandAll={(searchText ?? '') !== ''}
                  onChange={ (id) => {props.onChange(id)} }
                  ></ObjectsTree>
              </Panel>
            );
          })}
        </Collapse>
      )}
      {groups.length === 0 && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Objects not found" />
      )}
    </>
  );
}

export default ToolboxObjects;