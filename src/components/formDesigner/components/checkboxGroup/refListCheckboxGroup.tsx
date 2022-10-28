import React, { FC } from 'react';
import RadioGroup from '../radio/radioGroup';
import MultiCheckbox from './multiCheckbox';
import { ICheckboxGroupProps } from './utils';

export const RefListCheckboxGroup: FC<ICheckboxGroupProps> = props => {
  console.log('RefListCheckboxGroup props?.mode', props?.mode);

  if (props?.mode === 'single') {
    return <RadioGroup {...props} />;
  }

  return <MultiCheckbox {...props} />;
};

export default RefListCheckboxGroup;
