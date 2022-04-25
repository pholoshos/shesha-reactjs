import { ChildTable, IChildTableProps } from '../../';
import { DataTableFullInstance } from '../../providers/dataTable/contexts';
import React, { FC, Fragment, useRef, useState } from 'react';
import { ITableCustomTypeEditor } from '../../components/indexTable/interfaces';
import DataTableProvider from '../../providers/dataTable';

export interface IInlineEditableChildTableProps {
  parentEntityId: string;
  tableId: string;
  saveLocally?: boolean;
  showTotal?: boolean;
  header: string;
  crud?: boolean;
  onRowsChanged?: (rows: object[]) => void;
  customTypeEditors?: ITableCustomTypeEditor[];
}

export const InlineEditableChildTable: FC<IInlineEditableChildTableProps> = ({
  parentEntityId,
  tableId,
  saveLocally = false,
  showTotal = false,
  header,
  onRowsChanged,
  customTypeEditors,
  crud = true,
}) => {
  const [totalRows, setTotalRows] = useState(0);

  const tableRef = useRef<DataTableFullInstance>(null);

  const tableProps: IChildTableProps = {
    id: tableId,
    header,
    crud,
    saveLocally,
  };

  const renderTotalItems = (total: number, itemsString: string) => {
    return (
      <div className="narrative-report-total-display">
        {itemsString}: <strong>{total || 0}</strong>
      </div>
    );
  };

  const handleRowsChanged = (rows: object[]) => {
    if (onRowsChanged) {
      onRowsChanged(rows);
    }

    if (showTotal) {
      setTotalRows(rows?.length);
    }
  };

  return (
    <Fragment>
      <DataTableProvider tableId={tableProps?.id} parentEntityId={parentEntityId}>
        <ChildTable
          tableRef={tableRef}
          {...tableProps}
          onRowsChanged={handleRowsChanged}
          customTypeEditors={customTypeEditors}
        />
      </DataTableProvider>

      {showTotal && <Fragment>{renderTotalItems(totalRows, header)}</Fragment>}
    </Fragment>
  );
};

export default InlineEditableChildTable;
