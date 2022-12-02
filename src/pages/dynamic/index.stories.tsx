import React, { useState } from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import StoryApp from '../../components/storyBookApp';
import DynamicPage from './';
import { addStory } from '../../stories/utils';
import { IDynamicPageProps } from './interfaces';
import { MainLayout } from '../..';
import { Button } from 'antd';

export default {
  title: 'Pages/DynamicPage',
  component: DynamicPage,
  argTypes: {},
} as Meta;

const DEFAULT_ARGS: IDynamicPageProps = {
  formId: { name: 'mazi-form-view' },
  id: 'a91b07fc-6f21-4fb5-a709-4f4357f1271f',
  mode: 'edit',
};

// Create a master template for mapping args to render the Button component
const Template: Story<IDynamicPageProps> = args => (
  <StoryApp>
    <MainLayout>
      <DynamicPage {...args} />
    </MainLayout>
  </StoryApp>
);

// Reuse that template for creating different stories
export const Basic = Template.bind({});

export const RoleDetailsPage = addStory(Template, {
  formId: { name: 'role-details' },
  id: '81ae1b5a-4121-429b-89fa-06ec3a549e54',
});

export const WardDetailsPage = addStory(Template, {
  formId: { name: 'warddetails', module: 'Boxfusion.His.Clients.Houghton' },
  id: '1b38f1cf-df7a-4d46-8555-4362753d8e17',
});

export const UserManagementPage = addStory(Template, {
  formId: { name: 'user-management-new' },
});

export const PersonDetailsPage = addStory(Template, {
  formId: { name: 'person-details', module: 'shesha' },
  id: '98273D2D-F59E-42A3-9D8A-0218874548A9',
  mode: 'edit',
});

export const SubFormPage = addStory(Template, {
  formId: { name: 'sub-form' },
  mode: 'edit',
});

export const PersonListPage = addStory(Template, {
  formId: { name: 'person-list' },
  //mode: 'edit',
});

export const FormsIndexPage = addStory(Template, {
  formId: { name: 'forms', module: 'shesha' },
  mode: 'edit',
});

export const FormDetailsPage = addStory(Template, {
  formId: { name: 'form-details', module: 'Shesha' },
  mode: 'readonly',
  id: 'ca8eb327-c110-41f5-be92-06c0afa7a6d8',
});

export const FormsTemplatesIndexPage = addStory(Template, {
  formId: { name: 'form-templates', module: 'Shesha' },
  mode: 'edit',
});

export const FormTemplateDetailsPage = addStory(Template, {
  formId: { name: 'form-template-details', module: 'Shesha' },
  mode: 'edit',
});

export const ModulesIndexPage = addStory(Template, {
  formId: { name: 'modules', module: 'Shesha' },
  mode: 'edit',
});

export const ModuleDetailsPage = addStory(Template, {
  formId: { name: 'module-details', module: 'Shesha' },
  mode: 'edit',
});

export const MissingPage = addStory(Template, {
  formId: { name: 'dummy' },
  mode: 'edit',
});

export const WizardForm = addStory(Template, {
  formId: { name: 'mazi-form-view' },
  mode: 'edit',
});

export const WizardDebugForm = addStory(Template, {
  formId: {
    name: 'mazi-form-view-debug',
  },
});

export const PersonForm = addStory(Template, {
  formId: { name: '/persons/edit' },
  mode: 'edit',
  id: 'a13c1379-263f-4ec6-ab6b-1f3066f49ef1',
});

export const OrganisationEdit = addStory(Template, {
  formId: { name: '/organisations/edit', version: 1 },
  id: '1C0558C5-8A67-48D8-9A06-F49DBED2187D',
  mode: 'edit',
});

export const PermissionedObject = addStory(Template, {
  formId: { name: '/permissionedObject/webapi' },
  mode: 'edit',
});

export const ModelConfigurationEdit = addStory(Template, {
  formId: { name: 'model-configuration-edit' },
  id: 'BD6F85B7-43C0-411A-BFBB-67E7D5754EE8',
  mode: 'edit',
});

export const WardsIndex = addStory(Template, {
  formId: {
    module: 'Boxfusion.His.Clients.Houghton',
    name: 'wardsTable',
  },
  mode: 'readonly',
});

export const FormDesigner = addStory(Template, {
  formId: {
    module: 'Boxfusion.His.Clients.Houghton',
    name: 'wardsTable'
  },
  mode: 'readonly',
});

export const Performance = addStory(Template, {
  formId: {
    module: 'Boxfusion.His.Clients.Houghton',
    name: 'billing-management-details',
  },
  mode: 'readonly',
  id: '0dee0b4a-48eb-4a81-86f1-192175c284ae',
});


export const ComplexModel = addStory(Template, {
  formId: {
    module: 'test',
    name: 'test-nested',
  },
  mode: 'readonly',
  id: '6a8c3704-8aca-4878-8db6-f4f55d5cc5d5',
});

export const MissingForm = addStory(Template, {
  formId: {
    module: 'test',
    name: 'test-nested1',
  },
  mode: 'readonly',
  id: '6a8c3704-8aca-4878-8db6-f4f55d5cc5d5',
});

export const MissingEntity = addStory(Template, {
  formId: {
    module: 'test',
    name: 'test-nested',
  },
  mode: 'readonly',
  id: '6a8c3704-8aca-4878-8db6-f4f55d5cc555',
});

Basic.args = DEFAULT_ARGS;

const Template2: Story<{}> = () => {
  const pages: IDynamicPageProps[] = [
    {
      formId: { name: 'form-details', module: 'test' },
      mode: 'edit',
      id: '265b4645-affe-4b4e-a364-3f0e8062eb80'
    },
    {
      formId: { name: 'modules', module: 'Shesha' },
      mode: 'edit',
    },
    {
      formId: { name: 'module-details', module: 'Shesha' },
      mode: 'edit',
      id: '8ab76d87-9c37-41ce-9919-34d7fc8828b3',
    },
    {
      formId: { name: 'forms', module: 'Shesha' },
      mode: 'edit',
    },
    {
      formId: { name: 'form-details', module: 'Shesha' },
      mode: 'edit',
      id: '4e8c53ea-1257-4f82-bafb-021f11b0dbfc',
    },
  ];
  const [page, setPage] = useState(0);

  const onClick = () => {
    const nextPage = page >= pages.length - 1 ? 0 : page + 1;
    setPage(nextPage);
  };

  return (
    <StoryApp>
      <MainLayout>
        <Button onClick={onClick}>Change</Button>
        <DynamicPage {...pages[page]} />
      </MainLayout>
    </StoryApp>
  );
};

export const Pages = addStory(Template2, {});
