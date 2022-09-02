import React, { FC, useMemo } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { FilterOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import QueryBuilderField from './queryBuilderField';
import {
  MetadataProvider,
  QueryBuilderProvider,
  useForm,
  useMetadata,
  useQueryBuilder,
  useTableViewSelectorConfigurator,
} from '../../../../providers';
import { validateConfigurableComponentSettings, evaluateString } from '../../../../providers/form/utils';
import ConditionalWrap from '../../../conditionalWrapper';
import { IProperty } from '../../../../providers/queryBuilder/models';
import { Alert, Typography } from 'antd';

export interface IQueryBuilderProps extends IConfigurableFormComponent {
  jsonExpanded?: boolean;
  allowUseExpression?: boolean;
  useExpression?: string;
  modelType?: string;
  fieldsUnavailableHint?: string;
}

const settingsForm = settingsFormJson as FormMarkup;

const QueryBuilderComponent: IToolboxComponent<IQueryBuilderProps> = {
  type: 'queryBuilder',
  name: 'Query Builder',
  icon: <FilterOutlined />,
  //dataTypes: [DataTypes.string],
  factory: (model: IQueryBuilderProps) => <QueryBuilder {...model}></QueryBuilder>,
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
};

const QueryBuilder: FC<IQueryBuilderProps> = props => {
  const queryBuilder = useQueryBuilder(false);

  return queryBuilder ? (
    <QueryBuilderComponentRenderer {...props}></QueryBuilderComponentRenderer>
  ) : (
    <QueryBuilderWithModelType {...props}></QueryBuilderWithModelType>
  );
};

const QueryBuilderWithModelType: FC<IQueryBuilderProps> = props => {
  const { formData } = useForm();
  const { modelType: modelTypeExpression } = props;
  const modelType = evaluateString(modelTypeExpression, { data: formData });

  return (
    <ConditionalWrap
      condition={Boolean(modelType)}
      wrap={content => <MetadataProvider modelType={modelType}>{content}</MetadataProvider>}
    >
      <QueryBuilderWithMetadata {...props}></QueryBuilderWithMetadata>
    </ConditionalWrap>
  );
};

const QueryBuilderWithMetadata: FC<IQueryBuilderProps> = props => {
  const metadata = useMetadata(false);

  const fields = useMemo<IProperty[]>(() => {
    if (metadata) {
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
    return null;
  }, [metadata, metadata?.metadata]);

  return (
    <ConditionalWrap
      condition={fields !== null}
      wrap={content => <QueryBuilderProvider fields={fields}>{content}</QueryBuilderProvider>}
    >
      <QueryBuilderComponentRenderer {...props}></QueryBuilderComponentRenderer>
    </ConditionalWrap>
  );
};

const QueryBuilderComponentRenderer: FC<IQueryBuilderProps> = props => {
  const { formMode, formData } = useForm();
  const { fieldsUnavailableHint, allowUseExpression, useExpression: _useExpression } = props;
  const { selectedItemId, items } = useTableViewSelectorConfigurator(false) ?? {}; // note: it should be outside the QueryBuilder component!

  // TODO: implement combined components which support both expressions/functions and custom values like date/datetime and remove the `useExpression` property
  const useExpression = allowUseExpression
    ? evaluateString(_useExpression, { data: formData }) === 'true'
    : items?.find(({ id }) => id === selectedItemId)?.useExpression;

  const queryBuilder = useQueryBuilder(false);

  const fieldsAvailable = Boolean(queryBuilder);

  if (!fieldsAvailable && formMode === 'designer' && !fieldsUnavailableHint)
    return (
      <Alert
        className="sha-designer-warning"
        message="Fields are not available. Wrap Query Builder with a QueryBuilderProvider/MetadataProvider or specify `Model Type`"
        type="warning"
      />
    );

  const fields = queryBuilder?.fields || [];

  return !fieldsAvailable && fieldsUnavailableHint ? (
    <ConfigurableFormItem model={props}>
      <Typography.Text type="secondary">{fieldsUnavailableHint}</Typography.Text>
    </ConfigurableFormItem>
  ) : (
    <ConfigurableFormItem model={props}>
      <QueryBuilderField fields={fields} jsonExpanded={props.jsonExpanded} useExpression={useExpression} />
    </ConfigurableFormItem>
  );
};

export default QueryBuilderComponent;
