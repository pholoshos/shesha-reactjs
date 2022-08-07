import React, { FC, Fragment, useEffect, useMemo } from 'react';
import { IFormItem, IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { MinusCircleOutlined, OrderedListOutlined, PlusOutlined } from '@ant-design/icons';
import { evaluateComplexString, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { ListItemProvider, useForm, useGlobalState } from '../../../../providers';
import { listSettingsForm } from './settings';
import ComponentsContainer from '../../componentsContainer';
import { Alert, Button, Divider, Form, message, Space } from 'antd';
import ConfigurableFormItem from '../formItem';
import { useGet, useMutate } from 'restful-react';
import ValidationErrors from '../../../validationErrors';
import Pagination from 'antd/lib/pagination/Pagination';
import { ListSize } from 'antd/lib/list';
import { getQueryParams } from '../../../../utils/url';
import './styles/index.less';
import Show from '../../../show';
import ShaSpin from '../../../shaSpin';
import classNames from 'classnames';

interface IListSettingsProps {
  dataSourceUrl?: string;
  queryParamsExpression?: string;
  bordered?: boolean;
  title?: string;
  footer?: string;
  size?: ListSize;
  formPath?: string;
  allowAddAndRemove?: boolean;
  submitUrl?: string;
  submitHttpVerb?: 'POST' | 'PUT';
  onSubmit?: string;
  showPagination?: boolean;
  paginationDefaultPageSize: number;
}

export interface IListComponentProps extends IListSettingsProps, Omit<IConfigurableFormComponent, 'size'> {
  /** the source of data for the list component */
  labelCol?: number;
  wrapperCol?: number;
  dataSource?: 'form' | 'api';
  renderStrategy?: 'dragAndDrop' | 'externalForm';
  allowSubmit?: boolean;
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
      const submitProps = model?.allowSubmit
        ? {
            submitUrl: model?.submitUrl,
            submitHttpVerb: model?.submitHttpVerb,
          }
        : {};

      return (
        <ConfigurableFormItem
          model={model}
          className="sha-list-component"
          labelCol={{ span: model?.labelCol }}
          wrapperCol={{ span: model?.wrapperCol }}
        >
          <ListComponentRender
            containerId={model.id}
            showPagination={model?.showPagination}
            paginationDefaultPageSize={model?.showPagination ? model?.paginationDefaultPageSize : 5}
            name={model?.name}
            bordered={model?.bordered}
            title={model?.title}
            footer={model?.footer}
            size={size}
            submitHttpVerb={model?.submitHttpVerb}
            submitUrl={model?.submitUrl}
            allowAddAndRemove={model?.allowAddAndRemove}
            dataSourceUrl={model?.dataSource === 'api' ? model?.dataSourceUrl : null}
            formPath={model?.renderStrategy === 'externalForm' ? model?.formPath : null}
            {...submitProps}
          />
        </ConfigurableFormItem>
      );
    }

    return (
      <ConfigurableFormItem model={model} labelCol={{ span: model?.labelCol }} wrapperCol={{ span: model?.wrapperCol }}>
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
}

const ListComponentRender: FC<IListComponentRenderProps> = ({
  containerId,
  dataSourceUrl,
  showPagination,
  paginationDefaultPageSize = 5,
  formPath, // Render embedded form if this option is provided
  value,
  name,
  onChange,
  allowAddAndRemove,
  submitUrl,
  submitHttpVerb = 'POST',
  onSubmit,
}) => {
  const queryParams = useMemo(() => getQueryParams(), []);
  const { formData, formSettings } = useForm();
  const { globalState } = useGlobalState();

  const evaluatedSubmitUrl = useMemo(() => {
    if (!submitUrl?.trim()) return '';

    return evaluateComplexString(submitUrl, [
      { match: 'data', data: formData },
      { match: 'globalState', data: globalState },
      { match: 'query', data: queryParams },
    ]);
  }, [submitUrl, formData, globalState, queryParams]);

  const { refetch, loading: fetchingData, data, error: fetchDataError } = useGet({ path: '/' });
  const { mutate, loading: submitting, error: submitError } = useMutate({
    path: evaluatedSubmitUrl,
    verb: submitHttpVerb,
  });

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
      refetch({ path: evaluatedDataSourceUrl, queryParams: { maxResultCount: paginationDefaultPageSize } });
    }
  }, [evaluatedDataSourceUrl]);

  useEffect(() => {
    if (typeof onChange === 'function' && data && evaluatedDataSourceUrl) {
      if (Array.isArray(data?.result)) {
        onChange(data?.result);
      } else if (Array.isArray(data?.result?.items)) {
        onChange(data?.result?.items);
      }
    }
  }, [data, evaluatedDataSourceUrl]);

  useEffect(() => {
    if (value && !Array.isArray(value) && !evaluatedDataSourceUrl && typeof onChange === 'function') {
      onChange([]);
    }
  }, [value]);

  const handleSave = () => {
    if (onSubmit) {
      const getOnSubmitPayload = () => {
        // tslint:disable-next-line:function-constructor
        return new Function('data, query, globalState, items', onSubmit)(formData, queryParams, globalState, value); // Pass data, query, globalState
      };

      const payload = Boolean(onSubmit) ? getOnSubmitPayload() : value;

      mutate(payload).then(() => {
        message.success('Data saved successfully!');
      });
    }
  };

  const renderPagination = () => (
    <span>
      <Pagination
        defaultCurrent={1}
        total={data?.result?.totalCount || 50}
        defaultPageSize={paginationDefaultPageSize}
        pageSizeOptions={[5, 10, 15, 20]}
        onChange={(page: number, pageSize) => {
          refetch({
            queryParams: { skipCount: pageSize * (page - 1), maxResultCount: pageSize },
            path: evaluatedDataSourceUrl,
          });
        }}
      />
    </span>
  );

  return (
    <Fragment>
      <ValidationErrors error={fetchDataError} />
      <ValidationErrors error={submitError} />

      <ShaSpin spinning={fetchingData || submitting} tip={fetchingData ? 'Fetching data...' : 'Submitting'}>
        <Show when={Array.isArray(value)}>
          <Form.List name={name} initialValue={[]}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map((field, index) => (
                    <ListItemProvider index={index} prefix={`${name}.`} formSettings={formSettings} key={field.key}>
                      <ComponentsContainer
                        containerId={containerId}
                        plainWrapper
                        direction="horizontal"
                        alignItems="center"
                      />

                      <Show when={allowAddAndRemove}>
                        <div className="sha-list-component-add-item-btn">
                          <Button
                            danger
                            type="primary"
                            size="small"
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                            icon={<MinusCircleOutlined />}
                          >
                            Remove Above Field
                          </Button>
                        </div>
                      </Show>

                      <Divider />
                    </ListItemProvider>
                  ))}

                  <div className={classNames('sha-list-pagination-container', { 'show-pagination': showPagination })}>
                    <Space>
                      <Show when={allowAddAndRemove}>
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small">
                          Add field
                        </Button>
                      </Show>

                      <Show when={Boolean(submitHttpVerb) && Boolean(submitUrl)}>
                        <Button type="primary" onClick={handleSave} icon={<PlusOutlined />} size="small">
                          Save Items
                        </Button>
                      </Show>
                    </Space>

                    <Show when={showPagination}>{renderPagination()}</Show>
                  </div>
                </>
              );
            }}
          </Form.List>
        </Show>
      </ShaSpin>
    </Fragment>
  );
};

ListComponentRender.displayName = 'ListComponentRender';

export default ListComponent;
