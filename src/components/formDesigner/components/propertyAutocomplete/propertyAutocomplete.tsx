import React, { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { AutoComplete, Button, Input, Select } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { useForm, useMetadata, useMetadataDispatcher } from '../../../../providers';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { camelCase } from 'lodash';
import { IPropertyMetadata } from '../../../../interfaces/metadata';
import camelcase from 'camelcase';
import { getIconByDataType } from '../../../../utils/metadata';
import ShaIcon from '../../../shaIcon';

export interface IPropertyAutocompleteProps {
  id: string;
  value?: string | string[];
  style?: CSSProperties;
  dropdownStyle?: CSSProperties;
  size?: SizeType;
  onChange?: (value: string | string[]) => void;
  mode?: 'single' | 'multiple' | 'tags';
}

interface IOption {
  value: string;
  label: string | React.ReactNode;
}

export const PropertyAutocomplete: FC<IPropertyAutocompleteProps> = ({ mode = 'single', ...props }) => {
  const { style = { width: '32px' } } = props;
  const [options, setOptions] = useState<IOption[]>([]);
  const [currentProperties, setCurrentProperties] = useState<IPropertyMetadata[]>([]);

  const { getAction } = useForm();

  const meta = useMetadata(false);
  const { getMetadata: fetchMeta } = useMetadataDispatcher();
  const { metadata } = meta || {};

  const getNested = (properties: IPropertyMetadata[], propName: string): Promise<IPropertyMetadata[]> => {
    const propMeta = properties.find(p => camelcase(p.path) == propName);

    if (!propMeta)
      return Promise.reject(`property '${propName}' not found`);

    if (propMeta.dataType === 'entity')
      return fetchMeta({ modelType: propMeta.entityType }).then(m => m.properties);
    
    if (propMeta.dataType === 'object')
      return Promise.resolve(propMeta.properties);
    
    return Promise.reject(`data type '${propMeta.dataType}' doesn't support nested properties`);
  }

  const containerPath = useMemo(() => {
    if (!props.value || Array.isArray(props.value))
      return null;
    
    const lastIdx = props.value?.lastIndexOf('.');
    return lastIdx === -1
      ? null
      : props.value.substring(0, lastIdx);
  }, [props.value]);

  const getFullPath = (path: string, prefix: string) => {
    return prefix ? `${prefix}.${camelcase(path)}` : camelcase(path);
  }
  const properties2options = (properties: IPropertyMetadata[], prefix: string): IOption[] => {
    return properties.map(p => {
      const value = getFullPath(p.path, prefix);
      const icon = getIconByDataType(p.dataType);
      const label = (
        <div>{icon && <ShaIcon iconName={icon} />} {value}</div>
      );
      return {
        value: value,
        label: label
      };
    });
  }

  useEffect(() => {
    if (!metadata.properties)
      return;

    if (containerPath){
      const parts = containerPath.split('.');

      const promise = parts.reduce((left, right) => {
        return left.then(pp => getNested(pp, right));
      }, Promise.resolve(metadata.properties));
  
      promise.then(properties => {
        setCurrentProperties(properties);
      })
    } else {
      setCurrentProperties(metadata.properties);
    }
  }, [metadata?.properties, containerPath]);

  useEffect(() => {
    const opts = properties2options(currentProperties, containerPath);
    setOptions(opts);
  }, [currentProperties]);
  
  const onSelect = (data: string) => {
    if (props.onChange) props.onChange(data);

    // find property in the metadata provider and save it to the state
  };

  const selectedProperty = useMemo(() => {
    const selectedProp = currentProperties.find(p => getFullPath(p.path, containerPath) === props.value);
    return selectedProp;
  }, [props.value, currentProperties]);

  const onSearch = (data: string) => {
    if (props.onChange) props.onChange(data);

    const filteredProperties: IOption[] = [];

    const properties = currentProperties;
    properties.forEach(p => {
      const fullPath = getFullPath(p.path, containerPath);

      if (fullPath.toLowerCase()?.startsWith(data?.toLowerCase()))
        filteredProperties.push({ value: fullPath, label: fullPath });
    });

    setOptions(filteredProperties);
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
        <Select allowClear onChange={props?.onChange} value={props.value} mode={mode} showSearch size={props.size}>
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
