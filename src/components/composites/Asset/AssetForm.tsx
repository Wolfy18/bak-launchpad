import React, { useState } from 'react';
import { Divider, Form, Space, Button, Input } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FileUploader } from 'components/atoms/Input';
import { insertLineBreaks } from 'utils';

const FileInputPairItem: React.FC<{ name: string }> = ({ name }) => {
  const [uploadedValue, setUploadedValue] = useState<
    AttachmentProps | undefined
  >();

  const handleUploadCallback = (file: AttachmentProps) => {
    setUploadedValue(file);
  };

  return (
    <div>
      {/* Input for file upload */}
      <FileUploader callback={handleUploadCallback} />
      {/* Hidden input */}
      <Input name={name} type="hidden" value={uploadedValue?.ipfs} />
    </div>
  );
};

const AssetForm: React.FC = () => {
  const [text, setText] = useState('');

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.currentTarget.value;
    const formattedText = insertLineBreaks(inputValue);

    setText(formattedText);
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Name" name="name" required>
        <Input name="name" type="text" maxLength={64} />
      </Form.Item>

      <Form.Item label="Asset Name" name="asset_name">
        <Input name="asset_name" type="text" maxLength={32} showCount={true} />
      </Form.Item>

      <Form.Item label="Number of tokens" name="amount" required>
        <Input name="amount" type="number" min={1} />
      </Form.Item>

      <Form.Item label="Cover Image" name="image" required>
        <FileInputPairItem name="image" />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea
          name="description"
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleTextAreaChange(event)
          }
          value={text}
        />
      </Form.Item>

      <Divider orientation="left">Attributes</Divider>

      <Form.List name="attributes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} className="flex mb-2" align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'key']}
                  rules={[{ required: true, message: 'Missing key' }]}
                >
                  <Input placeholder="Key" maxLength={64} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'value']}
                  rules={[{ required: true, message: 'Missing value' }]}
                >
                  <Input placeholder="Value" maxLength={64} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add attribute
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider orientation="left">Files</Divider>
      <Form.List name="files">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} className="mb-8" align="center">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Missing name' }]}
                  className="mb-0 col-span-2"
                >
                  <Input placeholder="Name" maxLength={64} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'src']}
                  rules={[{ required: true, message: 'Missing src' }]}
                  className="mb-0 col-span-2"
                >
                  <FileInputPairItem name="src" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add File
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default AssetForm;
