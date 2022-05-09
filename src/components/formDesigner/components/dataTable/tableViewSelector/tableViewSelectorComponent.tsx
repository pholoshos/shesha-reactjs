import React, { FC, MutableRefObject, useEffect } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { SelectOutlined } from '@ant-design/icons';
import TableViewSelectorSettings from './tableViewSelectorSettings';
import { ITableViewSelectorProps } from './models';
import { IndexViewSelectorRenderer, useForm } from '../../../../..';
import { useDataTableStore, useGlobalState } from '../../../../../providers';
import { evaluateDynamicFilters, hasDynamicFilter } from '../../../../../providers/dataTable/utils';
import camelCaseKeys from 'camelcase-keys';
import _ from 'lodash';
import { useDebouncedCallback } from 'use-debounce';

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
    selectedStoredFilterIds,
    setPredefinedFilters,
  } = useDataTableStore();
  const { globalState } = useGlobalState();
  const { formData } = useForm();

  const dataSourceType = getDataSourceType();

  componentRef.current = {
    columns,
    dataSourceType,
  };

  const defaultSelectedFilterId =
    selectedStoredFilterIds && selectedStoredFilterIds.length > 0 ? selectedStoredFilterIds[0] : null;

  //#region Filters
  const hasFilters = filters?.length > 0;

  const foundDynamicFilter = hasDynamicFilter(filters);

  const hasFormData = !_.isEmpty(formData);
  const hasGlobalState = !_.isEmpty(formData);

  const debounceEvaluateDynamicFiltersHelper = useDebouncedCallback(
    () => {
      if (hasFilters) {
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

        let parsedFilters = evaluatedFilters;

        if (defaultSelectedFilterId) {
          parsedFilters = evaluatedFilters?.map(filter => {
            const localFilter = { ...filter };

            if (localFilter.id === defaultSelectedFilterId) {
              localFilter.defaultSelected = true;
              localFilter.selected = true;
            }

            return localFilter;
          });
        } else {
          const firstElement = evaluatedFilters[0];

          firstElement.defaultSelected = true;
          firstElement.selected = true;

          evaluatedFilters[0] = firstElement;
        }

        if (hasFormData || hasGlobalState) {
          // Here we know we have evaluated our filters

          // TODO: Deal with the situation whereby the expression value evaluated to empty string because the action GetData will fail
          setPredefinedFilters(parsedFilters);
        } else if (!foundDynamicFilter) {
          // Here we do not need dynamic filters
          setPredefinedFilters(parsedFilters);
        }
      }
    },
    // delay in ms
    300
  );

  useEffect(() => {
    if (hasFilters) {
      debounceEvaluateDynamicFiltersHelper();
    }
  }, [filters, formData, globalState]);
  //#endregion

  const changeSelectedFilter = (id: string) => {
    changeSelectedStoredFilterIds(id ? [id] : []);
  };

  return (
    <IndexViewSelectorRenderer
      header={title || 'Table'}
      filters={filters || []}
      onSelectFilter={changeSelectedFilter}
      selectedFilterId={defaultSelectedFilterId}
    />
  );
};

export default TableViewSelectorComponent;
