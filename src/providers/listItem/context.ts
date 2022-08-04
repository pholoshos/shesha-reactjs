import React from 'react';

export interface IListItemState {
  index?: number;
  prefix?: string;
}

export const ListItemContext = React.createContext<IListItemState>({
  index: undefined,
  prefix: undefined,
});
