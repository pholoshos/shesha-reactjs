import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import FormDesigner from './formDesigner';
import { /*MetadataProvider,*/ FormProvider, useSheshaApplication, MetadataDispatcherProvider } from '../../providers';
import { Button, Select } from 'antd';
// @ts-ignore
import { formGetByPath, formTestDelayGet, formTestDelayPost, formUpdateMarkup } from '../../apis/form';
import allFormsJson from './allForms.json';
import { LabeledValue } from 'antd/lib/select';
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

//#region TableContextProps
export const TableContextProps = DesignerTemplate.bind({});

TableContextProps.args = {
  formPath: '/settings/forms/playground',
};
//#endregion

export const ColumnProps = addStory(DesignerTemplate, {
  //formPath: 'D:\\Boxfusion\\Shesha3\\opensource\\shesha-reactjs\\src\\components\\formDesigner\\components\\dataTable\\table\\columnsEditor\\columnSettings.json'
  formId: '70D82B7E-73AD-4EB1-A445-F569CEC771E0',
});

//#region for refactoring only

export interface IActionsTemplateProps {
  formPath: string;
}
const ActionsTemplate: Story<IActionsTemplateProps> = props => {
  return (
    <StoryApp>
      <ActionsTemplateContent {...props} />
    </StoryApp>
  );
};

const ActionsTemplateContent: FC<IActionsTemplateProps> = props => {
  const { backendUrl, httpHeaders } = useSheshaApplication();

  const [form, setForm] = useState(null);

  const onLoadClick = () => {
    formGetByPath({ path: props.formPath }, { base: backendUrl, headers: httpHeaders })
      .then(response => {
        console.log({ msg: 'loaded', response });
        setForm(response.result);
      })
      .catch(error => {
        console.log({ msg: 'failed to load', error });
      });
  };

  const onSaveClick = () => {
    if (!Boolean(form)) {
      console.log('Form not loaded!');
      return;
    }

    formUpdateMarkup(form, { id: form.id, base: backendUrl, headers: httpHeaders })
      .then(response => {
        console.log({ msg: 'form saved', response });
      })
      .catch(err => {
        console.log({ msg: 'form save failed', error: err });
      });
  };

  const onPostClick = () => {
    formTestDelayPost({ queryParams: { delayMs: 200 }, base: backendUrl, headers: httpHeaders })
      .then(response => {
        console.log({ msg: 'post success', response });
      })
      .catch(error => {
        console.log({ msg: 'post failed', error });
      });
  };

  const onGetClick = () => {
    formTestDelayGet({ delayMs: 500 }, { base: backendUrl, headers: httpHeaders })
      .then(response => {
        console.log({ msg: 'get success', response });
      })
      .catch(err => {
        console.log({ msg: 'get failed', error: err });
      });
  };

  return (
    <div>
      <Button onClick={onLoadClick}>Load form by path</Button>
      <Button onClick={onSaveClick}>Save form</Button>

      <Button onClick={onPostClick}>Test Post</Button>
      <Button onClick={onGetClick}>Test Get</Button>
    </div>
  );
};

export const RefactoringActions = ActionsTemplate.bind({});
const refactoringArgs: IActionsTemplateProps = {
  formPath: '/indexTable',
};
RefactoringActions.args = refactoringArgs;

//#endregion

export const SectionsUsage = addStory(DesignerTemplate, {
  formPath: '/settings/forms/playground',
});

export const QueryBuilderSettings = addStory(DesignerTemplate, {
  formId: '7490f400-1d50-47f7-ab84-97625e67ea29',
});

export const TableViewSettings = addStory(DesignerTemplate, {
  formId: '6f0f3e5c-c173-46c2-bb52-5b8d584068c5',
});

export const IndexPageWithEntityType = addStory(DesignerTemplate, {
  formPath: '/indexTable',
});

export const IndexPageWithTableConfig = addStory(DesignerTemplate, {
  formPath: '/index-page-with-config',
});

export const TableContext = addStory(DesignerTemplate, {
  formPath:
    'D:\\Boxfusion\\Shesha3\\opensource\\metadata\\shesha-reactjs_etalon\\src\\components\\formDesigner\\components\\dataTable\\tableContext\\settingsForm.json',
});
export const AutocompleteProps = addStory(DesignerTemplate, {
  formPath:
    'D:\\Boxfusion\\Shesha3\\opensource\\metadata\\shesha-reactjs_etalon\\src\\components\\formDesigner\\components\\autocomplete\\settingsForm.json',
});
export const CodeEditorProps = addStory(DesignerTemplate, {
  formPath:
    'D:\\Boxfusion\\Shesha3\\opensource\\metadata\\shesha-reactjs_etalon\\src\\components\\formDesigner\\components\\codeEditor\\settingsForm.json',
});

export const FormSettings = addStory(DesignerTemplate, {
  formPath:
    'D:\\Boxfusion\\Shesha3\\opensource\\metadata\\shesha-reactjs_etalon\\src\\components\\formDesigner\\formSettings.json',
});

export const PersonEdit = addStory(DesignerTemplate, {
  formPath: '/persons/edit',
});

export const PersonDetails = addStory(DesignerTemplate, {
  formPath: '/persons/details',
});

export const ModelItemProps = addStory(DesignerTemplate, {
  formPath:
    'D:\\Boxfusion\\Shesha3\\opensource\\metadata\\shesha-reactjs\\src\\components\\modelConfigurator\\propertiesEditor\\itemSettings.json',
});

export const ModelGroupProps = addStory(DesignerTemplate, {
  formPath:
    'D:\\Boxfusion\\Shesha3\\opensource\\metadata\\shesha-reactjs\\src\\components\\modelConfigurator\\propertiesEditor\\groupSettings.json',
});

export const PropertyProps = addStory(DesignerTemplate, {
  formId: '97a5ba27-a3a4-4651-92b1-07bfe1debb2c',
});

export const DynamicViewProps = addStory(DesignerTemplate, {
  formPath:
    'D:\\Boxfusion\\Shesha3\\opensource\\etalon\\shesha-reactjs\\src\\components\\formDesigner\\components\\dynamicView\\settingsForm.json',
});

export const Empty = addStory(DesignerTemplate, {
  formPath: 'empty',
});

interface FormInfo {
  name: string;
  path: string;
  id: string;
}
export const FormsEditor: FC = () => {
  const [currentForm, setCurrentForm] = useState(null);
  const forms = allFormsJson as FormInfo[];
  const options = forms.map<LabeledValue>(f => ({
    value: f.id,
    label: f.name,
  }));
  return (
    <div>
      <div>
        <Select<LabeledValue>
          showSearch
          optionFilterProp="label"
          style={{ width: '100%' }}
          options={options}
          labelInValue={true}
          onChange={value => setCurrentForm(value.value)}
        />
      </div>
      <div>
        Designer {currentForm}
        {currentForm && (
          <MetadataDispatcherProvider>
            <FormProvider id={currentForm} mode="designer">
              <FormDesigner />
            </FormProvider>
          </MetadataDispatcherProvider>
        )}
      </div>
    </div>
  );
};

const BrowserTemplate: Story = () => (
  <StoryApp>
    <FormsEditor />
  </StoryApp>
);

export const Browser = addStory(BrowserTemplate, null);

//#region Views
export const TableView = DesignerTemplate.bind({});

TableView.args = {
  // formPath: '/view/forms/table',
  // formPath: '/view/table/playground',
  formPath: 'test-new-table',
  // formPath: 'table-cbfdec6c-8fe5-4d35-b067-6c00de8ba311',
  modelType: 'table',
  // vi
};

export const DetailsView = DesignerTemplate.bind({});

DetailsView.args = {
  // formPath: '/view/forms/details',
  formPath: 'view-details-testing',
  modelType: 'details',
};

export const FormComponentView = DesignerTemplate.bind({});

FormComponentView.args = {
  formPath: '/view/forms/form',
  modelType: 'form',
};

export const BlankView = DesignerTemplate.bind({});

export const ReadOnlyForm = DesignerTemplate.bind({});

// BlankView.args = {
//   formPath: '/view/forms/blank',
//   modelType: 'blank',
// };

BlankView.args = {
  formPath: 'area-index-child-table-test',
  // formPath: '/view/test/typography',
  modelType: 'blank',
};

ReadOnlyForm.args = {
  formPath: '/settings/forms/playground',
  // formPath: '/view/test/typography',
  modelType: 'blank',
};

export const ExportJSONDemo = DesignerTemplate.bind({});

ExportJSONDemo.args = {
  formPath: 'blank-form-index',
  modelType: 'blank',
};

//#endregion
