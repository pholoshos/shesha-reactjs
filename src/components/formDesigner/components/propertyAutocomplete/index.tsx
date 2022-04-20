import React from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { FileSearchOutlined } from '@ant-design/icons';
import FormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { PropertyAutocomplete } from './propertyAutocomplete';
import { useForm } from '../../../..';

export interface IPropertyAutocompleteComponentProps extends IConfigurableFormComponent {
  dropdownStyle?: string;
  mode?: 'single' | 'multiple';
}

const settingsForm = settingsFormJson as FormMarkup;

const PropertyAutocompleteComponent: IToolboxComponent<IPropertyAutocompleteComponentProps> = {
  type: 'propertyAutocomplete',
  name: 'Property Autocomplete',
  icon: <FileSearchOutlined />,
  factory: (model: IPropertyAutocompleteComponentProps) => {
    const { formData } = useForm();
    return (
      <FormItem model={model}>
        <PropertyAutocomplete
          id={model.id}
          style={getStyle(model?.style, formData)}
          dropdownStyle={getStyle(model?.dropdownStyle, formData)}
          size={model.size}
          mode={model?.mode}
        />
      </FormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
};

export default PropertyAutocompleteComponent;
