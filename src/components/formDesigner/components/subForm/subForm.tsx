import React, { CSSProperties, FC, useMemo } from 'react';
import ShaSpin from '../../../shaSpin';
import ValidationErrors from '../../../validationErrors';
import { useSubForm } from '../../../../providers/subForm';
import { SubFormContainer } from './subFormContainer';
import { FormItemProvider } from '../../../../providers';
import { upgradeComponentsTree, useFormDesignerComponents } from '../../../../providers/form/utils';

interface ISubFormProps {
  style?: CSSProperties;
  readOnly?: boolean;
}

const SubForm: FC<ISubFormProps> = ({ readOnly }) => {
  const { errors, loading, components, formSettings, name } = useSubForm();
  const designerComponents = useFormDesignerComponents();

  const isLoading = useMemo(() => {
    return Object.values(loading).find(l => Boolean(l));
  }, [loading]);

  const updatedComponents = useMemo(() => {
    return upgradeComponentsTree(designerComponents, components);
  }, [components]);

  return (
    <ShaSpin spinning={isLoading}>
      <div style={{ flex: 1 }} data-name={name}>
        {Object.keys(errors).map((error, index) => (
          <ValidationErrors key={index} error={errors[error]} />
        ))}

        <div>
          <FormItemProvider namePrefix={name} labelCol={formSettings?.labelCol} wrapperCol={formSettings?.wrapperCol}>
            <SubFormContainer components={updatedComponents} readOnly={readOnly} />
          </FormItemProvider>
        </div>
      </div>
    </ShaSpin>
  );
};

SubForm.displayName = 'SubForm';

export { SubForm };

export default SubForm;
