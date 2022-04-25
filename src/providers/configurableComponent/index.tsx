import React, { useContext, PropsWithChildren, useEffect, Context, useReducer } from 'react';
import reducerFactory from './reducer';
import {
  getConfigurableComponentActionsContext,
  getConfigurableComponentStateContext,
  getContextInitialState,
  IConfigurableComponentActionsContext,
  IConfigurableComponentStateContext,
} from './contexts';
import { getFlagSetters } from '../utils/flagsSetters';
import {
  loadRequestAction,
  loadSuccessAction,
  loadErrorAction,
  saveRequestAction,
  saveSuccessAction,
  saveErrorAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import {
  /*useConfigurableComponentUpdate,*/ useConfigurableComponentUpdateSettings,
  ConfigurableComponentUpdateSettingsInput,
} from '../../apis/configurableComponent';
import { useAppConfigurator } from '../appConfigurator';

export interface IGenericConfigurableComponentProviderProps<TSettings extends any> {
  initialState: IConfigurableComponentStateContext<TSettings>;
  stateContext: Context<IConfigurableComponentStateContext<TSettings>>;
  actionContext: Context<IConfigurableComponentActionsContext<TSettings>>;
  id?: string;
}

const GenericConfigurableComponentProvider = <TSettings extends any>({
  children,
  initialState,
  stateContext,
  actionContext,
  id,
}: PropsWithChildren<IGenericConfigurableComponentProviderProps<TSettings>>) => {
  const reducer = reducerFactory(initialState);
  const { fetchSettings, getSettings, invalidateSettings } = useAppConfigurator();

  const initialSettings = getSettings(id)?.settings as TSettings;

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    id,
    settings: initialSettings,
  });

  useEffect(() => {
    if (!Boolean(id) || Boolean(state.settings)) return;
    
    doFetch();
  }, [id]);

  const doFetch = () => {
    dispatch(loadRequestAction({ id }));
    fetchSettings(id)
      .then((settings) => {
        dispatch(
          loadSuccessAction({...settings})
        );
      })
      .catch((error) => {
        dispatch(loadErrorAction({ error: error?.['message'] || 'Failed to load component' }))
      });
  };

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const loadComponent = () => {
    doFetch();
  };

  // todo: review usage of useFormUpdateMarkup after
  const {
    mutate: saveFormHttp /*, loading: saveFormInProgress, error: saveFormError*/,
  } = useConfigurableComponentUpdateSettings({
    id,
  });

  const saveComponent = (settings: TSettings): Promise<void> => {
    if (!state.id) {
      console.warn('ConfigurableComponent: save of component without `id` called');
      return Promise.resolve();
    }

    dispatch(saveRequestAction({}));

    const dto: ConfigurableComponentUpdateSettingsInput = {
      id: state.id,
      settings: settings ? JSON.stringify(settings) : null,
    };

    return saveFormHttp(dto, {})
      .then(_response => {
        invalidateSettings(state.id);
        dispatch(saveSuccessAction({ settings: dto.settings }));
      })
      .catch(_error => {
        dispatch(saveErrorAction({ error: '' }));
      });
  };

  const configurableFormActions: IConfigurableComponentActionsContext<TSettings> = {
    ...getFlagSetters(dispatch),
    load: loadComponent,
    save: saveComponent,
    /* NEW_ACTION_GOES_HERE */
  };

  return (
    <stateContext.Provider value={state}>
      <actionContext.Provider value={configurableFormActions}>{children}</actionContext.Provider>
    </stateContext.Provider>
  );
};

export interface IConfigurableComponentProviderProps {
  id?: string;
}

export const createConfigurableComponent = <TSettings extends any>(defaultSettings: TSettings) => {
  const initialState = getContextInitialState<TSettings>(defaultSettings);
  const StateContext = getConfigurableComponentStateContext<TSettings>(initialState);
  const ActionContext = getConfigurableComponentActionsContext<TSettings>();

  const useConfigurableComponent = () => {
    const stateContext = useContext(StateContext);
    const actionsContext = useContext(ActionContext);

    if (stateContext === undefined || actionsContext === undefined) {
      throw new Error('useConfigurableComponent must be used within a ConfigurableComponentProvider');
    }

    return { ...stateContext, ...actionsContext };
  };

  const ConfigurableComponentProvider = <T extends PropsWithChildren<IConfigurableComponentProviderProps>>(
    props: T
  ) => {
    return (
      <GenericConfigurableComponentProvider<TSettings>
        initialState={initialState}
        stateContext={StateContext}
        actionContext={ActionContext}
        id={props.id}
      >
        {props.children}
      </GenericConfigurableComponentProvider>
    );
  };

  return { ConfigurableComponentProvider, useConfigurableComponent };
};
