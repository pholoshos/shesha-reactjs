import React from "react";
import { FC } from "react";
import { useExecuteScriptAction } from './execute-script';
import { useApiCallAction } from './api-call';

export const ApplicationActionsProcessor: FC = ({ children }) => {
  useExecuteScriptAction();
  useApiCallAction();

  return (
    <>{children}</>
  );
}

/*
import { IConfigurableActionDispatcherActionsContext } from '../configurableActionsDispatcher/contexts';

*/