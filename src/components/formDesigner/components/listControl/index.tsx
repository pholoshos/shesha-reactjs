import React, { FC, useEffect, useMemo } from 'react';
import { IAnyObject, IFormItem, IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { MinusCircleOutlined, OrderedListOutlined, PlusOutlined } from '@ant-design/icons';
import { evaluateComplexString, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { ListItemProvider, useForm, useGlobalState } from '../../../../providers';
import { listSettingsForm } from './settings';
import ComponentsContainer from '../../componentsContainer';
import { Button, Divider, Form, message, Space } from 'antd';
import ConfigurableFormItem from '../formItem';
import { useGet, useMutate } from 'restful-react';
import ValidationErrors from '../../../validationErrors';
import Pagination from 'antd/lib/pagination/Pagination';
import { getQueryParams } from '../../../../utils/url';
import './styles/index.less';
import Show from '../../../show';
import ShaSpin from '../../../shaSpin';
import classNames from 'classnames';
import { useFormMarkup } from './useFormMarkup';
import CollapsiblePanel from '../../../collapsiblePanel';
import { ButtonGroup } from '../button/buttonGroup/buttonGroupComponent';
import { ListControlSettings } from './settingsv2';
import { IListItemsProps } from './models';
import { camelCase, isEmpty } from 'lodash';
import camelCaseKeys from 'camelcase-keys';
import { evaluateDynamicFilters } from '../../../../providers/dataTable/utils';

export interface IListComponentProps extends IListItemsProps, IConfigurableFormComponent {
  /** the source of data for the list component */
  labelCol?: number;
  wrapperCol?: number;
  dataSource?: 'form' | 'api';
  renderStrategy?: 'dragAndDrop' | 'externalForm';
}

const ListComponent: IToolboxComponent<IListComponentProps> = {
  type: 'list',
  name: 'List',
  icon: <OrderedListOutlined />,
  factory: ({ ...model }: IListComponentProps) => {
    const { isComponentHidden } = useForm();

    const isHidden = isComponentHidden(model);

    if (isHidden) return null;

    return (
      <ConfigurableFormItem
        model={{ ...model, hideLabel: true }}
        className="sha-list-component"
        labelCol={{ span: model?.hideLabel ? 0 : model?.labelCol }}
        wrapperCol={{ span: model?.hideLabel ? 24 : model?.wrapperCol }}
      >
        <ListComponentRender
          containerId={model.id}
          allowSubmit={model?.allowSubmit}
          submitUrl={model?.submitUrl}
          submitHttpVerb={model?.submitHttpVerb}
          showPagination={model?.showPagination}
          paginationDefaultPageSize={model?.showPagination ? model?.paginationDefaultPageSize : 5}
          name={model?.name}
          bordered={model?.bordered}
          title={model?.title}
          footer={model?.footer}
          buttons={model?.buttons}
          filters={model?.filters}
          properties={model?.properties}
          uniqueStateId={model?.uniqueStateId}
          maxHeight={model?.maxHeight}
          allowAddAndRemove={model?.allowAddAndRemove}
          dataSourceUrl={model?.dataSource === 'api' ? model?.dataSourceUrl : null}
          formId={model?.renderStrategy === 'externalForm' ? model?.formId : null}
        />
      </ConfigurableFormItem>
    );
  },
  // settingsFormMarkup: listSettingsForm,
  settingsFormFactory: ({ model, onSave, onCancel, onValuesChange }) => {
    return (
      <ListControlSettings
        model={(model as unknown) as IListItemsProps}
        onSave={onSave as any}
        onCancel={onCancel}
        onValuesChange={onValuesChange as any}
      />
    );
  },
  initModel: model => {
    const customProps: IListComponentProps = {
      ...model,
      showPagination: true,
      hideLabel: true,
    };
    return customProps;
  },
  validateSettings: model => validateConfigurableComponentSettings(listSettingsForm, model),
};

interface IListComponentRenderProps extends IListItemsProps, IFormItem {
  containerId: string;
  value?: any[];
}

const ListComponentRender: FC<IListComponentRenderProps> = ({
  containerId,
  dataSourceUrl,
  showPagination,
  paginationDefaultPageSize = 5,
  formId, // Render embedded form if this option is provided
  value,
  name,
  onChange,
  allowAddAndRemove,
  submitUrl,
  submitHttpVerb = 'POST',
  onSubmit,
  allowSubmit,
  buttons,
  title,
  maxHeight,
  filters,
  properties,
}) => {
  const { markup, error: fetchFormError } = useFormMarkup(formId);
  const queryParamsFromBrowser = useMemo(() => getQueryParams(), []);
  const { formData, formSettings, formMode } = useForm();
  const { globalState } = useGlobalState();
  const isInDesignerMode = formMode === 'designer';

  const evaluatedSubmitUrl = useMemo(() => {
    if (!submitUrl?.trim() || isInDesignerMode) return '';

    return evaluateComplexString(submitUrl, [
      { match: 'data', data: formData },
      { match: 'globalState', data: globalState },
      { match: 'query', data: queryParamsFromBrowser },
    ]);
  }, [submitUrl, formData, globalState, queryParamsFromBrowser, isInDesignerMode]);

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
      { match: 'query', data: queryParamsFromBrowser },
    ]);
  }, [dataSourceUrl]);

  const getFilters = () => {
    if (!filters) return '';

    const localFormData = !isEmpty(formData) ? camelCaseKeys(formData, { deep: true, pascalCase: true }) : formData;

    const evaluatedFilters = evaluateDynamicFilters(
      [filters],
      [
        {
          match: 'data',
          data: localFormData,
        },
        {
          match: 'globalState',
          data: globalState,
        },
      ]
    );

    if (evaluatedFilters.find(f => f?.unevaluatedExpressions?.length)) return '';

    return JSON.stringify(evaluatedFilters[0]) || '';
  };

  const queryParams = useMemo(() => {
    const _queryParams: IAnyObject = {
      maxResultCount: showPagination ? paginationDefaultPageSize : 1000_000,
    };
    if (properties?.length) {
      _queryParams.properties = properties?.map(p => camelCase(p)).join();
    }

    if (filters && getFilters()) {
      _queryParams.filter = getFilters();
    }

    return _queryParams;
  }, [formData, globalState, properties, showPagination, paginationDefaultPageSize]);

  useEffect(() => {
    if (isInDesignerMode) return;

    if (evaluatedDataSourceUrl) {
      refetch({
        path: evaluatedDataSourceUrl,
        queryParams,
      });
    }
  }, [evaluatedDataSourceUrl, isInDesignerMode]);

  useEffect(() => {
    if (isInDesignerMode) return;

    if (typeof onChange === 'function' && data && evaluatedDataSourceUrl) {
      if (Array.isArray(data?.result)) {
        onChange(data?.result);
      } else if (Array.isArray(data?.result?.items)) {
        onChange(data?.result?.items);
      }
    }
  }, [data, evaluatedDataSourceUrl, isInDesignerMode]);

  useEffect(() => {
    if (
      value &&
      !Array.isArray(value) &&
      !evaluatedDataSourceUrl &&
      typeof onChange === 'function' &&
      !isInDesignerMode
    ) {
      onChange([]);
    }
  }, [value, isInDesignerMode]);

  const handleSave = () => {
    if (onSubmit) {
      const getOnSubmitPayload = () => {
        // tslint:disable-next-line:function-constructor
        return new Function('data, query, globalState, items', onSubmit)(
          formData,
          queryParamsFromBrowser,
          globalState,
          value
        ); // Pass data, query, globalState
      };

      const payload = Boolean(onSubmit) ? getOnSubmitPayload() : value;

      mutate(payload).then(() => {
        message.success('Data saved successfully!');
      });
    }
  };

  const renderPagination = () => {
    if (!showPagination) return null;

    return (
      <Pagination
        defaultCurrent={1}
        total={data?.result?.totalCount || 50}
        defaultPageSize={paginationDefaultPageSize}
        pageSizeOptions={[5, 10, 15, 20]}
        size="small"
        showSizeChanger
        showTitle
        onChange={(page: number, pageSize) => {
          refetch({
            queryParams: { ...queryParams, skipCount: pageSize * (page - 1), maxResultCount: pageSize },
            path: evaluatedDataSourceUrl,
          });
        }}
      />
    );
  };

  return (
    <CollapsiblePanel
      header={title}
      extraClass="sha-list-component-extra"
      extra={
        <div className="sha-list-component-extra-space">
          {renderPagination()}
          <ButtonGroup items={buttons || []} name={''} type={''} id={containerId} size="small" />
        </div>
      }
    >
      <Show when={isInDesignerMode}>
        <ComponentsContainer containerId={containerId} />
      </Show>

      <Show when={!isInDesignerMode}>
        <ValidationErrors error={fetchDataError} />
        <ValidationErrors error={submitError} />
        <ValidationErrors error={fetchFormError} />

        <ShaSpin spinning={fetchingData || submitting} tip={fetchingData ? 'Fetching data...' : 'Submitting'}>
          <Show when={Array.isArray(value)}>
            <div className="sha-list-component-body" style={{ maxHeight: !showPagination ? maxHeight : 'unset' }}>
              <Form.List name={name} initialValue={[]}>
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields?.map((field, index) => (
                        <div className="sha-list-component-item">
                          <ListItemProvider
                            index={index}
                            prefix={`${name}.`}
                            formSettings={formSettings}
                            key={field.key}
                          >
                            <Show when={Boolean(containerId)}>
                              <ComponentsContainer
                                containerId={containerId}
                                plainWrapper
                                direction="horizontal"
                                alignItems="center"
                              />
                            </Show>

                            <Show when={Boolean(formId)}>
                              {/* <EmbeddedForm markup={markup} containerId={containerId} /> */}
                            </Show>

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
                                  Remove
                                </Button>
                              </div>
                            </Show>

                            <Divider />
                          </ListItemProvider>
                        </div>
                      ))}

                      <div className={classNames('sha-list-pagination-container')}>
                        <Space>
                          <Show when={allowAddAndRemove}>
                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small">
                              Add field
                            </Button>
                          </Show>

                          <Show when={allowSubmit && Boolean(submitHttpVerb) && Boolean(submitUrl?.trim())}>
                            <Button type="primary" onClick={handleSave} icon={<PlusOutlined />} size="small">
                              Save Items
                            </Button>
                          </Show>
                        </Space>
                      </div>
                    </>
                  );
                }}
              </Form.List>
            </div>
          </Show>
        </ShaSpin>
      </Show>
    </CollapsiblePanel>
  );
};

ListComponentRender.displayName = 'ListComponentRender';

export default ListComponent;
