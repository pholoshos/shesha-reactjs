import React, { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { AutoComplete, Button, Input, Select } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { useForm, useMetadata } from '../../../../providers';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { camelCase } from 'lodash';

export interface IPropertyAutocompleteProps {
  id: string;
  value?: string | string[];
  style?: CSSProperties;
  dropdownStyle?: CSSProperties;
  size?: SizeType;
  onChange?: (value: string | string[]) => void;
  mode?: 'single' | 'multiple';
}

interface IOption {
  value: string;
  label: string;
}

export const PropertyAutocomplete: FC<IPropertyAutocompleteProps> = ({ mode = 'single', ...props }) => {
  const { style = { width: '32px' } } = props;
  const [options, setOptions] = useState<IOption[]>([]);

  const { getAction } = useForm();

  const meta = useMetadata(false);
  const { metadata } = meta || {};

  useEffect(() => {
    // add current value - recheck
    const properties = metadata?.properties || [];
    const opts = properties.map(p => ({ value: p.path, label: p.path }));
    setOptions(opts);
  }, [metadata]);

  /* 
     1. implement search functionality
        filter existing properties by input text
        if input contains dot - left part before dot and if it exists - try to search property inside
     2. implement select functionality
     3. implement fill properties
    */

  const onSelect = (data: string) => {
    if (props.onChange) props.onChange(data);

    // find property in the metadata provider and save it to the state
  };

  const selectedProperty = useMemo(() => {
    const properties = metadata?.properties || [];
    const selectedProp = properties.find(p => p.path === props.value);
    return selectedProp;
  }, [props.value, metadata]);

  const onSearch = (data: string) => {
    console.log('onSearch');
    if (props.onChange) props.onChange(data);

    const properties = metadata?.properties || [];
    // @ts-ignore
    let exactMatch = false;

    const filteredProperties: IOption[] = [];

    properties.forEach(p => {
      if (p.path === data) exactMatch = true;

      if (p.path?.toLowerCase()?.startsWith(data?.toLowerCase()))
        filteredProperties.push({ value: p.path, label: p.path });
    });

    // if (!exactMatch)
    //     filteredProperties.unshift({ value: data, label: data });

    setOptions(filteredProperties);

    // 1. fetch additional metadata if required and change options
    // 2. if existing property selected - activate `fill` button
  };

  const onFillPropsClick = () => {
    const action = getAction(props.id, 'linkToModelMetadata');

    if (typeof action === 'function') {
      action(selectedProperty);
    }
  };

  return (
    <>
      {mode === 'single' ? (
        <Input.Group style={props.style}>
          <AutoComplete
            value={props.value}
            options={options}
            style={{ width: 'calc(100% - 32px)' }}
            onSelect={onSelect}
            onSearch={onSearch}
            notFoundContent="Not found"
            size={props.size}
            dropdownStyle={props?.dropdownStyle}
          />
          <Button
            icon={<ThunderboltOutlined />}
            onClick={onFillPropsClick}
            disabled={!Boolean(selectedProperty)}
            style={style}
            size={props.size}
          />
        </Input.Group>
      ) : (
        <Select
          allowClear
          onChange={props?.onChange}
          value={props.value}
          mode={'multiple'}
          showSearch
          size={props.size}
        >
          {options.map((option, index) => (
            <Select.Option key={index} value={camelCase(option.value)}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      )}
    </>
  );
};

export default PropertyAutocomplete;
