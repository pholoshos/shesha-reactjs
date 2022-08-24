import React, { useEffect, useRef } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { TableOutlined } from '@ant-design/icons';
import settingsFormJson from './settingsForm.json';
import { Alert } from 'antd';
import { ChildTable, IChildTableProps } from '../../../../';
import { useForm } from '../../../../providers/form';
import { DataTableFullInstance } from '../../../../providers/dataTable/contexts';
import { useDataTableState } from '../../../../providers';
import DataTableProvider from '../../../../providers/dataTable';
import { evaluateValue, validateConfigurableComponentSettings } from '../../../../providers/form/utils';

const MAX_CRUD_OPTIONS = 3; // create | update | delete
const ALL_CRUD_OPTIONS = ["create", "update", "delete"];

export interface IChildDataTableProps extends IConfigurableFormComponent {
  tableConfigId?: string;
  parentEntityId?: string;
  crud?: boolean;
  enableAllCrudOptions?: boolean;
  crudMode?: 'inline' | 'dialog';
  crudOptions?: string[];
}

const settingsForm = settingsFormJson as FormMarkup;

const ChildDataTableComponent: IToolboxComponent<IChildDataTableProps> = {
  type: 'childDataTable',
  name: 'Child DataTable',
  icon: <TableOutlined />,
  factory: (model: IChildDataTableProps) => {
    const {
      parentEntityId,
      tableConfigId,
      label,
      crud,
      crudOptions,
      enableAllCrudOptions,
      crudMode
    } = model;
    
    const { isComponentHidden, formData } = useForm();

    const tableRef = useRef<DataTableFullInstance>(null);
    const { registerActions } = useForm();

    useEffect(
      () =>
        registerActions(model.id, {
          refresh: () => {
            tableRef.current?.refreshTable();
          },
        }),
      []
    );
    // todo: refactor and implement a generic way for values evaluation (maybe pass values evaluator from the ConfigurableForm level)
    //const { formData } = useForm();
    //const parentEntityId = evaluateValue(customProps.parentEntityId, { data: formData });

    const selectedOptions = {};

    if (crud && !enableAllCrudOptions) {
      (crudOptions?.length ? crudOptions : ALL_CRUD_OPTIONS)?.forEach(option => {
        selectedOptions[option] = true;
      });
    }
    
    const tableProps: IChildTableProps = {
      id: tableConfigId,
      header: label,
      crud: crud
        ? enableAllCrudOptions || (crudOptions?.length === MAX_CRUD_OPTIONS ? true : selectedOptions)
        : false,
      crudMode,
    };

    const { parentEntityId: currentParentEntityId } = useDataTableState();

    if (!tableProps.id) return <Alert message="Child DataTable is not configured properly" type="warning" showIcon />;

    const evaluatedParentEntityId = evaluateValue(parentEntityId, { data: formData });

    if (isComponentHidden(model)) return null;

    return (
      <DataTableProvider parentEntityId={currentParentEntityId || evaluatedParentEntityId}>
        <ChildTable {...tableProps} tableRef={tableRef} />
      </DataTableProvider>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => {
    const response: IChildDataTableProps = {
      ...model,
      parentEntityId: '{data.id}',
    };

    return response;
  },
};

export default ChildDataTableComponent;
