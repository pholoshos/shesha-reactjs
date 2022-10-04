import React, { FC } from 'react';
import { Button } from 'antd';
import { useShaRouting, useDataTableStore, useForm, useModal } from '../../../../../../providers';
import { ISelectionProps } from '../../../../../../providers/dataTableSelection/models';
import { IModalProps } from '../../../../../../providers/dynamicModal/models';
import { evaluateKeyValuesToObject, evaluateString, getFormActionArguments } from '../../../../../../providers/form/utils';
import { IToolbarButton } from '../../../../../../providers/toolbarConfigurator/models';
import ShaIcon, { IconType } from '../../../../../shaIcon';
import classNames from 'classnames';
import moment from 'moment';
import { IKeyValue } from '../../../../../../interfaces/keyValue';
import axios from 'axios';
import { usePubSub } from '../../../../../../hooks';
import { useConfigurableActionDispatcher } from '../../../../../../providers/configurableActionsDispatcher';

export interface IToolbarButtonProps extends IToolbarButton {
  formComponentId: string;
  selectedRow: ISelectionProps;
}

export const ToolbarButton: FC<IToolbarButtonProps> = props => {
  const { /*getAction,*/ form, setFormMode, formData, formMode } = useForm();
  const { router } = useShaRouting();
  const { publish } = usePubSub();

  const { executeAction } = useConfigurableActionDispatcher();

  if (props?.buttonAction === 'dialogue') {
    const convertedProps = props as IToolbarButtonTableDialogProps;

    const modalProps: IModalProps = {
      id: props.id, // link modal to the current form component by id
      isVisible: false,
      formId: props.modalFormId,
      title: props.modalTitle,
      showModalFooter: convertedProps?.showModalFooter,
      submitHttpVerb: convertedProps?.submitHttpVerb,
      onSuccessRedirectUrl: convertedProps?.onSuccessRedirectUrl,
      destroyOnClose: true,
      width: props?.modalWidth,
      initialValues: evaluateKeyValuesToObject(convertedProps?.additionalProperties, formData),
      parentFormValues: formData,
    };

    return props?.refreshTableOnSuccess ? (
      <ToolbarButtonTableDialog {...props} modalProps={modalProps} />
    ) : (
      <ToolbarButtonPlainDialog {...props} modalProps={modalProps} />
    );
  }

  const onButtonClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation(); // Don't collapse the CollapsiblePanel when clicked

    const executeExpression = (expression: string) => {
      if (!expression) {
        console.error('Expected expression to be defined but it was found to be empty.');

        return;
      }

      // tslint:disable-next-line:function-constructor
      const func = new Function('data', 'moment', 'form', 'formMode', 'axios', expression);

      return func(formData, moment, form, formMode, axios);
    };

    switch (props.buttonAction) {
      case 'navigate':
        if (props.targetUrl) {
          const preparedUrl =
            props.targetUrl.indexOf('{{') > -1
              ? evaluateString(props.targetUrl, { selectedRow: props.selectedRow })
              : props.targetUrl;

          router?.push(preparedUrl);
        } else console.warn('tagret Url is not specified');
        break;
      case 'executeScript':
        if (props?.actionScript) {
          executeExpression(props?.actionScript);
        }
        break;
      case 'submit':
        form?.submit();
        break;
      case 'startFormEdit':
        setFormMode('edit');
        break;
      case 'cancelFormEdit':
        setFormMode('readonly');
        break;
      case 'reset':
        form?.resetFields();
        break;
      case 'dispatchAnEvent': {
        const eventName =
          props?.eventName === 'CUSTOM_EVENT' && props?.customEventNameToDispatch
            ? props?.customEventNameToDispatch
            : props?.eventName;

        const evaluationContext = {
          selectedRow: props.selectedRow,
          data: formData,
          moment: moment,
          form: form,
          formMode: formMode,
        };
        getFormActionArguments(props?.customActionParameters, evaluationContext)
          .then(actionArgs => { 
            //console.log('toolbar button resolve args', { actionArgs, evaluationContext })
            publish(eventName, { stateId: props?.uniqueStateId || 'NO_PROVIDED', state: actionArgs });
          })
          .catch(error => console.error(error)); // todo: add alert
        break;
      }
      case 'executeFormAction':
        if (props.actionConfiguration){
          //const { actionOwner, actionName } = props.actionConfiguration;
          const evaluationContext = {
            selectedRow: props.selectedRow,
            data: formData,
            moment: moment,
            form: form,
            formMode: formMode,
          };
          executeAction({ 
            actionConfiguration: props.actionConfiguration,
            argumentsEvaluationContext: evaluationContext
          });
        }
        /*
        console.log(props.buttonAction, { formComponentId: props.formComponentId, formAction: props.formAction, params: props.customActionParameters })
        if (props.formAction) {
          const actionBody = getAction(props.formComponentId, props.formAction);
          if (actionBody) {
            const evaluationContext = {
              selectedRow: props.selectedRow,
              data: formData,
              moment: moment,
              form: form,
              formMode: formMode,
            };
            getFormActionArguments(props?.customActionParameters, { data: evaluationContext })
              .then(actionArgs => actionBody(actionArgs))
              .catch(error => console.error(error)); // todo: add alert
          }
          else console.warn(`action ${props.formAction} not found on the form`);
        } else console.warn('formAction is not specified');
        */
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
    >
      {props.name}
    </Button>
  );
};

interface IToolbarButtonTableDialogProps extends Omit<IModalProps, 'formId' | 'isVisible'>, IToolbarButtonProps {
  modalProps?: IModalProps;
  additionalProperties?: IKeyValue[];
}

/**
 * This button should be rendered on the toolbar within a DataTableContext as it references the table store
 * @param props
 * @returns
 */
const ToolbarButtonTableDialog: FC<IToolbarButtonTableDialogProps> = props => {
  const { refreshTable } = useDataTableStore();

  const modalProps: IModalProps = {
    ...props?.modalProps,
    formId: props?.modalFormId,
    onSubmitted: () => {
      // todo: implement custom actions support
      refreshTable();
    },
  };

  const dynamicModal = useModal(modalProps);

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
    >
      {props.name}
    </Button>
  );
};

const ToolbarButtonPlainDialog: FC<IToolbarButtonTableDialogProps> = props => {
  const dynamicModal = useModal({ ...props?.modalProps, formId: props?.modalFormId });

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
    >
      {props.name}
    </Button>
  );
};

export default ToolbarButton;
