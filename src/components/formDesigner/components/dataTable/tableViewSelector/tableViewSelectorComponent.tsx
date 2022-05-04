import React, { FC, MutableRefObject, useEffect } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { SelectOutlined } from '@ant-design/icons';
import TableViewSelectorSettings from './tableViewSelectorSettings';
import { ITableViewSelectorProps } from './models';
import { IndexViewSelectorRenderer, useForm } from '../../../../..';
import { useDataTableStore, useGlobalState } from '../../../../../providers';
import { evaluateDynamicFilters } from '../../../../../providers/dataTable/utils';
import { usePrevious } from '../../../../../hooks';
import camelCaseKeys from 'camelcase-keys';
import _ from 'lodash';

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
    refreshTable,
  } = useDataTableStore();
  const { globalState } = useGlobalState();
  const { formData } = useForm();

  const dataSourceType = getDataSourceType();

  componentRef.current = {
    columns,
    dataSourceType,
  };

  const previousFilters = usePrevious(predefinedFilters);

  const evaluateDynamicFiltersHelper = () => {
    const data = camelCaseKeys(formData || {}, { pascalCase: true });

    return evaluateDynamicFilters(filters, [
      {
        match: '', // For backward compatibility
        data,
      },
      {
        match: 'data',
        data,
      },
      {
        match: 'globalState',
        data: globalState,
      },
    ]);
  };

  useEffect(() => {
    const evaluatedFilters = evaluateDynamicFiltersHelper();

    debugger;
    setPredefinedFilters(evaluatedFilters);

    if (!_.isEqual(_.sortBy(previousFilters), _.sortBy(evaluatedFilters))) {
      setTimeout(() => {
        refreshTable();
      }, 100);
    }
  }, [filters, formData, globalState]);

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
