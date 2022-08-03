import React, { FC, Fragment, useEffect, useMemo } from 'react';
import { IToolboxComponent, IValuable } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { OrderedListOutlined } from '@ant-design/icons';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm } from '../../../../providers';
import { listSettingsForm } from './settings';
import ComponentsContainer from '../../componentsContainer';
import { List } from 'antd';
import ConfigurableFormItem from '../formItem';
import { useGet } from 'restful-react';
import ValidationErrors from '../../../validationErrors';
import { PaginationConfig, PaginationPosition } from 'antd/lib/pagination/Pagination';

interface IListSettingsProps {
  dataSourceUrl?: string;
  queryParamsExpression?: string;
}

export interface IListComponentProps extends IListSettingsProps, IConfigurableFormComponent {
  showPagination?: boolean;
  paginationShowQuickJumper: boolean;
  paginationResponsive?: boolean;
  paginationSize?: 'default' | 'small';
  paginationPosition?: PaginationPosition;
  paginationRole?: string;
  paginationTotalBoundaryShowSizeChanger?: number;
}

const ListComponent: IToolboxComponent<IListComponentProps> = {
  type: 'list',
  name: 'List',
  icon: <OrderedListOutlined />,
  factory: (model: IListComponentProps) => {
    const { isComponentHidden, formMode } = useForm();

    const isHidden = isComponentHidden(model);

    if (isHidden) return null;

    if (formMode !== 'designer') {
      return (
        <ConfigurableFormItem model={model}>
          <ListComponentRender
            containerId={model.id}
            paginationConfig={
              model?.showPagination
                ? {
                    responsive: model?.paginationResponsive,
                    showQuickJumper: model?.paginationShowQuickJumper,
                    size: model?.paginationSize,
                    role: model?.paginationRole,
                    position: model?.paginationPosition,
                  }
                : false
            }
          />
        </ConfigurableFormItem>
      );
    }

    return (
      <ConfigurableFormItem model={model}>
        <ComponentsContainer containerId={model.id} itemsLimit={1} />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: listSettingsForm,
  validateSettings: model => validateConfigurableComponentSettings(listSettingsForm, model),
};

interface IListComponentRenderProps extends IListSettingsProps, IValuable {
  containerId: string;
  value?: any[];
  paginationConfig?: PaginationConfig | false;
}

const ListComponentRender: FC<IListComponentRenderProps> = ({
  containerId,
  dataSourceUrl,
  paginationConfig,
  value = [
    {
      firstName: 'Phil',
      lastName: 'Mashiane',
    },
    {
      firstName: 'Mazi',
      lastName: 'Muhlari',
    },
    {
      firstName: 'Ian',
      lastName: 'Houvet',
    },
  ],
}) => {
  const { refetch, loading, data, error } = useGet({ path: dataSourceUrl || '/' });

  useEffect(() => {
    if (dataSourceUrl) {
      refetch();
    }
  }, [dataSourceUrl]);

  const { formData } = useForm();

  console.log('LOGS:: ListComponentRender formData: ', formData, value);

  const listItems = useMemo<any[]>(() => {
    if (dataSourceUrl && data) {
      return data?.result;
    }

    return value;
  }, [value, data]);

  return (
    <Fragment>
      <ValidationErrors error={error} />
      <List
        size="small"
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        loading={loading}
        dataSource={listItems}
        pagination={paginationConfig}
        renderItem={(_, index) => {
          console.log('List renderItem, _, index', _, index);

          return (
            <List.Item>
              <ComponentsContainer
                containerId={containerId}
                listFormComponentIndex={index}
                plainWrapper
                direction="horizontal"
                alignItems="center"
              />
            </List.Item>
          );
        }}
      />
    </Fragment>
  );
};

ListComponentRender.displayName = 'ListComponentRender';

export default ListComponent;
