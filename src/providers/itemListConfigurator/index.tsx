import React, { FC, useReducer, useContext, PropsWithChildren, useMemo } from 'react';
import itemListConfiguratorReducer from './reducer';
import {
  IConfigurableItem,
  IItemsOptions,
  IUpdateChildItemsPayload,
  IUpdateItemSettingsPayload,
  ItemListConfiguratorProviderActionsContext,
  ItemListConfiguratorStateContext,
  ITEM_LIST_CONFIGURATOR_CONTEXT_INITIAL_STATE,
  IConfigurableItemGroup,
} from './contexts';
import {
  addItemAction,
  deleteItemAction,
  selectItemAction,
  updateChildItemsAction,
  updateItemAction,
  addGroupAction,
  deleteGroupAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { getItemById } from './utils';
import { usePrevious } from 'react-use';
import { nanoid } from 'nanoid/non-secure';

export interface IItemListConfiguratorProviderPropsBase {
  baseUrl?: string;
}

export interface IItemListConfiguratorProviderProps {
  items: IConfigurableItem[];
  options: IItemsOptions;
  childrenKey: string;
}

const ItemListConfiguratorProvider: FC<PropsWithChildren<IItemListConfiguratorProviderProps>> = ({
  items,
  options: { onAddNewItem, onAddNewGroup } = {},
  children,
}) => {
  const [state, dispatch] = useReducer(itemListConfiguratorReducer, {
    ...ITEM_LIST_CONFIGURATOR_CONTEXT_INITIAL_STATE,
    items: items || [],
  });

  // We don't wanna rerender if selectItem is called with the same selected value
  const previousSelectedItem = usePrevious(state?.selectedItemId);

  const addItem = () => {
    const itemProps: IConfigurableItem = {
      id: nanoid(),
      title: `New item`,
      selected: false,
    };

    dispatch(addItemAction(typeof onAddNewItem === 'function' ? onAddNewItem(itemProps, 1) : itemProps));
  };

  const deleteItem = (uid: string) => {
    dispatch(deleteItemAction(uid));
  };

  const selectItem = (uid: string) => {
    if (previousSelectedItem !== uid) {
      dispatch(selectItemAction(uid));
    }
  };

  const updateChildItems = (payload: IUpdateChildItemsPayload) => {
    dispatch(updateChildItemsAction(payload));
  };

  const addGroup = () => {
    const groupProps: IConfigurableItemGroup = {
      id: nanoid(),
      itemType: 'group',
      title: `New Group`,
      childItems: [],
      selected: false,
    };

    dispatch(addGroupAction(typeof onAddNewGroup === 'function' ? onAddNewGroup(groupProps, 1) : groupProps));
  };

  const deleteGroup = (uid: string) => {
    dispatch(deleteGroupAction(uid));
  };

  const getItem = (uid: string): IConfigurableItem => {
    return getItemById(state.items, uid);
  };

  const updateItem = (payload: IUpdateItemSettingsPayload) => {
    dispatch(updateItemAction(payload));
  };

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const memoizedSelectedItemId = useMemo(() => state?.selectedItemId, [state.selectedItemId]);

  return (
    <ItemListConfiguratorStateContext.Provider value={{ ...state, selectedItemId: memoizedSelectedItemId }}>
      <ItemListConfiguratorProviderActionsContext.Provider
        value={{
          addItem,
          deleteItem,
          selectItem,
          updateChildItems,
          getItem,
          updateItem,
          addGroup,
          deleteGroup,
          /* NEW_ACTION_GOES_HERE */
        }}
      >
        {children}
      </ItemListConfiguratorProviderActionsContext.Provider>
    </ItemListConfiguratorStateContext.Provider>
  );
};

function useItemListConfiguratorState() {
  const context = useContext(ItemListConfiguratorStateContext);

  if (context === undefined) {
    throw new Error('useItemListConfiguratorState must be used within a ItemListConfiguratorProvider');
  }

  return context;
}

function useItemListConfiguratorActions() {
  const context = useContext(ItemListConfiguratorProviderActionsContext);

  if (context === undefined) {
    throw new Error('useItemListConfiguratorActions must be used within a ItemListConfiguratorProvider');
  }

  return context;
}

function useItemListConfigurator() {
  return { ...useItemListConfiguratorState(), ...useItemListConfiguratorActions() };
}

export { ItemListConfiguratorProvider, useItemListConfigurator };
