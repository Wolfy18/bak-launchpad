import React, { useState } from 'react';
import { Divider, Form as FormDS, Space, Button, Input } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FileUploader } from 'components/atoms/Input';
import { insertLineBreaks, recursiveProperties } from 'utils';
import { Field, FieldProps } from 'formik';
import { useFormContext } from 'context/FormContext';

const AssetForm: React.FC<AssetProps & { index: number }> = ({
  blockchain,
  name,
  asset_name,
  image,
  amount,
  description,
  attrs,
  files,
  index,
}) => {
  const [text, setText] = useState('');
  const { assetCollection, setAssetCollection } = useFormContext();
  const [form] = FormDS.useForm();
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.currentTarget.value;
    const formattedText = insertLineBreaks(inputValue);

    setText(formattedText);
  };

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e.target, ' <---- target');
    const inputElement = e.target as HTMLInputElement;
    const properties = inputElement.name.split('.').slice(1);
    const assetUpdate = { ...assetCollection[index] };

    const updatedProperty = recursiveProperties(
      properties,
      inputElement.value,
      // @ts-expect-error dynamic keys
      assetUpdate as NestedObject
    );

    const updated = { ...assetUpdate, ...updatedProperty };

    // insert line breaks for description
    if (updated.description) {
      updated['description'] = insertLineBreaks(updated.description);
    }

    const newcol = [...assetCollection];
    newcol[index] = updated;
    setAssetCollection(newcol);
  };

  return (
    <FormDS layout="vertical" onChange={handleFormChange} form={form}>
      <Field name={`asset[${index}].blockchain`}>
        {({ field, meta }: FieldProps) => (
          <FormDS.Item
            name={field.name}
            initialValue={blockchain}
            className="hidden"
          >
            <Input
              {...field}
              type="hidden"
              maxLength={64}
              status={meta.error ? 'error' : undefined}
            />
          </FormDS.Item>
        )}
      </Field>

      <Field name={`asset[${index}].name`}>
        {({ field, meta }: FieldProps) => (
          <FormDS.Item
            label="Token Name"
            name={field.name}
            required
            help={meta.error}
            initialValue={name}
          >
            <Input
              {...field}
              type="text"
              maxLength={64}
              status={meta.error ? 'error' : undefined}
            />
          </FormDS.Item>
        )}
      </Field>

      <Field name={`asset[${index}].asset_name`}>
        {({ field, meta }: FieldProps) => (
          <FormDS.Item
            label="Index Name"
            name={field.name}
            help={meta.error}
            initialValue={asset_name || name}
          >
            <Input
              {...field}
              type="text"
              maxLength={32}
              showCount={true}
              placeholder={name}
              status={meta.error ? 'error' : undefined}
            />
          </FormDS.Item>
        )}
      </Field>

      <Field name={`asset[${index}].amount`}>
        {({ field, meta }: FieldProps) => (
          <FormDS.Item
            label="Number of tokens"
            name={field.name}
            required
            help={meta.error}
            initialValue={Number(amount)}
          >
            <Input
              {...field}
              type="number"
              min={1}
              status={meta.error ? 'error' : undefined}
            />
          </FormDS.Item>
        )}
      </Field>

      <Field name={`asset[${index}].image`}>
        {({ field, meta }: FieldProps) => (
          <FileUploader
            {...field}
            status={meta.error ? 'error' : undefined}
            initialValue={image}
            error={meta.error}
            label="Cover Image"
          />
        )}
      </Field>

      <Field name={`asset[${index}].description`}>
        {({ field, meta }: FieldProps) => (
          <FormDS.Item
            label="Description"
            name={field.name}
            help={meta.error}
            initialValue={description}
          >
            <Input.TextArea
              {...field}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleTextAreaChange(event)
              }
              value={text}
              status={meta.error ? 'error' : undefined}
            />
          </FormDS.Item>
        )}
      </Field>
      <Divider orientation="left">Attributes</Divider>

      <FormDS.List name={`asset[${index}].attrs`} initialValue={attrs}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, fileIdx) => (
              <Space key={key} className="flex mb-2" align="baseline">
                <Field name={`asset[${index}].attrs[${fileIdx}].key`}>
                  {({ field, meta }: FieldProps) => (
                    <FormDS.Item
                      {...restField}
                      name={[name, field.name]}
                      rules={[{ required: true, message: 'Missing key' }]}
                      help={meta.error}
                      initialValue={
                        attrs && attrs[fileIdx] ? attrs[fileIdx].key : null
                      }
                    >
                      <Input
                        placeholder="Key"
                        {...field}
                        maxLength={64}
                        status={meta.error ? 'error' : undefined}
                      />
                    </FormDS.Item>
                  )}
                </Field>
                <Field name={`asset[${index}].attrs[${fileIdx}].value`}>
                  {({ field, meta }: FieldProps) => (
                    <FormDS.Item
                      {...restField}
                      name={[name, field.name]}
                      rules={[{ required: true, message: 'Missing value' }]}
                      help={meta.error}
                      initialValue={
                        attrs && attrs[fileIdx] ? attrs[fileIdx].value : null
                      }
                    >
                      <Input
                        {...field}
                        placeholder="Value"
                        maxLength={64}
                        status={meta.error ? 'error' : undefined}
                      />
                    </FormDS.Item>
                  )}
                </Field>

                <MinusCircleOutlined
                  onClick={() => {
                    remove(name);
                    const currentAsset = { ...assetCollection[index] };

                    attrs = currentAsset.attrs?.filter(
                      (obj, idx) => idx !== name
                    );
                    currentAsset.attrs = attrs;

                    const newcol = [...assetCollection];
                    newcol[index] = currentAsset;
                    setAssetCollection(newcol);
                  }}
                />
              </Space>
            ))}
            <FormDS.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add attribute
              </Button>
            </FormDS.Item>
          </>
        )}
      </FormDS.List>

      <Divider orientation="left">Files</Divider>
      <FormDS.List name={`asset[${index}].files`} initialValue={files}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, fileIdx) => (
              <Space key={key} className="mb-8" align="center">
                <Field name={`asset[${index}].files[${fileIdx}].name`}>
                  {({ field, meta }: FieldProps) => (
                    <FormDS.Item
                      {...restField}
                      name={[name, field.name]}
                      rules={[{ required: true, message: 'Missing name' }]}
                      className="mb-0 col-span-2"
                      help={meta.error}
                      initialValue={
                        files && files[fileIdx] ? files[fileIdx].name : null
                      }
                    >
                      <Input
                        {...field}
                        placeholder="Name"
                        maxLength={64}
                        status={meta.error ? 'error' : undefined}
                      />
                    </FormDS.Item>
                  )}
                </Field>
                <Field name={`asset[${index}].files[${fileIdx}].src`}>
                  {({ field, meta }: FieldProps) => (
                    <FileUploader
                      name={[name, field.name]}
                      status={meta.error ? 'error' : undefined}
                      initialValue={
                        files && files[fileIdx] ? files[fileIdx].src : null
                      }
                      error={meta.error}
                      rules={[{ required: true, message: 'Missing source' }]}
                      className="mb-0 col-span-2"
                      prefixName={`asset[${index}].files_${fileIdx}_`}
                    />
                  )}
                </Field>
                <Field name={`asset[${index}].files[${fileIdx}].mediaType`}>
                  {({ field, meta }: FieldProps) => (
                    <FormDS.Item
                      {...restField}
                      name={[name, field.name]}
                      className="mb-0 col-span-2"
                      initialValue={
                        files && files[fileIdx]
                          ? files[fileIdx].mediaType
                          : null
                      }
                      help={meta.error}
                    >
                      <Input
                        {...field}
                        placeholder="media/type"
                        maxLength={64}
                        type="text"
                        status={meta.error ? 'error' : undefined}
                      />
                    </FormDS.Item>
                  )}
                </Field>
                <MinusCircleOutlined
                  onClick={() => {
                    remove(name);
                    const currentAsset = { ...assetCollection[index] };

                    files = currentAsset.files?.filter(
                      (obj, idx) => idx !== name
                    );
                    currentAsset.files = files;

                    const newcol = [...assetCollection];
                    newcol[index] = currentAsset;
                    setAssetCollection(newcol);
                  }}
                />
              </Space>
            ))}
            <FormDS.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add File
              </Button>
            </FormDS.Item>
          </>
        )}
      </FormDS.List>
    </FormDS>
  );
};

export default AssetForm;
