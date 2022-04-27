import React, { FC, useEffect, useMemo, useState } from 'react';
import { Collapse, Dropdown, Empty, Menu } from 'antd';
import { useLocalStorage } from '../../hooks';
import SearchBox from '../formDesigner/toolboxSearchBox';
import ObjectsTree from './objectsTree';
import { PermissionedObjectDto, usePermissionedObjectGetAllTree } from '../../apis/permissionedObject';
import { DatabaseFilled } from '@ant-design/icons';
import { useForm } from '../..';
import { getLastSection } from '../../utils/string';

const { Panel } = Collapse;

export interface IPermissionedObjectsTreeProps {
  objectsType?: string,

  /**
   * A callback for when the value of this component changes
   */
   onChange?: any;
}

interface GrouppedObjects {
  groupName: string,
  visibleItems: PermissionedObjectDto[],
}

export const PermissionedObjectsTree: FC<IPermissionedObjectsTreeProps> = (props) => {

  const [openedKeys, setOpenedKeys] = useLocalStorage('shaPermissionedObjects.toolbox.objects.openedKeys.' + props.objectsType, ['']);
  const [searchText, setSearchText] = useLocalStorage('shaPermissionedObjects.toolbox.objects.search.' + props.objectsType, '');
  const [groupBy, setGroupBy] = useLocalStorage('shaPermissionedObjects.toolbox.objects.grouping.' + props.objectsType, '-');
  const [objectsType, setObjectsType] = useLocalStorage('shaPermissionedObjects.toolbox.objects.type', null);

  const [allItems, setAllItems] = useState<PermissionedObjectDto[]>();

  const fetcher = usePermissionedObjectGetAllTree({queryParams: {type: objectsType ?? props.objectsType}, lazy: true });
  const { loading: isFetchingData, error: fetchingDataError, data: fetchingDataResponse } = fetcher;

  const [objectId, setObjectId] = useState("");
  
    const { getAction } = useForm(false);

  useEffect(() => {
    if (Boolean(getAction)){
      const action = getAction(null,'onChangeId')
      if (Boolean(action)){
        action(objectId);
      }
    }
  }, [objectId])

  useEffect(() => {
    fetcher.refetch();
  }, [props, objectsType])

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
        
        if (matched || childItems.length > 0) {
          const filteredItem: PermissionedObjectDto = { ...item, child: childItems };
          result.push(filteredItem)
        }
      }
    });

    return result;
  }

  const grouping = (field: string, split: boolean) => {
    const groups = [] as GrouppedObjects[];
    if (Boolean(allItems)){
      allItems.forEach((item) => {
        let name = split ? getLastSection('.', item[field]) : item[field];
        name = Boolean(name) ? name : '-';
        const g = groups.filter((g) => { return g.groupName === name});
        if (g.length > 0) {
          g[0].visibleItems.push(item);
        } else {
          groups.push({ groupName: name, visibleItems: [item]});
        }
      });
      groups.forEach(group => { group.visibleItems = getVisibleProperties(group.visibleItems, searchText) });
    }
    return groups.sort((a, b) => { return a.groupName == '-' ? 1 : b.groupName == '-' ? -1 
      : a.groupName > b.groupName ? 1 : b.groupName > a.groupName ? -1 : 0; });
  }

  const groups = useMemo<GrouppedObjects[]>(() => {
    switch (groupBy) {
      case 'c': return grouping('category', false);
      case 'm': return grouping('module', true);
      default: return [{ groupName: "-", visibleItems: getVisibleProperties(allItems, searchText) }];
    }
  }, [allItems, searchText, groupBy])

  const onCollapseChange = (key: string | string[]) => {
    setOpenedKeys(Array.isArray(key) ? key : [key]);
  };

  const onChangeHandler = (id: string) => {
    setObjectId(id);
    if (Boolean(props.onChange))
      props.onChange(id);
  }

  const menu = (
    <Menu>
      <Menu.Item key={"1"} onClick={() => {setGroupBy("-")}}>Without grouping</Menu.Item>
      <Menu.Item key={"2"} onClick={() => {setGroupBy("m")}}>Group by Module</Menu.Item>
      <Menu.Item key={"3"} onClick={() => {setGroupBy("c")}}>Group by Category</Menu.Item>
    </Menu>
  );

  const typeMenu = (
    <Menu>
      <Menu.Item key={"1"} onClick={() => {setObjectsType("Shesha.WebApi")}}>API</Menu.Item>
      <Menu.Item key={"2"} onClick={() => {setObjectsType("Shesha.WebCrudApi")}}>CRUD API</Menu.Item>
      <Menu.Item key={"3"} onClick={() => {setObjectsType("Shesha.Entity")}}>Entities</Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className="sha-page-heading">
        <div className="sha-page-heading-left">
          <SearchBox value={searchText} onChange={setSearchText} placeholder='Search objects' />
        </div>
        <div className="sha-page-heading-right">
          <Dropdown.Button icon={<DatabaseFilled />} overlay={typeMenu} title='Objects type'/>
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
              ds.groupName === '-' 
              ? (
                <div key={dsIndex.toString()}>
                  <ObjectsTree 
                    items={visibleItems} 
                    searchText={searchText} 
                    defaultExpandAll={(searchText ?? '') !== ''}
                    onChange={ onChangeHandler }
                    defaultSelected={objectId}
                    ></ObjectsTree>
                </div>
              )
              : (
              <Panel header={ds.groupName} key={dsIndex.toString()} className={classes.reduce((a, c) => a + ' ' + c)}>
                <ObjectsTree 
                  items={visibleItems} 
                  searchText={searchText} 
                  defaultExpandAll={(searchText ?? '') !== ''}
                  onChange={ onChangeHandler }
                  defaultSelected={objectId}
                  ></ObjectsTree>
              </Panel>
              )
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

export default PermissionedObjectsTree;