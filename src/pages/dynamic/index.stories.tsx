import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import StoryApp from '../../components/storyBookApp';
import DynamicPage from './';
import { addStory } from '../../stories/utils';
import { IDynamicPageProps } from './interfaces';

export default {
  title: 'Pages/DynamicPage',
  component: DynamicPage,
  argTypes: {},
} as Meta;

const DEFAULT_ARGS: IDynamicPageProps = {
  path: 'mazi-form-view',
  id: 'a91b07fc-6f21-4fb5-a709-4f4357f1271f',
  mode: 'edit',
};

// Create a master template for mapping args to render the Button component
const Template: Story<IDynamicPageProps> = args => (
  <StoryApp>
    <DynamicPage {...args} />
  </StoryApp>
);

// Reuse that template for creating different stories
export const Basic = Template.bind({});

export const OtpSettings = addStory(Template, {
  path: 'mazi-form-view',
  mode: 'edit',
});

export const PersonEdit = addStory(Template, {
  path: 'mazi-form-view',
  id: 'a91b07fc-6f21-4fb5-a709-4f4357f1271f',
  mode: 'edit',
});

Basic.args = DEFAULT_ARGS;
