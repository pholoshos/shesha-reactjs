import React, { FC, useEffect, useRef, useMemo, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useResizeColumns, useFlexLayout, useRowSelect, useSortBy, usePagination, Row, useTable } from 'react-table';
import { LoadingOutlined } from '@ant-design/icons';
import { Empty, Spin } from 'antd';
import _ from 'lodash';
import { IReactTableProps } from './interfaces';
import { nanoid } from 'nanoid/non-secure';
import { useDeepCompareEffect, usePrevious } from 'react-use';
import { TableRow } from './tableRow';
import ConditionalWrap from '../conditionalWrapper';
import { SortableContainer } from './sortableContainer';
import { arrayMove } from 'react-sortable-hoc';

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }: any, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    // @ts-ignore
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});

const ReactTable: FC<IReactTableProps> = ({
  columns = [],
  data = [],
  useMultiSelect = false,
  loading = false,
  defaultSorting = [],
  defaultCanSort = false,
  manualPagination = true,
  manualSortBy = true,
  manualFilters,
  // defaultColumn,
  // changeSelectedIds,
  disableSortBy = false,
  pageCount,
  // tableRef,
  onFetchData,
  onSelectRow,
  onRowDoubleClick,
  onResizedChange,
  onSelectedIdsChanged,
  onSort,
  scrollBodyHorizontally = false,
  height = 250,
  allowRowSorting = true,
}) => {
  const [items, setItems] = useState(data);
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      // maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    []
  );

  const getColumnAccessor = cid => {
    const column = columns.find(c => c.id == cid);
    return column ? column.accessor.toString() : '';
  };

  const initialSorting = useMemo(() => {
    if (!defaultSorting) return [];
    return defaultSorting.map(s => {
      return { ...s, id: getColumnAccessor(s.id) };
    });
  }, [defaultSorting]);

  useDeepCompareEffect(() => {
    setItems(data);
  }, [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state } = useTable(
    {
      columns,
      data: items,
      defaultColumn,
      initialState: {
        sortBy: initialSorting,
        hiddenColumns: columns
          .map((column: any) => {
            if ([column.isVisible, column.show].includes(false)) return column.accessor || column.id;
          })
          ?.filter(Boolean),
      },
      defaultCanSort,
      manualFilters,
      manualPagination,
      manualSortBy,
      disableSortBy,
      pageCount,
    },
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination,
    useRowSelect,
    // useBlockLayout,
    ({ useInstanceBeforeDimensions, allColumns }) => {
      if (useMultiSelect) {
        allColumns.push(localColumns => [
          // Let's make a column for selection
          {
            id: 'selection',
            disableResizing: true,
            minWidth: 35,
            width: 35,
            maxWidth: 35,
            disableSortBy: true,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <span>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </span>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <span>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </span>
            ),
          },
          ...localColumns,
        ]);
      }
      useInstanceBeforeDimensions?.push(({ headerGroups: localHeaderGroups }) => {
        if (Array.isArray(localHeaderGroups)) {
          // fix the parent group of the selection button to not be resizable
          const selectionGroupHeader = localHeaderGroups[0]?.headers[0];
          if (selectionGroupHeader) {
            selectionGroupHeader.canResize = false;
          }
        }
      });
    }
  );

  console.log('LOGS:: rows, rows?.length', rows, rows?.length, data?.length, items?.length);

  const { pageIndex, pageSize, selectedRowIds, sortBy } = state;

  const previousSortBy = usePrevious(sortBy);

  useEffect(() => {
    if (onSort && !_.isEqual(_.sortBy(previousSortBy), _.sortBy(sortBy))) {
      onSort(sortBy);
    }
  }, [sortBy]);

  useEffect(() => {
    if (selectedRowIds && typeof onSelectedIdsChanged === 'function') {
      const arrays: string[] = items
        ?.map(({ Id }, index) => {
          if (selectedRowIds[index]) {
            return Id;
          }

          return null;
        })
        ?.filter(Boolean);

      onSelectedIdsChanged(arrays);
    }
  }, [selectedRowIds]);

  const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
    setItems(oldItems => arrayMove(oldItems, oldIndex, newIndex));
  }, []);

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    if (onFetchData) {
      // onFetchData();
    }
  }, [onFetchData, pageIndex, pageSize, sortBy]);

  const onResizeClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event?.stopPropagation();

  const handleSelectRow = (row: Row<object>) => {
    onSelectRow(row?.index, row?.original);
  };

  useEffect(() => {
    if (onResizedChange) {
      onResizedChange(state?.columnResizing);
    }
  }, [state?.columnResizing]);

  const handleDoubleClickRow = (row: Row<object>, index: number) => {
    if (onRowDoubleClick) {
      onRowDoubleClick(row?.original, index);
    }
  };

  return (
    <Spin
      spinning={loading}
      indicator={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <LoadingOutlined style={{ fontSize: 24 }} spin />
          <span style={{ marginLeft: 12, fontSize: 14, color: 'black' }}>loading...</span>
        </span>
      }
    >
      <div className="sha-react-table">
        <table {...getTableProps()} className="sha-table">
          {columns?.length > 1 &&
            headerGroups.map(headerGroup => (
              <span
                {...headerGroup.getHeaderGroupProps({
                  // style: { paddingRight: '15px' },
                })}
                className={classNames('tr tr-head')}
              >
                {headerGroup?.headers?.map(column => {
                  return (
                    <span
                      key={nanoid()}
                      // {...column.getHeaderProps(headerProps)}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={classNames('th', {
                        'sorted-asc': column.isSorted && column.isSortedDesc,
                        'sorted-desc': column.isSorted && !column.isSortedDesc,
                      })}
                    >
                      {column.render('Header')}

                      {/* Use column.getResizerProps to hook up the events correctly */}
                      {column.canResize && (
                        <span
                          {...column.getResizerProps()}
                          className={classNames('resizer', { isResizing: column.isResizing })}
                          onClick={onResizeClick}
                        />
                      )}
                    </span>
                  );
                })}
              </span>
            ))}

          <ConditionalWrap
            condition={allowRowSorting}
            wrap={children => (
              <SortableContainer
                onSortEnd={onSortEnd}
                axis="y"
                lockAxis="y"
                lockToContainerEdges={true}
                lockOffset={['30%', '50%']}
                helperClass="helperContainerClass"
                useDragHandle={true}
              >
                {children}
              </SortableContainer>
            )}
          >
            <span
              className="tbody"
              style={{
                height: scrollBodyHorizontally ? height || 250 : 'unset',
                overflowY: scrollBodyHorizontally ? 'auto' : 'unset',
              }}
              {...getTableBodyProps()}
            >
              {rows?.length === 0 && !loading && (
                <span className="sha-table-empty">
                  <Empty description="There is no data for this table" />
                </span>
              )}

              {rows.map((row, rowIndex) => {
                return (
                  <TableRow
                    prepareRow={prepareRow}
                    onClick={handleSelectRow}
                    onDoubleClick={handleDoubleClickRow}
                    row={row}
                    index={rowIndex}
                    allowSort={allowRowSorting}
                  />
                );
              })}
            </span>
          </ConditionalWrap>
        </table>
      </div>
    </Spin>
  );
};

export default ReactTable;
