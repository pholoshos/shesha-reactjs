import classNames from 'classnames';
import { nanoid } from 'nanoid/non-secure';
import React, { FC } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { Row } from 'react-table';
import ConditionalWrap from '../conditionalWrapper';
import { RowCell } from './rowCell';

export interface ISortableRowProps {
  prepareRow: (row: Row<any>) => void;
  onClick: (row: Row<any>) => void;
  onDoubleClick: (row: Row<any>, index: number) => void;
  row: Row<any>;
  index: number;
  selectedRowIndex?: number;
  allowSort?: boolean;
}

const SortableRow = SortableElement(props => <TableRow {...props} />);

export const TableRow: FC<ISortableRowProps> = props => {
  const { row, prepareRow, onClick, onDoubleClick, index, selectedRowIndex, allowSort } = props;

  const handleRowClick = () => onClick(row);

  const handleRowDoubleClick = () => onDoubleClick(row, index);

  prepareRow(row);

  return (
    <ConditionalWrap condition={allowSort} wrap={children => <SortableRow>{children}</SortableRow>}>
      <span
        key={nanoid()}
        onClick={handleRowClick}
        onDoubleClick={handleRowDoubleClick}
        {...row.getRowProps()}
        className={classNames(
          'tr tr-body',
          { 'tr-odd': index % 2 === 0 },
          { 'sha-tr-selected': selectedRowIndex === row?.index }
        )}
      >
        {row.cells.map(cell => {
          return <RowCell cell={cell} />;
        })}
      </span>
    </ConditionalWrap>
  );
};
