import React, { FC } from "react";
import { Form, Input } from "antd";
import { FormInstance } from "antd/lib/form";
import { ErrorAntd, FieldData } from "../../../../../../types";

interface RecommendationFormProps {
  onFinish?: (values: any) => void;
  fields?: FieldData[];
  onChange?: (value: any) => void;
  onError?: (params: {
    values: any;
    errorFields: ErrorAntd;
    outOfDate: boolean;
  }) => void;
}

export const RecommendationForm: FC<RecommendationFormProps> = ({
  onFinish,
  fields,
  onChange,
  onError
}) => {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onChange}
      onFinishFailed={onError}
      fields={fields}
    >
      <Form.Item
        name="recommendationsText"
        label="Рекомендации"
        rules={[{ required: true, message: "Заполните поле" }]}
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
  );
};
