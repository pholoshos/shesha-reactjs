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

  const labeledValueGetter = (
    itemValue: IGuidNullableEntityWithDisplayNameDto,
    _options: ISelectOption<IDtoType>[]
  ) => {
    return {
      value: itemValue.id,
      label: itemValue.displayText,
      data: itemValue,
    };
  };

  return (
    <Autocomplete getOptionFromFetchedItem={getDtoFromFetchedItem} getLabeledValue={labeledValueGetter} {...props} />
  );
};

export const RawAutocomplete = (props: IAutocompleteProps<string>) => {
  const getDtoFromFetchedItem = (item): ISelectOption<string> => {
    return {
      value: item['value'],
      label: item['displayText'],
      data: item['value'],
    };
  };

  const labeledValueGetter = (itemValue: string, options: ISelectOption<string>[]) => {
    if (!Boolean(itemValue)) return null;
    const item = options?.find(i => i.value === itemValue);

    return {
      value: itemValue,
      label: item?.label ?? 'unknown',
      data: itemValue,
    };
  };

  return (
    <Autocomplete<string>
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
