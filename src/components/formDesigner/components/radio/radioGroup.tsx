import { Radio, Space } from 'antd';
import React, { FC } from 'react';
import { useForm } from '../../../../providers/form';
import { useReferenceList } from '../../../../providers/referenceListDispatcher';
import ReadOnlyDisplayFormItem from '../../../readOnlyDisplayFormItem';
import { getDataSourceList, IRadioProps } from './utils';

const RadioGroup: FC<IRadioProps> = model => {
  const { referenceListName, referenceListNamespace, items = [], value, onChange } = model;

  const { data: refListItems } = useReferenceList(referenceListNamespace, referenceListName);

  const { formMode, isComponentDisabled } = useForm();

  const options = getDataSourceList(model?.dataSourceType, items, refListItems?.items);

  const isReadOnly = model?.readOnly || formMode === 'readonly';

  const disabled = isComponentDisabled(model);

  const renderCheckGroup = () => (
    <Radio.Group disabled={disabled} value={value} onChange={onChange} style={model?.style}>
      <Space direction={model?.direction}>
        {options.map((checkItem, index) => (
          <Radio key={index} value={checkItem.value}>
            {checkItem.label}
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
