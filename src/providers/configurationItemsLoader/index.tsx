import React, { FC, useContext, PropsWithChildren, useRef } from 'react';
import metadataReducer from './reducer';
import {
  ConfigurationItemsLoaderActionsContext,
  ConfigurationItemsLoaderStateContext,
  CONFIGURATION_ITEMS_LOADER_CONTEXT_INITIAL_STATE,
  IConfigurationItemsLoaderStateContext,
  IConfigurationItemsLoaderActionsContext,
  IGetFormPayload,
  IClearItemCachePayload,
  IGetRefListPayload,
} from './contexts';
import useThunkReducer from 'react-hook-thunk-reducer';
import { IFormsDictionary, IReferenceListsDictionary } from './models';
import { FormIdentifier, useSheshaApplication } from '../../providers';
import { asFormFullName, asFormRawId } from '../form/utils';
import { FormMarkupWithSettings, IFormDto } from '../form/models';
import { FormConfigurationDto, formConfigurationGet, formConfigurationGetByName } from '../../apis/formConfiguration';
import { getFormNotFoundMessage, getReferenceListNotFoundMessage } from './utils';
import { ConfigurationItemsViewMode } from '../appConfigurator/models';
import { IReferenceList } from '../../interfaces/referenceList';
import { referenceListGetByName } from '../../apis/referenceList';
import { MakePromiseWithState, PromisedValue } from '../../utils/promises';

export interface IConfigurationItemsLoaderProviderProps { }

const ConfigurationItemsLoaderProvider: FC<PropsWithChildren<IConfigurationItemsLoaderProviderProps>> = ({ children }) => {
  const initial: IConfigurationItemsLoaderStateContext = {
    ...CONFIGURATION_ITEMS_LOADER_CONTEXT_INITIAL_STATE,
  };

  const forms = useRef<IFormsDictionary>({});
  const referenceLists = useRef<IReferenceListsDictionary>({});

  const [state, _dispatch] = useThunkReducer(metadataReducer, initial);

  const { backendUrl, httpHeaders } = useSheshaApplication();

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const makeRefListLoadingKey = (payload: IGetRefListPayload): string => {
    const { refListId, configurationItemMode } = payload;
    if (!refListId || !refListId.name)
      return null;

    const addMode = (key: string): string => {
      return `${key}:${configurationItemMode}`
    }

    return refListId.namespace
      ? addMode(`${refListId.module}/${refListId.namespace}.${refListId.name}`)
      : addMode(`${refListId.module}/${refListId.name}`);
  }

  const makeFormLoadingKey = (payload: IGetFormPayload): string => {
    const { formId, configurationItemMode } = payload;

    const addMode = (key: string): string => {
      return `${key}:${configurationItemMode}`
    }

    const rawId = asFormRawId(formId);
    if (rawId) {
      return addMode(rawId);
    }

    const fullName = asFormFullName(formId);
    if (fullName) {
      return addMode(`${fullName.module}/${fullName.name}`);
    }
    return null;
  }

  const getMarkupFromResponse = (data: FormConfigurationDto): FormMarkupWithSettings => {
    const markupJson = data.markup;
    return markupJson
      ? JSON.parse(markupJson) as FormMarkupWithSettings
      : null;
  }

  const getCacheKeyByFullName = (itemType: string, mode: string, module: string, name: string): string => {
    return `${itemType}:${mode}:${module}:${name}`;
  }
  const getCacheKeyByRawId = (itemType: string, mode: string, rawId: string): string => {
    return `${itemType}:${mode}:${rawId}`;
  }

  const getFromCache = <TDto extends any>(key: string): TDto => {
    const cachedJson = window?.localStorage?.getItem(key);
    try {
      const dto = cachedJson
        ? JSON.parse(cachedJson)
        : null;
      return dto as TDto
    } catch (error) {
      return null;
    }
  }

  const convertFormConfigurationDto2FormDto = (dto: FormConfigurationDto): IFormDto => {
    const markupWithSettings = getMarkupFromResponse(dto);

    const result: IFormDto = {
      id: dto.id,
      name: dto.name,

      module: dto.module,
      label: dto.label,
      description: dto.description,
      modelType: dto.modelType,
      versionNo: dto.versionNo,
      versionStatus: dto.versionStatus,
      isLastVersion: dto.isLastVersion,

      markup: markupWithSettings?.components,
      settings: markupWithSettings?.formSettings,
    };
    return result;
  };

  const getCacheKey = (formId: FormIdentifier, configurationItemMode?: ConfigurationItemsViewMode): string => {
    const rawId = asFormRawId(formId);
    const fullName = asFormFullName(formId);
    return fullName
        ? getCacheKeyByFullName('form', configurationItemMode, fullName.module, fullName.name)
        : rawId
          ? getCacheKeyByRawId('form', configurationItemMode, rawId)
          : null;
  }

  const getRefList = (payload: IGetRefListPayload): PromisedValue<IReferenceList> => {
    // create a key
    const key = makeRefListLoadingKey(payload);

    if (!payload.skipCache){
      const loadedRefList = referenceLists.current[key];
      if (loadedRefList) return loadedRefList; // todo: check for rejection
    }

    const { refListId, configurationItemMode } = payload;

    const refListPromise = new Promise<IReferenceList>((resolve, reject) => {
      if (!refListId)
        reject("Reference List identifier must be specified");

      const cacheKey = getCacheKey(refListId, configurationItemMode);
      const storage = window?.localStorage;
      const cachedDto = cacheKey ? getFromCache<IReferenceList>(cacheKey) : null;

      const promise = referenceListGetByName({ module: refListId.module, namespace: refListId.namespace, name: refListId.name, md5: cachedDto?.cacheMd5 }, { base: backendUrl, headers: httpHeaders/*, responseConverter*/ });

      promise.then(response => {
        console.log('PERF: resolve reference list response');
        // todo: handle not changed
        if (response.success) {
          const responseData = response.result;
          if (!responseData)
            throw 'Failed to fetch reference list. Response is empty';
            
          const dto: IReferenceList = {
            name: responseData.name,
            items: [...responseData.items]
          };
          if (storage)
            storage.setItem(cacheKey, JSON.stringify(responseData));

          resolve(dto);
        } else {
          const rawResponse = response as Response;
          if (rawResponse && rawResponse.status === 304) {
            // code 304 indicates that the content ws not modified - use cached value
            resolve(cachedDto);
          } else {
            const httpResponse = response as Response;

            const error = response.error ?? { code: httpResponse?.status, message: httpResponse?.status === 404 ? getReferenceListNotFoundMessage(refListId) : httpResponse?.statusText };

            reject(error);
          }
        }
      })
        .catch(e => {
          reject(e);
        });
    });
    const promiseWithState = MakePromiseWithState(refListPromise);
    referenceLists.current[key] = promiseWithState;

    return promiseWithState;

  }

  const getForm = (payload: IGetFormPayload): Promise<IFormDto> => {
    // create a key
    const key = makeFormLoadingKey(payload);

    if (!payload.skipCache){
      const loadedForm = forms.current[key];
      if (loadedForm) return loadedForm; // todo: check for rejection
    }

    const { formId, configurationItemMode } = payload;
    const rawId = asFormRawId(formId);
    const fullName = asFormFullName(formId);

    const formPromise = new Promise<IFormDto>((resolve, reject) => {
      if (!rawId && !fullName)
        reject("Form identifier must be specified");

      const cacheKey = getCacheKey(formId, configurationItemMode);
      const storage = window?.localStorage;
      const cachedDto = cacheKey ? getFromCache<FormConfigurationDto>(cacheKey) : null;

      const promise = Boolean(fullName)
        ? formConfigurationGetByName({ name: fullName.name, module: fullName.module, md5: cachedDto?.cacheMd5 }, { base: backendUrl, headers: httpHeaders/*, responseConverter*/ })
        : Boolean(rawId)
          ? formConfigurationGet({ id: rawId, md5: cachedDto?.cacheMd5 }, { base: backendUrl, headers: httpHeaders/*, responseConverter*/ })
          : Promise.reject("Form identifier must be specified");

      promise.then(response => {
        //console.log('PERF: resolve form response');
        // todo: handle not changed
        if (response.success) {
          const responseData = response.result;
          if (!responseData)
            throw 'Failed to fetch form. Response is empty';

          const dto = convertFormConfigurationDto2FormDto(responseData);
          if (storage)
            storage.setItem(cacheKey, JSON.stringify(responseData));

          resolve(dto);
        } else {
          const rawResponse = response as Response;
          if (rawResponse && rawResponse.status === 304) {
            // code 304 indicates that the content ws not modified - use cached value
            const dto = convertFormConfigurationDto2FormDto(cachedDto);
            resolve(dto);
          } else {
            const httpResponse = response as Response;

            const error = response.error ?? { code: httpResponse?.status, message: httpResponse?.status === 404 ? getFormNotFoundMessage(formId) : httpResponse?.statusText };

            reject(error);
          }
        }
      })
        .catch(e => {
          reject(e);
        });
    });
    forms.current[key] = formPromise;

    return formPromise;
  };

  

  const clearItemCache = (payload: IClearItemCachePayload) => {
    const modes: ConfigurationItemsViewMode[] = ['live', 'ready', 'latest'];
    modes.forEach(mode => {
      const cacheKey = getCacheKey(payload.formId, mode);
      
      delete forms.current[cacheKey];
    });
  }

  const loaderActions: IConfigurationItemsLoaderActionsContext = {
    getForm,
    getRefList,
    clearItemCache,
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
