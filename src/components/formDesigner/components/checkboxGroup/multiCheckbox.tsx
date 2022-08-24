import { Checkbox, Col, Row } from 'antd';
import React, { FC } from 'react';
import { useForm } from '../../../../providers';
import { useReferenceList } from '../../../../providers/referenceListDispatcher';
import { getDataSourceList } from '../radio/utils';
import { getSpan, ICheckboxGroupProps } from './utils';

const MultiCheckbox: FC<ICheckboxGroupProps> = model => {
  const { items, referenceListName, referenceListNamespace, direction, value, onChange } = model;

  const { data: refList } = useReferenceList(referenceListNamespace, referenceListName);

  const { formMode } = useForm();

  const options = getDataSourceList(model?.dataSourceType, items, refList?.items) || [];

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
