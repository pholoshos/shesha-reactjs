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
