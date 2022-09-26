import { FormRawMarkup, IFormSettings } from "../form/models";

export interface IPersistedFormProps {
    id?: string;
    module?: string;
    name?: string;
    label?: string;
    description?: string;
    markup?: FormRawMarkup;
    formSettings?: IFormSettings;
}