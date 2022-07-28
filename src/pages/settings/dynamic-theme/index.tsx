import React, { FC } from 'react';
import { DownOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Mentions,
  Menu,
  Pagination,
  Progress,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Spin,
  Steps,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import { CollapsiblePanel, Page } from '../../../components';
import { MyTransfer } from './transfer';
import { SplitSpace } from './splitSpace';
import { carTabListNoTitle, menuItems, selectProps } from './data';
import { useTheme } from '../../..';
import ColorPicker from '../../../components/colorPicker';
import { humanizeString } from '../../../utils/string';

export interface IConfigurableThemePageProps {}

const ConfigurableThemePage: FC<IConfigurableThemePageProps> = () => {
  const { theme, changeTheme } = useTheme();

  const onColorChange = (nextColor: Partial<typeof theme>) => {
    changeTheme({
      ...theme,
      ...nextColor,
    });
  };

  const renderColor = (colorName: 'primaryColor' | 'errorColor' | 'warningColor' | 'successColor' | 'infoColor') => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <ColorPicker
          title={humanizeString(colorName)}
          presetColors={['#1890ff', '#25b864', '#ff6f00', '#ff4d4f', '#faad14', '#52c41a', '#1890ff']}
          color={theme[colorName]}
          onChange={({ hex }) => {
            onColorChange({
              [colorName]: hex,
            });
          }}
        />

        <span>{humanizeString(colorName)}</span>
      </div>
    );
  };

  return (
    <Page title="Customize theme">
      <Row gutter={16} wrap={false}>
        <Col>
          <CollapsiblePanel header="Theme colors">
            <Space direction="vertical" align="start">
              {/* Primary Color */}
              {renderColor('primaryColor')}

              {/* Error Color */}
              {renderColor('errorColor')}

              {/* Warning Color */}
              {renderColor('warningColor')}

              {/* Success Color */}
              {renderColor('successColor')}

              {/* Info Color */}
              {renderColor('infoColor')}
            </Space>
          </CollapsiblePanel>
        </Col>

        <Col flex="auto">
          <CollapsiblePanel collapsible="disabled" header="Theme modification result">
            <Space direction="vertical" split={<Divider />} style={{ width: '100%' }} size={0}>
              {/* Primary Button */}
              <SplitSpace>
                <Button type="primary">Primary</Button>
                <Button>Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="text">Text</Button>
                <Button type="link">Link</Button>
              </SplitSpace>

              {/* Danger Button */}
              <SplitSpace>
                <Button danger type="primary">
                  Primary
                </Button>
                <Button danger>Default</Button>
                <Button danger type="dashed">
                  Dashed
                </Button>
                <Button danger type="text">
                  Text
                </Button>
                <Button danger type="link">
                  Link
                </Button>
              </SplitSpace>

              {/* Typography */}
              <SplitSpace>
                <Typography.Text type="success">Text (success)</Typography.Text>
                <Typography.Text type="warning">Text(warning)</Typography.Text>
                <Typography.Text type="danger">Text(danger)</Typography.Text>
                <Typography.Link href="https://ant.design" target="_blank">
                  Link
                </Typography.Link>
                <Typography.Text copyable>Text</Typography.Text>

                {/* Dropdown */}
                <Dropdown
                  overlay={
                    <Menu
                      items={[
                        {
                          key: '1',
                          label: '1st menu item',
                        },
                        {
                          key: '2',
                          label: 'a danger item',
                          danger: true,
                        },
                      ]}
                    />
                  }
                >
                  <a onClick={e => e.preventDefault()}>
                    <Space>
                      Hover me
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>

                {/* Spin */}
                <Spin />
              </SplitSpace>

              {/* Menu - horizontal */}
              <Row gutter={16}>
                <Col span={12}>
                  <Menu mode="horizontal" defaultSelectedKeys={['mail']} items={menuItems} />
                </Col>
                <Col span={12}>
                  <Menu mode="horizontal" theme="dark" defaultSelectedKeys={['mail']} items={menuItems} />
                </Col>
              </Row>

              {/* Pagination */}
              <Pagination showQuickJumper defaultCurrent={2} total={500} />

              {/* Steps - dot */}
              <Steps current={2} status="error" progressDot>
                <Steps.Step title="Finished" description="You can hover on the dot." />
                <Steps.Step title="In Progress" description="You can hover on the dot." />
                <Steps.Step title="Error" description="You can hover on the dot." />
                <Steps.Step title="Waiting" description="You can hover on the dot." />
              </Steps>

              {/* Form - Select */}
              <Form>
                <SplitSpace>
                  <Form.Item>
                    <Select {...selectProps} />
                  </Form.Item>
                  <Form.Item hasFeedback validateStatus="success">
                    <Select {...selectProps} />
                  </Form.Item>
                  <Form.Item hasFeedback validateStatus="warning">
                    <Select {...selectProps} />
                  </Form.Item>
                  <Form.Item hasFeedback validateStatus="error">
                    <Select {...selectProps} />
                  </Form.Item>
                  <Form.Item hasFeedback validateStatus="validating">
                    <Select {...selectProps} />
                  </Form.Item>
                </SplitSpace>
              </Form>

              {/* Form - DatePicker */}
              <Form>
                <SplitSpace>
                  <Form.Item>
                    <DatePicker />
                  </Form.Item>
                  <Form.Item hasFeedback validateStatus="success">
                    <DatePicker.RangePicker />
                  </Form.Item>
                  <Form.Item hasFeedback validateStatus="warning">
                    <DatePicker />
                  </Form.Item>
                  <Form.Item hasFeedback validateStatus="error">
                    <DatePicker />
                  </Form.Item>
                  <Form.Item hasFeedback validateStatus="validating">
                    <DatePicker />
                  </Form.Item>
                </SplitSpace>
              </Form>

              <SplitSpace>
                <Checkbox>Checkbox</Checkbox>

                <Radio.Group defaultValue="bamboo">
                  <Radio value="bamboo">Bamboo</Radio>
                  <Radio value="light">Light</Radio>
                  <Radio value="little">Little</Radio>
                </Radio.Group>

                <Mentions placeholder="Mention by @">
                  <Mentions.Option value="afc163">afc163</Mentions.Option>
                  <Mentions.Option value="zombieJ">zombieJ</Mentions.Option>
                  <Mentions.Option value="yesmeck">yesmeck</Mentions.Option>
                </Mentions>

                <Slider defaultValue={30} style={{ width: 100 }} />

                <Switch defaultChecked />
              </SplitSpace>

              <Row gutter={16}>
                <Col span={8}>
                  {/* Card */}
                  <Card
                    style={{ width: '100%' }}
                    tabList={carTabListNoTitle}
                    tabBarExtraContent={<a href="#">More</a>}
                  />
                </Col>
                <Col span={8}>
                  {/* Table */}
                  <Table
                    size="small"
                    bordered
                    rowSelection={{}}
                    columns={[
                      {
                        title: 'Key',
                        dataIndex: 'key',
                        filters: [
                          {
                            text: 'Little',
                            value: 'little',
                          },
                        ],
                        sorter: (a, b) => a.key.length - b.key.length,
                      },
                    ]}
                    dataSource={[
                      {
                        key: 'Bamboo',
                      },
                      {
                        key: 'Light',
                      },
                      {
                        key: 'Little',
                      },
                    ]}
                  />
                </Col>
              </Row>

              <SplitSpace>
                <Tag color="success">success</Tag>
                <Tag color="processing">processing</Tag>
                <Tag color="error">error</Tag>
                <Tag color="warning">warning</Tag>
                <Tag color="default">default</Tag>
                <Tag.CheckableTag checked>CheckableTag</Tag.CheckableTag>
              </SplitSpace>

              {/* Alert */}
              <Row gutter={16}>
                <Col span={6}>
                  <Alert showIcon message="Success Text" type="success" />
                </Col>
                <Col span={6}>
                  <Alert showIcon message="Info Text" type="info" />
                </Col>
                <Col span={6}>
                  <Alert showIcon message="Warning Text" type="warning" />
                </Col>
                <Col span={6}>
                  <Alert showIcon message="Error Text" type="error" />
                </Col>
              </Row>

              {/* Progress */}
              <Row gutter={16}>
                <Col flex="auto">
                  <Progress percent={30} />
                  <Progress percent={70} status="exception" />
                  <Progress percent={100} />
                </Col>
              </Row>

              <MyTransfer />
            </Space>
          </CollapsiblePanel>
        </Col>
      </Row>
    </Page>
  );
};

export default ConfigurableThemePage;
