import { Radio, Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { ReferenceListItemDto, useReferenceListGetItems } from '../../../../apis/referenceList';
import { useForm } from '../../../../providers/form';
import ReadOnlyDisplayFormItem from '../../../readOnlyDisplayFormItem';
import { getCachedItems, saveListItems } from '../../../refListDropDown/utils';
import { getDataSourceList, IRadioProps } from './utils';

const RadioGroup: FC<IRadioProps> = model => {
  const { referenceListName, referenceListNamespace, items = [], value, onChange } = model;

  const { formMode, isComponentDisabled } = useForm();

  const { refetch: fetchItems, data: listItemsResult } = useReferenceListGetItems({
    lazy: true,
  });

  const [cachedListItems, setCachedListItems] = useState<ReferenceListItemDto[]>([]);

  useEffect(() => {
    if (referenceListName && referenceListNamespace) {
      const cachedItems = getCachedItems(referenceListName, referenceListNamespace);

      if (cachedItems?.length) {
        setCachedListItems(cachedItems);
      } else {
        fetchItems({ queryParams: { name: referenceListName, namespace: referenceListNamespace } });
      }
    }
  }, [referenceListName, referenceListNamespace]);

  useEffect(() => {
    if (listItemsResult?.result) {
      saveListItems(referenceListName, referenceListNamespace, listItemsResult?.result);
    }
  }, [listItemsResult]);

  const listItems = cachedListItems?.length ? cachedListItems : listItemsResult?.result;

  const options = getDataSourceList(model?.dataSourceType, items, listItems);

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
