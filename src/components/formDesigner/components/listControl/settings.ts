import { DesignerToolbarSettings } from '../../../../interfaces/toolbarSettings';

export const listSettingsForm = new DesignerToolbarSettings()
  .addSectionSeparator({
    id: 'b8954bf6-f76d-4139-a850-c99bf06c8b69',
    name: 'separator1',
    parentId: 'root',
    label: 'Display',
    sectionName: '',
  })
  .addPropertyAutocomplete({
    id: '5c813b1a-04c5-4658-ac0f-cbcbae6b3bd4',
    name: 'name',
    parentId: 'root',
    label: 'Name',
    validate: { required: true },
  })
  .addCheckbox({
    id: '65aef83a-ea37-480a-9d77-ee4f4e229a70',
    name: 'hideLabel',
    parentId: 'root',
    label: 'Hide label?',
  })
  .addCheckbox({
    id: '49b76c8f-c26f-48f9-8122-aa94dfe53b98',
    name: 'bordered',
    parentId: 'root',
    label: 'Bordered',
  })
  .addTextField({
    id: '2d2c4546-6512-4e89-aca8-9f50568bcc25',
    name: 'title',
    label: 'Title',
  })
  .addTextField({
    id: '5ea4dc3d-46ff-4cef-842f-ced7e6410a49',
    name: 'footer',
    label: 'Footer',
  })
  .addSectionSeparator({
    id: '14a4ff65-25a1-487b-bb2a-af287f3b1293',
    name: 'separatorData',
    parentId: 'root',
    label: 'Display',
    sectionName: '',
  })
  .addDropdown({
    id: 'f3d38650-475c-45fd-a748-3b336e6e9f77',
    name: 'dataSource',
    parentId: 'root',
    hidden: false,
    customVisibility: null,
    description: 'The list data to be used can be the data that comes with the form of can be fetched from the API',
    label: 'Size',
    useRawValues: false,
    dataSourceType: 'values',
    values: [
      { id: 'e98bd235-04c9-4acf-b4e2-d45ee7f64195', label: 'form', value: 'form' },
      { id: 'f6f884b2-57f0-4246-83fa-0c12931b1320', label: 'api', value: 'api' },
    ],
    validate: { required: true },
  })
  .addDropdown({
    id: 'c1ce809e-14f0-4a31-b914-6971d62ec532',
    name: 'renderStrategy',
    parentId: 'root',
    hidden: false,
    customVisibility: null,
    description:
      'Which form should be used to render the data? If current form, you can drag items, else specify form path',
    label: 'Render Strategy',
    useRawValues: false,
    dataSourceType: 'values',
    values: [
      { id: '1b2cd084-11c3-4437-a681-672ed5ebb296', label: 'Drag And Drop', value: 'dragAndDrop' },
      { id: 'bfb75690-d6f6-414e-b4de-4156d2038265', label: 'External Form', value: 'externalForm' },
    ],
    validate: { required: true },
  })
  .addAutocomplete({
    id: 'f722680e-1ae6-4050-82ce-171f27e96d56',
    name: 'formPath',
    parentId: 'root',
    hidden: false,
    customVisibility: "return data.renderStrategy === 'externalForm'",
    description: 'Specify the form that will be rendered on this list component',
    label: 'Form Path',
    useRawValues: false,
    validate: { required: true },
    dataSourceType: 'entitiesList',
    dataSourceUrl: '/api/services/app/Metadata/EntityTypeAutocomplete',
    queryParams: [],
  })
  .addCodeEditor({
    name: 'dataSourceUrl',
    id: 'b469c1f1-8c47-457b-a7d5-5f323b3bc4a6',
    mode: 'inline',
    customVisibility: "return data.dataSource ==='api'",
    description: 'The API url that will be used to fetch the list data',
    exposedVariables: [
      {
        id: '788673a5-5eb9-4a9a-a34b-d8cea9cacb3c',
        name: 'data',
        description: 'Form data',
        type: 'object',
      },
      {
        id: '65b71112-d412-401f-af15-1d3080f85319',
        name: 'globalState',
        description: 'The global state',
        type: 'object',
      },
      {
        id: '3633b881-43f4-4779-9f8c-da3de9ecf9b8',
        name: 'queryParams',
        description: 'Query parameters',
        type: 'object',
      },
    ],
  })
  .addSectionSeparator({
    id: 'd9f673f9-dd6c-4816-afe4-3a58849b528d',
    name: 'separatorDateEnd',
    parentId: 'root',
    label: '',
    sectionName: '',
  })
  .addDropdown({
    id: '9ae0cf7c-17e9-4348-ba8b-706d30f92eb5',
    name: 'size',
    parentId: 'root',
    hidden: false,
    customVisibility: null,
    label: 'Size',
    useRawValues: false,
    dataSourceType: 'values',
    values: [
      { id: 'df84fc42-6376-4545-9403-ee0389447047', label: 'small', value: 'small' },
      { id: 'eaf35d30-28c5-41aa-9a33-cc2d183f6c5a', label: 'default', value: 'default' },
      { id: '51623926-7377-4e91-b95e-ae2a3f836b92', label: 'large', value: 'large' },
    ],
    validate: { required: true },
  })
  .addSectionSeparator({
    id: 'a6938bc7-d635-4f85-8773-709fe29cc614',
    name: 'separatorPagination',
    parentId: 'root',
    label: 'Pagination',
    sectionName: '',
  })
  .addCheckbox({
    id: 'c94b5f19-094d-479d-991b-f24c7768bdf5',
    name: 'showPagination',
    parentId: 'root',
    label: 'Show pagination',
  })
  .addContainer({
    id: 'b573b06d-a159-4d87-97ff-9fc0cfdc71ea',
    name: 'paginationContainer',
    parentId: 'root',
    direction: 'vertical',
    components: new DesignerToolbarSettings()
      .addCheckbox({
        id: '6d8d3c56-73b7-425b-85fe-5a1b6cb49350',
        label: 'Show Quick Jumper',
        name: 'paginationShowQuickJumper',
        parentId: 'b573b06d-a159-4d87-97ff-9fc0cfdc71ea',
      })
      .addCheckbox({
        id: '6d8d3c56-73b7-425b-85fe-5a1b6cb49350',
        label: 'Responsive',
        name: 'paginationResponsive',
        parentId: 'b573b06d-a159-4d87-97ff-9fc0cfdc71ea',
      })
      .addDropdown({
        id: '9e8018a5-eb00-4a1c-a09b-19273e2ff602',
        name: 'paginationSize',
        parentId: 'b573b06d-a159-4d87-97ff-9fc0cfdc71ea',
        hidden: false,
        customVisibility: null,
        label: 'Pagination size',
        useRawValues: false,
        dataSourceType: 'values',
        values: [
          { id: '357a0656-2faf-4623-bde3-0f3845377692', label: 'default', value: 'default' },
          { id: 'd6cdf31f-d05f-4e8b-a9ab-643386d37e13', label: 'small', value: 'small' },
        ],
        validate: { required: true },
      })
      .addDropdown({
        id: 'f6c3d710-8d98-47fc-9fe2-7c6312e9a03c',
        name: 'paginationPosition',
        parentId: 'b573b06d-a159-4d87-97ff-9fc0cfdc71ea',
        hidden: false,
        customVisibility: null,
        label: 'Position',
        useRawValues: false,
        dataSourceType: 'values',
        values: [
          { id: '6678b10f-ffd6-4c01-943a-c6b6b30e7f6e', label: 'top', value: 'top' },
          { id: '73ec0fbc-4e5b-4d8d-971e-4bc0af3848c9', label: 'bottom', value: 'bottom' },
          { id: '7631b842-7f18-4e29-b03f-b37caed5901b', label: 'both', value: 'both' },
        ],
        validate: { required: true },
      })
      .addTextField({
        id: '77b65196-3f9b-4a54-b6ce-463767c51234',
        name: 'paginationRole',
        label: 'Role',
        parentId: 'b573b06d-a159-4d87-97ff-9fc0cfdc71ea',
      })
      .addNumberField({
        id: '90b73fb7-f400-4a33-8690-78602b8ef1c9',
        name: 'paginationTotalBoundaryShowSizeChanger',
        label: 'Total Boundary Show Size Changer',
        parentId: 'b573b06d-a159-4d87-97ff-9fc0cfdc71ea',
      })
      .toJson(),
  })
  .addSectionSeparator({
    id: '49372e55-a607-4c20-bbe4-48ca19a816bd',
    name: 'separatorEndOfPagination',
    parentId: 'root',
    label: 'Pagination',
    sectionName: '',
  })
  .addSectionSeparator({
    id: 'bc67960e-77e3-40f2-89cc-f18f94678cce',
    name: 'separatorVisibility',
    parentId: 'root',
    label: 'Visibility',
    sectionName: 'Visibility',
  })
  .addTextArea({
    id: '03959ffd-cadb-496c-bf6d-b742f7f6edc6',
    name: 'customVisibility',
    parentId: 'root',
    label: 'Custom Visibility',
    autoSize: false,
    showCount: false,
    allowClear: false,
    description:
      'Enter custom visibility code.  You must return true to show the component. The global variable data is provided, and allows you to access the data of any form component, by using its API key.',
  })
  .toJson();
