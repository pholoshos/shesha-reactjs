import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import { ReferenceListItemDto, useReferenceListGetItems } from '../../apis/referenceList';
import { getCachedItems, saveListItems } from './utils';
import { CustomLabeledValue, IGenericRefListDropDownProps, ISelectOption } from './models';
import ReadOnlyDisplayFormItem from '../readOnlyDisplayFormItem';

// tslint:disable-next-line:whitespace
export const GenericRefListDropDown = <TValue,>(props: IGenericRefListDropDownProps<TValue>) => {
  const {
    listName,
    listNamespace,
    showArrow = true,
    value,
    includeFilters = false,
    filters = [],
    width,
    base,
    mode,
    onChange,
    getLabeledValue,
    getOptionFromFetchedItem,
    readOnly,
    disabled,
    ...rest
  } = props;

  // todo: implement referencelist provider with cache support and promise result
  const { refetch: fetchItems, loading, data: listItemsResult } = useReferenceListGetItems({
    lazy: true,
    base,
  });

  const [cachedListItems, setCachedListItems] = useState<ReferenceListItemDto[]>([]);

  useEffect(() => {
    if (listName && listNamespace) {
      const cachedItems = getCachedItems(listName, listNamespace);

      if (cachedItems?.length) {
        setCachedListItems(cachedItems);
      } else {
        fetchItems({ queryParams: { name: listName, namespace: listNamespace } });
      }
    }
  }, [listName, listNamespace]);

  useEffect(() => {
    if (listItemsResult?.result) {
      saveListItems(listName, listNamespace, listItemsResult?.result);
    }
  }, [listItemsResult]);

  const filter = ({ itemValue }: ReferenceListItemDto) => {
    if (!filters?.length) {
      return true;
    }

    const filtered = filters?.includes(itemValue);

    return includeFilters ? filtered : !filtered;
  };

  const listItems = cachedListItems?.length ? cachedListItems : listItemsResult?.result;

  const wrapValue = (localValue: TValue | TValue[]): CustomLabeledValue<TValue> | CustomLabeledValue<TValue>[] => {
    if (localValue === undefined) return undefined;
    if (mode === 'multiple' || mode === 'tags') {
      return Array.isArray(localValue)
        ? (localValue as TValue[]).map<CustomLabeledValue<TValue>>(o => {
            return getLabeledValue(o, options);
          })
        : [getLabeledValue(localValue as TValue, options)];
    } else return getLabeledValue(localValue as TValue, options);
  };

  const options = useMemo<ISelectOption<TValue>[]>(() => {
    const fetchedData = (listItems || []).filter(filter);

    const fetchedItems = fetchedData.map<ISelectOption<TValue>>(item => {
      const option = Boolean(getOptionFromFetchedItem)
        ? (getOptionFromFetchedItem(item) as ISelectOption<TValue>)
        : (item as ISelectOption<TValue>);

      return option;
    });

    const selectedItem = wrapValue(value);
    // Remove items which are already exist in the fetched items.
    // Note: we shouldn't process full list and make it unique because by this way we'll hide duplicates received from the back-end
    const selectedItems = selectedItem
      ? (Array.isArray(selectedItem) ? selectedItem : [selectedItem]).filter(
          i => fetchedItems.findIndex(fi => fi.value === i.value) === -1
        )
      : [];

    const result = [...fetchedItems, ...selectedItems];
    return result;
  }, [listItems]);

  const handleChange = (_: CustomLabeledValue<TValue>, option: any) => {
    if (!Boolean(onChange)) return;
    const selectedValue =
      option !== undefined
        ? Array.isArray(option)
          ? (option as ISelectOption<TValue>[]).map(o => o.data)
          : (option as ISelectOption<TValue>).data
        : undefined;

    if (mode === 'multiple' || mode === 'tags') {
      onChange(Array.isArray(selectedValue) ? selectedValue : [selectedValue]);
    } else onChange(selectedValue);
  };

  if (readOnly) {
    return (
      <ReadOnlyDisplayFormItem
        value={wrapValue(value)}
        disabled={disabled}
        type={mode === 'multiple' || mode === 'tags' ? 'dropdownMultiple' : 'dropdown'}
      />
    );
  }

  return (
    <Select<CustomLabeledValue<TValue> | CustomLabeledValue<TValue>[]>
      showSearch
      labelInValue={true}
      defaultActiveFirstOption={false}
      showArrow={showArrow}
      notFoundContent={null}
      allowClear={true}
      loading={loading}
      disabled={disabled}
      filterOption={(input, option) => {
        if (typeof option?.children === 'string' && typeof input === 'string') {
          // @ts-ignore
          return option?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0;
        }

        return false;
      }}
      {...rest}
      style={{ width }}
      onChange={handleChange}
      value={wrapValue(value)}
      mode={mode}
    >
      {options?.map(({ value: localValue, label, data }) => (
        <Select.Option value={localValue} key={localValue} data={data}>
          {label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default GenericRefListDropDown;
