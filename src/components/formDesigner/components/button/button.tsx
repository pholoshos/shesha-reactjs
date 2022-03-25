import React from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { BorderOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { ButtonType } from 'antd/lib/button';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import { useForm } from '../../../../providers/form';
import { useClosestModal, useModal } from '../../../../providers/dynamicModal';
import {
  evaluateKeyValuesToObject,
  evaluateValue,
  validateConfigurableComponentSettings,
} from '../../../../providers/form/utils';
import { useShaRouting } from '../../../../providers';
import ShaIcon, { IconType } from '../../../shaIcon';
import { IModalProperties } from '../../../../providers/dynamicModal/models';

type ButtonActionType = 'submit' | 'reset' | 'close' | 'custom' | 'dialog' | 'executeScript';

// type ButtonActionType =
//   | 'navigate'
//   | 'dialogue'
//   | 'executeScript'
//   | 'executeFormAction'
//   | 'submit'
//   | 'reset'
//   | 'startFormEdit'
//   | 'cancelFormEdit';

export type IActionParameters = [{ key: string; value: string }];

export interface IButtonProps extends IConfigurableFormComponent, IModalProperties {
  actionType: ButtonActionType;
  customAction?: string;
  actionScript?: string;
  customActionParameters?: IActionParameters;
  icon?: string;
  buttonType?: ButtonType;
  danger?: boolean;
  showConfirmDialogBeforeSubmit?: boolean;
  modalConfirmDialogMessage?: string;
}

const settingsForm = settingsFormJson as FormMarkup;

const ButtonField: IToolboxComponent<IButtonProps> = {
  type: 'button',
  name: 'Button',
  icon: <BorderOutlined />,
  factory: (model: IButtonProps) => {
    const { form, getAction, formData } = useForm();
    const { router } = useShaRouting();
    const closestModal = useClosestModal();

    const dialog = useModal({
      formId: model?.modalFormId,
      id: model?.id,
      isVisible: false,
      initialValues: evaluateKeyValuesToObject(model?.additionalProperties, formData),
      parentFormValues: formData,
      showModalFooter: model?.showModalFooter,
      submitHttpVerb: model?.submitHttpVerb,
      onSuccessRedirectUrl: model?.onSuccessRedirectUrl,
      destroyOnClose: true,
      width: model?.modalWidth,
    });

    const fieldModel = {
      ...model,
      label: null,
      tooltip: null,
    };

    const onClick = () => {
      const getExpressionExecutor = (expression: string) => {
        if (!expression) {
          return null;
        }

        // tslint:disable-next-line:function-constructor
        const func = new Function('data', expression);

        return func(formData);
      };

      switch (model.actionType) {
        case 'submit':
          if (!Boolean(form)) {
            console.warn('Form not found');
            return;
          }

          const { showConfirmDialogBeforeSubmit, modalConfirmDialogMessage } = model;
          if (showConfirmDialogBeforeSubmit) {
            Modal.confirm({
              content: modalConfirmDialogMessage,
              onOk: () => form?.submit(),
            });
          } else {
            form?.submit();
          }

          break;
        case 'reset':
          if (!Boolean(form)) {
            console.warn('Form not found');
            return;
          }
          form.resetFields();
          break;

        case 'close': // close modal or page
          if (closestModal) closestModal.close();
          else router?.back();
          break;

        case 'custom':
          const action = model.customAction ? getAction(model.id, model.customAction) : null;

          if (action) {
            const actionArgs = {};
            for (const parameterIdx in model.customActionParameters) {
              if (model.customActionParameters.hasOwnProperty(parameterIdx)) {
                const parameter = model.customActionParameters[parameterIdx];
                const value = evaluateValue(parameter.value, { data: formData });
                actionArgs[parameter.key] = value;
              }
            }

            action(formData, actionArgs);
          }
          break;

        case 'executeScript':
          if (model?.actionScript) {
            getExpressionExecutor(model?.actionScript);
          }
          break;
        case 'dialog':
          dialog?.open();

          break;

        default:
          break;
      }
    };

    return (
      <ConfigurableFormItem model={fieldModel}>
        <Button
          onClick={onClick}
          type={model.buttonType}
          danger={model.danger}
          icon={model.icon ? <ShaIcon iconName={model.icon as IconType} /> : undefined}
        >
          {model.label}
        </Button>
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => {
    const buttonModel: IButtonProps = {
      ...model,
      label: 'Submit',
      actionType: 'submit',
      buttonType: 'default',
    };
    return buttonModel;
  },
};

export default ButtonField;
