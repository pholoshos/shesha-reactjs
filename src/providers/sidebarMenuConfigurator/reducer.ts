import {
  ISidebarMenuConfiguratorStateContext,
  IUpdateChildItemsPayload,
  IUpdateItemSettingsPayload,
  SIDEBAR_MENU_CONTEXT_INITIAL_STATE,
} from './contexts';
import { SidebarMenuActionEnums } from './actions';
import { v4 as uuid } from 'uuid';
import { handleActions } from 'redux-actions';
import { getItemPositionById } from './utils';
import { ISidebarMenuItem } from '../../interfaces/sidebar';

const sidebarMenuReducer = handleActions<ISidebarMenuConfiguratorStateContext, any>(
  {
    [SidebarMenuActionEnums.AddItem]: (state: ISidebarMenuConfiguratorStateContext) => {
      const buttonProps: ISidebarMenuItem = {
        id: uuid(),
        itemType: 'button',
        title: `New item`,
        childItems: [],
      };

      const newItems = [...state.items];
      //const parent = state.selectedItemId ? getItemById(newItems, state.selectedItemId) : null;
      const parent = null;

      if (parent) {
        parent.childItems = [...parent.childItems, buttonProps];
      } else newItems.push(buttonProps);

      return {
        ...state,
        items: newItems,
        selectedItemId: buttonProps.id,
      };
    },

    [SidebarMenuActionEnums.DeleteItem]: (
      state: ISidebarMenuConfiguratorStateContext,
      action: ReduxActions.Action<string>
    ) => {
      const { payload } = action;

      console.log('state.items: ', state.items);
      const items = removeIdDeep([...state.items], payload);
      // const newItems = state.items.filter(item => item.id !== payload);

      // const position = getItemPositionById(newItems, payload);

      // console.log('SidebarMenuActionEnums.DeleteItem position: ', position);

      console.log('newItems: ', items);

      return {
        ...state,
        items,
        // items: [...newItems],
        selectedItemId: state.selectedItemId === payload ? null : state.selectedItemId,
      };
    },

    [SidebarMenuActionEnums.SelectItem]: (
      state: ISidebarMenuConfiguratorStateContext,
      action: ReduxActions.Action<string>
    ) => {
      const { payload } = action;

      return {
        ...state,
        selectedItemId: payload,
      };
    },

    [SidebarMenuActionEnums.UpdateItem]: (
      state: ISidebarMenuConfiguratorStateContext,
      action: ReduxActions.Action<IUpdateItemSettingsPayload>
    ) => {
      const { payload } = action;

      const newItems = [...state.items];

      const position = getItemPositionById(newItems, payload.id);
      if (!position) return state;

      let newArray = position.ownerArray;
      newArray[position.index] = {
        ...newArray[position.index],
        ...payload.settings,
      };

      return {
        ...state,
        items: newItems,
      };
    },

    [SidebarMenuActionEnums.UpdateChildItems]: (
      state: ISidebarMenuConfiguratorStateContext,
      action: ReduxActions.Action<IUpdateChildItemsPayload>
    ) => {
      const {
        payload: { index, childs: childIds },
      } = action;
      if (!Boolean(index) || index.length == 0) {
        return {
          ...state,
          items: childIds,
        };
      }
      // copy all items
      const newItems = [...state.items];
      // blockIndex - full index of the current container
      const blockIndex = [...index];
      // lastIndex - index of the current element in its' parent
      const lastIndex = blockIndex.pop();

      // search for a parent item
      const lastArr = blockIndex.reduce((arr, i) => arr[i]['childItems'], newItems);

      // and set a list of childs
      lastArr[lastIndex]['childItems'] = childIds;

      return {
        ...state,
        items: newItems,
      };
    },

    [SidebarMenuActionEnums.AddGroup]: (state: ISidebarMenuConfiguratorStateContext) => {
      const groupProps: ISidebarMenuItem = {
        id: uuid(),
        itemType: 'group',
        title: `New Group`,
        childItems: [],
      };
      return {
        ...state,
        items: [groupProps, ...state.items],
        selectedItemId: groupProps.id,
      };
    },

    [SidebarMenuActionEnums.DeleteGroup]: (
      state: ISidebarMenuConfiguratorStateContext,
      action: ReduxActions.Action<string>
    ) => {
      const { payload } = action;

      const newItems = state.items.filter(item => item.id !== payload);

      return {
        ...state,
        items: [...newItems],
        selectedItemId: state.selectedItemId === payload ? null : state.selectedItemId,
      };
    },
  },

  SIDEBAR_MENU_CONTEXT_INITIAL_STATE
);

export default sidebarMenuReducer;

function removeIdDeep(list: ISidebarMenuItem[], idToRemove: string) {
  const filtered = list.filter(entry => entry.id !== idToRemove);
  return filtered.map(entry => {
    if (!entry.childItems) return entry;
    return { ...entry, childItems: removeIdDeep(entry.childItems, idToRemove) };
  });
}
