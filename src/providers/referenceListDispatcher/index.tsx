import React, { FC, useContext, PropsWithChildren, /*useRef,*/ useState, useEffect } from 'react';
import metadataReducer from './reducer';
import {
  ReferenceListDispatcherActionsContext,
  ReferenceListDispatcherStateContext,
  REFERENCELIST_DISPATCHER_CONTEXT_INITIAL_STATE,
  IReferenceListDispatcherStateContext,
  IReferenceListDispatcherActionsContext,
  IGetReferenceListPayload,
} from './contexts';
import useThunkReducer from 'react-hook-thunk-reducer';
import { ILoadingState, /*IReferenceListDictionary,*/ IReferenceListIdentifier } from './models';
//import { useSheshaApplication } from '../../providers';
import { IReferenceList, IReferenceListItem } from '../../interfaces/referenceList';
//import { getReferenceListFullName } from './utils';
//import { referenceListGetItems } from '../../apis/referenceList';
import { PromisedValue } from '../../utils/promises';
import { useConfigurationItemsLoader } from '../configurationItemsLoader';
import { isValidRefListId } from './utils';

export interface IReferenceListDispatcherProviderProps { }

// const getReferenceListCacheKey = (refListId: IReferenceListIdentifier): string => {

// }

const ReferenceListDispatcherProvider: FC<PropsWithChildren<IReferenceListDispatcherProviderProps>> = ({ children }) => {
  const initial: IReferenceListDispatcherStateContext = {
    ...REFERENCELIST_DISPATCHER_CONTEXT_INITIAL_STATE,
  };

  //const refLists = useRef<IReferenceListDictionary>({});

  const loader = useConfigurationItemsLoader();

  const [state, _dispatch] = useThunkReducer(metadataReducer, initial);

  //const { backendUrl, httpHeaders } = useSheshaApplication();
  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const getReferenceList = (payload: IGetReferenceListPayload): PromisedValue<IReferenceList> => {
    return loader.getRefList({ refListId: payload.refListId, skipCache: false });
    
    /*
    const { refListId } = payload;

    if (!refListId.name && (!refListId.module || !refListId.namespace))
      return MakePromiseWithState(Promise.reject("Reference list name or module not specified"));

    const refListKey = getReferenceListFullName(moduleName, name);
    const loadedRefList = refLists.current[refListKey];
    if (loadedRefList) return loadedRefList;

    const refListPromise = new Promise<IReferenceList>((resolve, reject) => {
      referenceListGetItems({ namespace: moduleName, name: name }, { base: backendUrl, headers: httpHeaders })
        .then(response => {
          if (!response.success) {
            reject(response.error);
          }

          const refList: IReferenceList = {
            name: name,
            items: response.result.map<IReferenceListItem>(i => ({
              id: i.id,
              item: i.item,
              itemValue: i.itemValue,
              description: i.description,
              orderIndex: i.orderIndex,
            })),
          };

          resolve(refList);
        })
        .catch(e => {
          reject(e);
        });
    });
    const promiseWithState = MakePromiseWithState(refListPromise);
    refLists.current[refListKey] = promiseWithState;

    return promiseWithState;
    */
  };

  const getReferenceListItem = (moduleName: string, name: string, itemValue?: number): Promise<IReferenceListItem> => {
    return getReferenceList({ refListId: { module: moduleName, name: name } }).promise.then(list => {
      return list.items.find(i => i.itemValue == itemValue);
    });
  }

  const referenceListActions: IReferenceListDispatcherActionsContext = {
    getReferenceList,
    getReferenceListItem,
    /* NEW_ACTION_GOES_HERE */
  };

  return (
    <ReferenceListDispatcherStateContext.Provider value={state}>
      <ReferenceListDispatcherActionsContext.Provider value={referenceListActions}>
        {children}
      </ReferenceListDispatcherActionsContext.Provider>
    </ReferenceListDispatcherStateContext.Provider>
  );
};

function useReferenceListDispatcherState(require: boolean) {
  const context = useContext(ReferenceListDispatcherStateContext);

  if (context === undefined && require) {
    throw new Error('useReferenceListDispatcherState must be used within a ReferenceListDispatcherProvider');
  }

  return context;
}

function useReferenceListDispatcherActions(require: boolean) {
  const context = useContext(ReferenceListDispatcherActionsContext);

  if (context === undefined && require) {
    throw new Error('useReferenceListDispatcherActions must be used within a ReferenceListDispatcherProvider');
  }

  return context;
}

function useReferenceListDispatcher(require: boolean = true) {
  const actionsContext = useReferenceListDispatcherActions(require);
  const stateContext = useReferenceListDispatcherState(require);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when require == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

const getRefListItemByValue = (list: IReferenceList, itemValue?: number): IReferenceListItem => {
  return !list || itemValue === null || itemValue === undefined
    ? null
    : list.items.find(i => i.itemValue == itemValue);
}

const useReferenceList = (refListId: IReferenceListIdentifier): ILoadingState<IReferenceList> => {
  const { getReferenceList } = useReferenceListDispatcher();
  const refListPromise = getReferenceList({ refListId: refListId });

  const [data, setData] = useState<IReferenceList>(refListPromise.value);

  useEffect(() => {
    // if the reflist is not loaded on first rendering - use promise to return data
    if (!refListPromise.isResolved)
      refListPromise.promise.then(list => {
        if (data !== refListPromise.value) {
          setData(list);
        }
      });
  }, []);

  useEffect(() => {
    // if the loaded list changed after first loading - return actual value
    if (data !== refListPromise.value) {
      setData(refListPromise.value);
    }
  }, [refListPromise.value]);

  if (!isValidRefListId(refListId))
    return { loading: false, data: null };

  const result: ILoadingState<IReferenceList> = {
    data,
    loading: refListPromise.isPending,
    error: refListPromise.error
  };
  return result;
}

const useReferenceListItem = (moduleName: string, namespace: string, listName: string, itemValue?: number): ILoadingState<IReferenceListItem> => {
  if (itemValue === null || itemValue === undefined)
    return null;

  const { getReferenceList } = useReferenceListDispatcher();
  const refListPromise = getReferenceList({ refListId: { module: moduleName, namespace: namespace, name: listName } });
  const loadedItem = refListPromise.isResolved
    ? getRefListItemByValue(refListPromise.value, itemValue)
    : null;

  const [data, setData] = useState<IReferenceListItem>(loadedItem);

  if (refListPromise.isPending)
    refListPromise.promise.then(list => {
      const item = getRefListItemByValue(list, itemValue);
      setData(item);
    });

  const result: ILoadingState<IReferenceListItem> = {
    data,
    loading: refListPromise.isPending,
    error: refListPromise.error
  };
  return result;
}

export {
  ReferenceListDispatcherProvider,
  useReferenceListDispatcher,
  useReferenceListItem,
  useReferenceList
};
