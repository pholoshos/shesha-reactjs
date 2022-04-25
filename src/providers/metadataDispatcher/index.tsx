import React, { FC, useContext, PropsWithChildren, useRef } from 'react';
import metadataReducer from './reducer';
import {
  MetadataDispatcherActionsContext,
  MetadataDispatcherStateContext,
  METADATA_DISPATCHER_CONTEXT_INITIAL_STATE,
  IMetadataDispatcherStateContext,
  IMetadataDispatcherActionsContext,
  IGetMetadataPayload,
  IRegisterProviderPayload,
} from './contexts';
import {
  activateProviderAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import useThunkReducer from 'react-hook-thunk-reducer';
import { metadataGetProperties, PropertyMetadataDto } from '../../apis/metadata';
import { IModelsDictionary, IProvidersDictionary } from './models';
import { useSheshaApplication } from '../../providers';
import { IModelMetadata, IPropertyMetadata } from '../../interfaces/metadata';

export interface IMetadataDispatcherProviderProps {}

const MetadataDispatcherProvider: FC<PropsWithChildren<IMetadataDispatcherProviderProps>> = ({ children }) => {
  const initial: IMetadataDispatcherStateContext = {
    ...METADATA_DISPATCHER_CONTEXT_INITIAL_STATE,
  };

  const providers = useRef<IProvidersDictionary>({});
  const models = useRef<IModelsDictionary>({});

  const [state, dispatch] = useThunkReducer(metadataReducer, initial);

  const { backendUrl, httpHeaders } = useSheshaApplication();
  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const mapProperty = (property: PropertyMetadataDto, prefix: string = ''): IPropertyMetadata => {
    return {
      ...property,
      path: property.path,
      prefix,
      properties: property.properties?.map(child => mapProperty(child, property.path)),
    };
  };

  const getMetadata = (payload: IGetMetadataPayload) => {
    const { modelType } = payload;
    const loadedModel = models.current[payload.modelType];
    if (loadedModel) return Promise.resolve(loadedModel);

    const result = new Promise<IModelMetadata>((resolve, reject) => {
      metadataGetProperties({ container: modelType }, { base: backendUrl, headers: httpHeaders })
        .then(response => {
          if (!response.success) {
            reject(response.error);
          }

          const properties = response.result.map<IPropertyMetadata>(p => mapProperty(p));

          const meta: IModelMetadata = {
            type: payload.modelType,
            name: payload.modelType, // todo: fetch name from server
            properties,
          };

          models.current[payload.modelType] = meta;
          resolve(meta);
        })
        .catch(e => {
          reject(e);
        });
    });

    return result;
  };

  const registerProvider = (payload: IRegisterProviderPayload) => {
    const existingProvider = providers.current[payload.id];
    if (!existingProvider) {
      providers.current[payload.id] = {
        id: payload.id,
        modelType: payload.modelType,
        contextValue: payload.contextValue,
      };
    } else {
      existingProvider.modelType = payload.modelType;
      existingProvider.contextValue = payload.contextValue;
    }
  };

  const activateProvider = (providerId: string) => {
    dispatch(activateProviderAction(providerId));
  };

  const getActiveProvider = () => {
    const registration = state.activeProvider ? providers.current[state.activeProvider] : null;

    return registration?.contextValue;
  };

  const metadataActions: IMetadataDispatcherActionsContext = {
    getMetadata,
    registerProvider,
    activateProvider,
    getActiveProvider,
    /* NEW_ACTION_GOES_HERE */
  };

  return (
    <MetadataDispatcherStateContext.Provider value={state}>
      <MetadataDispatcherActionsContext.Provider value={metadataActions}>
        {children}
      </MetadataDispatcherActionsContext.Provider>
    </MetadataDispatcherStateContext.Provider>
  );
};

function useMetadataDispatcherState(require: boolean) {
  const context = useContext(MetadataDispatcherStateContext);

  if (context === undefined && require) {
    throw new Error('useMetadataDispatcherState must be used within a MetadataDispatcherProvider');
  }

  return context;
}

function useMetadataDispatcherActions(require: boolean) {
  const context = useContext(MetadataDispatcherActionsContext);

  if (context === undefined && require) {
    throw new Error('useMetadataDispatcherActions must be used within a MetadataDispatcherProvider');
  }

  return context;
}

function useMetadataDispatcher(require: boolean = true) {
  return { ...useMetadataDispatcherState(require), ...useMetadataDispatcherActions(require) };
}

export { MetadataDispatcherProvider, useMetadataDispatcherState, useMetadataDispatcherActions, useMetadataDispatcher };
