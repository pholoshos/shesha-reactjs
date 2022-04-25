import { evaluateString } from '../../formDesignerUtils';
import { ColumnSorting, IStoredFilter, SortDirection } from './interfaces';
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

export const sortDirection2ColumnSorting = (value?: SortDirection): ColumnSorting =>
{
  switch (value){
    case 0: return 'asc';
    case 1: return 'desc';
    default: return null;
  }
}
export const columnSorting2SortDirection = (value?: ColumnSorting): SortDirection =>
{
  switch (value){
    case 'asc': return 0;
    case 'desc': return 1;
    default: return null;
  }
}