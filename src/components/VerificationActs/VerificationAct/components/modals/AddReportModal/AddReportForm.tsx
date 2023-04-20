import { FC } from "react";
import { Col, Form, Input, InputNumber, Row } from "antd";
import { ErrorAntd, FieldData } from "../../../../../../types";

interface AddReportFormProps {
  onFinish?: (values: any) => void;
  fields?: FieldData[];
  onChange?: (value: any) => void;
  onError?: (params: {
    values: any;
    errorFields: ErrorAntd;
    outOfDate: boolean;
  }) => void;
}

export const AddReportForm: FC<AddReportFormProps> = ({
  fields,
  onFinish,
  onError,
  onChange,
}) => {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onChange}
      onFinishFailed={onError}
      fields={fields}
    >
      <Row>
        <Col flex={8}>
          <Form.Item name="name" label="Наименование приложения">
            <Input maxLength={1024} />
          </Form.Item>
        </Col>
        <Col flex={1} offset={1}>
          <Form.Item name="pageCount" label="Количество листов">
            <InputNumber
              min={0}
              max={999999}
              maxLength={6}
              minLength={1}
              parser={(value) => Number(value) || 0}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
