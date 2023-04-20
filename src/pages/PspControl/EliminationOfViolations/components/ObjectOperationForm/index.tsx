import React, { useCallback, useState } from "react";
import classNames from "classnames/bind";
import { Spin, Form, Upload, Button, Input, notification } from "antd";
import { Store } from "antd/lib/form/interface";
import { DeleteOutlined, PlusCircleFilled } from "@ant-design/icons";
import { normFile, urlsValidator } from "./utils";
import { FormInstance } from "antd/lib/form";
import { FormFields } from "../../constants";
import styles from "./objectOperationForm.module.css";
import { TypesOfOperations } from "../ModalOfOperations/constants";
import { isArray } from "lodash";

const { TextArea } = Input;

const cx = classNames.bind(styles);

interface IProps {
  form: FormInstance<any>;
  isLoading: boolean;
  onFinish: (values: any) => void;
  initialValues: Store;
  typeOfOperation?: TypesOfOperations;
}

const onChangeHandler = (file) => {
  let result: string | boolean = false;
  if (file.size > 20971520) {
    result = Upload.LIST_IGNORE;
    notification.error({
      message: "Файл слишком тяжелый",
      description: "Максимально допустимый размер файла 20мб!",
      duration: 0,
    });
  }
  return result;
};

export const ObjectOperationForm: React.FC<IProps> = ({
  form,
  isLoading,
  onFinish,
  initialValues,
  children,
  typeOfOperation,
}) => {
  const [hasUrls, setHasUrls] = useState(false);

  return (
    <Spin spinning={isLoading}>
      <Form
        layout="vertical"
        initialValues={initialValues}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name={FormFields.files}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra={"Максимально допустимый размер файла 20мб"}
          rules={[
            {
              required:
                (typeOfOperation === TypesOfOperations.sendForVerification ||
                  typeOfOperation === TypesOfOperations.requestAnExtension) &&
                !hasUrls,
              message: "Добавление файла обязательно!",
            },
          ]}
        >
          <Upload listType="picture" beforeUpload={onChangeHandler}>
            <Button icon={<PlusCircleFilled />} type="text">
              Добавить файл
            </Button>
          </Upload>
        </Form.Item>
        <Form.List name={FormFields.urls}>
          {(fields, { add, remove }, { errors }) => {
            setHasUrls(fields.length > 0);

            return (
              <React.Fragment>
                <Form.Item>
                  <Button
                    onClick={() => add()}
                    icon={<PlusCircleFilled />}
                    type="text"
                  >
                    Добавить ссылку
                  </Button>
                </Form.Item>

                {fields.map((field) => {
                  return (
                    <div className={cx("link-wrapper")}>
                      <Form.Item
                        style={{ width: "100%" }}
                        name={[field.fieldKey]}
                        fieldKey={[field.fieldKey]}
                        rules={[
                          {
                            required: true,
                            message: "Поле обязательно к заполнению!",
                          },
                          { type: "url", message: "Введите валидный url!" },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Button
                        className={cx("delete-link-button")}
                        onClick={() => remove(field.name)}
                        icon={<DeleteOutlined />}
                        type="text"
                      />
                    </div>
                  );
                })}

                <Form.ErrorList errors={errors} />
              </React.Fragment>
            );
          }}
        </Form.List>
        {children}
        <Form.Item name={FormFields.comment} label="Комментарий">
          <TextArea className={cx("text-area")} />
        </Form.Item>
      </Form>
    </Spin>
  );
};
