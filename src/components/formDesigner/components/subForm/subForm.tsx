import React, { CSSProperties, FC, useMemo } from 'react';
import ShaSpin from '../../../shaSpin';
import ValidationErrors from '../../../validationErrors';
import { useSubForm } from '../../../../providers/subForm';
import { SubFormContainer } from './subFormContainer';
import { FormItemProvider } from '../../../../providers';

interface ISubFormProps {
  style?: CSSProperties;
}

const SubForm: FC<ISubFormProps> = ({ style }) => {
  const { errors, loading, components, formSettings, name } = useSubForm();

  const isLoading = useMemo(() => {
    return Object.values(loading).find(l => Boolean(l));
  }, [loading]);

  console.log('SubForm style: ', style);

  return (
    <ShaSpin spinning={isLoading}>
      <div style={{ flex: 1 }}>
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
