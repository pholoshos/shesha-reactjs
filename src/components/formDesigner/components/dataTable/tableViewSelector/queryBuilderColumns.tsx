import React, { FC, MutableRefObject, useMemo, useState } from 'react';
import { Form, Button } from 'antd';
import { ITableViewSelectorProps } from './models';
import TableViewSelectorSettingsModal from './tableViewSelectorSettingsModal';
import { QueryBuilderProvider } from '../../../../../providers';
import { useForm } from '../../../../../providers/form';
import { ITableColumn, IToolboxComponent, useMetadata } from '../../../../..';
import { IProperty } from '../../../../../providers/queryBuilder/models';
import { TableDataSourceType } from '../../../../../providers/dataTable/interfaces';
import { SelectOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../../formItem';

const QueryBuilderColumnsComponent: IToolboxComponent<ITableViewSelectorProps> = {
  type: 'queryBuilderColumns',
  name: 'Query Builder Columns',
  icon: <SelectOutlined />,
  isHidden: true,
  factory: (model: ITableViewSelectorProps, componentRef: MutableRefObject<any>) => {
    return (
      <ConfigurableFormItem model={model}>
        <QueryBuilderColumns componentRef={componentRef} />
      </ConfigurableFormItem>
    );
  },
  initModel: (model: ITableViewSelectorProps) => {
    return {
      ...model,
      filters: [],
    };
  },
};

export default QueryBuilderColumnsComponent;

export interface IQueryBuilderColumnsProps {
  value?: ITableViewSelectorProps[];
  onChange?: (value: ITableViewSelectorProps[]) => void;
  onValuesChange?: (changedValues: any, values: ITableViewSelectorProps) => void;
  componentRef: MutableRefObject<any>;
}

const QueryBuilderColumns: FC<IQueryBuilderColumnsProps> = ({ value, onChange, onValuesChange, componentRef }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { selectedComponentRef } = useForm();

  const metadata = useMetadata(false);

  const columns = (selectedComponentRef?.current?.columns as ITableColumn[]) || [];
  const dataSourceType: TableDataSourceType = selectedComponentRef?.current?.dataSourceType;

  if (componentRef) {
    componentRef.current = {
      columns,
      dataSourceType,
    };
  }

  const fields = useMemo<IProperty[]>(() => {
    if (dataSourceType === 'tableConfig') {
      return columns.map<IProperty>(column => ({
        label: column.header,
        propertyName: column.columnId,
        visible: column.isVisible,
        dataType: column.dataType,
        fieldSettings: {
          typeShortAlias: column.entityReferenceTypeShortAlias,
          referenceListName: column.referenceListName,
          referenceListNamespace: column.referenceListNamespace,
          allowInherited: column.allowInherited,
        },
        //tooltip: column.description
        //preferWidgets: ['']
      }));
    }
    if (dataSourceType === 'entity') {
      const properties = metadata?.metadata?.properties || [];
      if (Boolean(properties))
        return properties.map<IProperty>(property => ({
          label: property.label,
          propertyName: property.path,
          visible: property.isVisible,
          dataType: property.dataType,
          fieldSettings: {
            typeShortAlias: property.entityType,
            referenceListName: property.referenceListName,
            referenceListNamespace: property.referenceListNamespace,
            allowInherited: true,
          },
        }));
    }
    return [];
  }, [dataSourceType, columns, metadata]);

  /*
  console.log({
    metadata,
    ref: selectedComponentRef.current,
    dataSourceType,
    fields
  });
  */

  //console.log({ columns, fields });

  /* NOTE: don't delete this code, it's not needed now but will be used in another part of the system
  // take all columns with dots, create a list of 
  columns.forEach(column => {
    let { propertyName } = column;
    let container = fields;
    let currentParent = container;
    if (propertyName.indexOf('.') > -1){
      const parts = propertyName.split('.');
      propertyName = parts.pop(); // remove name of the property

      parts.forEach(part => {
        let property = currentParent.find(f => f.propertyName === part);
        if (!property){
          property = {
            propertyName: part,
            dataType: '!struct',
            label: part,
            visible: true,
            childProperties: [],
          };
          currentParent.push(property);
        }
        if (property.childProperties)
        currentParent = property.childProperties;
      });      
    }
    
    currentParent.push({
      label: column.header,
      propertyName: propertyName,
      visible: column.isVisible,
      dataType: column.dataType,
    });
  });
  */
  return (
    <QueryBuilderProvider fields={fields}>
      <Form form={form} onValuesChange={onValuesChange}>
        <Button onClick={() => setModalVisible(true)}>Customise Filters</Button>

        <Form.Item name="filters" initialValue={value}>
          <TableViewSelectorSettingsModal
            visible={modalVisible}
            value={value}
            onChange={onChange}
            hideModal={() => {
              setModalVisible(false);
            }}
          />
        </Form.Item>
      </Form>
    </QueryBuilderProvider>
  );
};
