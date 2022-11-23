import React, { FC, useContext, PropsWithChildren, useRef } from 'react';
import metadataReducer from './reducer';
import {
  ConfigurationItemsLoaderActionsContext,
  ConfigurationItemsLoaderStateContext,
  CONFIGURATION_ITEMS_LOADER_CONTEXT_INITIAL_STATE,
  IConfigurationItemsLoaderStateContext,
  IConfigurationItemsLoaderActionsContext,
  IGetFormPayload,
} from './contexts';
import useThunkReducer from 'react-hook-thunk-reducer';
import { IFormsDictionary } from './models';
import { useSheshaApplication } from '../../providers';
import { asFormFullName, asFormRawId } from '../form/utils';
import { FormMarkupWithSettings, IFormDto } from '../form/models';
import { formConfigurationGet, formConfigurationGetByName } from '../../apis/formConfiguration';
import { FormConfigurationDto } from '../form/api';

export interface IConfigurationItemsLoaderProviderProps { }

const ConfigurationItemsLoaderProvider: FC<PropsWithChildren<IConfigurationItemsLoaderProviderProps>> = ({ children }) => {
  const initial: IConfigurationItemsLoaderStateContext = {
    ...CONFIGURATION_ITEMS_LOADER_CONTEXT_INITIAL_STATE,
  };

  const forms = useRef<IFormsDictionary>({});

  const [state, _dispatch] = useThunkReducer(metadataReducer, initial);

  const { backendUrl, httpHeaders } = useSheshaApplication();
  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const makeFormLoadingKey = (payload: IGetFormPayload): string => {
    const { formId } = payload;
    const rawId = asFormRawId(formId);
    if (rawId) {
      return rawId;
    }

    const fullName = asFormFullName(formId);
    if (fullName) {
      return `${fullName.module}/${fullName.name}`;
    }
    return null;
  }

  const getMarkupFromResponse = (data: FormConfigurationDto): FormMarkupWithSettings => {
    const markupJson = data.markup;
    return markupJson
      ? JSON.parse(markupJson) as FormMarkupWithSettings
      : null;
  }

  const getForm = (payload: IGetFormPayload) => {
    // create a key
    const key = makeFormLoadingKey(payload);

    const loadedForm = forms.current[key];
    if (loadedForm) return loadedForm; // todo: check for rejection

    /*
    request types:
    1. id + md5 ->
        1.1 when MD5 differs: full dto + md5
        1.2 when MD5 equals: 304
    2. name + module + mode + md5 -> 
        2.1 when MD5 differs: full dto + md5
        2.2 when MD5 equals: 304
    */
    const { formId } = payload;
    const rawId = asFormRawId(formId);
    const fullName = asFormFullName(formId);

    const formPromise = new Promise<IFormDto>((resolve, reject) => {
      if (!rawId && !fullName)
        reject("Form identifier nust be specified");

      /*
      check form in the local storage
      if exists - extract MD5 and include into the payload
      handle 2 possible responses:
      1. not changed - return value from localstorage
      2. changed - use value from response and save to local storage

      store id for every request key
      key -> id from local storage
      id -> form from local storage
      */
      // useGet<IAbpWrappedGetEntityResponse<FormConfigurationDto>, IAjaxResponseBase, IGetFormByIdPayload | IGetFormByNamePayload>(
      const promise = Boolean(fullName)
        ? formConfigurationGetByName({ name: fullName.name, module: fullName.module }, { base: backendUrl, headers: httpHeaders })
        : Boolean(rawId)
          ? formConfigurationGet({ id: rawId }, { base: backendUrl, headers: httpHeaders })
          : Promise.reject();

      promise.then(response => {
        //console.log('PERF: resolve form response');
        // todo: handle not changed
        if (response.success) {
          const responseData = response.result;
          if (!responseData)
            throw 'Failed to fetch form. Response is empty';
          const markupWithSettings = getMarkupFromResponse(responseData);

          const result: IFormDto = {
            id: responseData.id,
            name: responseData.name,

            module: responseData.module,
            label: responseData.label,
            description: responseData.description,
            modelType: responseData.modelType,
            versionNo: responseData.versionNo,
            versionStatus: responseData.versionStatus,
            isLastVersion: responseData.isLastVersion,

            markup: markupWithSettings?.components,
            settings: markupWithSettings?.formSettings,
          };

          resolve(result);
        } else
          reject(response.error);
      })
        .catch(e => {
          reject(e);
        });
    });
    forms.current[key] = formPromise;

    return formPromise;
  };

  const loaderActions: IConfigurationItemsLoaderActionsContext = {
    getForm,
  };

  return (
    <ConfigurationItemsLoaderStateContext.Provider value={state}>
      <ConfigurationItemsLoaderActionsContext.Provider value={loaderActions}>
        {children}
      </ConfigurationItemsLoaderActionsContext.Provider>
    </ConfigurationItemsLoaderStateContext.Provider>
  );
};

function useConfigurationItemsLoaderState(require: boolean) {
  const context = useContext(ConfigurationItemsLoaderStateContext);

  if (context === undefined && require) {
    throw new Error('useConfigurationItemsLoaderState must be used within a ConfigurationItemsLoaderProvider');
  }

  return context;
}

function useConfigurationItemsLoaderActions(require: boolean) {
  const context = useContext(ConfigurationItemsLoaderActionsContext);

  if (context === undefined && require) {
    throw new Error('useConfigurationItemsLoaderActions must be used within a ConfigurationItemsLoaderProvider');
  }

  return context;
}

function useConfigurationItemsLoader(require: boolean = true) {
  const actionsContext = useConfigurationItemsLoaderActions(require);
  const stateContext = useConfigurationItemsLoaderState(require);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when require == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

export { ConfigurationItemsLoaderProvider, useConfigurationItemsLoaderState, useConfigurationItemsLoaderActions, useConfigurationItemsLoader };
