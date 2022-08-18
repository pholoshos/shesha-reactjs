import React, { FC, useMemo } from 'react';
import ShaSpin from '../../../shaSpin';
import ValidationErrors from '../../../validationErrors';
import { useSubForm } from './provider';

interface ISubFormProps {
  name: string;
  containerId;
  dataMode: 'parent' | 'api';
}

const SubForm: FC<ISubFormProps> = ({}) => {
  const { errors, loading } = useSubForm();

  const isLoading = useMemo(() => {
    return Object.values(loading).find(l => Boolean(l));
  }, [loading]);

  return (
    <ShaSpin spinning={isLoading}>
      <div>
        {Object.keys(errors).map(error => (
          <ValidationErrors error={errors[error]} />
        ))}

        <div></div>
      </div>
    </ShaSpin>
  );
};

SubForm.displayName = 'SubForm';

export { SubForm };

export default SubForm;
