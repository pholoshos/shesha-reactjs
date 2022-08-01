import React, { FC, useMemo } from 'react';
import { QueryBuilderProvider, useForm, useMetadata } from '../../../../providers';
import { ITableColumn } from '../../../../providers/dataTable/interfaces';
import { IProperty } from '../../../../providers/queryBuilder/models';

export const QueryBuilderTableWrapper: FC = ({ children }) => {
  const { selectedComponentRef } = useForm();

  const metadata = useMetadata(false);

  const columns = (selectedComponentRef?.current?.columns as ITableColumn[]) || [];

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
  }, [columns, metadata]);

  return (
    <QueryBuilderProvider fields={fields} id="QueryBuilderTableWrapper">
      {children}
    </QueryBuilderProvider>
  );
};
