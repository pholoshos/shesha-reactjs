import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import FormDesigner from './formDesigner';
import { FormProvider, MetadataDispatcherProvider } from '../../providers';
// @ts-ignore
import { formGetByPath, formTestDelayGet, formTestDelayPost, formUpdateMarkup } from '../../apis/form';
import { addStory } from '../../stories/utils';
import { FormMode } from '../../providers/form/models';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/Temp/FormDesigner',
  component: FormDesigner,
} as Meta;

export interface IFormDesignerStoryProps {
  formPath?: string;
  formId?: string;
  mode?: FormMode;
}

// Create a master template for mapping args to render the Button component
const DesignerTemplate: Story<IFormDesignerStoryProps> = ({ formPath, formId, mode = 'designer' }) => (
  <StoryApp>
    <MetadataDispatcherProvider>
      <FormProvider path={formPath} id={formId} mode={mode}>
        <FormDesigner />
      </FormProvider>
    </MetadataDispatcherProvider>
  </StoryApp>
);

export const PersonEdit = addStory(DesignerTemplate, {
  formPath: '/persons/edit',
});

export const PersonDetails = addStory(DesignerTemplate, {
  formPath: '/persons/details',
});

export const FormsIndexOld = addStory(DesignerTemplate, {
  formPath: 'forms-v2',
});

export const FormsIndexNew = addStory(DesignerTemplate, {
  formPath: 'forms',
});

export const Playground = addStory(DesignerTemplate, {
  formPath: 'playground-form',
});