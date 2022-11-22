import { ArrowsAltOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import React from 'react';
import { useGlobalState } from '../../../..';
import { evaluateString, validateConfigurableComponentSettings } from '../../../../formDesignerUtils';
import { IConfigurableFormComponent, IToolboxComponent } from '../../../../interfaces/formDesigner';
import { useForm } from '../../../../providers/form';
import { FormMarkup } from '../../../../providers/form/models';
import StatusTag, { DEFAULT_STATUS_TAG_MAPPINGS, IStatusTagProps as ITagProps } from '../../../statusTag';
import settingsFormJson from './settingsForm.json';

export interface IStatusTagProps extends Omit<ITagProps, 'mappings' | 'style'>, IConfigurableFormComponent {
  colorCodeEvaluator?: string;
  overrideCodeEvaluator?: string;
  valueCodeEvaluator?: string;
  mappings?: string;
}

const settingsForm = settingsFormJson as FormMarkup;

const StatusTagComponent: IToolboxComponent<IStatusTagProps> = {
  type: 'statusTag',
  name: 'Status Tag',
  icon: <ArrowsAltOutlined />,
  factory: (model: IStatusTagProps) => {
    const { formData, formMode } = useForm();
    const { globalState } = useGlobalState();

    const getExpressionExecutor = (expression: string) => {
      if (!expression) {
        return null;
      }

      // tslint:disable-next-line:function-constructor
      const func = new Function('data', 'formMode', expression);

      return func(formData, formMode);
    };

    const { colorCodeEvaluator, overrideCodeEvaluator, valueCodeEvaluator, override, value, color } = model;

    const allEmpty =
      [colorCodeEvaluator, overrideCodeEvaluator, valueCodeEvaluator, override, value, color].filter(Boolean)
        ?.length === 0;

    const getValueByExpression = (expression: string = '') => {
      return expression?.includes('{{') ? evaluateString(expression, formData) : expression;
    };

    if (allEmpty) {
      return <Alert type="info" message="Status tag not configured properly" />;
    }

    const evaluatedOverrideByExpression = getValueByExpression(override);
    const localValueByExpression = getValueByExpression(value as string);
    const localColorByExpression = getValueByExpression(color);

    const computedColorByCode = getExpressionExecutor(colorCodeEvaluator) || '';
    const computedOverrideByCode = getExpressionExecutor(overrideCodeEvaluator) || '';
    const computedValueByCode = getExpressionExecutor(valueCodeEvaluator) || '';

    const allEvaluationEmpty =
      [
        evaluatedOverrideByExpression,
        localValueByExpression,
        localColorByExpression,
        computedColorByCode,
        computedOverrideByCode,
        computedValueByCode,
      ].filter(Boolean)?.length === 0;

    const getParsedMappings = () => {
      try {
        return JSON.parse(model?.mappings);
      } catch (error) {
        return null;
      }
    };

    const props: ITagProps = {
      override: computedOverrideByCode || evaluatedOverrideByExpression,
      // value: computedValue || localValueByExpression,
      value: allEvaluationEmpty ? 1000 : computedValueByCode || localValueByExpression,
      color: computedColorByCode || localColorByExpression,
      mappings: getParsedMappings(),
    };

    const executeExpression = (expression: string, returnBoolean = false) => {
      if (!expression) {
        if (returnBoolean) {
          return true;
        } else {
          console.error('Expected expression to be defined but it was found to be empty.');

          return false;
        }
      }

      /* tslint:disable:function-constructor */
      const evaluated = new Function('data, globalState', expression)(formData, globalState);

      // tslint:disable-next-line:function-constructor
      return typeof evaluated === 'boolean' ? evaluated : true;
    };

    const isVisibleByCondition = executeExpression(model.customVisibility, true);

    if (!isVisibleByCondition && formMode !== 'designer') return null;

    return <StatusTag {...props} />;
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => ({
    mappings: JSON.stringify(DEFAULT_STATUS_TAG_MAPPINGS, null, 2) as any,
    ...model,
  }),
};

export default StatusTagComponent;
