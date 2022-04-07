import React, { Fragment, useState } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { FilterOutlined } from '@ant-design/icons';
import { ITableViewSelectorProps } from './models';
import { ConfigurableFormItem } from '../../../..';
import { Button } from 'antd';
import FilterSettingsModal from './filterSettingsModal';

const CustomFilterComponent: IToolboxComponent<ITableViewSelectorProps> = {
  type: 'filter',
  name: 'Filter',
  icon: <FilterOutlined />,
  isHidden: true,
  factory: (model: ITableViewSelectorProps) => {
    return (
      <ConfigurableFormItem model={model}>
        <CustomFilter />
      </ConfigurableFormItem>
    );
  },
  initModel: (model: ITableViewSelectorProps) => {
    return {
      ...model,
      filters: [],
    };
  },
};

export const CustomFilter = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleFiltersModal = () => setShowModal(prev => !prev);

  return (
    <Fragment>
      <Button onClick={toggleFiltersModal}>Customise Filters</Button>

      <FilterSettingsModal visible={showModal} hideModal={toggleFiltersModal} />
    </Fragment>
  );
};

export default CustomFilterComponent;
