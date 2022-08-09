import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { ITableCustomTypesRender } from './interfaces';
import { IConfigurableActionColumnsProps } from '../../providers/datatableColumnsConfigurator/models';
import ShaIcon, { IconType } from '../shaIcon';
import { evaluateKeyValuesToObject, evaluateString } from '../../providers/form/utils';
import { useDataTable, useForm, useGlobalState, useModal, useShaRouting, useSheshaApplication } from '../../providers';
import camelCaseKeys from 'camelcase-keys';
import { message, Modal, notification } from 'antd';
import { useGet, useMutate } from 'restful-react';
import { IModalProps } from '../../providers/dynamicModal/models';
import ValidationErrors from '../validationErrors';
import { axiosHttp } from '../../apis/axios';
import { DataTablePubsubConstants } from '../../providers/dataTable/pubSub';
import { usePubSub } from '../../hooks';
import { usePrevious } from 'react-use';
import { useReferenceListItem } from '../../providers/referenceListDispatcher';

export const renderers: ITableCustomTypesRender[] = [
  {
    key: 'string',
    render: props => {
      return props.value;
    },
  },
  {
    key: 'number',
    render: props => {
      return props.value;
    },
  },
  {
    key: 'date',
    render: props => {
      return props.value ? moment(props.value).format('DD/MM/YYYY') : null;
    },
  },
  {
    key: 'date-time',
    render: props => {
      return props.value ? moment(props.value).format('DD/MM/YYYY HH:mm') : null;
    },
  },
  {
    key: 'time',
    render: props => {
      return props.value ? moment.utc(props.value * 1000).format('HH:mm') : null;
    },
  },
  {
    key: 'boolean',
    render: props => {
      return props.value ? 'Yes' : 'No';
    },
  },
  {
    key: 'duration',
    render: props => {
      const time = props.value ? moment(props.value, 'HH:mm:ss') : null;
      return time && time.isValid ? time.format('HH:mm:ss') : null;
    },
  },
  {
    key: 'reference-list-item',
    render: props => {
      const { column: { referenceListName, referenceListNamespace }, value: colValue } = props;

      const item = useReferenceListItem(referenceListNamespace, referenceListName, colValue);
      return item?.data?.item;
    },
  },
  {
    key: 'entity',
    render: props => {
      return typeof props?.value === 'object' ? props?.value?.displayText : props?.value ?? null;
    },
  },
  {
    key: 'action',
    render: props => {
      const { router } = useShaRouting();
      const { crudConfig, refreshTable, changeActionedRow } = useDataTable();
      const { backendUrl } = useSheshaApplication();
      const { formData, formMode } = useForm();
      const { globalState } = useGlobalState();
      const { publish } = usePubSub();

      const { mutate: deleteRowHttp } = useMutate({
        verb: 'DELETE',
        path: crudConfig?.deleteUrl,
      });

      const [state, setState] = useState<{
        modalProps?: IModalProps;
        entityId?: string;
        entity?: any;
        additionalProperties?: any; // These props will be passed as initialization properties to the modal
      }>({});

      const { refetch: fetchEntity, loading, data: fetchEntityResponse, error: fetchEntityError } = useGet({
        path: crudConfig?.detailsUrl || '',
        queryParams: { id: state?.entityId },
        lazy: true,
      });

      const dynamicModal = useModal({ ...state?.modalProps, initialValues: state?.entity, parentFormValues: formData });

      useEffect(() => {
        if (state?.entityId) {
          fetchEntity();
        }
      }, [state?.entityId]);

      const previousEntityId = usePrevious(state?.entityId);

      useEffect(() => {
        const hasNewEntityId = state?.entityId && state?.entityId !== previousEntityId;

        if (state?.modalProps && !hasNewEntityId) {
          dynamicModal?.open();
        }
      }, [state?.modalProps]);

      useEffect(() => {
        if (!loading && fetchEntityResponse) {
          setState(prev => ({ ...prev, entity: fetchEntityResponse?.result }));
        }
      }, [loading]);

      useEffect(() => {
        if (state?.entity && state?.modalProps) {
          dynamicModal?.open();
        }
      }, [state?.entity]);

      useEffect(() => {
        if (fetchEntityError) {
          notification.error({ message: <ValidationErrors error={fetchEntityError} renderMode="raw" /> });
        }
      }, [fetchEntityError]);

      const resetModalProps = () => {
        setState({});
      };

      const getActionProps = (data): IConfigurableActionColumnsProps => {
        return data?.column?.actionProps as IConfigurableActionColumnsProps;
      };

      const getRowData = data => {
        return data?.cell?.row?.original;
      };

      const handleDeleteRowClick = () => {
        const deletingLoader = message.loading('Action in progress..', 0);

        const id: string = props?.cell?.row?.original?.Id;

        deleteRowHttp('', { queryParams: { id } })
          .then(() => {
            refreshTable();
          })
          .catch(() => {
            message.error('Sorry, and error has occurred. Please try again later');
          })
          .finally(deletingLoader);
      };

      const getExpressionExecutor = (expression: string, result?: any) => {
        if (!expression) {
          return null;
        }

        // tslint:disable-next-line:function-constructor
        return new Function('data, moment, formMode, http, message, globalState, result, selectedRow', expression)(
          formData,
          moment,
          formMode,
          axiosHttp(backendUrl),
          message,
          globalState,
          result,
          camelCaseKeys(props?.cell?.row?.original || {}, { deep: true })
        );
      };

      const clickHandler = (event, data) => {
        event.stopPropagation();

        const actionProps = getActionProps(data);

        const selectedRow = getRowData(data);

        if (!actionProps) return;

        changeActionedRow(data.row.original);

        switch (actionProps.action) {
          case 'navigate': {
            if (actionProps.targetUrl) {
              const preparedUrl =
                actionProps.targetUrl.indexOf('{{') > -1
                  ? evaluateString(actionProps.targetUrl, { selectedRow: data.row.original })
                  : actionProps.targetUrl;

              if (typeof router === 'object') {
                try {
                  router?.push(preparedUrl);
                } catch (error) {
                  window.location.href = preparedUrl;
                }
              } else {
                window.location.href = preparedUrl;
              }
              break;
            } else console.warn('target Url is not specified');
            break;
          }
          case 'executeFormAction': {
            publish(actionProps?.formAction, { stateId: actionProps?.uniqueStateId || 'NO_PROVIDED' });
            break;
          }
          case 'editRow': {
            const convertedProps = actionProps as Omit<IModalProps, 'formId'>;

            const modalProps = {
              id: selectedRow?.Id, // link modal to the current form component by id
              isVisible: false,
              formId: actionProps.modalFormId,
              title: actionProps.modalTitle,
              initialValues: selectedRow ? camelCaseKeys(selectedRow) : selectedRow,
              showModalFooter: convertedProps?.showModalFooter,
              submitHttpVerb: convertedProps?.submitHttpVerb,
              width: actionProps?.modalWidth,
              destroyOnClose: true,

              onSubmitted: () => {
                refreshTable();
                resetModalProps();
              },
            };

            setState(prev => ({ ...prev, modalProps, entityId: selectedRow?.Id }));

            break;
          }
          case 'dialogue': {
            const convertedProps = actionProps as Omit<IModalProps, 'formId'>;

            const onSuccessScriptExecutor = (values: any) => {
              getExpressionExecutor(props?.onSuccessScript, values);
            };

            const onErrorScriptExecutor = () => {
              getExpressionExecutor(props?.onErrorScript);
            };

            const modalProps: IModalProps = {
              id: selectedRow?.Id, // link modal to the current form component by id
              isVisible: false,
              formId: actionProps.modalFormId,
              title: actionProps.modalTitle,
              mode: actionProps?.modalFormMode,
              showModalFooter: convertedProps?.showModalFooter,
              submitHttpVerb: convertedProps?.submitHttpVerb,
              onSuccessRedirectUrl: convertedProps?.onSuccessRedirectUrl,
              destroyOnClose: true,
              skipFetchData: convertedProps.skipFetchData,
              width: actionProps?.modalWidth,
              initialValues: evaluateKeyValuesToObject(actionProps?.additionalProperties, formData),
              parentFormValues: formData,
              modalConfirmDialogMessage: convertedProps?.modalConfirmDialogMessage,
              onSubmitted: values => {
                onSuccessScriptExecutor(values);

                if (props?.refreshTableOnSuccess) {
                  publish(DataTablePubsubConstants.refreshTable, { stateId: actionProps?.uniqueStateId });
                }
              },
              onFailed: onErrorScriptExecutor,
            };

            setState(prev => ({ ...prev, modalProps }));

            break;
          }
          case 'deleteRow': {
            Modal.confirm({
              title: 'Delete item?',
              content: actionProps?.deleteWarningMessage || 'Are you sure you want to delete this item?',
              okText: 'Delete',
              okButtonProps: {
                type: 'primary',
                danger: true,
              },
              onOk: handleDeleteRowClick,
            });

            break;
          }
          case 'executeScript': {
            getExpressionExecutor(actionProps?.actionScript);

            break;
          }
          default: {
            console.log(`unknown action: '${actionProps.action}'`);
          }
        }
      };

      const aProps = getActionProps(props);
      return (
        <a className="sha-link" onClick={e => clickHandler(e, props)}>
          {aProps.icon && <ShaIcon iconName={aProps.icon as IconType} />}
        </a>
      );
    },
  },
];
