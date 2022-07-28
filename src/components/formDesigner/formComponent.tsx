import React, { FC, MutableRefObject } from 'react';
import { useForm } from '../../providers/form';

export interface IFormComponentProps {
  id: string;
  componentRef: MutableRefObject<any>;
  listFormComponentIndex: number;
}

const FormComponent: FC<IFormComponentProps> = ({ id, componentRef, listFormComponentIndex }) => {
  const { getComponentModel, form, getToolboxComponent } = useForm();

  const model = getComponentModel(id);
  const toolboxComponent = getToolboxComponent(model.type);
  if (!toolboxComponent) return <div>Component not found</div>;

  return <>{toolboxComponent.factory(model, componentRef, form, listFormComponentIndex)}</>;
};

export default FormComponent;
