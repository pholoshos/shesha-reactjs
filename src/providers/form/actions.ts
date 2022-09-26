import { createAction } from 'redux-actions';
import { IFormValidationErrors } from '../../interfaces';
import {
  ISetVisibleComponentsPayload,
  ISetFormDataPayload,
  IRegisterActionsPayload,
  ISetEnabledComponentsPayload,
} from './contexts';
import { IFlatComponentsStructure, FormMode } from './models';

export enum FormActionEnums {
  SetFlatComponentsAction = 'SET_FLAT_COMPONENTS',
  SetFormMode = 'SET_FORM_MODE',
  SetVisibleComponents = 'SET_VISIBLE_COMPONENTS',
  SetEnabledComponents = 'SET_ENABLED_COMPONENTS',
  SetFormData = 'SET_FORM_DATA',
  SetValidationErrors = 'SET_VALIDATION_ERRORS',
  RegisterActions = 'REGISTER_ACTIONS',
}

export const setFlatComponentsAction = createAction<IFlatComponentsStructure, IFlatComponentsStructure>(FormActionEnums.SetFlatComponentsAction, p => p);

export const setFormModeAction = createAction<FormMode, FormMode>(FormActionEnums.SetFormMode, p => p);

export const setVisibleComponentsAction = createAction<ISetVisibleComponentsPayload, ISetVisibleComponentsPayload>(
  FormActionEnums.SetVisibleComponents,
  p => p
);

export const setEnabledComponentsAction = createAction<ISetEnabledComponentsPayload, ISetEnabledComponentsPayload>(
  FormActionEnums.SetEnabledComponents,
  p => p
);

export const setFormDataAction = createAction<ISetFormDataPayload, ISetFormDataPayload>(
  FormActionEnums.SetFormData,
  p => p
);

export const setValidationErrorsAction = createAction<IFormValidationErrors, IFormValidationErrors>(
  FormActionEnums.SetValidationErrors,
  p => p
);

export const registerComponentActionsAction = createAction<IRegisterActionsPayload, IRegisterActionsPayload>(
  FormActionEnums.RegisterActions,
  p => p
);