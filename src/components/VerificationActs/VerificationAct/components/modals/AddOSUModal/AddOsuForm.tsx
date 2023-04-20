import {FC, useState} from "react";
import {Col, Form, Input, Row, Select, Spin} from "antd";
import {FormInstance} from "antd/lib/form";

import {IdType} from "../../../../../../types";

interface AddOsuFormProps {
  form: FormInstance<any>;
  options: { value: IdType; label: string }[];
  onSelectOsu: (value: IdType) => void;
  onFinish: (values: any) => void;
  isVisibilityInspection?: boolean;
}

export const AddOsuForm: FC<AddOsuFormProps> = ({
  form,
  options,
  onSelectOsu,
  onFinish,
  isVisibilityInspection
}) => {
  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        name="osuShortName"
        label="Наименование"
        rules={[{ required: true, message: "Выберите наименование" }]}
      >
        <Select
          options={options}
          onChange={onSelectOsu}
        />
      </Form.Item>
      <Row gutter={[32, 4]}>
        <Col span={8}>
          <Form.Item
            name="osuType"
            label="Тип системы учета"
            rules={[{ required: false }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="osuPurpose"
            label="Назначение"
            rules={[{ required: false }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="osuOwner"
            label="Владелец"
            rules={[{ required: false }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="territorialLocation"
            label="Территориальное расположение"
            rules={[{ required: false }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="osuAffiliation"
            label="Принадлежность к Компании"
            rules={[{ required: false }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="transportedProduct"
            label="Транспортируемый продукт"
            rules={[{ required: false }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="receive"
            label="Принимающая сторона"
            rules={[{ required: false, message: "Выберите тип проверки" }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="accredited"
            label="Наличие аккредитации"
            rules={[{ required: false, message: "Выберите тип проверки" }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="send"
            label="Сдающая сторона"
            rules={[{ required: false, message: "Выберите тип проверки" }]}
          >
            <Input readOnly />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
