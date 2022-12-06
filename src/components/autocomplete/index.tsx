import React from 'react';
import { IGuidNullableEntityWithDisplayNameDto } from '../..';
import { EntityAutocomplete } from './entityAutocomplete';
import { IAutocompleteProps, ISelectOption, AutocompleteDataSourceType, CustomLabeledValue } from './models';
import { UrlAutocomplete } from './urlAutocomplete';

/**
 * A component for working with dynamic autocomplete
 */

export const Autocomplete = <TValue,>(props: IAutocompleteProps<TValue>) => {
  return props.dataSourceType === 'entitiesList'
    ? <EntityAutocomplete {...props} />
    : <UrlAutocomplete {...props}  />
};

export type IDtoType = IGuidNullableEntityWithDisplayNameDto | IGuidNullableEntityWithDisplayNameDto[];

export const EntityDtoAutocomplete = (props: IAutocompleteProps<IDtoType>) => {
  const getDtoFromFetchedItem = (item): ISelectOption<IDtoType> => {
    return {
      value: item['value'],
      label: item['displayText'],
      data: {
        id: item['value'],
        displayText: item['displayText'],
      },
    };
  };

  const labeledValueGetter = (itemValue: IGuidNullableEntityWithDisplayNameDto, options: ISelectOption<IDtoType>[]) => {
    if (!Boolean(itemValue)) return null;
    // update label value from fetched data (necessary for JsonEntity because it stores DisplayText in the Json and might be inconsistent)
    const item = options?.find(i => i.value === itemValue.id);

    return {
      value: itemValue.id,
      label: item?.label ?? itemValue.displayText,
      data: itemValue,
    };
  };

  return (
    <Autocomplete getOptionFromFetchedItem={getDtoFromFetchedItem} getLabeledValue={labeledValueGetter} {...props} />
  );
};


// RawAutocomplete updated to use with input data in the IGuidNullableEntityWithDisplayNameDto format.
// Necessary for JsonEntity because it stores EntityReference in the IGuidNullableEntityWithDisplayNameDto format
// and form designer migth not know which exactly format should be used
// It still returns data in the raw format
export type IRawAutocompleteType = string | IGuidNullableEntityWithDisplayNameDto;

export const RawAutocomplete = (props: IAutocompleteProps<IRawAutocompleteType>) => {
  const getDtoFromFetchedItem = (item): ISelectOption<IRawAutocompleteType> => {
    return {
      value: item['value'],
      label: item['displayText'],
      data: item['value'],
    };
  };

  const labeledValueGetter  = (itemValue: IRawAutocompleteType , options: ISelectOption<IRawAutocompleteType>[]) => {
    var val = (itemValue as IGuidNullableEntityWithDisplayNameDto)?.id ?? itemValue as string;
    if (!Boolean(val)) return null;
    const item = options?.find(i => i.value === val);

    return {
      value: val,
      label: item?.label ?? (itemValue as IGuidNullableEntityWithDisplayNameDto)?.displayText ?? props.allowFreeText ? val : 'unknown',
      data: itemValue,
    } ;
  };

  return (
    <Autocomplete<IRawAutocompleteType>
      getOptionFromFetchedItem={getDtoFromFetchedItem}
      getLabeledValue={labeledValueGetter}
      {...props}
    />
  );
};

type InternalAutocompleteType = typeof Autocomplete;
interface IInternalAutocompleteInterface extends InternalAutocompleteType {
  Raw: typeof RawAutocomplete;
  EntityDto: typeof EntityDtoAutocomplete;
}

const AutocompleteInterface = Autocomplete as IInternalAutocompleteInterface;
AutocompleteInterface.Raw = RawAutocomplete;
AutocompleteInterface.EntityDto = EntityDtoAutocomplete;

export {
  RawAutocomplete as AutocompleteRaw,
  EntityDtoAutocomplete as AutocompleteDto,
  IAutocompleteProps,
  ISelectOption,
  AutocompleteDataSourceType,
  CustomLabeledValue
};

export default AutocompleteInterface;
