import { DesignerToolbarSettings } from "../../../interfaces/toolbarSettings";

export const dialogArgumentsForm = new DesignerToolbarSettings()
  .addTextField({
    id: '12C40CB0-4C60-4171-9380-01D51FDF6212',
    name: 'modalTitle',
    //parentId: 'root',
    label: 'Title',
    validate: { required: true },
  })
  .addAutocomplete({
    id: "adbc3b29-9a53-4305-869a-f37ba6e8bb94",
    name: "formId",
    label: "Modal form",
    validate: {
      required: true
    },
    dataSourceType: "entitiesList",
    entityTypeShortAlias: "Shesha.Core.FormConfiguration",
    entityDisplayProperty: "configuration.name",
    useRawValues: true,
    queryParams: null,
  })
  .addCheckbox({
    id: "c815c322-ba5d-4062-9736-e5d03c724134",
    name: "showModalFooter",
    label: "Show Modal Buttons",
  })
  .addDropdown({
    id: "f15848e8-87fa-4d76-b5a4-8548b8c2dd8b",
    name: "submitHttpVerb",
    label: "Submit Http Verb",
    values: [
      {
        label: "POST",
        value: "POST",
        id: "8418606a-d85d-4795-a2ee-4a69fcc656f9"
      },
      {
        label: "PUT",
        value: "PUT",
        id: "64bbca8a-2fb1-4448-ab71-3db077233bd2"
      }
    ],
    dataSourceType: "values",
    customVisibility: "return data.showModalFooter === true",
    defaultValue: ["POST"],
    useRawValues: true,
  })
  .addLabelValueEditor({
    id: "b395c0e9-dbc1-44f1-8fef-c18a49442871",
    name: "additionalProperties",
    label: "Additional properties",
    labelTitle: "Key",
    labelName: "key",
    valueTitle: "Value",
    valueName: "value",
    description: "Additional properties you want to be passed when the form gets submitted like parentId in the case where the modal is used in a childTable. Also note you can use Mustache expression like {{id}} for value property"
  })
  .addNumberField({
    id: "264903ff-b525-4a6e-893f-d560b219df9d",
    name: "modalWidth",
    label: "Width",
    customVisibility: "return data.showModalFooter === true"
  })
  .toJson();

/*
          {
            "id": "a8b80cb4-b214-40e9-8289-0792376672ee",
            "type": "textField",
            "name": "modalTitle",
            "label": "Title",
            "labelAlign": "right",
            "parentId": "fe4b3c03-3e0b-410f-8a9d-93db02ca51ed",
            "hidden": false,
            "customVisibility": null,
            "validate": {
              "required": true
            }
          },
          {
            "id": "adbc3b29-9a53-4305-869a-f37ba6e8bb94",
            "type": "autocomplete",
            "name": "modalFormId",
            "label": "Modal form",
            "labelAlign": "right",
            "parentId": "fe4b3c03-3e0b-410f-8a9d-93db02ca51ed",
            "hidden": false,
            "customVisibility": null,
            "validate": {
              "required": true
            },
            "dataSourceType": "entitiesList",
            "entityTypeShortAlias": "Shesha.Core.FormConfiguration",
            "entityDisplayProperty": "configuration.name",
            "useRawValues": true
          },
          {
            "id": "2ab34541-6fa0-4be2-bb1e-eb65ec63b353",
            "type": "textField",
            "name": "modalActionOnSuccess",
            "label": "Action on success",
            "labelAlign": "right",
            "parentId": "fe4b3c03-3e0b-410f-8a9d-93db02ca51ed",
            "hidden": true,
            "customVisibility": null,
            "validate": {}
          },
          {
            "id": "c815c322-ba5d-4062-9736-e5d03c724134",
            "type": "checkbox",
            "name": "showModalFooter",
            "parentId": "fe4b3c03-3e0b-410f-8a9d-93db02ca51ed",
            "label": "Show Modal Buttons",
            "defaultChecked": false
          },
          {
            "id": "ae69ab38-65fa-4b34-a701-3b46aff045f5",
            "type": "checkbox",
            "name": "refreshTableOnSuccess",
            "parentId": "fe4b3c03-3e0b-410f-8a9d-93db02ca51ed",
            "label": "Refresh table on success?",
            "defaultChecked": false
          },
          {
            "id": "f15848e8-87fa-4d76-b5a4-8548b8c2dd8b",
            "type": "dropdown",
            "name": "submitHttpVerb",
            "parentId": "fe4b3c03-3e0b-410f-8a9d-93db02ca51ed",
            "label": "Submit Http Verb",
            "values": [
              {
                "label": "POST",
                "value": "POST",
                "id": "8418606a-d85d-4795-a2ee-4a69fcc656f9"
              },
              {
                "label": "PUT",
                "value": "PUT",
                "id": "64bbca8a-2fb1-4448-ab71-3db077233bd2"
              }
            ],
            "dataSourceType": "values",
            "customVisibility": "return data.showModalFooter === true",
            "defaultValue": ["POST"]
          },
          {
            "id": "e669632e-55e0-46f4-9585-9e81ef0ae174",
            "type": "textField",
            "name": "onSuccessRedirectUrl",
            "parentId": "fe4b3c03-3e0b-410f-8a9d-93db02ca51ed",
            "label": "Success Redirect URL",
            "customVisibility": "return data.showModalFooter === true"
          },
          {
            "id": "b395c0e9-dbc1-44f1-8fef-c18a49442871",
            "type": "labelValueEditor",
            "name": "additionalProperties",
            "parentId": "fe4b3c03-3e0b-410f-8a9d-93db02ca51ed",
            "label": "Additional properties",
            "labelTitle": "Key",
            "labelName": "key",
            "valueTitle": "Value",
            "valueName": "value",
            "description": "Additional properties you want to be passed when the form gets submitted like parentId in the case where the modal is used in a childTable. Also note you can use Mustache expression like {{id}} for value property"
          },
          {
            "id": "264903ff-b525-4a6e-893f-d560b219df9d",
            "type": "numberField",
            "name": "modalWidth",
            "parentId": "fe4b3c03-3e0b-410f-8a9d-93db02ca51ed",
            "label": "Width",
            "customVisibility": "return data.showModalFooter === true"
          }
        ],
        
*/