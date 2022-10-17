import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import StoryApp from '../../components/storyBookApp';
import DynamicPage from './';
import { addStory } from '../../stories/utils';
import { IDynamicPageProps } from './interfaces';
import { MainLayout } from '../..';

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
  id: '81ae1b5a-4121-429b-89fa-06ec3a549e54'
});

export const PersonsIndexPage = addStory(Template, {
  formId: { name: 'persons', module: 'shesha' },
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
  mode: 'edit',
  id: '7545b898-e3b1-42a8-9404-00ee56ade384',
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
  }
});

export const PersonForm = addStory(Template, {
  formId: { name: 'person-form' },
  mode: 'edit',
});

export const OrganisationEdit = addStory(Template, {
  formId: { name: '/organisations/edit' },
  id: '1C0558C5-8A67-48D8-9A06-F49DBED2187D',
  mode: 'edit',
});

Basic.args = DEFAULT_ARGS;
