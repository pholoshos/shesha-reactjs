import { nanoid } from 'nanoid/non-secure';
import React, { FC } from 'react';
import { Cell, CellPropGetter, TableCellProps, TableHeaderProps } from 'react-table';

const getStyles = (props: Partial<TableHeaderProps | TableCellProps>, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
];

const cellProps: CellPropGetter<object> = (props, { cell }) => getStyles(props, cell.column.align);

export interface IRowCellProps {
  cell: Cell<any, any>;
}

export const RowCell: FC<IRowCellProps> = ({ cell }) => {
  return (
    <span key={nanoid()} {...cell.getCellProps(cellProps)} className="td">
      {cell.render('Cell')}
    </span>
  );
};
