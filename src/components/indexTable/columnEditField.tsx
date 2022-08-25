import React, { FC, ChangeEvent } from 'react';
import { Input, DatePicker, InputNumber, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment, { Moment, isMoment } from 'moment';
import { IndexColumnDataType } from '../../providers/dataTable/interfaces';
import RefListDropDown, { IRefListDropDownOption } from '../refListDropDown';
import EntityDropdown from '../entityDropdown';
import { IColumnEditFieldProps } from './interfaces';
import { IGuidNullableEntityWithDisplayNameDto, IReferenceListItemValueDto } from '../../interfaces/shesha';
import FormItem from 'antd/lib/form/FormItem';

// (alias) type IndexColumnDataType = "string" | "number" | "boolean" | "date" | "datetime" | "time" | "refList" | "multiValueRefList" | "entityReference" | "other"

export const ColumnEditField: FC<IColumnEditFieldProps> = props => {
  const {
    // id,
    name: name,
    caption,
    dataType = 'string',
    referenceListName,
    referenceListNamespace,
    entityReferenceTypeShortAlias,
    value: stateValue,
    onChange: handleChange,
  } = props;

  const placeholder = [
    'entity',
    'date',
    'date-time',
    'reference-list-item',
    'multiValueRefList',
  ].includes(dataType)
    ? `Select ${caption}`
    : `Enter ${caption}`;

  const handleInputChange = (changeValue: number | string | undefined | ChangeEvent<HTMLInputElement>) => {
    // console.log('handleInputChange changeValue: ', changeValue);
    if (changeValue) {
      const value =
        typeof changeValue === 'number' ? changeValue : (changeValue as ChangeEvent<HTMLInputElement>).target.value;
      handleChange(name, value);
    }
  };

  const renderFilterInput = (type: IndexColumnDataType = 'string') => {
    if (type === 'string') {
      return <Input size="small" placeholder={placeholder} value={stateValue} onChange={handleInputChange} />;
    }

    return (
      <InputNumber
        className="ant-input-number-no-margin"
        size="small"
        onChange={handleInputChange}
        placeholder={placeholder}
        type="number"
        min={0}
        value={typeof stateValue === 'number' ? stateValue : parseFloat(stateValue.replace(/,/g, ''))}
      />
    );
  };

  const dateFormat = 'DD/MM/YYYY';

  // @ts-ignore
  const getMoment = (value: any): Moment => {
    if (stateValue === null || stateValue === undefined) return undefined;

    if (isMoment(value)) return value;

    const date = moment(new Date(value), dateFormat);

    return date.isValid() ? date : undefined;
  };

  const renderDateInput = () => {
    const onChange = (_, dateString: string | string[]) => {
      handleChange(name, dateString);
    };

    const localPlaceholder = `Select ${caption}`;

    return (
      <DatePicker
        size="small"
        onChange={onChange}
        value={getMoment(stateValue)}
        format={dateFormat}
        placeholder={localPlaceholder}
      />
    );
  };

  const renderBooleanInput = () => {
    const onChange = (e: CheckboxChangeEvent) => {
      handleChange(name, e.target.checked);
    };
    return <Checkbox onChange={onChange}>Yes</Checkbox>;
  };

  // {['refList', 'multiValueRefList'].includes(dataType) && renderRenderReflistDropdown()}
  const renderRenderReflistDropdown = () => {
    const localPlaceholder = `Select ${caption}`;

    const onChange = (value: any) => {
      handleChange(name, value);
    };

    const getMultiValueRefListValues = () =>
      typeof stateValue === 'string' ? null : (stateValue as IReferenceListItemValueDto[]);

    const getReferenceListItemValue = () =>
      typeof stateValue === 'string' ? null : (stateValue as IReferenceListItemValueDto);

    const val = dataType !== 'multiValueRefList' ? getMultiValueRefListValues() : getReferenceListItemValue();

    return (
      <RefListDropDown.Dto
        listName={referenceListName}
        listNamespace={referenceListNamespace}
        size="small"
        // mode={dataType === 'refList' ? null : 'multiple'}
        placeholder={localPlaceholder}
        style={{ width: '100%' }}
        onChange={onChange}
        value={val}
      />
    );
  };

  // dataType === 'entityReference' && renderEntityDropdown()
  const renderEntityDropdown = () => {
    const value =
      typeof stateValue === 'object' ? (stateValue as IGuidNullableEntityWithDisplayNameDto)?.displayText : stateValue;

    const onChange = (_: number | number[], option: any) => {
      const { children, value: localValue } = option as IRefListDropDownOption;

      handleChange(name, { value: localValue, displayText: children });
    };

    return (
      <EntityDropdown
        typeShortAlias={entityReferenceTypeShortAlias}
        value={value}
        onChange={onChange}
        size="small"
        placeholder={placeholder}
        style={{ width: '100%' }}
      />
    );
  };

  return (
    <div className="column-item-filter">
      <FormItem>
        {dataType === 'string' && renderFilterInput()}

        {dataType === 'number' && renderFilterInput('number')}

        {['date', 'date-time'].includes(dataType) && renderDateInput()}

        {dataType === 'boolean' && renderBooleanInput()}

        {dataType === 'entity' && renderEntityDropdown()}

        {['reference-list-item', 'multiValueRefList'].includes(dataType) && renderRenderReflistDropdown()}
      </FormItem>
    </div>
  );
};

export default ColumnEditField;
