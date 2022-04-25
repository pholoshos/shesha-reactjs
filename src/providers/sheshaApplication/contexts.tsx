import { createContext } from 'react';
import { IToolboxComponentGroup } from '../..';

export interface ISheshaApplicationStateContext {
  applicationName?: string;
  backendUrl: string;
  httpHeaders: { [key: string]: string };
  toolboxComponentGroups?: IToolboxComponentGroup[];
}

export const SHESHA_APPLICATION_CONTEXT_INITIAL_STATE: ISheshaApplicationStateContext = {
  backendUrl: '',
  httpHeaders: {},
  toolboxComponentGroups: [],
};

export interface ISheshaApplicationActionsContext {
  changeBackendUrl?: (backendUrl: string) => void;
}

export const DEFAULT_ACCESS_TOKEN_NAME = 'xDFcxiooPQxazdndDsdRSerWQPlincytLDCarcxVxv';

export const SheshaApplicationStateContext = createContext<ISheshaApplicationStateContext>(
  SHESHA_APPLICATION_CONTEXT_INITIAL_STATE
);

export const SheshaApplicationActionsContext = createContext<ISheshaApplicationActionsContext | undefined>(undefined);
