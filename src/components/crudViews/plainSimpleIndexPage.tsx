import React, { FC } from 'react';
import { Page, ShaSpin } from '../';
import IndexTableFull, { IIndexTableFullProps } from '../indexTableFull';
import DataTableProvider from '../../providers/dataTable';

export interface ISimpleIndexPageProps extends Omit<IIndexTableFullProps, 'id'> {
  /**
   * Page title
   */
  title: string;

  /**
   * The id for the table
   */
  tableConfigId: string;

  loading?: boolean;
}

const TableWithControls: FC<ISimpleIndexPageProps> = ({ loading = false, ...props }) => {
  return (
    <Page noPadding>
      <ShaSpin spinning={loading}>
        <IndexTableFull id={props.tableConfigId} header={props.title} {...props} />
      </ShaSpin>
    </Page>
  );
};

const SimpleIndexPagePlain: FC<ISimpleIndexPageProps> = props => (
  <DataTableProvider tableId={props.tableConfigId}>
    <TableWithControls {...props} />
  </DataTableProvider>
);

export default SimpleIndexPagePlain;
