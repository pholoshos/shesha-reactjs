import React, { FC, MutableRefObject, useEffect } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { SelectOutlined } from '@ant-design/icons';
import TableViewSelectorSettings from './tableViewSelectorSettings';
import { ITableViewSelectorProps } from './models';
import { IndexViewSelectorRenderer, useForm } from '../../../../..';
import { useDataTableStore, useGlobalState } from '../../../../../providers';
import { evaluateDynamicFilters } from '../../../../../providers/dataTable/utils';
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
      title: 'Title',
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

export const TableViewSelector: FC<ITableViewSelectorProps> = ({ filters, componentRef, defaultFilterId, title }) => {
  const {
    columns,
    getDataSourceType,
    changeSelectedStoredFilterIds,
    selectedStoredFilterIds,
    setPredefinedFilters,
    predefinedFilters,
    changeDefaultSelectedFilterId,
  } = useDataTableStore();
  const { globalState } = useGlobalState();
  const { formData, formMode } = useForm();

  const dataSourceType = getDataSourceType();

  componentRef.current = {
    columns,
    dataSourceType,
  };

  const defaultSelectedFilterId =
    selectedStoredFilterIds && selectedStoredFilterIds.length > 0 ? selectedStoredFilterIds[0] : null;

  //#region Filters
  const debounceEvaluateDynamicFiltersHelper = () => {
    const data = !_.isEmpty(formData) ? camelCaseKeys(formData, { deep: true, pascalCase: true }) : formData;

    const evaluatedFilters = evaluateDynamicFilters(filters, [
      {
        match: 'data',
        data: data,
      },
      {
        match: 'globalState',
        data: globalState,
      },
      {
        match: '', // For backward compatibility. It's also important that the empty one is the last one as it's a fallback
        data,
      },
    ]);

    setPredefinedFilters(evaluatedFilters);
  };

  useEffect(() => {
    debounceEvaluateDynamicFiltersHelper();
  }, [filters, formData, globalState]);
  //#endregion

  useEffect(() => {
    if (formMode !== 'designer' && defaultFilterId) {
      changeDefaultSelectedFilterId(defaultFilterId);
    }
  }, [formMode]);

  const changeSelectedFilter = (id: string) => {
    changeSelectedStoredFilterIds(id ? [id] : []);
  };

  return (
    <IndexViewSelectorRenderer
      header={title || 'Table'}
      filters={predefinedFilters || []}
      onSelectFilter={changeSelectedFilter}
      selectedFilterId={defaultSelectedFilterId}
    />
  );
};

export default TableViewSelectorComponent;
