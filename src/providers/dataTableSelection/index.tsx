import React, { FC, useReducer, useContext, PropsWithChildren } from 'react';
import DataTableSelectionReducer from './reducer';
import {
  DataTableSelectionActionsContext,
  DataTableSelectionStateContext,
  DATATABLE_SELECTION_CONTEXT_INITIAL_STATE,
} from './contexts';
import {
  setSelectedRowAction,
  setMultiSelectedRowAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { Row } from 'react-table';

export interface IDataTableSelectionProviderProps {}

const DataTableSelectionProvider: FC<PropsWithChildren<IDataTableSelectionProviderProps>> = ({ children }) => {
  const [state, dispatch] = useReducer(DataTableSelectionReducer, {
    ...DATATABLE_SELECTION_CONTEXT_INITIAL_STATE,
  });

  const setSelectedRow = (index: number, row: any) => {
    dispatch(setSelectedRowAction({ index, row, id: row?.id }));
  };

  const setMultiSelectedRow = (rows: Row[] | Row) => {
    dispatch(setMultiSelectedRowAction(rows));
  };

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  return (
    <DataTableSelectionStateContext.Provider value={state}>
      <DataTableSelectionActionsContext.Provider
        value={{
          setSelectedRow,
          setMultiSelectedRow,
          /* NEW_ACTION_GOES_HERE */
        }}
      >
        {children}
      </DataTableSelectionActionsContext.Provider>
    </DataTableSelectionStateContext.Provider>
  );
};

function useDataTableSelectionState() {
  const context = useContext(DataTableSelectionStateContext);

  if (context === undefined) {
    throw new Error('useDataTableSelection must be used within a DataTableSelectionProvider');
  }

  return context;
}

function useDataTableSelectionActions() {
  const context = useContext(DataTableSelectionActionsContext);

  if (context === undefined) {
    throw new Error('useDataTableSelectionActions must be used within a DataTableSelectionProvider');
  }

  return context;
}

function useDataTableSelection() {
  return { ...useDataTableSelectionState(), ...useDataTableSelectionActions() };
}

export { DataTableSelectionProvider, useDataTableSelectionState, useDataTableSelectionActions, useDataTableSelection };
