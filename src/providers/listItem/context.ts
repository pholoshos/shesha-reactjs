import { IFormSettings } from './../form/contexts';
import React from 'react';

export interface IListItemState {
  index?: number;
  prefix?: string;
  formSettings?: IFormSettings;
}

export const ListItemContext = React.createContext<IListItemState>({
  index: undefined,
  prefix: undefined,
});
