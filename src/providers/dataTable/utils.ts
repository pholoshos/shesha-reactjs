import { evaluateString } from '../../formDesignerUtils';
import { IStoredFilter } from './interfaces';
import camelCaseKeys from 'camelcase-keys';

export const evaluateDynamicFilters = (filters: IStoredFilter[], data: any) => {
  if (filters?.length === 0) return [];

  if (!data) return filters;

  const filtersString = JSON.stringify(filters);

  const evaluatedFiltersString = evaluateString(filtersString, camelCaseKeys(data || {}, { pascalCase: true }));

  return JSON.parse(evaluatedFiltersString) as IStoredFilter[];
};

export const hasDynamicFilter = (filters: IStoredFilter[]) => {
  if (filters?.length === 0) return false;

  const found = filters?.find(({ expression }) => {
    const _expression = typeof expression === 'string' ? expression : JSON.stringify(expression);

    return _expression?.includes('{{') && _expression?.includes('}}');
  });

  return Boolean(found);
};

export const cleanPropertyName = (keyValue: string) => keyValue?.replace('.', '_');
