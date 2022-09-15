import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import FormDesigner from './formDesigner';
import { FormProvider, MetadataDispatcherProvider } from '../../providers';
import { addStory } from '../../stories/utils';
import { FormMode } from '../../providers/form/models';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/Temp/FormDesigner',
  component: FormDesigner,
} as Meta;

export interface IFormDesignerStoryProps {
  module?: string;
  formName: string;
  mode?: FormMode;
}

// Create a master template for mapping args to render the Button component
const DesignerTemplate: Story<IFormDesignerStoryProps> = ({ module, formName, mode = 'designer' }) => (
  <StoryApp>
    <MetadataDispatcherProvider>
      <FormProvider module={module} name={formName} mode={mode}>
        <FormDesigner />
      </FormProvider>
    </MetadataDispatcherProvider>
  </StoryApp>
);

export const PersonEdit = addStory(DesignerTemplate, {
  formName: 'person-form',
});

export const PersonDetails = addStory(DesignerTemplate, {
  formName: '/persons/details',
});

export const FormsIndexOld = addStory(DesignerTemplate, {
  formName: 'forms-v2',
});

export const WizardForm = addStory(DesignerTemplate, {
  formName: 'mazi-form-view',
});

export const FormsIndex = addStory(DesignerTemplate, {
  formName: 'forms',
});

export const FormCreate = addStory(DesignerTemplate, {
  formName: 'form-create',
});

export const FormDetails = addStory(DesignerTemplate, {
  formName: 'form-details',
});

export const Modules = addStory(DesignerTemplate, {
  formName: 'modules',
});

export const ModuleCreate = addStory(DesignerTemplate, {
  formName: 'module-create',
});

export const ModuleDetails = addStory(DesignerTemplate, {
  formName: 'module-details',
});

export const FormTemplates = addStory(DesignerTemplate, {
  formName: 'form-templates',
});

export const FormTemplateCreate = addStory(DesignerTemplate, {
  formName: 'form-template-create',
});

export const FormTemplateDetails = addStory(DesignerTemplate, {
  formName: 'form-template-details',
});

export const Autocomplete = addStory(DesignerTemplate, {
  formName: 'autocomplete',
});

export const Playground = addStory(DesignerTemplate, {
  formName: 'playground-form',
});