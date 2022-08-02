import { IValuable } from './valuable';
import { IChangeable } from './changeable';

export interface IFormItem extends IChangeable, IValuable {}
