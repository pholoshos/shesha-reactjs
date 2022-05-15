import { createContext } from 'react';

export interface IConfigurableItem {
  id: string;
  selected?: boolean;
  title: string;
  itemType?: 'group' | string;
}

export interface IConfigurableItemGroup extends IConfigurableItem {
  childItems?: IConfigurableItem[];
}

export interface IItemsOptions {
  /**
   * A function that get called whenever a new item gets created. You can use it to pass
   */
  onAddNewItem?: (incomingItem: IConfigurableItem, lastItemNumber: number) => IConfigurableItem;

  /**
   * A function that get called whenever a new item gets created. You can use it to pass
   */
  onAddNewGroup?: (incomingItem: IConfigurableItem, lastItemNumber: number) => IConfigurableItem;
}

export interface IUpdateChildItemsPayload {
  /**
   * Index of the item being updated
   */
  index: number[];

  /**
   * Children to update the item with
   */
  children: IConfigurableItem[];
}

export interface IUpdateItemSettingsPayload {
  /**
   * Unique Id of an item whose settings will be updated
   */
  id: string;

  /**
   * The settings
   */
  settings: IConfigurableItem;
}

export interface IItemListConfiguratorStateContext {
  items: IConfigurableItem[];
  selectedItemId?: string;
  childrenKey?: string;
}

export interface IItemListConfiguratorActionsContext {
  addItem: () => void;
  deleteItem: (uid: string) => void;
  selectItem: (uid: string) => void;
  updateChildItems: (payload: IUpdateChildItemsPayload) => void;
  getItem: (uid: string) => IConfigurableItem;
  updateItem: (payload: IUpdateItemSettingsPayload) => void;
  addGroup: () => void;
  deleteGroup: (uid: string) => void;
}

export const ITEM_LIST_CONFIGURATOR_CONTEXT_INITIAL_STATE: IItemListConfiguratorStateContext = {
  items: [],
};

export const ItemListConfiguratorStateContext = createContext<IItemListConfiguratorStateContext>(
  ITEM_LIST_CONFIGURATOR_CONTEXT_INITIAL_STATE
);

export const ItemListConfiguratorProviderActionsContext = createContext<IItemListConfiguratorActionsContext>(undefined);
