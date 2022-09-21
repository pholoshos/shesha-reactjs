import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import FormDesigner from './formDesigner';
import { FormProvider, MetadataDispatcherProvider } from '../../providers';
import { addStory } from '../../stories/utils';
import { FormIdentifier, FormMode } from '../../providers/form/models';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/Temp/FormDesigner',
  component: FormDesigner,
} as Meta;

export interface IFormDesignerStoryProps {
  formId: FormIdentifier;
  // module?: string;
  // formName: string;
  mode?: FormMode;
}

// Create a master template for mapping args to render the Button component
const DesignerTemplate: Story<IFormDesignerStoryProps> = ({ formId, mode = 'designer' }) => (
  <StoryApp>
    <MetadataDispatcherProvider>
      <FormProvider formId={formId} mode={mode}>
        <FormDesigner />
      </FormProvider>
    </MetadataDispatcherProvider>
  </StoryApp>
);

export const PersonEdit = addStory(DesignerTemplate, {
  formId: {
    name: 'person-form',
  }
});

export const PersonDetails = addStory(DesignerTemplate, {
  formId: {
    name: '/persons/details',
  }
});

export const FormsIndexOld = addStory(DesignerTemplate, {
  formId: {
    name: 'forms-v2',
  }
});

export const WizardForm = addStory(DesignerTemplate, {
  formId: {
    name: 'mazi-form-view',
  }
});

export const FormsIndex = addStory(DesignerTemplate, {
  formId: {
    name: 'forms',
    module: 'shesha',
  }
});

export const FormsIndex2 = addStory(DesignerTemplate, {
  formId: {
    name: 'forms'
  }
});

export const FormCreate = addStory(DesignerTemplate, {
  formId: {
    name: 'form-create',
    module: 'shesha',
  }
});

export const FormDetails = addStory(DesignerTemplate, {
  formId: {
    name: 'form-details',
    module: 'shesha',
  }
});

export const Modules = addStory(DesignerTemplate, {
  formId: {
    name: 'modules',
    module: 'shesha',
  }
});

export const ModuleCreate = addStory(DesignerTemplate, {
  formId: {
    name: 'module-create',
    module: 'shesha',
  }
});

export const ModuleDetails = addStory(DesignerTemplate, {
  formId: {
    name: 'module-details',
    module: 'shesha',
  }
});

export const FormTemplates = addStory(DesignerTemplate, {
  formId: {
    name: 'form-templates',
    module: 'shesha',
  }
});

export const FormTemplateCreate = addStory(DesignerTemplate, {
  formId: {
    name: 'form-template-create',
    module: 'shesha',
  }
});

export const FormTemplateDetails = addStory(DesignerTemplate, {
  formId: {
    name: 'form-template-details',
    module: 'shesha',
  }
});

export const Autocomplete = addStory(DesignerTemplate, {
  formId: {
    name: 'autocomplete',
  }
});

export const Playground = addStory(DesignerTemplate, {
  formId: {
    name: 'playground-form',
  }
});