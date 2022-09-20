import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import FormDesigner from './formDesigner';
import { FormProvider } from '../../providers';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/TestFormDesigner',
  component: FormDesigner,
} as Meta;

export interface IFormDesignerStoryProps {
  formPath: string;
}

// Create a master template for mapping args to render the Button component
const Template: Story<IFormDesignerStoryProps> = args => (
  <StoryApp>
    <FormProvider name={args.formPath} mode="designer">
      <FormDesigner />
    </FormProvider>
  </StoryApp>
);

export const TableContextProps = Template.bind({});

TableContextProps.args = {
  formPath: '/reports/reporting-report/add-parameter',
};

export const IndexPage = Template.bind({});
const indexPageProps: IFormDesignerStoryProps = {
  formPath: '/indexTable',
};
IndexPage.args = { ...indexPageProps };
