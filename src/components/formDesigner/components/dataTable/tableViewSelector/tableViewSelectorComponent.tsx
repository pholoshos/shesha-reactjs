import React, { FC, MutableRefObject, useEffect } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { SelectOutlined } from '@ant-design/icons';
import TableViewSelectorSettings from './tableViewSelectorSettings';
import { ITableViewSelectorProps } from './models';
import { IndexViewSelectorRenderer, useForm } from '../../../../..';
import { useDataTableStore } from '../../../../../providers';
import { evaluateDynamicFilters } from '../../../../../providers/dataTable/utils';

const TableViewSelectorComponent: IToolboxComponent<ITableViewSelectorProps> = {
  type: 'tableViewSelector',
  name: 'Table view selector',
  icon: <SelectOutlined />,
  factory: (model: ITableViewSelectorProps, componentRef: MutableRefObject<any>) => {
    return <TableViewSelector componentRef={componentRef} {...model} />;
  },
  initModel: (model: ITableViewSelectorProps) => {
    return {
      ...model,
      filters: [],
    };
  },
  settingsFormFactory: ({ model, onSave, onCancel, onValuesChange }) => {
    return (
      <TableViewSelectorSettings
        model={model as ITableViewSelectorProps}
        onSave={onSave}
        onCancel={onCancel}
        onValuesChange={onValuesChange}
      />
    );
  },
};

export const TableViewSelector: FC<ITableViewSelectorProps> = ({ filters, componentRef }) => {
  const {
    columns,
    getDataSourceType,
    title,
    changeSelectedStoredFilterIds,
    predefinedFilters,
    selectedStoredFilterIds,
    setPredefinedFilters,
  } = useDataTableStore();

  const { formData } = useForm();

  const dataSourceType = getDataSourceType();

  componentRef.current = {
    columns,
    dataSourceType,
  };

  useEffect(() => {
    const evaluatedFilters = evaluateDynamicFilters(filters, formData);

    setPredefinedFilters(evaluatedFilters);
    // setPredefinedFilters(filters);
  }, [filters]);

  const changeSelectedFilter = (id: string) => {
    changeSelectedStoredFilterIds(id ? [id] : []);
  };

  return (
    <IndexViewSelectorRenderer
      header={title || 'Table'}
      filters={predefinedFilters || []}
      onSelectFilter={changeSelectedFilter}
      selectedFilterId={
        selectedStoredFilterIds && selectedStoredFilterIds.length > 0 ? selectedStoredFilterIds[0] : null
      }
    />
  );
};

export default TableViewSelectorComponent;
