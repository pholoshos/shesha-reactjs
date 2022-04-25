import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Query,
  Builder,
  Utils as QbUtils,
  ImmutableTree,
  Config,
  BuilderProps,
  JsonLogicResult,
  FieldSettings,
  Widgets,
} from 'react-awesome-query-builder';
import classNames from 'classnames';
// For AntDesign widgets only:
import AntdConfig from 'react-awesome-query-builder/lib/config/antd';
import { ITableColumn } from '../../interfaces';
import { IProperty } from '../../providers/queryBuilder/models';
import EntityAutocompleteWidget from './widgets/entityAutocomplete';
import RefListDropdownWidget from './widgets/refListDropDown';
import EntityReferenceType from './types/entityReference';
import RefListType from './types/refList';
import { DataTypes } from '../../interfaces/dataTypes';
import DateTimeDynamicWidget from './widgets/dateTimeDynamic';
import DateTimeDynamicType from './types/dateTimeDynamic';
const InitialConfig = AntdConfig;

export interface IQueryBuilderColumn extends ITableColumn {
  fieldSettings?: FieldSettings;
  preferWidgets?: Widgets[];
}

export interface IQueryBuilderProps {
  value?: object;
  onChange?: (result: JsonLogicResult) => void;
  columns?: IQueryBuilderColumn[];
  fields: IProperty[];
  showActionBtnOnHover?: boolean;
  useExpression?: boolean;
}

export const QueryBuilder: FC<IQueryBuilderProps> = ({
  showActionBtnOnHover = true,
  onChange,
  value,
  fields,
  useExpression,
}) => {
  const [tree, setTree] = useState<ImmutableTree>();
  const [config, setConfig] = useState<Config>();

  useEffect(() => {
    initialize();
  }, []);

  const allFields = useMemo(
    () =>
      useExpression
        ? fields?.map(({ dataType, ...field }) => ({
            ...field,
            dataType: ['date-time', 'date', 'time'].includes(dataType) ? 'dateTimeDynamic' : dataType,
          }))
        : fields,
    [useExpression, fields]
  );

  const initialize = () => {
    const operators = {
      ...InitialConfig.operators,
      starts_with: {
        ...InitialConfig.operators.starts_with,
        jsonLogic: 'startsWith',
      },
      ends_with: {
        ...InitialConfig.operators.ends_with,
        jsonLogic: 'endsWith',
      },
    };

    const widgets = {
      ...InitialConfig.widgets,
      entityAutocomplete: EntityAutocompleteWidget,
      refListDropdown: RefListDropdownWidget,
      dateTimeDynamic: DateTimeDynamicWidget,
    };

    const types = {
      ...InitialConfig.types,
      entityReference: EntityReferenceType,
      refList: RefListType,
      dateTimeDynamic: DateTimeDynamicType,
    };

    const conf: Config = {
      ...InitialConfig,
      fields: {},
      // @ts-ignore
      types,
      operators,
      widgets,
    };

    allFields?.forEach(({ dataType, visible, propertyName, label, fieldSettings, preferWidgets }) => {
      let type: string = dataType;
      let defaultPreferWidgets = [];

      /*
      Fields can be of type:
        simple (string, number, bool, date/time/datetime, list)
        structs (will be displayed in selectbox as tree)
        custom type (dev should add its own widget component in config for this)
      */
      if (visible) {
        switch (dataType) {
          case 'string':
          case DataTypes.string:
            type = 'text';
            break;

          case DataTypes.date:
            type = 'date';
            break;
          case DataTypes.dateTime:
            type = 'datetime';
            break;
          case DataTypes.time:
            type = 'time';
            break;

          case DataTypes.number:
            type = 'number';
            break;

          case 'entityReference':
          case DataTypes.entityReference:
            type = 'entityReference';
            defaultPreferWidgets = ['entityAutocomplete'];
            break;

          case 'refList':
          case DataTypes.referenceListItem:
            type = 'refList';
            defaultPreferWidgets = ['refListDropdown'];
            break;
          // case 'multiValueRefList':
          //   type = 'multiselect';
          //   break;
          case '!struct':
            type = dataType;
            break;
          case 'dateTimeDynamic':
            type = 'dateTimeDynamic';
            defaultPreferWidgets = ['dateTimeDynamic'];
          default:
            break;
        }

        conf.fields[propertyName] = {
          label,
          type,
          valueSources: ['value'],
          // @ts-ignore note: types are wrong in the library, they doesn't allow to extend
          fieldSettings,
          preferWidgets: preferWidgets || defaultPreferWidgets,
        };
      }
    });

    const loadedTree = value
      ? QbUtils.loadFromJsonLogic(value, conf)
      : QbUtils.loadTree({ id: QbUtils.uuid(), type: 'group' });

    const checkedTree = QbUtils.checkTree(loadedTree, conf);
    setTree(checkedTree);

    setConfig(conf);
  };

  const renderBuilder = (props: BuilderProps) => (
    <div className="query-builder-container">
      <div className={classNames('query-builder', { 'qb-lite': showActionBtnOnHover })}>
        <Builder {...props} />
      </div>
    </div>
  );

  const handleChange = (_tree: ImmutableTree, _config: Config) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    setTree(_tree);
    setConfig(_config);

    if (onChange) {
      onChange(QbUtils.jsonLogicFormat(_tree, _config));
    }
  };

  return (
    <div className="sha-query-builder">
      {tree && config && <Query {...config} value={tree} onChange={handleChange} renderBuilder={renderBuilder} />}
    </div>
  );
};

export default QueryBuilder;
