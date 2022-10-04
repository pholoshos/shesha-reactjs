import { IConfigurableActionDescriptor } from "../../interfaces/configurableAction";

export interface IConfigurableActionDictionary {
  [key: string]: IConfigurableActionDescriptor[];
}