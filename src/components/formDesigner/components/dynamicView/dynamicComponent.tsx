import React, { FC, useRef } from 'react';
import { CustomErrorBoundary } from '../../..';
import { IConfigurableFormComponent } from '../../../../interfaces';
import { useForm } from '../../../..';

export interface IConfigurableFormComponentProps {
  model: IConfigurableFormComponent;
}

const DynamicComponent: FC<IConfigurableFormComponentProps> = ({ model }) => {
  const { form, getToolboxComponent } = useForm();
  const componentRef = useRef();
  const toolboxComponent = getToolboxComponent(model.type);

  console.log('LOGS:: DynamicComponent toolboxComponent, model', toolboxComponent, model);

  if (!toolboxComponent) return null;
  const renderComponent = () => {
    return <CustomErrorBoundary>{toolboxComponent.factory(model, componentRef, form)}</CustomErrorBoundary>;
  };

  return renderComponent();
};

export default DynamicComponent;
