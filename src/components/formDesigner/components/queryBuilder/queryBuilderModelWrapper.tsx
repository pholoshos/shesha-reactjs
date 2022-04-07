import React, { FC, useMemo } from 'react';
import { MetadataProvider, QueryBuilderProvider, useForm, useMetadata } from '../../../../providers';
import { IProperty } from '../../../../providers/queryBuilder/models';

const QueryBuilderModelWrapperInner: FC = ({ children }) => {
  const metadata = useMetadata(false);

  const fields = useMemo<IProperty[]>(() => {
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
    return [];
  }, [metadata]);

  console.log(
    'QueryBuilderModelWrapperInner QueryBuilderModelWrapper id, fields: ',
    'QueryBuilderModelWrapper',
    fields
  );

  return (
    <QueryBuilderProvider fields={fields} id="QueryBuilderModelWrapper">
      {children}
    </QueryBuilderProvider>
  );
};

export const QueryBuilderModelWrapper: FC = ({ children }) => {
  const { formSettings } = useForm();

  return (
    <MetadataProvider id="QueryBuilderModelWrapper" modelType={formSettings?.modelType}>
      <QueryBuilderModelWrapperInner>{children}</QueryBuilderModelWrapperInner>
    </MetadataProvider>
  );
};
