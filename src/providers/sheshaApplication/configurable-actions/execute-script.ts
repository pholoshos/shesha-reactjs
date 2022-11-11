import { nanoid } from "nanoid";
import { useSheshaApplication } from "../../..";
import { DesignerToolbarSettings } from "../../../interfaces/toolbarSettings";
import { useConfigurableAction } from "../../configurableActionsDispatcher";
import { SheshaActionOwners } from "../../configurableActionsDispatcher/models";
import { executeScript } from "../../form/utils";

export interface IExecuteScriptArguments {
  expression: string;
}

const executeScriptArgumentsForm = new DesignerToolbarSettings()
  .addCodeEditor({
    id: nanoid(),
    name: 'expression',
    label: 'Expression',
    mode: "dialog",
  })
  .toJson();

export const useExecuteScriptAction = () => {
  const { backendUrl, httpHeaders } = useSheshaApplication();
  useConfigurableAction<IExecuteScriptArguments>({
    owner: 'Common',
    ownerUid: SheshaActionOwners.Common,
    name: 'Execute Script',
    hasArguments: true,
    argumentsFormMarkup: executeScriptArgumentsForm,
    executer: (actionArgs, context) => {
      if (!actionArgs.expression)
        return Promise.reject('Expected expression to be defined but it was found to be empty.');

      console.log('context is: ', context);

      return executeScript(actionArgs.expression, context);
    }
  }, [backendUrl, httpHeaders]);
};
