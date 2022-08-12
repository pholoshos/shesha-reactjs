import React, { FC, Fragment, useMemo, useState } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { FilterOutlined } from '@ant-design/icons';
import { FilterTarget, ICustomFilterProps } from './models';
import { ConfigurableFormItem } from '../../../..';
import { Button, Modal } from 'antd';
import { QueryBuilderTableWrapper } from '../../queryBuilder/queryBuilderTableWrapper';
import { QueryBuilderModelWrapper } from '../../queryBuilder/queryBuilderModelWrapper';
import { TableViewSelectorConfiguratorProvider, useTableViewSelectorConfigurator } from '../../../../../providers';
import FilterConfigurator from './filterConfigurator';
import { ITableViewProps } from '../../../../../providers/tableViewSelectorConfigurator/models';
import { useMedia } from 'react-use';

const CustomFilterComponent: IToolboxComponent<ICustomFilterProps> = {
  type: 'filter',
  name: 'Filter',
  icon: <FilterOutlined />,
  isHidden: true,
  factory: (model: ICustomFilterProps) => {
    return (
      <ConfigurableFormItem model={model}>
        <CustomFilter target={model?.target} />
      </ConfigurableFormItem>
    );
  },
  initModel: (model: ICustomFilterProps) => {
    return {
      ...model,
      filters: [],
    };
  },
};

//#region CustomFilter
interface ICustomFilter {
  value?: any;
  onChange?: any;
  target?: FilterTarget;
}

export const CustomFilter: FC<ICustomFilter> = ({ value, target, onChange }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleFiltersModal = () => setShowModal(prev => !prev);

  const Wrapper = useMemo(() => {
    return target === 'table' ? QueryBuilderTableWrapper : QueryBuilderModelWrapper;
  }, [target]);

  return (
    <Fragment>
      <Button onClick={toggleFiltersModal}>Customise Filters</Button>

      <Wrapper>
        <TableViewSelectorConfiguratorProvider items={(value as ITableViewProps[]) || []}>
          <FilterSettingsModalInner visible={showModal} onChange={onChange} hideModal={toggleFiltersModal} />
        </TableViewSelectorConfiguratorProvider>
      </Wrapper>
    </Fragment>
  );
};
//#endregion

//#region FilterSettingsModalInner
export interface IFilterSettingsModal {
  visible: boolean;
  hideModal: () => void;
  value?: object;
  onChange?: any;
  target?: FilterTarget;
}

export const FilterSettingsModalInner: FC<IFilterSettingsModal> = ({ visible, onChange, hideModal }) => {
  const { items } = useTableViewSelectorConfigurator();
  const isSmall = useMedia('(max-width: 480px)');

  const onOkClick = () => {
    if (typeof onChange === 'function') onChange(items);
    hideModal();
  };

  return (
    <Modal width={isSmall ? '90%' : '60%'} visible={visible} title="Configure Filters" okText="Save" onCancel={hideModal} onOk={onOkClick}>
      <FilterConfigurator />
    </Modal>
  );
};
//#endregion

export default CustomFilterComponent;
