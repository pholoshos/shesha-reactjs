import { Checkbox, Col, Radio, Row, Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { ReferenceListItemDto, useReferenceListGetItems } from '../../../../apis/referenceList';
import { getCachedItems, saveListItems } from '../../../refListDropDown/utils';
import { ICheckboxGoupProps, ICheckItem } from './utils';

export const RefListCheckboxGroup: FC<ICheckboxGoupProps> = ({
  dataSourceType,
  referenceListNamespace,
  referenceListName,
  mode,
  items,
  values,
  orientation,
}) => {
  const { refetch: fetchItems, data: listItemsResult } = useReferenceListGetItems({ lazy: true });
  const [cachedListItems, setCachedListItems] = useState<ReferenceListItemDto[]>([]);

  const checkBoxSpan = orientation === 'vertical' ? 24 : 6;

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

  const options = listItems;

  const getOptions = (): ICheckItem[] => {
    return values;
  };

  const valueOptions = getOptions() || [];

  if (dataSourceType === 'referenceList') {
    return mode === 'multiple' ? (
      <Checkbox.Group>
        <Row>
          {options?.map(({ id, item, itemValue }) => (
            <Col key={itemValue} span={checkBoxSpan}>
              <Checkbox key={id} value={itemValue}>
                {item}
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    ) : (
      <Radio.Group>
        <Space direction={orientation}>
          {options?.map(({ id, item, itemValue }) => (
            <Radio key={id} value={itemValue}>
              {item}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    );
  } else {
    console.log('Selected mode is values');
    console.log(valueOptions);
    return mode === 'multiple' ? (
      <Checkbox.Group>
        {items?.map(({ id, name, value }) => (
          <Checkbox key={id} name={name}>
            {value}
          </Checkbox>
        ))}
      </Checkbox.Group>
    ) : (
      <Radio.Group>
        <Space direction={orientation}>
          {items?.map(({ id, name, value }) => (
            <Radio key={id} value={value} name={name}>
              {value}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    );
  }
};

export default RefListCheckboxGroup;
