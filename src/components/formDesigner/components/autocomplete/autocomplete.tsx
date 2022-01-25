import React, { Key } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { FileSearchOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import Autocomplete, { AutocompleteDataSourceType } from '../../../autocomplete';
import { useForm } from '../../../../providers/form';
import { evaluateValue, replaceTags, validateConfigurableComponentSettings } from '../../../../providers/form/utils';

interface IQueryParamProp {
  id: string;
  param?: string;
  value?: Key;
}

interface IQueryParams {
  // tslint:disable-next-line:typedef-whitespace
  [name: string]: Key;
}

export interface IAutocompleteProps extends IConfigurableFormComponent {
  entityTypeShortAlias?: string;
  hideBorder?: boolean;
  dataSourceUrl?: string;
  dataSourceType: AutocompleteDataSourceType;
  mode?: 'tags' | 'multiple';
  useRawValues: boolean;
  queryParams: IQueryParamProp[];
}

const settingsForm = settingsFormJson as FormMarkup;

const AutocompleteComponent: IToolboxComponent<IAutocompleteProps> = {
  type: 'autocomplete',
  name: 'Autocomplete',
  icon: <FileSearchOutlined />,
  factory: (model: IAutocompleteProps) => {
    const { queryParams } = model;
    const { formData } = useForm();
    const dataSourceUrl = model.dataSourceUrl
      ? replaceTags(model.dataSourceUrl, { data: formData })
      : model.dataSourceUrl;

    const getQueryParams = (): IQueryParams => {
      const queryParamObj: IQueryParams = {};

      if (queryParams?.length) {
        queryParams?.forEach(({ param, value }) => {
          const valueAsString = value as string;
          if (param?.length && valueAsString.length) {
            queryParamObj[param] = /{.*}/i.test(valueAsString)
              ? evaluateValue(valueAsString, { data: formData })
              : value;
          }
        });

        return queryParamObj;
      }

      return null;
    };

    const autocompleteProps = {
      typeShortAlias: model?.entityTypeShortAlias,
      allowInherited: true /*hardcoded for now*/,
      disabled: model.disabled,
      bordered: !model.hideBorder,
      dataSourceUrl,
      dataSourceType: model.dataSourceType,
      mode: model?.mode,
      queryParams: getQueryParams(),
    };

    // todo: implement other types of datasources!
    return (
      <ConfigurableFormItem model={model}>
        {model.useRawValues ? (
          <Autocomplete.Raw {...autocompleteProps} />
        ) : (
          <Autocomplete.EntityDto {...autocompleteProps} />
        )}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => {
    const customProps: IAutocompleteProps = {
      ...model,
      dataSourceType: 'entitiesList',
      useRawValues: false,
    };
    return customProps;
  },
};

export default AutocompleteComponent;
