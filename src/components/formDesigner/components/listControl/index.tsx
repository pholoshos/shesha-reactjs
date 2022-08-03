import React, { FC, Fragment, useEffect, useMemo } from 'react';
import { IToolboxComponent, IValuable } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { OrderedListOutlined } from '@ant-design/icons';
import { evaluateComplexString, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm, useGlobalState } from '../../../../providers';
import { listSettingsForm } from './settings';
import ComponentsContainer from '../../componentsContainer';
import { List } from 'antd';
import ConfigurableFormItem from '../formItem';
import { useGet } from 'restful-react';
import ValidationErrors from '../../../validationErrors';
import { PaginationConfig, PaginationPosition } from 'antd/lib/pagination/Pagination';
import { ListSize } from 'antd/lib/list';
import { getQueryParams } from '../../../../utils/url';

interface IListSettingsProps {
  dataSourceUrl?: string;
  queryParamsExpression?: string;
  bordered?: boolean;
  title?: string;
  footer?: string;
  size?: ListSize;
  formPath?: string;
}

export interface IListComponentProps extends IListSettingsProps, Omit<IConfigurableFormComponent, 'size'> {
  /** the source of data for the list component */
  dataSource?: 'form' | 'api';

  showPagination?: boolean;
  paginationShowQuickJumper: boolean;
  paginationResponsive?: boolean;
  paginationSize?: 'default' | 'small';
  paginationPosition?: PaginationPosition;
  paginationRole?: string;
  paginationTotalBoundaryShowSizeChanger?: number;
  renderStrategy?: 'dragAndDrop' | 'externalForm';
}

const ListComponent: IToolboxComponent<IListComponentProps> = {
  type: 'list',
  name: 'List',
  icon: <OrderedListOutlined />,
  factory: ({ size, ...model }: IListComponentProps) => {
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
            bordered={model?.bordered}
            title={model?.title}
            footer={model?.footer}
            size={size}
            dataSourceUrl={model?.dataSourceUrl}
            formPath={model?.renderStrategy === 'externalForm' ? model?.formPath : null}
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
  title,
  footer,
  formPath, // Render embedded form if this option is provided
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
  const { refetch, loading, data, error } = useGet({ path: '/' });
  const { formData } = useForm();
  const { globalState } = useGlobalState();

  const evaluatedDataSourceUrl = useMemo(() => {
    const getEvaluatedFormat = () => {
      // tslint:disable-next-line:function-constructor
      return new Function(dataSourceUrl)();
    };

    const rawString = getEvaluatedFormat();

    return evaluateComplexString(rawString, [
      { match: 'data', data: formData },
      { match: 'globalState', data: globalState },
      { match: 'query', data: getQueryParams() },
    ]);
  }, [dataSourceUrl]);

  useEffect(() => {
    if (evaluatedDataSourceUrl) {
      refetch({ path: evaluatedDataSourceUrl });
    }
  }, [evaluatedDataSourceUrl]);

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
        header={<span>{title}</span>}
        footer={<span>{footer}</span>}
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
