import { UseMutateReturn } from 'restful-react';
import {
  AjaxResponseBase,
  FormDto,
  FormDtoAjaxResponse,
  useFormCreate,
  UseFormCreateProps,
} from '../../../../apis/form';
import { generateNewKey } from '../../../../components/formDesigner/components/dataTable/table/utils';
import { evaluateString } from '../../../../providers/form/utils';
import blankViewMarkup from '../defaults/markups/blankView.json';
import dashboardViewMarkup from '../defaults/markups/dashboardView.json';
import detailsViewMarkup from '../defaults/markups/detailsView.json';
import formViewMarkup from '../defaults/markups/formView.json';
import masterDetailsViewMarkup from '../defaults/markups/masterDetailsView.json';
import menuViewMarkup from '../defaults/markups/menuView.json';
import tableViewMarkup from '../defaults/markups/tableView.json';

export interface LabelCol {
  span: number;
}

export interface IWrapperCol {
  span: number;
}

export interface Props {}

export interface DocgenInfo {
  description: string;
  displayName: string;
  props: Props;
}

export interface IFormSettings {
  layout: string;
  colon: boolean;
  labelCol: LabelCol;
  wrapperCol: IWrapperCol;
  displayName: string;
  __docgenInfo: DocgenInfo;
  showModeToggler: boolean;
  _formFields: string[];
  modelType: string;
  postUrl: string;
  getUrl: string;
}

export interface IFormMarkupWithSettings {
  columns?: [];
  settings: IFormSettings;
}

export const useCreateForm = (
  props: UseFormCreateProps
): UseMutateReturn<FormDtoAjaxResponse, AjaxResponseBase, FormDto, any, void> => {
  const hook = useFormCreate(props);

  const mutate = (data: FormDto) => {
    const json = getDefaultFormMarkup(data.type as ViewType);

    let markup: any;

    if (typeof json === 'object') {
      const markupString = JSON.stringify(json);

      markup = evaluateString(markupString, { modelType: data?.modelType });
    }

    return hook.mutate({
      ...data,
      markup: typeof markup === 'object' ? JSON.stringify(markup) : markup,
    });
  };

  return { ...hook, mutate };
};

export type ViewType = 'details' | 'table' | 'form' | 'blank' | 'masterDetails' | 'menu' | 'dashboard';

export const getDefaultFormMarkup = (type: ViewType) => {
  switch (type) {
    case 'blank':
      return blankViewMarkup;
    case 'dashboard':
      return dashboardViewMarkup;
    case 'details':
      return detailsViewMarkup;
    case 'form':
      return formViewMarkup;
    case 'masterDetails':
      return masterDetailsViewMarkup;
    case 'menu':
      return menuViewMarkup;
    case 'table':
      return generateNewKey(tableViewMarkup);
    default:
      return blankViewMarkup;
  }
};
