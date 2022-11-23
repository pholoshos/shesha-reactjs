import { IFormDto } from "../form/models";

export interface IFormsDictionary {
  [key: string]: Promise<IFormDto>;
}