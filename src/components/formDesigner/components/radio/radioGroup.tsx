import { Radio, Space } from 'antd';
import React, { FC } from 'react';
import { useForm } from '../../../../providers/form';
import ReadOnlyDisplayFormItem from '../../../readOnlyDisplayFormItem';
import { IRadioProps } from './utils';

const RadioGroup: FC<IRadioProps> = model => {
  const { items = [] } = model;

  const { formMode, isComponentDisabled } = useForm();

  const isReadOnly = model?.readOnly || formMode === 'readonly';

  const disabled = isComponentDisabled(model);

  const renderCheckGroup = () => (
    <Radio.Group disabled={disabled}>
      <Space direction={model?.direction}>
        {items.map((checkItem, index) => (
          <Radio key={index} value={checkItem.value}>
            {checkItem.name}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );

  if (isReadOnly) {
    return <ReadOnlyDisplayFormItem type="radiogroup" disabled={disabled} render={renderCheckGroup} />;
  }

  return renderCheckGroup();
};

export default RadioGroup;
