import React, { useMemo } from 'react';
import { Form } from 'antd';
import { ITableViewSelectorProps } from './models';
import TableViewSelectorSettingsModal from './tableViewSelectorSettingsModal';
import { QueryBuilderProvider } from '../../../../../providers';
import { useForm } from '../../../../../providers/form';
import { ITableColumn, SectionSeparator } from '../../../../..';
import { IProperty } from '../../../../../providers/queryBuilder/models';
import { TableDataSourceType } from '../../../../../providers/dataTable/interfaces';
import ConditionalWrap from '../../../../conditionalWrapper';

export interface ITableViewSelectorSettingsProps {
  model: ITableViewSelectorProps;
  onSave: (model: ITableViewSelectorProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: ITableViewSelectorProps) => void;
}

function TableViewSelectorSettings(props: ITableViewSelectorSettingsProps) {
  const [form] = Form.useForm();
  const { selectedComponentRef } = useForm();

  const columns = (selectedComponentRef?.current?.columns as ITableColumn[]) || [];
  const dataSourceType: TableDataSourceType = selectedComponentRef?.current?.dataSourceType;

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
    return null;
  }, [dataSourceType, columns /*, metadata*/]);

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

  const handleValuesChange = (changedValues: any, values: ITableViewSelectorProps) => {
    if (props.onValuesChange) {
      props.onValuesChange(changedValues, values);
    }
  };

  return (
    <ConditionalWrap
      condition={fields !== null}
      wrap={content => <QueryBuilderProvider fields={fields}>{content}</QueryBuilderProvider>}
    >
      <Form form={form} onFinish={props.onSave} onValuesChange={handleValuesChange} initialValues={props.model}>
        <SectionSeparator sectionName="Filters" />

        <Form.Item name="filters">
          <TableViewSelectorSettingsModal />
        </Form.Item>

        {/* <Form.Item
          label="Persist selected filter"
          valuePropName={'checked'}
          labelCol={{ span: 24 }}
          name="persistSelectedFilters"
        >
          <Checkbox />
        </Form.Item> */}
      </Form>
    </ConditionalWrap>
  );
}

export default TableViewSelectorSettings;
