import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { IFormItem, IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { DeleteFilled, OrderedListOutlined } from '@ant-design/icons';
import { evaluateComplexString, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { FormItemProvider, ListItemProvider, useForm, useGlobalState } from '../../../../providers';
import { listSettingsForm } from './settings';
import ComponentsContainer from '../../componentsContainer';
import { Button, ColProps, Divider, Form, Input, message, Space } from 'antd';
import ConfigurableFormItem from '../formItem';
import { useMutate } from 'restful-react';
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
import { SubFormProvider } from '../../../../providers/subForm';
import SubForm from '../subForm/subForm';
import { ListControlEvents } from './constants';
import { useDebouncedCallback } from 'use-debounce/lib';
import { useSubscribe } from '../../../../hooks';
import { nanoid } from 'nanoid';
import { EntitiesGetAllQueryParams, useEntitiesGetAll } from '../../../../apis/entities';

const MAX_RESULT_COUNT = 1_000_000;

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
      labelCol: 5,
      wrapperCol: 13,
      buttons: [
        {
          id: nanoid(),
          itemType: 'item',
          sortOrder: 0,
          name: 'button1',
          label: ' ',
          itemSubType: 'button',
          uniqueStateId,
          buttonAction: 'dispatchAnEvent',
          eventName: 'refreshListItems',
          chosen: false,
          selected: false,
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

interface IListComponentRenderState {
  quickSearch?: string;
  skipCount?: number;
  maxResultCount?: number;
}

const ListComponentRender: FC<IListComponentRenderProps> = ({
  containerId,
  dataSource,
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
  submitHttpVerb = 'POST',
  onSubmit,
  submitUrl,
  entityType,
  showQuickSearch,
  labelCol,
  wrapperCol,
}) => {
  const { markup, error: fetchFormError } = useFormMarkup(formPath?.id);
  const [state, setState] = useState<IListComponentRenderState>({ maxResultCount: paginationDefaultPageSize });
  const queryParamsFromBrowser = useMemo(() => getQueryParams(), []);
  const { formData, formMode } = useForm();
  const { globalState } = useGlobalState();
  const { refetch: fetchEntities, loading: isFetchingEntities, data, error: fetchEntitiesError } = useEntitiesGetAll({
    lazy: true,
  });
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

  const { mutate: submitHttp, loading: submitting, error: submitError } = useMutate({
    path: getEvaluatedUrl(submitUrl),
    verb: submitHttpVerb,
  });

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
    const _queryParams: EntitiesGetAllQueryParams = {
      entityType,
      maxResultCount: showPagination ? state?.maxResultCount : MAX_RESULT_COUNT,
      skipCount: state?.skipCount,
      quickSearch: state?.quickSearch,
    };

    if (properties?.length) {
      _queryParams.properties = properties?.map(p => camelCase(p)).join(' ');
    }

    if (filters && getFilters()) {
      _queryParams.filter = getFilters();
    }

    return _queryParams;
  }, [properties, showPagination, paginationDefaultPageSize, state]);

  const debouncedRefresh = useDebouncedCallback(
    () => {
      fetchEntities({ queryParams });
    },
    // delay in ms
    300
  );

  useEffect(() => {
    if (isInDesignerMode) return;

    if (dataSource === 'api') {
      debouncedRefresh();
    }
  }, [isInDesignerMode, dataSource]);

  useEffect(() => {
    if (isInDesignerMode) return;

    if (!isFetchingEntities && typeof onChange === 'function' && data && dataSource === 'api') {
      if (Array.isArray(data?.result)) {
        onChange(data?.result);
      } else if (Array.isArray(data?.result?.items)) {
        onChange(data?.result?.items);
      }
    }
  }, [data, isInDesignerMode, isFetchingEntities]);

  useEffect(() => {
    if (value && !Array.isArray(value) && typeof onChange === 'function' && !isInDesignerMode) {
      onChange([]);
    }
  }, [value, isInDesignerMode]);

  useEffect(() => {
    if (!value) {
      onChange([]); // Make sure the form is not undefined
    }
  }, [value]);

  //#region Events
  useSubscribe(ListControlEvents.refreshListItems, ({ stateId }) => {
    if (stateId === uniqueStateId) {
      debouncedRefresh();
    }
  });

  useSubscribe(ListControlEvents.saveListItems, ({ stateId }) => {
    if (stateId === uniqueStateId) {
      submitListItems();
    }
  });

  useSubscribe(ListControlEvents.addListItems, ({ stateId, state }) => {
    if (stateId === uniqueStateId) {
      debouncedAddItems(state);
    }
  });
  //#endregion

  const debouncedAddItems = useDebouncedCallback(data => {
    onChange(Array.isArray(value) ? [...value, data] : [data]);
  }, 300);

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
          const skipCount = pageSize * (page - 1);

          setState(prev => ({ ...prev, skipCount, maxResultCount: pageSize }));

          fetchEntities({ queryParams: { ...queryParams, skipCount: skipCount, maxResultCount: pageSize } });
        }}
      />
    );
  };

  const deleteItem = useCallback(
    (index: number) => {
      if (deleteUrl) {
        const item = value[index];

        deleteHttp('', { queryParams: { id: item?.id || item.Id } }).then(() => {
          debouncedRefresh();
        });
      }
    },
    [value]
  );

  const setQuickSearch = useDebouncedCallback((text: string) => {
    setState(prev => ({ ...prev, quickSearch: text }));
  }, 200);

  const submitListItems = useDebouncedCallback(() => {
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

      submitHttp(payload).then(() => {
        message.success('Data saved successfully!');
      });
    }
  }, 350);

  const renderSubForm = (name?: string, localLabelCol?: ColProps, localWrapperCol?: ColProps) => {
    // Note we do not pass the name. The name will be provided by the List component
    return (
      <SubFormProvider
        name={name}
        markup={markup}
        properties={[]}
        labelCol={localLabelCol}
        wrapperCol={localWrapperCol}
      >
        <SubForm />
      </SubFormProvider>
    );
  };

  const isSpinning = submitting || isDeleting || isFetchingEntities;

  console.log('LOGS:: value, data: ', value, data);

  return (
    <CollapsiblePanel
      header={title}
      extraClass="sha-list-component-extra"
      extra={
        <div className="sha-list-component-extra-space">
          <Space size="small">
            {renderPagination()}

            <Show when={showQuickSearch}>
              <Input.Search onSearch={setQuickSearch} size="small" />
            </Show>

            <ButtonGroup items={buttons || []} name={''} type={''} id={containerId} size="small" />
          </Space>
        </div>
      }
    >
      <Show when={isInDesignerMode && renderStrategy === 'dragAndDrop'}>
        <FormItemProvider labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          <ComponentsContainer containerId={containerId} />
        </FormItemProvider>
      </Show>
      <Show when={isInDesignerMode && renderStrategy === 'externalForm' && Boolean(formPath?.id)}>
        {renderSubForm('__IGNORE__')}
      </Show>

      <Show when={!isInDesignerMode}>
        <ValidationErrors error={fetchFormError} />
        <ValidationErrors error={deleteError} />
        <ValidationErrors error={submitError} />
        <ValidationErrors error={fetchEntitiesError} />

        <ShaSpin spinning={isSpinning} tip={isFetchingEntities ? 'Fetching data...' : 'Submitting'}>
          <Show when={Array.isArray(value)}>
            <div className="sha-list-component-body" style={{ maxHeight: !showPagination ? maxHeight : 'unset' }}>
              <Form.List name={name} initialValue={[]}>
                {(fields, { remove }) => {
                  console.log('LOGS:: fields, value, name, formData: ', fields, value, name, formData);

                  return (
                    <>
                      {fields?.map((field, index) => (
                        <div className="sha-list-component-item">
                          <Show when={Boolean(containerId) && renderStrategy === 'dragAndDrop'}>
                            <FormItemProvider
                              namePrefix={`${index}`}
                              wrapperCol={{ span: wrapperCol }}
                              labelCol={{ span: labelCol }}
                            >
                              <ComponentsContainer
                                containerId={containerId}
                                plainWrapper
                                direction="horizontal"
                                alignItems="center"
                              />{' '}
                            </FormItemProvider>
                          </Show>

                          <Show when={Boolean(formPath?.id) && Boolean(markup) && renderStrategy === 'externalForm'}>
                            {renderSubForm(
                              `${index}`,
                              labelCol && { span: labelCol },
                              wrapperCol && { span: wrapperCol }
                            )}
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
