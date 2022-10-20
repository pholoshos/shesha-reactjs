import React, { FC, useContext, PropsWithChildren, useEffect } from 'react';
import formReducer from './reducer';
import {
  FormPersisterActionsContext,
  FormPersisterStateConsumer,
  FormPersisterStateContext,
  FORM_PERSISTER_CONTEXT_INITIAL_STATE,
  IFormPersisterActionsContext,
  IFormPersisterStateContext,
  // DEFAULT_FORM_SETTINGS,
} from './contexts';
import { getFlagSetters } from '../utils/flagsSetters';
import {
  loadRequestAction,
  loadSuccessAction,
  loadErrorAction,
  saveRequestAction,
  saveSuccessAction,
  saveErrorAction,
  updateFormSettingsAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { useFormConfigurationUpdateMarkup, FormUpdateMarkupInput } from '../../apis/formConfiguration';
import useThunkReducer from 'react-hook-thunk-reducer';
import { useFormConfiguration } from '../form/api';
import { DEFAULT_FORM_SETTINGS, FormIdentifier, FormMarkupWithSettings, IFormSettings } from '../form/models';
import { IPersistedFormProps } from './models';

export interface IFormProviderProps {
  formId: FormIdentifier;
}

const FormPersisterProvider: FC<PropsWithChildren<IFormProviderProps>> = ({
  children,
  formId,
}) => {
  const initial: IFormPersisterStateContext = {
    ...FORM_PERSISTER_CONTEXT_INITIAL_STATE,
    formId: formId,
  };

  const [state, dispatch] = useThunkReducer(formReducer, initial);

  const {
    refetch: fetchFormMarkup,
    loading: isFetchingMarkup,
    error: fetchMarkupError,
    formConfiguration
  } = useFormConfiguration({ formId, lazy: true });

  const doFetchFormInfo = () => {
    if (formId) {
      dispatch(loadRequestAction({ formId }));
      fetchFormMarkup();
    }
  };

  useEffect(() => {
    if (!formId) return;

    doFetchFormInfo();
  }, [formId]);

  useEffect(() => {
    if (!isFetchingMarkup) {
      if (formConfiguration) {
        const formContent: IPersistedFormProps = {
          id: formConfiguration.id,
          name: formConfiguration.name,
          module: formConfiguration.module,
          label: formConfiguration.label,
          description: formConfiguration.description,
          markup: formConfiguration.markup ?? [],
          formSettings: formConfiguration.settings ?? DEFAULT_FORM_SETTINGS,
          versionNo: formConfiguration.versionNo,
          versionStatus: formConfiguration.versionStatus,
          isLastVersion: formConfiguration.isLastVersion,
        };

        // parse json content
        dispatch((dispatchThunk, _getState) => {
          dispatchThunk(loadSuccessAction(formContent));
        });
      }

      if (fetchMarkupError) {
        // todo: handle error messages
        dispatch(loadErrorAction());
      }
    }
  }, [isFetchingMarkup, formConfiguration, fetchMarkupError]);

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const loadForm = () => {
    doFetchFormInfo();
  };

  // todo: review usage of useFormUpdateMarkup after
  const { mutate: saveFormHttp } = useFormConfigurationUpdateMarkup({});

  const saveForm = async (payload: FormMarkupWithSettings): Promise<void> => {
    if (!state.formProps?.id) return Promise.reject();

    dispatch(saveRequestAction());

    const dto: FormUpdateMarkupInput = {
      id: state.formProps.id,
      markup: JSON.stringify(payload, null, 2),
    };
console.log('SAVE FORM: ', dto);
    await saveFormHttp(dto, {})
      .then(_response => {
        dispatch(saveSuccessAction());
        return Promise.resolve();
      })
      .catch(_error => {
        dispatch(saveErrorAction());
        return Promise.reject();
      });
  };

  const updateFormSettings = (settings: IFormSettings) => {
    dispatch(updateFormSettingsAction(settings));
  };

  const formPersisterActions: IFormPersisterActionsContext = {
    ...getFlagSetters(dispatch),
    loadForm,
    saveForm,
    updateFormSettings,
    /* NEW_ACTION_GOES_HERE */
  };

  return (
    <FormPersisterStateContext.Provider value={state}>
      <FormPersisterActionsContext.Provider value={formPersisterActions}>
        {children}
      </FormPersisterActionsContext.Provider>
    </FormPersisterStateContext.Provider>
  );
};

function useFormPersisterState(require: boolean = true) {
  const context = useContext(FormPersisterStateContext);

  if (require && context === undefined) {
    throw new Error('useFormPersisterState must be used within a FormPersisterProvider');
  }

  return context;
}

function useFormPersisterActions(require: boolean = true) {
  const context = useContext(FormPersisterActionsContext);

  if (require && context === undefined) {
    throw new Error('useFormPersisterActions must be used within a FormPersisterProvider');
  }

  return context;
}

function useFormPersister(require: boolean = true) {
  const actionsContext = useFormPersisterActions(require);
  const stateContext = useFormPersisterState(require);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when require == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

export { FormPersisterProvider, FormPersisterStateConsumer as FormPersisterConsumer, useFormPersister };
