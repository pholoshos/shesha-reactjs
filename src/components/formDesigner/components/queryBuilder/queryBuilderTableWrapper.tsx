import React, { FC, useMemo } from 'react';
import { QueryBuilderProvider, useForm, useMetadata } from '../../../../providers';
import { ITableColumn, TableDataSourceType } from '../../../../providers/dataTable/interfaces';
import { IProperty } from '../../../../providers/queryBuilder/models';

export const QueryBuilderTableWrapper: FC = ({ children }) => {
  const { selectedComponentRef } = useForm();

  const metadata = useMetadata(false);

  const columns = (selectedComponentRef?.current?.columns as ITableColumn[]) || [];

  const dataSourceType: TableDataSourceType = selectedComponentRef?.current?.dataSourceType;

  const fields = useMemo<IProperty[]>(() => {
    if (dataSourceType === 'tableConfig') {
      return columns.map<IProperty>(column => ({
        label: column.header,
        propertyName: column.columnId,
        visible: column.isVisible,
        dataType: column.dataType,
        fieldSettings: {
          typeShortAlias: column.entityReferenceTypeShortAlias,
          referenceListName: column.referenceListName,
          referenceListNamespace: column.referenceListNamespace,
          allowInherited: column.allowInherited,
        },
      }));
    }
    if (dataSourceType === 'entity') {
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
    return [];
  }, [dataSourceType, columns, metadata]);

  return (
    <QueryBuilderProvider fields={fields} id="QueryBuilderTableWrapper">
      {children}
    </QueryBuilderProvider>
  );
};
