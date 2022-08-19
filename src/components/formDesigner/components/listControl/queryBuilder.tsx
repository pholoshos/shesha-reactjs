import React, { FC, useMemo } from 'react';
import { IChangeable, IValuable } from '../../../../interfaces';
import QueryBuilderField from '../queryBuilder/queryBuilderField';
import {
  MetadataProvider,
  QueryBuilderProvider,
  useForm,
  useMetadata,
  useQueryBuilder,
  useTableViewSelectorConfigurator,
} from '../../../../providers';
import { evaluateString } from '../../../../providers/form/utils';
import ConditionalWrap from '../../../conditionalWrapper';
import { IProperty } from '../../../../providers/queryBuilder/models';
import { Alert, Typography } from 'antd';

export interface IQueryBuilderProps extends IChangeable, IValuable {
  jsonExpanded?: boolean;
  useExpression?: boolean;
  modelType?: string;
  fieldsUnavailableHint?: string;
}

// TODO: Too many
export const QueryBuilderWithModelType: FC<IQueryBuilderProps> = props => {
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
  const { fieldsUnavailableHint } = props;
  const { selectedItemId, items } = useTableViewSelectorConfigurator(false) ?? {}; // note: it should be outside the QueryBuilder component!

  // TODO: implement combined components which support both expressions/functions and custom values like date/datetime and remove the `useExpression` property
  const useExpression = items?.find(({ id }) => id === selectedItemId)?.useExpression || props?.useExpression;

  const queryBuilder = useQueryBuilder(false);
  const { formMode } = useForm();

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
    <Typography.Text type="secondary">{fieldsUnavailableHint}</Typography.Text>
  ) : (
    <QueryBuilderField
      fields={fields}
      jsonExpanded={props.jsonExpanded}
      useExpression={useExpression}
      onChange={props?.onChange}
      value={props?.value}
    />
  );
};
