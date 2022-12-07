import React from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { SwapOutlined } from '@ant-design/icons';
import { useForm, useGlobalState } from '../../../../providers';
import ShaDrawer from './drawer';
import { IDrawerProps } from './models';
import { getSettings } from './settings';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';

const DrawerComponent: IToolboxComponent<IDrawerProps> = {
  type: 'drawer',
  name: 'Drawer',
  icon: <SwapOutlined />,
  factory: (model: IDrawerProps) => {
    const { formMode, formData } = useForm();
    const { globalState } = useGlobalState();

    const executeExpression = (expression: string, returnBoolean = false) => {
      if (!expression) {
        if (returnBoolean) {
          return true;
        } else {
          console.error('Expected expression to be defined but it was found to be empty.');

          return false;
        }
      }

      /* tslint:disable:function-constructor */
      const evaluated = new Function('data, globalState', expression)(formData, globalState);

      // tslint:disable-next-line:function-constructor
      return typeof evaluated === 'boolean' ? evaluated : true;
    };

    const isVisibleByCondition = executeExpression(model?.customVisibility, true);

    if (!isVisibleByCondition && formMode !== 'designer') return null;

    const { size, style, ...props } = model;

    return <ShaDrawer {...props} />;
  },
  settingsFormMarkup: data => getSettings(data),
  initModel: model => {
    const customProps: IDrawerProps = {
      ...model,
    };
    return customProps;
  },
  validateSettings: model => validateConfigurableComponentSettings(getSettings(model), model),
};

export default DrawerComponent;
