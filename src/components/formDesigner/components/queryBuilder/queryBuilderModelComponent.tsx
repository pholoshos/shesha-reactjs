import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { FilterOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import QueryBuilderField from './queryBuilderField';
import { useQueryBuilder, useTableViewSelectorConfigurator } from '../../../../providers';
import React from 'react';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';

export interface IQueryBuilderProps extends IConfigurableFormComponent {
  jsonExpanded?: boolean;
}

const settingsForm = settingsFormJson as FormMarkup;

const QueryBuilderComponent: IToolboxComponent<IQueryBuilderProps> = {
  type: 'queryBuilder',
  name: 'Query Builder',
  icon: <FilterOutlined />,
  //dataTypes: [DataTypes.string],
  factory: (model: IQueryBuilderProps) => {
    const { selectedItemId, items } = useTableViewSelectorConfigurator();

    const useExpression = items?.find(({ id }) => id === selectedItemId)?.useExpression;

    const queryBuilder = useQueryBuilder(false);
    const fields = queryBuilder?.fields || [];

    return (
      <ConfigurableFormItem model={model}>
        <QueryBuilderField fields={fields} jsonExpanded={model.jsonExpanded} useExpression={useExpression} />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
};

export default QueryBuilderComponent;
