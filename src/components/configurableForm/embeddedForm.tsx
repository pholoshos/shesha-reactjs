import React, { FC } from 'react';
import { FormProvider } from '../../providers';
import { FormMarkup } from '../../providers/form/models';
import ComponentsContainer from '../formDesigner/componentsContainer';

export interface IEmbeddedFormProps {
  markup: string;
  containerId: string;
}

const EmbeddedForm: FC<IEmbeddedFormProps> = ({ markup, containerId }) => {
  console.log("LOGS:: EmbeddedForm markup, containerId", markup, containerId);
  
  return (
    <FormProvider markup={(markup as unknown) as FormMarkup} mode="readonly">
      <ComponentsContainer containerId={containerId} />
    </FormProvider>
  );
};

EmbeddedForm.displayName = 'EmbeddedForm';

export { EmbeddedForm };

export default EmbeddedForm;
