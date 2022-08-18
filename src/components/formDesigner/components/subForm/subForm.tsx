import React, { FC } from 'react';

interface ISubFormProps {
  name: string;
  formId: string;
  dataMode: 'parent' | 'api';
  properties: string[];
  onCreated: string;
  onUpdated: string;
}

const SubForm: FC<ISubFormProps> = () => {
  
  return <div></div>;
};

SubForm.displayName = 'SubForm';

export { SubForm };

export default SubForm;
