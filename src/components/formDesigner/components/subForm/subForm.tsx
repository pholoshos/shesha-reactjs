import React, { FC, useMemo } from 'react';
import ShaSpin from '../../../shaSpin';
import ValidationErrors from '../../../validationErrors';
import { useSubForm } from '../../../../providers/subForm';
import { SubFormContainer } from './subFormContainer';
import { FormItemProvider } from '../../../../providers';

const SubForm: FC = () => {
  const { errors, loading, components, formSettings, name } = useSubForm();

  const isLoading = useMemo(() => {
    return Object.values(loading).find(l => Boolean(l));
  }, [loading]);

  return (
    <ShaSpin spinning={isLoading}>
      <div>
        {Object.keys(errors).map(error => (
          <ValidationErrors error={errors[error]} />
        ))}

        <div>
          <FormItemProvider namePrefix={name} labelCol={formSettings?.labelCol} wrapperCol={formSettings?.wrapperCol}>
            <SubFormContainer components={components} />
          </FormItemProvider>
        </div>
      </div>
    </ShaSpin>
  );
};

SubForm.displayName = 'SubForm';

export { SubForm };

export default SubForm;
