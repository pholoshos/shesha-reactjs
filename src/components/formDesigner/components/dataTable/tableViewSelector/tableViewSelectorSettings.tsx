import React, { useMemo, useState } from 'react';
import { Form, Select } from 'antd';
import { ITableViewSelectorProps } from './models';
import TableViewSelectorSettingsModal from './tableViewSelectorSettingsModal';
import { QueryBuilderProvider } from '../../../../../providers';
import { useForm } from '../../../../../providers/form';
import { ITableColumn, SectionSeparator } from '../../../../..';
import { IProperty } from '../../../../../providers/queryBuilder/models';
import { TableDataSourceType } from '../../../../../providers/dataTable/interfaces';
import ConditionalWrap from '../../../../conditionalWrapper';
import { ITableViewProps } from '../../../../../providers/tableViewSelectorConfigurator/models';

export interface ITableViewSelectorSettingsProps {
  model: ITableViewSelectorProps;
  onSave: (model: ITableViewSelectorProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: ITableViewSelectorProps) => void;
}

function TableViewSelectorSettings(props: ITableViewSelectorSettingsProps) {
  const [form] = Form.useForm();
  const { selectedComponentRef } = useForm();
  const [localFilters, setLocalFilters] = useState<ITableViewProps[]>(props.model.filters || []);

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
    setLocalFilters(values?.filters);

    if (props.onValuesChange) {
      props.onValuesChange(changedValues, values);
    }
  };

  return (
    <ConditionalWrap
      condition={fields !== null}
      wrap={content => <QueryBuilderProvider fields={fields}>{content}</QueryBuilderProvider>}
    >
      <Form form={form} onFinish={props.onSave} onValuesChange={handleValuesChange}>
        <SectionSeparator sectionName="Filters" />

        <Form.Item name="filters" initialValue={props.model.filters}>
          <TableViewSelectorSettingsModal />
        </Form.Item>

        <Form.Item
          label="Default selected filter"
          labelCol={{ span: 24 }}
          name="defaultFilterId"
          initialValue={props.model.defaultFilterId}
        >
          <Select allowClear disabled={localFilters?.length === 0}>
            {localFilters?.map(filter => (
              <Select.Option key={filter?.id} value={filter?.id}>
                {filter?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </ConditionalWrap>
  );
}

export default TableViewSelectorSettings;
