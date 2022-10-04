import React, { FC, useReducer, useContext, PropsWithChildren } from 'react';
import toolbarReducer from './reducer';
import {
  IUpdateChildItemsPayload,
  IUpdateItemSettingsPayload,
  ColumnsConfiguratorActionsContext,
  ColumnsConfiguratorStateContext,
  TOOLBAR_CONTEXT_INITIAL_STATE,
} from './contexts';
import {
  addColumnAction,
  deleteColumnAction,
  addGroupAction,
  deleteGroupAction,
  selectItemAction,
  updateChildItemsAction,
  updateItemAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { ColumnsItemProps } from './models';
import { getItemById } from './utils';

export interface IColumnsConfiguratorProviderPropsBase {
  baseUrl?: string;
}

export interface IColumnsConfiguratorProviderProps {
  items: ColumnsItemProps[];
  value?: any;
  onChange?: (value: any) => void;
}

const ColumnsConfiguratorProvider: FC<PropsWithChildren<IColumnsConfiguratorProviderProps>> = props => {
  const {
    // onChange,
    // value,
    children,
  } = props;

  const [state, dispatch] = useReducer(toolbarReducer, {
    ...TOOLBAR_CONTEXT_INITIAL_STATE,
    items: props.items,
  });

  const addColumn = () => {
    dispatch(addColumnAction());
  };

  const deleteColumn = (uid: string) => {
    dispatch(deleteColumnAction(uid));
  };

  const addGroup = () => {
    dispatch(addGroupAction());
  };

  const deleteGroup = (uid: string) => {
    dispatch(deleteGroupAction(uid));
  };

  const selectItem = (uid: string) => {
    dispatch(selectItemAction(uid));
  };

  const updateChildItems = (payload: IUpdateChildItemsPayload) => {
    dispatch(updateChildItemsAction(payload));
  };

  const getItem = (uid: string): ColumnsItemProps => {
    return getItemById(state.items, uid);
  };

  const updateItem = (payload: IUpdateItemSettingsPayload) => {
    dispatch(updateItemAction(payload));
  };
  
  /* NEW_ACTION_DECLARATION_GOES_HERE */

  return (
    <ColumnsConfiguratorStateContext.Provider value={state}>
      <ColumnsConfiguratorActionsContext.Provider
        value={{
          addColumn,
          deleteColumn,
          addGroup,
          deleteGroup,
          selectItem,
          updateChildItems,
          getItem,
          updateItem,
          //getChildItems,
          /* NEW_ACTION_GOES_HERE */
        }}
      >
        {children}
      </ColumnsConfiguratorActionsContext.Provider>
    </ColumnsConfiguratorStateContext.Provider>
  );
};

function useColumnsConfiguratorState() {
  const context = useContext(ColumnsConfiguratorStateContext);

  if (context === undefined) {
    throw new Error('useColumnsConfiguratorState must be used within a ColumnsConfiguratorProvider');
  }

  return context;
}

function useColumnsConfiguratorActions() {
  const context = useContext(ColumnsConfiguratorActionsContext);

  if (context === undefined) {
    throw new Error('useColumnsConfiguratorActions must be used within a ColumnsConfiguratorProvider');
  }

  return context;
}

function useColumnsConfigurator() {
  return { ...useColumnsConfiguratorState(), ...useColumnsConfiguratorActions() };
}

export { ColumnsConfiguratorProvider, useColumnsConfigurator };
