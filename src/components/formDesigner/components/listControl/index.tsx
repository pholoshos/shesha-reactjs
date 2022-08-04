import React, { FC, Fragment, useEffect, useMemo } from 'react';
import { IFormItem, IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { OrderedListOutlined } from '@ant-design/icons';
import { evaluateComplexString, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { ListItemProvider, useForm, useGlobalState } from '../../../../providers';
import { listSettingsForm } from './settings';
import ComponentsContainer from '../../componentsContainer';
import { Alert, Form, List } from 'antd';
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
    const { isComponentHidden, formMode, setFormData } = useForm();

    useEffect(() => {
      if (formMode !== 'designer') {
        setFormData({
          values: {
            items: [
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
          },
          mergeValues: true,
        });
      }
    }, [formMode]);

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
            name={model?.name}
            bordered={model?.bordered}
            title={model?.title}
            footer={model?.footer}
            size={size}
            // dataSourceUrl={model?.dataSourceUrl}
            formPath={model?.renderStrategy === 'externalForm' ? model?.formPath : null}
          />
        </ConfigurableFormItem>
      );
    }

    return (
      <ConfigurableFormItem model={model}>
        {model?.renderStrategy === 'externalForm' ? (
          <Alert message="You can't drop items here if renderStrategy === 'externalForm'. Instead, specify form path" />
        ) : (
          <ComponentsContainer containerId={model.id} itemsLimit={1} />
        )}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: listSettingsForm,
  validateSettings: model => validateConfigurableComponentSettings(listSettingsForm, model),
};

interface IListComponentRenderProps extends IListSettingsProps, IFormItem {
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
  value: _value,
  name,
  onChange,
}) => {
  const { refetch, loading, data, error } = useGet({ path: '/' });
  const { formData } = useForm();
  const { globalState } = useGlobalState();

  const value = (formData || {})[name];

  console.log('LOGS:: _value: ', _value);

  const queryParams = useMemo(() => getQueryParams(), []);

  const evaluatedDataSourceUrl = useMemo(() => {
    if (!dataSourceUrl) return '';

    const getEvaluatedFormat = () => {
      // tslint:disable-next-line:function-constructor
      return new Function(dataSourceUrl)();
    };

    const rawString = getEvaluatedFormat();

    return evaluateComplexString(rawString, [
      { match: 'data', data: formData },
      { match: 'globalState', data: globalState },
      { match: 'query', data: queryParams },
    ]);
  }, [dataSourceUrl]);

  useEffect(() => {
    if (evaluatedDataSourceUrl) {
      refetch({ path: evaluatedDataSourceUrl });
    }
  }, [evaluatedDataSourceUrl, queryParams, formData, globalState]);

  const listItems = useMemo<any[]>(() => {
    if (evaluatedDataSourceUrl && data) {
      return data?.result;
    }

    return Array.isArray(value) ? value : [];
  }, [data, evaluatedDataSourceUrl]);

  // useEffect(() => {
  //   if (typeof onChange === 'function') {
  //     onChange(data?.result);
  //   }
  // }, [data, evaluatedDataSourceUrl]);

  console.log('LOGS:: ListComponentRender listItems, value: ', listItems, value, formData);

  return (
    <Fragment>
      <ValidationErrors error={error} />
      <Form.List name={name} initialValue={listItems}>
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <div key={field.key}>
                  <ListItemProvider index={index} prefix={`${name}.`}>
                    <ComponentsContainer
                      containerId={containerId}
                      plainWrapper
                      direction="horizontal"
                      alignItems="center"
                    />
                  </ListItemProvider>
                </div>
              ))}
            </div>
          );
        }}
      </Form.List>
      {/* <List
        size="small"
        header={<span>{title}</span>}
        footer={<span>{footer}</span>}
        bordered
        loading={loading}
        dataSource={listItems}
        pagination={paginationConfig}
        renderItem={(_, index) => {
          return (
            <ListItemProvider index={index} prefix={`${name}.`}>
              <List.Item>
                <ComponentsContainer
                  containerId={containerId}
                  plainWrapper
                  direction="horizontal"
                  alignItems="center"
                />
              </List.Item>
            </ListItemProvider>
          );
        }}
      /> */}
    </Fragment>
  );
};

ListComponentRender.displayName = 'ListComponentRender';

export default ListComponent;
