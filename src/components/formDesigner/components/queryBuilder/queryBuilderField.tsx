import React, { FC, useState } from 'react';
import { JsonLogicResult } from 'react-awesome-query-builder';
import { Modal, Button, Collapse } from 'antd';
import { IProperty } from '../../../../providers/queryBuilder/models';
import QueryBuilder from '../../../queryBuilder';
import { CodeEditor } from '../../..';
import { CaretRightOutlined } from '@ant-design/icons';

export interface IQueryBuilderFieldProps {
  jsonExpanded?: boolean;
  useExpression?: boolean;
  fields: IProperty[];
  value?: object;
  onChange?: (value: any) => void;
}

export const QueryBuilderField: FC<IQueryBuilderFieldProps> = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [jsonLogicResult, setJsonLogicResult] = useState<JsonLogicResult>(undefined);
  const [jsonExpanded, setJsonExpanded] = useState(props.jsonExpanded ?? false);

  const onOkClick = () => {
    if (jsonLogicResult) {
      if (jsonLogicResult && jsonLogicResult.errors && jsonLogicResult.errors.length > 0) {
        console.log(jsonLogicResult);
        // show errors
        return;
      }

      if (props.onChange) {
        props.onChange(jsonLogicResult?.logic);
      }
    }
    setModalVisible(false);
  };

  const onChange = (result: JsonLogicResult) => {
    setJsonLogicResult(result);
  };

  const onExpandClick = () => {
    setJsonExpanded(!jsonExpanded);
  };

  return (
    <>
      <Collapse
        className="sha-query-builder-field"
        activeKey={jsonExpanded ? '1' : null}
        expandIconPosition="right"
        bordered={false}
        ghost={true}
        expandIcon={({ isActive }) =>
          isActive ? (
            <span onClick={onExpandClick}>
              hide json <CaretRightOutlined rotate={90} />
            </span>
          ) : (
            <span onClick={onExpandClick}>
              show json <CaretRightOutlined rotate={0} />
            </span>
          )
        }
      >
        <Collapse.Panel
          header={
            <Button type="primary" onClick={() => setModalVisible(true)}>
              Query Builder
            </Button>
          }
          key="1"
        >
          <CodeEditor
            width="100%"
            readOnly={true}
            value={props.value ? JSON.stringify(props.value, null, 2) : null}
            mode="json"
            theme="monokai"
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              autoScrollEditorIntoView: true,
              minLines: 3,
              maxLines: 100,
            }}
          />
        </Collapse.Panel>
      </Collapse>
      <Modal
        visible={modalVisible}
        width="60%"
        title="Quick Filter Query Builder"
        onCancel={() => setModalVisible(false)}
        onOk={onOkClick}
        destroyOnClose
      >
        <h4>Here you can create your own table filters using the query builder below</h4>

        <QueryBuilder
          value={props.value}
          onChange={onChange}
          fields={props.fields}
          useExpression={props?.useExpression}
        />
      </Modal>
    </>
  );
};

export default QueryBuilderField;
