import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import FormDesigner from './formDesigner';
import { MetadataDispatcherProvider } from '../../providers';
import { addStory } from '../../stories/utils';
import { FormIdentifier, FormMode } from '../../providers/form/models';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/Temp/FormDesigner',
  component: FormDesigner,
} as Meta;

export interface IFormDesignerStoryProps {
  formId: FormIdentifier;
  mode?: FormMode;
}

// Create a master template for mapping args to render the Button component
const DesignerTemplate: Story<IFormDesignerStoryProps> = ({ formId }) => (
  <StoryApp>
    <MetadataDispatcherProvider>
      <FormDesigner formId={formId}/>
    </MetadataDispatcherProvider>
  </StoryApp>
);

export const PublicHolidaysForm = addStory(DesignerTemplate, {
  formId: { name: 'public-holiday-table' }
});
export const RoleAppointmentForm = addStory(DesignerTemplate, {
  formId: '7d50a512-f100-4a6c-977d-c4f39e34b637'
});

export const TestForm = addStory(DesignerTemplate, {
  formId: 'bb9a1ec3-c727-4fef-918e-ce1600f87d9c'
  /*
  formId: {
    name: 'test-form',
    module: 'shesha'
  }*/
});
export const UserManagementForm = addStory(DesignerTemplate, {
  formId: { name: 'user-management-new' }
});
export const RoleDetailsForm = addStory(DesignerTemplate, {
  formId: { name: 'role-details' }
});

export const PersonDetails = addStory(DesignerTemplate, {
  formId: {
    name: 'person-details',
    module: 'shesha',
  }
});

export const PersonsIndex = addStory(DesignerTemplate, {
  formId: {
    name: 'persons',
    module: 'shesha',
  }
});

export const SubForm = addStory(DesignerTemplate, {
  formId: {
    name: 'sub-form',
  }
});

export const PersonList = addStory(DesignerTemplate, {
  formId: {
    name: 'person-list',
  }
});

export const UserManagement = addStory(DesignerTemplate, {
  formId: {
    name: 'user-management-new',
  }
});

export const WizardForm = addStory(DesignerTemplate, {
  formId: {
    name: 'mazi-form-view',
  }
});

export const WizardFormDebug = addStory(DesignerTemplate, {
  formId: { 
    name: 'mazi-form-view-debug' 
  },
});

export const FormsIndex = addStory(DesignerTemplate, {
  formId: {
    name: 'forms',
    module: 'shesha',
  }
});

export const FormCreate = addStory(DesignerTemplate, {
  formId: {
    name: 'form-create',
    module: 'shesha',
  }
});

export const FormDetails = addStory(DesignerTemplate, {
  /*
  formId: {
    name: 'form-details',
    module: 'shesha',
  }
  */
  formId: '567b9f53-a9be-48f1-8ea8-d4626edf78fd'
});

export const Modules = addStory(DesignerTemplate, {
  formId: '655a8f6e-89f2-48e4-a5d8-e133bab20b16'
  /*
  formId: {
    name: 'modules',
    module: 'shesha',
  }
  */
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

export const OrganisationEdit = addStory(DesignerTemplate, {
  formId: { name: '/organisations/edit', version: 1 },
});

export const PermissionedObjects = addStory(DesignerTemplate, {
  formId: { name: '/permissionedObject/webapi' },
});

export const ModelConfigurationEdit = addStory(DesignerTemplate, {
  formId: { name: 'model-configuration-edit' }
});

export const PermissionEdit = addStory(DesignerTemplate, {
  formId: { name: 'permission-edit' }
});
