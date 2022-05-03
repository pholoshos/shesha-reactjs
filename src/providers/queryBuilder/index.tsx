import React, { FC, useReducer, useContext, PropsWithChildren } from 'react';
import QueryBuilderReducer from './reducer';
import { QueryBuilderActionsContext, QueryBuilderStateContext, QUERY_BUILDER_CONTEXT_INITIAL_STATE } from './contexts';
import {
  setFieldsAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { IProperty } from './models';

export interface IQueryBuilderProviderProps {
  fields?: IProperty[];
  id?: string; // Just for testing
}

const QueryBuilderProvider: FC<PropsWithChildren<IQueryBuilderProviderProps>> = ({ children, fields, id }) => {
  const [state, dispatch] = useReducer(QueryBuilderReducer, {
    ...QUERY_BUILDER_CONTEXT_INITIAL_STATE,
    fields: fields || [],
    id,
  });

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const setFields = (newFields: IProperty[]) => {
    dispatch(setFieldsAction(newFields));
  };

  //TODO: Fix the passing of fields so that it can be consumed properly by QueryBuilderComponent.
  //TODO: For some weird reasons the component receives fields as empty, though it has been passed properly
  //TODO: As a work-around I passed fields here as it seems to work. Will revisit this bug later
  return (
    <QueryBuilderStateContext.Provider value={{ ...state, fields }}>
      <QueryBuilderActionsContext.Provider
        value={{
          setFields,
          /* NEW_ACTION_GOES_HERE */
        }}
      >
        {children}
      </QueryBuilderActionsContext.Provider>
    </QueryBuilderStateContext.Provider>
  );
};

function useQueryBuilderState(requireBuilder: boolean = true) {
  const context = useContext(QueryBuilderStateContext);

  if (context === undefined && requireBuilder) {
    throw new Error('useQueryBuilderState must be used within a QueryBuilderProvider');
  }

  return context;
}

function useQueryBuilderActions(requireBuilder: boolean = true) {
  const context = useContext(QueryBuilderActionsContext);

  if (context === undefined && requireBuilder) {
    throw new Error('useQueryBuilderActions must be used within a QueryBuilderProvider');
  }

  return context;
}

function useQueryBuilder(requireBuilder: boolean = true) {
  const actionsContext = useQueryBuilderActions(requireBuilder);
  const stateContext = useQueryBuilderState(requireBuilder);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when requireBuilder == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

export { QueryBuilderProvider, useQueryBuilderState, useQueryBuilderActions, useQueryBuilder };
