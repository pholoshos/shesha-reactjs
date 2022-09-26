import { createContext } from 'react';
import {
  IFlagsState,
  IFlagsSetters,
} from '../../interfaces';
import {
  DEFAULT_FORM_SETTINGS,
  FormIdentifier,
  FormMarkup,
  FormMarkupWithSettings,
  IFormSettings,
} from '../form/models';
import { IPersistedFormProps } from './models';

export type IFlagProgressFlags =
  | 'load'
  | 'save' /* NEW_IN_PROGRESS_FLAG_GOES_HERE */;
export type IFlagSucceededFlags =
  | 'load'
  | 'save' /* NEW_SUCCEEDED_FLAG_GOES_HERE */;
export type IFlagErrorFlags =
  | 'load'
  | 'save' /* NEW_ERROR_FLAG_GOES_HERE */;
export type IFlagActionedFlags = '__DEFAULT__' /* NEW_ACTIONED_FLAG_GOES_HERE */;

export interface IFormPersisterStateContext extends IFlagsState<IFlagProgressFlags, IFlagSucceededFlags, IFlagErrorFlags, IFlagActionedFlags> {
  formId: FormIdentifier;
  formProps: IPersistedFormProps;
  formSettings: IFormSettings;
  markup: FormMarkup;
}

export interface IFormLoadPayload {
  formId: FormIdentifier;
}

export interface IFormPersisterActionsContext
  extends IFlagsSetters<IFlagProgressFlags, IFlagSucceededFlags, IFlagErrorFlags, IFlagActionedFlags> {
  loadForm: () => void;
  saveForm: (payload: FormMarkupWithSettings) => Promise<void>;
  updateFormSettings: (settings: IFormSettings) => void;
}

/** Form initial state */
export const FORM_PERSISTER_CONTEXT_INITIAL_STATE: IFormPersisterStateContext = {
  formId: null,
  isInProgress: {},
  succeeded: {},
  error: {},
  actioned: {},
  markup: null,
  formSettings: DEFAULT_FORM_SETTINGS,
  formProps: null,
};

export const FormPersisterStateContext = createContext<IFormPersisterStateContext>(FORM_PERSISTER_CONTEXT_INITIAL_STATE);

export const FormPersisterActionsContext = createContext<IFormPersisterActionsContext>(undefined);

export const FormPersisterStateConsumer = FormPersisterStateContext.Consumer;
