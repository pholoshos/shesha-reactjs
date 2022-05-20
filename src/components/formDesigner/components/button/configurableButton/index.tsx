import React, { FC } from 'react';
import { Button, message, Modal } from 'antd';
import { useShaRouting, useForm, useModal, useGlobalState, useSheshaApplication } from '../../../../../providers';
import { ISelectionProps } from '../../../../../providers/dataTableSelection/models';
import { IModalProps } from '../../../../../providers/dynamicModal/models';
import { evaluateKeyValuesToObject, evaluateString } from '../../../../../providers/form/utils';
import ShaIcon, { IconType } from '../../../../shaIcon';
import classNames from 'classnames';
import moment from 'moment';
import { IKeyValue } from '../../../../../interfaces/keyValue';
import { axiosHttp } from '../../../../../apis/axios';
import { IButtonGroupButton } from '../../../../../providers/buttonGroupConfigurator/models';
import { usePubSub } from '../../../../../hooks';
import { DataTablePubsubConstants } from '../../../../../providers/dataTable/pubSub';
import { DynamicFormPubSubConstants } from '../../../../../pages/dynamic/pubSub';
import { CSSProperties } from 'react';

export interface IConfigurableButtonProps extends Omit<IButtonGroupButton, 'style'> {
  formComponentId: string;
  selectedRow?: ISelectionProps;
  disabled?: boolean;
  hidden?: boolean;
  style?: CSSProperties;
}

export const ConfigurableButton: FC<IConfigurableButtonProps> = props => {
  const { backendUrl } = useSheshaApplication();
  const { getAction, form, setFormMode, formData, formMode } = useForm();
  const { router } = useShaRouting();
  const { globalState } = useGlobalState();
  // const { pubSub, globalStateId } = useGlobalState();
  const { publish } = usePubSub();

  const executeExpression = (expression: string, result?: any) => {
    if (!expression) {
      console.error('Expected expression to be defined but it was found to be empty.');

      return;
    }

    // tslint:disable-next-line:function-constructor
    return new Function('data, moment, form, formMode, http, result, message, globalState', expression)(
      formData,
      moment,
      form,
      formMode,
      axiosHttp(backendUrl),
      result,
      message,
      globalState
    );
  };

  const onSuccessScriptExecutor = (values: any) => {
    executeExpression(props?.onSuccessScript, values);
  };

  const onErrorScriptExecutor = () => {
    executeExpression(props?.onErrorScript);
  };

  if (props?.buttonAction === 'dialogue') {
    const convertedProps = props as IToolbarButtonTableDialogProps;

    const modalProps: IModalProps = {
      id: props.id, // link modal to the current form component by id
      isVisible: false,
      formId: props.modalFormId,
      title: props.modalTitle,
      mode: props?.modalFormMode,
      showModalFooter: convertedProps?.showModalFooter,
      submitHttpVerb: convertedProps?.submitHttpVerb,
      onSuccessRedirectUrl: convertedProps?.onSuccessRedirectUrl,
      destroyOnClose: true,
      skipFetchData: props.skipFetchData,
      width: props?.modalWidth,
      initialValues: evaluateKeyValuesToObject(convertedProps?.additionalProperties, formData),
      parentFormValues: formData,
      modalConfirmDialogMessage: convertedProps?.modalConfirmDialogMessage,
      onSubmitted: values => {
        debugger;
        onSuccessScriptExecutor(values);

        if (props?.refreshTableOnSuccess) {
          publish(DataTablePubsubConstants.refreshTable, { stateId: props?.uniqueStateId });
        }
      },
      onFailed: onErrorScriptExecutor,
    };

    return <ToolbarButtonPlainDialog {...props} modalProps={modalProps} />;
  }

  const onButtonClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation(); // Don't collapse the CollapsiblePanel when clicked

    const { showConfirmDialogBeforeSubmit, modalConfirmDialogMessage } = props;

    switch (props.buttonAction) {
      case 'navigate':
        if (props.targetUrl) {
          const preparedUrl =
            props.targetUrl.indexOf('{{') > -1
              ? evaluateString(props.targetUrl, { selectedRow: props.selectedRow })
              : props.targetUrl;

          router?.push(preparedUrl);
        } else console.warn('target Url is not specified');
        break;
      case 'executeScript':
        if (props?.actionScript) {
          if (showConfirmDialogBeforeSubmit) {
            Modal.confirm({
              content: modalConfirmDialogMessage,
              onOk: () => executeExpression(props?.actionScript),
            });
          } else {
            executeExpression(props?.actionScript);
          }
        }

        break;
      case 'submit':
        if (showConfirmDialogBeforeSubmit) {
          Modal.confirm({
            content: modalConfirmDialogMessage,
            onOk: () => form?.submit(),
          });
        } else {
          form?.submit();
        }
        break;
      case 'startFormEdit':
        setFormMode('edit');
        break;
      case 'cancelFormEdit':
        publish(DynamicFormPubSubConstants.CancelFormEdit, { stateId: 'NO_PROVIDED' });
        break;
      case 'reset':
        form?.resetFields();
        break;
      case 'executeFormAction':
      case 'customAction':
        if (props?.formAction){
          if (props?.formAction != 'CUSTOM_ACTION') {
            publish(props?.formAction, { stateId: props?.uniqueStateId || 'NO_PROVIDED' });
          } else {
            if (props.customFormAction) {
              const actionBody = getAction(props.formComponentId, props.customFormAction);

              if (actionBody) actionBody();
              else console.warn(`action ${props.customFormAction} not found on the form`);
            } else console.warn('customFormAction is not specified');
          }
        }
        break;
      default:
        break;
    }
  };

  return (
    <Button
      title={props.tooltip}
      onClick={event => onButtonClick(event)}
      type={props.buttonType}
      danger={props.danger}
      icon={props.icon ? <ShaIcon iconName={props.icon as IconType} /> : undefined}
      className={classNames('sha-toolbar-btn sha-toolbar-btn-configurable')}
      size={props?.size}
      disabled={props?.disabled}
      style={props?.style}
    >
      {props.label}
    </Button>
  );
};

interface IToolbarButtonTableDialogProps extends Omit<IModalProps, 'formId' | 'isVisible'>, IConfigurableButtonProps {
  modalProps?: IModalProps;
  additionalProperties?: IKeyValue[];
}

const ToolbarButtonPlainDialog: FC<IToolbarButtonTableDialogProps> = props => {
  const dynamicModal = useModal({
    ...props?.modalProps,
    formId: props?.modalFormId,
  });

  const onButtonClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation(); // Don't collapse the CollapsiblePanel when clicked

    if (props.modalFormId) {
      dynamicModal.open();
    } else console.warn('Modal Form is not specified');
  };

  return (
    <Button
      title={props.tooltip}
      onClick={onButtonClick}
      type={props.buttonType}
      danger={props.danger}
      icon={props.icon ? <ShaIcon iconName={props.icon as IconType} /> : undefined}
      className={classNames('sha-toolbar-btn sha-toolbar-btn-configurable')}
      size={props?.size}
      disabled={props?.disabled}
      style={props?.style}
    >
      {props.label}
    </Button>
  );
};

export default ConfigurableButton;
