import { useEffect, useState } from 'react';
import { useBoolean } from 'react-use';
import { useDataTableGetData } from '../../apis/dataTable';
import transformJS from 'js-to-json-logic';
import { useDataTable } from '../../providers';

const UNIQUE_FILTER_ID = 'HjHi0UVD27o8Ub8zfz6dH';

export const useSelectedTableRow = (selectedTableId: string) => {
  const [data, setData] = useState<object>();
  const [loading, setLoading] = useBoolean(false);
  const { entityType, tableId, properties, tableData } = useDataTable();

  const { mutate } = useDataTableGetData({});

  useEffect(() => {
    if (!selectedTableId) return;

    if (tableData?.find(item => (item as any)?.Id === selectedTableId)) {
      return;
    }

    setLoading(true);

    mutate({
      id: tableId,
      entityType,
      properties,
      pageSize: 1,
      currentPage: 1,
      filter: [],
      selectedStoredFilterIds: [UNIQUE_FILTER_ID],
      selectedFilters: [
        {
          expression: transformJS(`Id === "${selectedTableId}"`),
          name: 'EntityPickerInner filter',
          id: UNIQUE_FILTER_ID,
        },
      ],
    })
      .then(data => {
        const { rows } = data?.result;

        setData(rows?.length ? rows[0] : null); // length === 1
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedTableId]);

  return { loading, data };
};
