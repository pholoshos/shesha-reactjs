import React, { FC } from 'react';
import IndexViewSelector from '../indexViewSelector';
import { FilterOutlined, ReloadOutlined, SlidersOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useDataTable } from '../../providers';
import AppliedCustomFilters from '../appliedCustomFilters';
import TablePager from '../tablePager';
import GlobalTableFilter from '../globalTableFilter';

export interface IIndexTableControlsProps {
  /**
   * @deprecated pass this on an `IndexTableProvider` level
   */  
  header?: string;
  disableCustomFilters: boolean;
  showRefreshBtn?: boolean;
  showPagination?: boolean;
}

export const IndexTableControls: FC<IIndexTableControlsProps> = ({
  header,
  disableCustomFilters,
  showPagination = true,
}) => {
  const {
    title,
    isInProgress: { isFiltering, isSelectingColumns },
    setIsInProgressFlag,
    storedFilters,
    refreshTable,
    isFetchingTableData,
  } = useDataTable();

  const startFilteringColumns = () => setIsInProgressFlag({ isFiltering: true, isSelectingColumns: false });

  const startTogglingColumnVisibility = () => setIsInProgressFlag({ isSelectingColumns: true, isFiltering: false });

  return (
    <div className="sha-index-table-controls">
      <div className="index-table-controls-left">
        {!disableCustomFilters && Boolean(storedFilters.length) ? (
          [
            <IndexViewSelector key="viewSelector" header={header || title} />,
            <AppliedCustomFilters key="appliedFilters" />,
          ]
        ) : (
          <div className="index-view-selector">
            <h1 className="title">{header || title}</h1>
          </div>
        )}
      </div>

      <div className="index-table-controls-right">
        <GlobalTableFilter />

        <Button
          type="link"
          disabled={!!isFiltering}
          onClick={startFilteringColumns}
          className="extra-btn filter"
          icon={<FilterOutlined />}
          size="small"
        />

        <Button
          type="link"
          className="extra-btn column-visibility"
          icon={<SlidersOutlined rotate={90} />}
          disabled={!!isSelectingColumns}
          onClick={startTogglingColumnVisibility}
          size="small"
        />

        {showPagination && <TablePager />}

        <Button
          type="link"
          disabled={isFetchingTableData ?? false}
          onClick={refreshTable}
          className="extra-btn reload"
          icon={<ReloadOutlined />}
          size="small"
        />
      </div>
    </div>
  );
};

export default IndexTableControls;
