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
      <FormDesigner formId={formId} />
    </MetadataDispatcherProvider>
  </StoryApp>
);

export const PublicHolidaysForm = addStory(DesignerTemplate, {
  formId: { name: 'public-holiday-table' },
});
export const RoleAppointmentForm = addStory(DesignerTemplate, {
  formId: '7d50a512-f100-4a6c-977d-c4f39e34b637',
});

export const TestForm = addStory(DesignerTemplate, {
  formId: '1385826b-b888-4977-bcee-0d0146a1b5b2',
  //formId: '7b8562c7-1aed-4818-b830-1dd04c789f20'
  /*
  formId: {
    name: 'test-form',
    module: 'shesha'
  }*/
});

export const AutocompleteSettingsForm = addStory(DesignerTemplate, {
  formId: '7c19404f-7c6f-4cee-9af7-6b82b7be3982',
});

export const UserManagementForm = addStory(DesignerTemplate, {
  formId: { name: 'user-management-new' },
});
export const RoleDetailsForm = addStory(DesignerTemplate, {
  formId: { name: 'role-details' },
});

export const PersonDetails = addStory(DesignerTemplate, {
  formId: {
    name: 'person-details',
    module: 'shesha',
  },
});

export const WardDetails = addStory(DesignerTemplate, {
  /*
  formId: {
    name: 'persons-index',
    module: 'test',
  }
  */
  //formId: '2EE5EDC5-4E56-4C8D-B5E4-D5ED067EA639'
  formId: '361076e6-f4cc-42b0-9c7f-a6e9500cd5ef',
});

export const SubForm = addStory(DesignerTemplate, {
  /*
  formId: {
    name: 'sub-form',
  }
  */
  formId: '363C7F25-4C09-4708-BCCC-9043160C416D',
});

export const PersonList = addStory(DesignerTemplate, {
  formId: 'D35B5C3C-F9A0-44B4-82F9-8DDE9E4458EE',
  /*
  formId: {
    name: 'person-list',
  }
  */
});

export const UserManagement = addStory(DesignerTemplate, {
  formId: {
    name: 'user-management-new',
  },
});

export const WizardForm = addStory(DesignerTemplate, {
  formId: 'A91B07FC-6F21-4FB5-A709-4F4357F1271F',
  /*
  formId: {
    name: 'mazi-form-view',
  }
  */
});

export const WizardFormDebug = addStory(DesignerTemplate, {
  formId: {
    name: 'mazi-form-view-debug',
  },
});

export const FormsIndex = addStory(DesignerTemplate, {
  formId: '4E69FF2B-CDC0-417A-BE39-1BF59B74011C',
  /*
  formId: {
    name: 'forms',
    module: 'shesha',
  }
  */
});

export const FormCreate = addStory(DesignerTemplate, {
  formId: {
    name: 'form-create',
    module: 'shesha',
  },
});

export const FormDetails = addStory(DesignerTemplate, {
  /*
  formId: {
    name: 'form-details',
    module: 'shesha',
  }
  */
  formId: '483BC7C3-8EF3-4481-86C9-E1BED37162D2',
});

export const Modules = addStory(DesignerTemplate, {
  formId: '655a8f6e-89f2-48e4-a5d8-e133bab20b16',
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
  },
});

export const ModuleDetails = addStory(DesignerTemplate, {
  formId: {
    name: 'module-details',
    module: 'shesha',
  },
});

export const FormTemplates = addStory(DesignerTemplate, {
  formId: {
    name: 'form-templates',
    module: 'shesha',
  },
});

export const FormTemplateCreate = addStory(DesignerTemplate, {
  formId: {
    name: 'form-template-create',
    module: 'shesha',
  },
});

export const FormTemplateDetails = addStory(DesignerTemplate, {
  formId: {
    name: 'form-template-details',
    module: 'shesha',
  },
});

export const Autocomplete = addStory(DesignerTemplate, {
  formId: {
    name: 'autocomplete',
  },
});

export const Playground = addStory(DesignerTemplate, {
  formId: {
    name: 'playground-form',
  },
});

export const TestWizard = addStory(DesignerTemplate, {
  formId: 'a1dbe3d1-b560-431d-aa3f-dc39738e7200',
  // formId: {
  //   name: 'test-wizard-form',
  //   module: 'Shesha',
  // },
  // mode: 'readonly',
});

export const OrganisationEdit = addStory(DesignerTemplate, {
  formId: { name: '/organisations/edit', version: 1 },
});

export const PermissionedObjects = addStory(DesignerTemplate, {
  formId: { name: '/permissionedObject/webapi' },
});

export const ModelConfigurationEdit = addStory(DesignerTemplate, {
  formId: { name: 'model-configuration-edit' },
});

export const PermissionEdit = addStory(DesignerTemplate, {
  formId: { name: 'permission-edit' },
});

export const StyleFixEdit = addStory(DesignerTemplate, {
  formId: { name: 'facility-patient-flattened-table', module: 'Boxfusion.His.Clients.Houghton' },
});

export const CancelledVersion = addStory(DesignerTemplate, {
  formId: '04450959-c281-4853-9e16-c16666436ae0',
});

export const UselessForm = addStory(DesignerTemplate, {
  formId: '6b249510-a0de-427a-b9e8-fb66ede29b6e',
  // formId: { name: 'useless-form', module: 'Shesha' },
});

export const PersonEdit = addStory(DesignerTemplate, {
  formId: {
    name: '/persons/edit',
    version: 2,
  },
});

export const ComplexModel = addStory(DesignerTemplate, {
  formId: {
    name: 'test-nested',
    module: 'test'
  }
});
