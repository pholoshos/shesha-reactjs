import { DesignerToolbarSettings } from '../../../../../interfaces';

export const settingsFormMarkup = new DesignerToolbarSettings()
  .addSectionSeparator({
    id: 'b8954bf6-f76d-4139-a850-c99bf06c8b69',
    name: 'separator1',
    parentId: 'root',
    label: 'Display',
    sectionName: '',
  })
  .addTextArea({
    id: 'b9857800-eb4d-4303-b1ac-6f9bc7f140ad',
    name: 'content',
    parentId: 'root',
    label: 'Content',
    validate: {
      required: true,
    },
  })
  .addDropdown({
    id: '6d29cf2c-96fe-40ce-be97-32e9f5d0fe40',
    name: 'contentType',
    parentId: 'root',
    label: 'Content type',
    values: [
      {
        label: 'Secondary',
        value: 'secondary',
        id: '32ebcc5b-6775-4b34-b856-d7ed42f33c3b',
      },
      {
        label: 'Success',
        value: 'success',
        id: 'f3622f5e-3dc3-452b-aa57-2273f65b9fdc',
      },
      {
        label: 'Warning',
        value: 'warning',
        id: '3e6a5ac8-bf51-48fb-b5c1-33ba455a1246',
      },
      {
        label: 'Danger',
        value: 'danger',
        id: '4b3830fa-6b2a-4493-a049-2a4a5be4b0a4',
      },
    ],
    dataSourceType: 'values',
  })
  .addCheckbox({
    id: '3cd922a6-22b2-435f-8a46-8cca9fba8bea',
    name: 'code',
    parentId: 'root',
    label: 'Code style?',
  })
  .addCheckbox({
    id: 'aa17f452-0b07-473a-9c7a-986dfc2d37d9',
    name: 'italic',
    parentId: 'root',
    label: 'Italic',
  })
  .addCheckbox({
    id: '43f91890-9728-47f3-9694-3d893d820c86',
    name: 'copyable',
    parentId: 'root',
    label: 'Copyable?',
  })

  .addCheckbox({
    id: '96f479b7-8ebc-4cda-a0b8-ecb4c7fe3a5d',
    name: 'delete',
    parentId: 'root',
    label: 'Delete?',
  })
  .addCheckbox({
    id: '3a97e341-7f20-4479-9fa6-d8086e8b9a17',
    name: 'ellipsis',
    parentId: 'root',
    label: 'Ellipsis?',
  })
  .addCheckbox({
    id: '23f1f1d7-7eb8-440b-8620-bb059b6938e4',
    name: 'mark',
    parentId: 'root',
    label: 'Marked style?',
  })
  .addCheckbox({
    id: '9a94a3ad-c833-438d-9ea8-1196f2ae1c64',
    name: 'underline',
    parentId: 'root',
    label: 'Underline?',
  })
  .addDropdown({
    id: 'ccea671b-9144-4266-9cd7-64495cbc6910',
    name: 'level',
    parentId: 'root',
    label: 'Level',
    values: [
      {
        label: 'H1',
        value: '1',
        id: '81f0cd35-45b0-4d3e-8960-b6c9c3f7fb6f',
      },
      {
        label: 'H2',
        value: '2',
        id: 'a19ccf4a-27f0-45ae-819a-779668370639',
      },
      {
        label: 'H3',
        value: '3',
        id: '6a755f46-09a6-4e5e-b9fe-8617be7ef8e1',
      },
      {
        label: 'H4',
        value: '4',
        id: '3f8460ca-f50a-4cba-9b5d-6a2b02be14d2',
      },
      {
        label: 'H5',
        value: '5',
        id: '186a71a8-ead4-4bed-8a3b-bc197faac998',
      },
    ],
    dataSourceType: 'values',
  })
  .addSectionSeparator({
    id: '6befdd49-41aa-41d6-a29e-76fa00590b75',
    name: 'sectionStyle',
    parentId: 'root',
    label: 'Style',
    sectionName: '',
  })
  .addCodeEditor({
    id: '06ab0599-914d-4d2d-875c-765a495472f8',
    name: 'style',
    label: 'Style',
    parentId: 'root',
    validate: {},
    settingsValidationErrors: [],
    description: 'A script that returns the style of the element as an object. This should conform to CSSProperties',
    exposedVariables: [
      { id: '06ab0599-914d-4d2d-875c-765a495472f6', name: 'data', description: 'Form values', type: 'object' },
    ],
    mode: 'dialog',
  })
  .toJson();
