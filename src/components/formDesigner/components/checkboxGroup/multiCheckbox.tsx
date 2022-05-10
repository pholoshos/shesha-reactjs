import { Checkbox, Col, Row } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { ReferenceListItemDto, useReferenceListGetItems } from '../../../../apis/referenceList';
import { useForm } from '../../../../providers';
import { getCachedItems, saveListItems } from '../../../refListDropDown/utils';
import { getDataSourceList } from '../radio/utils';
import { getSpan, ICheckboxGroupProps } from './utils';

const MultiCheckbox: FC<ICheckboxGroupProps> = model => {
  const { items, referenceListName, referenceListNamespace, direction, value, onChange } = model;

  const { formMode } = useForm();

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

  const options = getDataSourceList(model?.dataSourceType, items, listItems) || [];

  const isReadOnly = model?.readOnly || formMode === 'readonly';

  return (
    <Checkbox.Group value={value} onChange={onChange} style={model?.style}>
      <Row>
        {options.map(({ id, label, value: v }) => (
          <Col id={id} span={getSpan(direction, options.length)}>
            <Checkbox id={id} value={v} disabled={isReadOnly}>
              {label}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  );
};

export default MultiCheckbox;
