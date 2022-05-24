import React, { FC, useReducer, useContext, PropsWithChildren } from 'react';
import toolbarReducer from './reducer';
import {
  IUpdateChildItemsPayload,
  IUpdateItemSettingsPayload,
  TableViewSelectorConfiguratorActionsContext,
  TableViewSelectorConfiguratorStateContext,
  TOOLBAR_CONTEXT_INITIAL_STATE,
} from './contexts';
import {
  addButtonAction,
  deleteButtonAction,
  addGroupAction,
  deleteGroupAction,
  selectItemAction,
  updateChildItemsAction,
  updateItemAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { ITableViewProps } from './models';
import { getItemById } from './utils';

export interface ITableViewSelectorConfiguratorProviderPropsBase {
  baseUrl?: string;
}

export interface ITableViewSelectorConfiguratorProviderProps {
  items: ITableViewProps[];
  value?: any;
  onChange?: (value: any) => void;
}

const TableViewSelectorConfiguratorProvider: FC<PropsWithChildren<
  ITableViewSelectorConfiguratorProviderProps
>> = props => {
  const {
    // onChange,
    // value,
    children,
  } = props;

  const [state, dispatch] = useReducer(toolbarReducer, {
    ...TOOLBAR_CONTEXT_INITIAL_STATE,
    items: props.items,
  });

  const addButton = () => {
    dispatch(addButtonAction());
  };

  const deleteButton = (uid: string) => {
    dispatch(deleteButtonAction(uid));
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

  const getItem = (uid: string): ITableViewProps => {
    return getItemById(state.items, uid);
  };

  const updateItem = (payload: IUpdateItemSettingsPayload) => {
    dispatch(updateItemAction(payload));
  };

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  return (
    <TableViewSelectorConfiguratorStateContext.Provider value={{ ...state }}>
      <TableViewSelectorConfiguratorActionsContext.Provider
        value={{
          addButton,
          deleteButton,
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
      </TableViewSelectorConfiguratorActionsContext.Provider>
    </TableViewSelectorConfiguratorStateContext.Provider>
  );
};

function useTableViewSelectorConfiguratorState(require: boolean = true) {
  const context = useContext(TableViewSelectorConfiguratorStateContext);

  if (require && context === undefined) {
    throw new Error(
      'useTableViewSelectorConfiguratorState must be used within a TableViewSelectorConfiguratorProvider'
    );
  }

  return context;
}

function useTableViewSelectorConfiguratorActions(require: boolean = true) {
  const context = useContext(TableViewSelectorConfiguratorActionsContext);

  if (require && context === undefined) {
    throw new Error(
      'useTableViewSelectorConfiguratorActions must be used within a TableViewSelectorConfiguratorProvider'
    );
  }

  return context;
}

function useTableViewSelectorConfigurator(require: boolean = true) {
  const actionsContext = useTableViewSelectorConfiguratorActions(require);
  const stateContext = useTableViewSelectorConfiguratorState(require);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when require == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

export { TableViewSelectorConfiguratorProvider, useTableViewSelectorConfigurator };
