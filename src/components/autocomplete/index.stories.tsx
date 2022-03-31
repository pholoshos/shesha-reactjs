import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import Autocomplete, { IAutocompleteProps } from './';
import { Button, Form } from 'antd';
import { addStory } from '../../stories/utils';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/Autocomplete',
  component: Autocomplete,
} as Meta;

interface IStoryArgs extends IAutocompleteProps {
  /**
   * Test Value, is used only by this story for the `Set Test Value Button`
   */
  testValue?: any;
  /**
   * Initial Value, is used only by this story
   */
  initialValue?: any;
}

interface ITemplateProps extends IStoryArgs {
  children: React.ReactNode;
}

const BaseTemplate: FC<ITemplateProps> = props => {
  const { testValue, children } = props;
  const label = 'Autocomplete';
  const name = 'autocomplete';
  const [state, setState] = useState(null);

  const [form] = Form.useForm();

  const onFinish = (data: any) => {
    console.log('onFinish data ', data);
    setState(data);
  };

  return (
    <StoryApp>
      <div style={{ width: 500 }}>
        <Form
          {...{
            labelCol: {
              xs: { span: 24 },
              md: { span: 8 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              md: { span: 16 },
              sm: { span: 16 },
            },
          }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item label={label} name={name} initialValue={props.initialValue}>
            {children}
          </Form.Item>

          {Boolean(testValue) && (
            <Button
              onClick={() =>
                form?.setFieldsValue({
                  [name]: testValue,
                })
              }
            >
              Set Test Value
            </Button>
          )}

          <Button onClick={() => form?.resetFields()} style={{ margin: '0 12px' }}>
            Reset
          </Button>

          <Button onClick={() => form?.submit()} type="primary">
            Submit
          </Button>
        </Form>
      </div>

      {Boolean(state) && (
        <div>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      )}
    </StoryApp>
  );
};

// Create a master template for mapping args to render the Button component
const RawTemplate: Story<IStoryArgs> = args => {
  const { testValue, initialValue, ...autocompleteProps } = args;
  return (
    <BaseTemplate {...args}>
      <Autocomplete.Raw {...autocompleteProps} />
    </BaseTemplate>
  );
};

const EntityDtoTemplate: Story<IStoryArgs> = args => {
  const { testValue, initialValue, ...autocompleteProps } = args;
  return (
    <BaseTemplate {...args}>
      <Autocomplete.EntityDto {...autocompleteProps} />
    </BaseTemplate>
  );
};

const singleEntityDtoBaseProps: IStoryArgs = {
  dataSourceType: 'url',
  dataSourceUrl: '/api/v1/BursMan/ScheduleVisits/MembersAutocomplete',
  testValue: {
    id: '291B86BE-27F1-41A0-8BFD-F867A3B38E32',
    displayText: 'Friday Green',
  },
};
//#region Single Entity DTO
export const SingleEntityDto = addStory(EntityDtoTemplate, {
  ...singleEntityDtoBaseProps,
});
//#endregion

//#region Single Entity DTO with initial value
export const SingleEntityDtoWithInitialValue = addStory(EntityDtoTemplate, {
  ...singleEntityDtoBaseProps,
  initialValue: {
    id: '6FB28E47-591E-46ED-90B5-13A88C69C759',
    displayText: 'Dimakatso Masetlane',
  },
});
//#endregion

//#region Single Entity DTO with initial value
export const SingleEntityDtoWithInitialValueReadOnly = addStory(EntityDtoTemplate, {
  ...singleEntityDtoBaseProps,
  readOnly: true,
  initialValue: {
    id: '6FB28E47-591E-46ED-90B5-13A88C69C759',
    displayText: 'Dimakatso Masetlane',
  },
});
//#endregion

const multipleEntityDtoBaseProps: IStoryArgs = {
  dataSourceType: 'url',
  dataSourceUrl: '/api/v1/BursMan/ScheduleVisits/MembersAutocomplete',
  mode: 'multiple',
  testValue: [
    {
      id: '7F3076A1-E766-41A4-A05B-90E70A01D8AE',
      displayText: 'Cinisile Mathonsi',
    },
    {
      id: '291B86BE-27F1-41A0-8BFD-F867A3B38E32',
      displayText: 'Friday Green',
    },
  ],
};

//#region Multiple Entity DTO
export const MultipleEntityDto = addStory(EntityDtoTemplate, {
  ...multipleEntityDtoBaseProps,
});
//#endregion

//#region Multiple Entity with initial value DTO
export const MultipleEntityDtoWithInitialValue = addStory(EntityDtoTemplate, {
  ...multipleEntityDtoBaseProps,
  initialValue: [
    {
      id: '42756BFC-0789-4AA3-91AC-68FEF3B8D5F1',
      displayText: 'DJ Khaled',
    },
    {
      id: '8DA3928A-6E03-4260-8961-C3D0B5A33C42',
      displayText: 'Jane Smith',
    },
  ],
});
//#endregion

//#region Multiple Entity with initial value DTO ReadOnly
export const MultipleEntityDtoWithInitialValueReadOnly = addStory(EntityDtoTemplate, {
  ...multipleEntityDtoBaseProps,
  readOnly: true,
  initialValue: [
    {
      id: '42756BFC-0789-4AA3-91AC-68FEF3B8D5F1',
      displayText: 'DJ Khaled',
    },
    {
      id: '8DA3928A-6E03-4260-8961-C3D0B5A33C42',
      displayText: 'Jane Smith',
    },
  ],
});
//#endregion

//#region Tags Entity DTO
export const TagsEntityDto = addStory(EntityDtoTemplate, {
  dataSourceType: 'url',
  dataSourceUrl: '/api/v1/BursMan/ScheduleVisits/MembersAutocomplete',
  mode: 'tags',
  testValue: [
    {
      id: '7F3076A1-E766-41A4-A05B-90E70A01D8AE',
      displayText: 'Cinisile Mathonsi',
    },
    {
      id: '291B86BE-27F1-41A0-8BFD-F867A3B38E32',
      displayText: 'Friday Green',
    },
  ],
});
//#endregion

//#region Single Raw
export const SingleRaw = addStory(RawTemplate, {
  dataSourceType: 'url',
  dataSourceUrl: '/api/v1/BursMan/ScheduleVisits/MembersAutocomplete',
  testValue: '7F3076A1-E766-41A4-A05B-90E70A01D8AE',
});
//#endregion

//#region Single Raw with initial value
export const SingleRawWithInitialValue = addStory(RawTemplate, {
  dataSourceType: 'url',
  dataSourceUrl: '/api/v1/BursMan/ScheduleVisits/MembersAutocomplete',
  testValue: '7F3076A1-E766-41A4-A05B-90E70A01D8AE',
  initialValue: '42756BFC-0789-4AA3-91AC-68FEF3B8D5F1',
});
//#endregion

//#region Multiple Raw
export const MultipleRaw = addStory(RawTemplate, {
  dataSourceType: 'url',
  dataSourceUrl: '/api/v1/BursMan/ScheduleVisits/MembersAutocomplete',
  mode: 'multiple',
  testValue: ['7F3076A1-E766-41A4-A05B-90E70A01D8AE', '42756BFC-0789-4AA3-91AC-68FEF3B8D5F1'],
});
//#endregion

//#region Multiple Raw with initial value
export const MultipleRawWithInitialValue = addStory(RawTemplate, {
  dataSourceType: 'url',
  dataSourceUrl: '/api/v1/BursMan/ScheduleVisits/MembersAutocomplete',
  mode: 'multiple',
  initialValue: ['7F3076A1-E766-41A4-A05B-90E70A01D8AE', '42756BFC-0789-4AA3-91AC-68FEF3B8D5F1'],
});
//#endregion
