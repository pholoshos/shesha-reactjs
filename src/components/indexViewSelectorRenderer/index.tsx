import React, { FC } from 'react';
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Tooltip } from 'antd';
import { IStoredFilter } from '../../providers/dataTable/interfaces';

export interface IIndexViewSelectorRendererProps {
  header?: string;
  filters?: IStoredFilter[];
  selectedFilterId?: string;
  onSelectFilter: (id?: string) => void;
}

export const IndexViewSelectorRenderer: FC<IIndexViewSelectorRendererProps> = ({
  header,
  filters,
  selectedFilterId,
  onSelectFilter,
}) => {
  const selectedFilter = selectedFilterId ? filters.find(f => f.id === selectedFilterId) : null;
  const defaultView: IStoredFilter = {
    id: null,
    name: header,
  };
  const viewsToSelect: IStoredFilter[] = [defaultView, ...filters].filter(view => {
    return view.id ? view.id !== selectedFilterId : Boolean(selectedFilterId);
  });

  const Item = ({ id: currentId, name: currentName, tooltip }: IStoredFilter) => {
    return (
      <span key={currentId} onClick={() => onSelectFilter(currentId)} className="custom-filter-container">
        {currentName}
        {tooltip && <TooltipIcon tooltip={tooltip} />}
      </span>
    );
  };

  return (
    <div className="index-view-selector">
      <Dropdown
        trigger={['click']}
        overlay={() => (
          <Menu className="index-view-selector-menu">
            {viewsToSelect.map(({ id, name, tooltip }: IStoredFilter) => (
              <Menu.Item key={id}>
                <Item key={id} {...{ id, name, tooltip }} />
              </Menu.Item>
            ))}
          </Menu>
        )}
      >
        <h2 className="title">
          {selectedFilter ? (
            <>
              {selectedFilter.name} {selectedFilter.tooltip && <TooltipIcon tooltip={selectedFilter.tooltip} />}
            </>
          ) : (
            header
          )}
          {filters.length > 0 && <DownOutlined style={{ marginLeft: '5px' }} />}
        </h2>
      </Dropdown>
    </div>
  );
};

interface ITooltipIconProps {
  tooltip: string;
}
const TooltipIcon: FC<ITooltipIconProps> = ({ tooltip }) => {
  return (
    <Tooltip title={tooltip} className="sha-tooltip-icon">
      <QuestionCircleOutlined />
    </Tooltip>
  );
};

export default IndexViewSelectorRenderer;
