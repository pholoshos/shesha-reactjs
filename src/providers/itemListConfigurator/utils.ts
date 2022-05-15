import { IConfigurableItem, IConfigurableItemGroup } from './contexts';

export const getItemById = (items: IConfigurableItem[], id: string): IConfigurableItem => {
  const position = getItemPositionById(items, id);
  return position ? position.ownerArray[position.index] : null;
};

export interface IItemPosition {
  ownerArray: IConfigurableItem[];
  index: number;
}

export const getItemPositionById = (items: IConfigurableItemGroup[], id: string): IItemPosition => {
  for (let index = 0; index < items.length; index++) {
    const item = items[index];

    if (item.id === id)
      return {
        ownerArray: items,
        index,
      };

    const childs = item.childItems;

    if (childs) {
      const itemPosition = getItemPositionById(childs, id);
      if (itemPosition) return itemPosition;
    }
  }

  return null;
};
