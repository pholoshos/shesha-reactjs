import { nanoid } from "nanoid";
import { DesignerToolbarSettings } from "../../../interfaces/toolbarSettings";

export interface IExecuteScriptArguments {
  expression: string;
}

export const executeScriptArgumentsForm = new DesignerToolbarSettings()
  .addCodeEditor({
    id: nanoid(),
    name: 'expression',
    label: 'Expression',
    mode: "dialog",
  })
  .toJson();