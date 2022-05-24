import React, { FC, useState } from 'react';
import { Collapse } from 'antd';
import { CodeEditor } from '../../..';
import { CaretRightOutlined } from '@ant-design/icons';

export interface IQueryBuilderExpressionViewerProps {
  jsonExpanded?: boolean;
  value?: object;
}

export const QueryBuilderExpressionViewer: FC<IQueryBuilderExpressionViewerProps> = props => {
  const [jsonExpanded, setJsonExpanded] = useState(props.jsonExpanded ?? false);

  console.log('QueryBuilderExpressionViewer value: ', props?.value);

  const onExpandClick = () => {
    setJsonExpanded(!jsonExpanded);
  };

  return (
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
      <Collapse.Panel header={<div>Code Editor</div>} key="1">
        <CodeEditor
          width="100%"
          readOnly={true}
          value={props.value ? JSON.stringify(props.value, null, 2) : ''}
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
  );
};

export default QueryBuilderExpressionViewer;
