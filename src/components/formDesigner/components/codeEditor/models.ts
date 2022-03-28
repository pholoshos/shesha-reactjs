import { IAceOptions } from 'react-ace';
import { IConfigurableFormComponent } from '../../../../interfaces';
import { EditorModes } from './types';

export interface ICodeExposedVariable {
  id: string;
  name: string;
  description: string;
  type: 'object' | 'function';
}

export interface ICodeEditorProps extends IConfigurableFormComponent {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  mode?: 'inline' | 'dialog';
  setOptions?: IAceOptions;
  language?: EditorModes;
  exposedVariables?: ICodeExposedVariable[];
}
