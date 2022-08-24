import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { IAnyObject, IFormItem, IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { DeleteFilled, OrderedListOutlined } from '@ant-design/icons';
import { evaluateComplexString, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { ListItemProvider, useForm, useGlobalState } from '../../../../providers';
import { listSettingsForm } from './settings';
import ComponentsContainer from '../../componentsContainer';
import { Button, Divider, Form } from 'antd';
import ConfigurableFormItem from '../formItem';
import { useGet, useMutate } from 'restful-react';
import ValidationErrors from '../../../validationErrors';
import Pagination from 'antd/lib/pagination/Pagination';
import { getQueryParams } from '../../../../utils/url';
import './styles/index.less';
import Show from '../../../show';
import ShaSpin from '../../../shaSpin';
import CollapsiblePanel from '../../../collapsiblePanel';
import { ButtonGroup } from '../button/buttonGroup/buttonGroupComponent';
import { ListControlSettings } from './settingsv2';
import { IListItemsProps } from './models';
import { camelCase, isEmpty } from 'lodash';
import camelCaseKeys from 'camelcase-keys';
import { evaluateDynamicFilters } from '../../../../providers/dataTable/utils';
import { useFormMarkup } from '../../../../providers/form/hooks';
import { SubFormProvider } from '../subForm/provider';
import SubForm from '../subForm/subForm';
import { ListControlEvents } from './constants';
import { useDebouncedCallback } from 'use-debounce/lib';
import { useSubscribe } from '../../../../hooks';
import { nanoid } from 'nanoid';

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
        model={{ ...model }}
        className="sha-list-component"
        labelCol={{ span: model?.hideLabel ? 0 : model?.labelCol }}
        wrapperCol={{ span: model?.hideLabel ? 24 : model?.wrapperCol }}
      >
        <ListComponentRender {...model} containerId={model?.id} />
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
    const uniqueStateId = `FORM_LIST_${nanoid()}`;

    const customProps: IListComponentProps = {
      ...model,
      showPagination: true,
      hideLabel: true,
      uniqueStateId,
      buttons: [
        {
          id: 'PWrW0k2WXPweNfHnZgbsj',
          itemType: 'item',
          sortOrder: 0,
          name: 'button1',
          label: ' ',
          itemSubType: 'button',
          uniqueStateId,
          buttonAction: 'executeFormAction',
          chosen: false,
          selected: false,
          formAction: 'refreshListItems',
          icon: 'ReloadOutlined',
          buttonType: 'link',
        },
      ],
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
  formPath, // Render embedded form if this option is provided
  value,
  name,
  onChange,
  allowRemoveItems,
  deleteUrl,
  buttons,
  title,
  maxHeight,
  filters,
  properties,
  renderStrategy,
  uniqueStateId,
}) => {
  const { markup, error: fetchFormError } = useFormMarkup(formPath?.id);
  const queryParamsFromBrowser = useMemo(() => getQueryParams(), []);
  const { formData, formMode } = useForm();
  const { globalState } = useGlobalState();
  const isInDesignerMode = formMode === 'designer';

  const getEvaluatedUrl = (url: string) => {
    if (!url) return '';

    return evaluateComplexString(url, [
      { match: 'data', data: formData },
      { match: 'globalState', data: globalState },
      { match: 'query', data: getQueryParams() },
    ]);
  };

  const { mutate: deleteHttp, loading: isDeleting, error: deleteError } = useMutate({
    path: getEvaluatedUrl(deleteUrl),
    verb: 'DELETE',
  });
  const { refetch, loading: fetchingData, data, error: fetchDataError } = useGet({ path: '/' });

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

  const debouncedRefresh = useDebouncedCallback(
    () => {
      refetch({
        path: evaluatedDataSourceUrl,
        queryParams,
      });
    },
    // delay in ms
    300
  );

  useEffect(() => {
    if (isInDesignerMode) return;

    if (evaluatedDataSourceUrl) {
      debouncedRefresh();
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

  useSubscribe(ListControlEvents.refreshListItems, ({ stateId }) => {
    if (stateId === uniqueStateId) {
      debouncedRefresh();
    }
  });

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

  const renderSubForm = () => {
    // TODO: Pass the correct name in the loop
    return (
      <SubFormProvider name={name} markup={markup} properties={[]}>
        <SubForm />
      </SubFormProvider>
    );
  };

  const deleteItem = useCallback(
    (index: number) => {
      const item = value[index];

      deleteHttp('', { queryParams: { id: item?.id || item.Id } }).then(() => {
        debouncedRefresh();
      });
    },
    [value]
  );

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
      <Show when={isInDesignerMode && renderStrategy === 'dragAndDrop'}>
        <ComponentsContainer containerId={containerId} />
      </Show>
      <Show when={isInDesignerMode && renderStrategy === 'externalForm' && Boolean(formPath?.id)}>
        {renderSubForm()}
      </Show>

      <Show when={!isInDesignerMode}>
        <ValidationErrors error={fetchDataError} />
        <ValidationErrors error={fetchFormError} />
        <ValidationErrors error={deleteError} />

        <ShaSpin spinning={fetchingData || isDeleting} tip={fetchingData ? 'Fetching data...' : 'Submitting'}>
          <Show when={Array.isArray(value)}>
            <div className="sha-list-component-body" style={{ maxHeight: !showPagination ? maxHeight : 'unset' }}>
              <Form.List name={name} initialValue={[]}>
                {(fields, { remove }) => {
                  return (
                    <>
                      {fields?.map((field, index) => (
                        <div className="sha-list-component-item">
                          <ListItemProvider index={index} prefix={`${name}.`} key={field.key}>
                            <Show when={Boolean(containerId) && renderStrategy === 'dragAndDrop'}>
                              <ComponentsContainer
                                containerId={containerId}
                                plainWrapper
                                direction="horizontal"
                                alignItems="center"
                              />
                            </Show>

                            <Show when={Boolean(formPath?.id) && Boolean(markup) && renderStrategy === 'externalForm'}>
                              {renderSubForm()}
                            </Show>

                            <Show when={allowRemoveItems}>
                              <div className="sha-list-component-add-item-btn">
                                <Button
                                  danger
                                  type="ghost"
                                  size="small"
                                  className="dynamic-delete-button"
                                  onClick={() => {
                                    remove(field.name);
                                    deleteItem(field.name);
                                  }}
                                  icon={<DeleteFilled />}
                                />
                              </div>
                            </Show>

                            <Divider className="sha-list-component-divider" />
                          </ListItemProvider>
                        </div>
                      ))}
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
