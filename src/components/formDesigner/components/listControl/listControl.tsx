import { camelCase, isEmpty } from 'lodash';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useMutate } from 'restful-react';
import { EntitiesGetAllQueryParams, useEntitiesGetAll } from '../../../../apis/entities';
import { FormItemProvider, SubFormProvider, useForm, useGlobalState } from '../../../../providers';
import { useFormMarkup } from '../../../../providers/form/hooks';
import { getQueryParams } from '../../../../utils/url';
import camelCaseKeys from 'camelcase-keys';
import { IListControlProps, IListComponentRenderState } from './models';
import { evaluateDynamicFilters } from '../../../../providers/dataTable/utils';
import { ListControlEvents, MAX_RESULT_COUNT } from './constants';
import { useDebouncedCallback } from 'use-debounce';
import { useSubscribe } from '../../../../hooks';
import { Button, ColProps, Divider, Empty, Form, Input, message, notification, Pagination, Space } from 'antd';
import SubForm from '../subForm/subForm';
import CollapsiblePanel from '../../../collapsiblePanel';
import Show from '../../../show';
import { ButtonGroup } from '../button/buttonGroup/buttonGroupComponent';
import ComponentsContainer from '../../componentsContainer';
import ValidationErrors from '../../../validationErrors';
import ShaSpin from '../../../shaSpin';
import { DeleteFilled } from '@ant-design/icons';
import classNames from 'classnames';

const ListControl: FC<IListControlProps> = ({
  containerId,
  dataSource,
  showPagination,
  paginationDefaultPageSize = 5,
  formPath, // Render embedded form if this option is provided
  value,
  name,
  onChange,
  allowDeleteItems,
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
  allowRemoteDelete,
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

    return (() => {
      // tslint:disable-next-line:function-constructor
      return new Function('data, query, globalState', url)(formData, queryParamsFromBrowser, globalState); // Pass data, query, globalState
    })();
  };

  const { mutate: deleteHttp, loading: isDeleting, error: deleteError } = useMutate({
    path: getEvaluatedUrl(deleteUrl),
    verb: 'DELETE',
  });

  const { mutate: submitHttp, loading: submitting, error: submitError } = useMutate({
    path: getEvaluatedUrl(submitUrl),
    verb: submitHttpVerb,
  });

  const evaluatedFilters = useMemo(() => {
    if (!filters) return '';

    const localFormData = !isEmpty(formData) ? camelCaseKeys(formData, { deep: true, pascalCase: true }) : formData;

    const _response = evaluateDynamicFilters(
      [{ expression: filters } as any],
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

    if (_response.find(f => f?.unevaluatedExpressions?.length)) return '';

    return JSON.stringify(_response[0]?.expression) || '';
  }, [filters, formData, globalState]);

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

    if (filters && evaluatedFilters) {
      _queryParams.filter = evaluatedFilters;
    }

    return _queryParams;
  }, [properties, showPagination, paginationDefaultPageSize, state, filters, evaluatedFilters]);

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
  }, [isInDesignerMode, dataSource, evaluatedFilters]);

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
      submitListItems(submitUrl);
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
    (index: number, remove: (index: number | number[]) => void) => {
      if (allowRemoteDelete) {
        if (!deleteUrl) {
          notification.error({
            placement: 'top',
            message: "'deleteUrl' missing",
            description: 'Please make sure you have specified the deleteUrl',
          });
        } else {
          const item = value[index];

          const idProp = item?.id || item.Id;

          if (!idProp) {
            notification.error({
              placement: 'top',
              message: "'Id' missing",
              description:
                "In order to delete items on the server, you need to make sure you include the 'Id' in the list of returned properties",
            });
          }

          deleteHttp('', { queryParams: { id: item?.id || item.Id } }).then(() => {
            if (remove) {
              remove(index);
            }
            debouncedRefresh();
          });
        }
      } else if (remove) {
        remove(index);
      }
    },
    [value, deleteUrl, allowRemoteDelete, allowDeleteItems]
  );

  const setQuickSearch = useDebouncedCallback((text: string) => {
    setState(prev => ({ ...prev, quickSearch: text }));
  }, 200);

  const submitListItems = useDebouncedCallback(url => {
    if (!url) {
      notification.error({
        message: 'submitUrl missing',
        description: "Please make sure you've specified the submitUrl",
        placement: 'top',
      });
    } else {
      let payload = value;

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

        payload = Boolean(onSubmit) ? getOnSubmitPayload() : value;
      }

      submitHttp(payload).then(() => {
        message.success('Data saved successfully!');
      });
    }
  }, 500);

  const renderSubForm = (localName?: string, localLabelCol?: ColProps, localWrapperCol?: ColProps) => {
    // Note we do not pass the name. The name will be provided by the List component
    return (
      <SubFormProvider
        name={localName}
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

  const hasNoData = value?.length === 0 && !isFetchingEntities;

  return (
    <CollapsiblePanel
      header={title}
      extraClass="sha-list-component-extra"
      className="sha-list-component-panel"
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
            <div
              className={classNames('sha-list-component-body', { loading: isFetchingEntities && value?.length === 0 })}
              style={{ maxHeight: !showPagination ? maxHeight : 'unset' }}
            >
              <Form.List name={name} initialValue={[]}>
                {(fields, { remove }) => {
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
                              />
                            </FormItemProvider>
                          </Show>

                          <Show when={Boolean(formPath?.id) && Boolean(markup) && renderStrategy === 'externalForm'}>
                            {renderSubForm(
                              `${index}`,
                              labelCol && { span: labelCol },
                              wrapperCol && { span: wrapperCol }
                            )}
                          </Show>

                          <Show when={allowDeleteItems}>
                            <div className="sha-list-component-add-item-btn">
                              <Button
                                danger
                                type="ghost"
                                size="small"
                                className="dynamic-delete-button"
                                onClick={() => {
                                  deleteItem(field.name, remove);
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

              <Show when={hasNoData}>
                <Empty description="There are no items found." />
              </Show>
            </div>
          </Show>
        </ShaSpin>
      </Show>
    </CollapsiblePanel>
  );
};

ListControl.displayName = 'ListControl';

export { ListControl };

export default ListControl;
