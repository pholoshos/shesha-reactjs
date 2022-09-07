import React, { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import { AutoComplete, Button, Input, Select } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { useForm, useMetadata, useMetadataDispatcher } from '../../providers';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { camelCase } from 'lodash';
import { IPropertyMetadata } from '../../interfaces/metadata';
import camelcase from 'camelcase';
import { getIconByDataType } from '../../utils/metadata';
import ShaIcon from '../shaIcon';

export interface IPropertyAutocompleteProps {
  id?: string;
  value?: string | string[];
  style?: CSSProperties;
  dropdownStyle?: CSSProperties;
  size?: SizeType;
  onChange?: (value: string | string[]) => void;
  onSelect?: (value: string | string[], selectedProperty: IPropertyMetadata) => void;
  onPropertiesLoaded?: (properties: IPropertyMetadata[], prefix: string) => void;
  mode?: 'single' | 'multiple' | 'tags';
  showFillPropsButton?: boolean;
}

interface IOption {
  value: string;
  label: string | React.ReactNode;
}

interface IAutocompleteState {
  options: IOption[];
  properties: IPropertyMetadata[];
}

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

export const PropertyAutocomplete: FC<IPropertyAutocompleteProps> = ({ mode = 'single', ...props }) => {
  const { style = { width: '32px' } } = props;

  const meta = useMetadata(false);
  const { getContainerProperties } = useMetadataDispatcher();
  const { metadata } = meta || {};

  const initialProperties = metadata?.properties ?? [];
  const [state, setState] = useState<IAutocompleteState>({ options: properties2options(initialProperties, null), properties: initialProperties });

  const setProperties = (properties: IPropertyMetadata[], prefix: string) => {
    if (props.onPropertiesLoaded)
      props.onPropertiesLoaded(properties, prefix);
    setState({
      properties: properties,
      options: properties2options(properties, prefix)
    });
  }

  const form = useForm(false);

  const containerPath = useMemo(() => {
    if (!props.value || Array.isArray(props.value))
      return null;

    const lastIdx = props.value?.lastIndexOf('.');
    return lastIdx === -1
      ? null
      : props.value.substring(0, lastIdx);
  }, [props.value]);

  // todo: move to metadata dispatcher
  // todo: add `loadProperties` method with callback:
  //    modelType, properties[] (dot notation props list)
  useEffect(() => {
    getContainerProperties({ metadata, containerPath }).then(properties => {
      setProperties(properties, containerPath)
    });
  }, [metadata?.properties, containerPath]);

  const getProperty = (path: string): IPropertyMetadata => {
    return state.properties.find(p => getFullPath(p.path, containerPath) === path);
  }

  const onSelect = (data: string) => {
    if (props.onChange) props.onChange(data);
    if (props.onSelect) {
      const property = getProperty(data);
      props.onSelect(data, property);
    }
  };

  const selectedProperty = useMemo(() => {
    return typeof(props.value) === 'string'
      ? getProperty(props.value)
      : null;
  }, [props.value, state.properties]);

  const onSearch = (data: string) => {
    if (props.onChange) props.onChange(data);

    const filteredOptions: IOption[] = [];

    state.properties.forEach(p => {
      const fullPath = getFullPath(p.path, containerPath);

      if (fullPath.toLowerCase()?.startsWith(data?.toLowerCase()))
        filteredOptions.push({ value: fullPath, label: fullPath });
    });

    setState({ properties: state.properties, options: filteredOptions });
  };

  const onFillPropsClick = () => {
    if (!form || !props.id)
      return;
    const action = form.getAction(props.id, 'linkToModelMetadata');

    if (typeof action === 'function') {
      action(selectedProperty);
    }
  };

  const showFillPropsButton = props.showFillPropsButton !== false && Boolean(form);

  const autoComplete = (
    <AutoComplete
      value={props.value}
      options={state.options}
      style={showFillPropsButton ? { width: 'calc(100% - 32px)'} : props.style }
      onSelect={onSelect}
      onSearch={onSearch}
      notFoundContent="Not found"
      size={props.size}
      dropdownStyle={props?.dropdownStyle}
      dropdownMatchSelectWidth={false}
    />
  );

  return (
    <>
      {mode === 'single' ? (
        showFillPropsButton
          ? (
            <Input.Group style={props.style}>
              {autoComplete}
              <Button
                icon={<ThunderboltOutlined />}
                onClick={onFillPropsClick}
                disabled={!Boolean(selectedProperty)}
                style={style}
                size={props.size}
              />
            </Input.Group>
          )
          : <>{autoComplete}</>
      ) : (
        <Select allowClear onChange={props?.onChange} value={props.value} mode={mode} showSearch size={props.size}>
          {state.options.map((option, index) => (
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
