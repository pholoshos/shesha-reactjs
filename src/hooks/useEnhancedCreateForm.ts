import { UseMutateReturn } from 'restful-react';
import { AjaxResponseBase, FormDto, FormDtoAjaxResponse, useFormCreate, UseFormCreateProps } from '../apis/form';
import { ViewType } from '../providers/form/models';
import { getDefaultFormMarkup } from '../providers/form/utils';

/**
 * An enhanced hook for creating a new form that passes a template markup based on the view type
 * @param props form create props
 * @returns a promise
 */
export const useEnhancedCreateForm = (
  props: UseFormCreateProps
): UseMutateReturn<FormDtoAjaxResponse, AjaxResponseBase, FormDto, any, void> => {
  const hook = useFormCreate(props);

  const mutate = (data: FormDto) =>
    hook.mutate({ ...data, markup: JSON.stringify(getDefaultFormMarkup(data.type as ViewType)) });

  return { ...hook, mutate };
};
