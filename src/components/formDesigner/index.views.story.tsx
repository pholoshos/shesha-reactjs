import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import { FormProvider } from '../../providers';
// import { addStory } from '../../stories/utils';
import FormDesigner from './formDesigner';
import ConfigurableForm from '../configurableForm';
import { IConfigurableFormProps } from '../configurableForm/models';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/FormDesigner/Views',
  component: ConfigurableForm,
} as Meta;

const configurableFormProps: IConfigurableFormProps = {
  mode: 'designer',
};

// Create a master template for mapping args to render the Button component
const BasicTemplate: Story<IConfigurableFormProps> = ({ path, mode, id }) => {
  return (
    <StoryApp>
      <FormProvider id={id} path={path} mode={mode}>
        <FormDesigner />
      </FormProvider>
    </StoryApp>
  );
};

// Reuse that template for creating different stories
export const Basic = BasicTemplate.bind({ path: 'table-cbfdec6c-8fe5-4d35-b067-6c00de8ba311' });
Basic.args = configurableFormProps;
