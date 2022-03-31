import React, { FC } from 'react';
import RadioGroup from '../radio/radioGroup';
import MultiCheckbox from './multiCheckbox';
import { ICheckboxGoupProps } from './utils';

export const RefListCheckboxGroup: FC<ICheckboxGoupProps> = props => {
  if (props?.mode === 'single') {
    return <RadioGroup {...props} />;
  }

  return <MultiCheckbox {...props} />;
};

export default RefListCheckboxGroup;
