import React from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { BorderOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { IModalProperties } from '../../../../providers/dynamicModal/models';
import ConfigurableButton from './configurableButton';
import { IButtonGroupButton } from '../../../../providers/buttonGroupConfigurator/models';
import { useAuth, useForm } from '../../../..';

export type IActionParameters = [{ key: string; value: string }];

export interface IButtonProps extends IButtonGroupButton, IConfigurableFormComponent, IModalProperties {}

const settingsForm = settingsFormJson as FormMarkup;

const ButtonField: IToolboxComponent<IButtonProps> = {
  type: 'button',
  name: 'Button',
  icon: <BorderOutlined />,
  factory: ({ style, ...model }: IButtonProps) => {
    const { isComponentDisabled, isComponentHidden, formMode, formData } = useForm();
    const { anyOfPermissionsGranted } = useAuth();

    const { id, isDynamic, hidden, disabled } = model;

    const fieldModel = {
      ...model,
      label: null,
      tooltip: null,
    };

    const isHidden = isComponentHidden({ id, isDynamic, hidden });

    const isDisabled = isComponentDisabled({ id, isDynamic, disabled });

    const grantedPermission = anyOfPermissionsGranted(model?.permissions || []);

    if (!grantedPermission && formMode !== 'designer') {
      return null;
    }

    return (
      <ConfigurableFormItem model={fieldModel}>
        <ConfigurableButton
          formComponentId={model?.id}
          {...model}
          disabled={isDisabled}
          hidden={isHidden}
          style={getStyle(style, formData)}
        />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => {
    const buttonModel: IButtonProps = {
      ...model,
      label: 'Submit',
      buttonAction: 'submit',
      buttonType: 'default',
    };
    return buttonModel;
  },
};

export default ButtonField;
