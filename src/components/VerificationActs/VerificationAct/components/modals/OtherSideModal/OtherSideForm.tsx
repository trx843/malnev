import React, {FC, useState} from "react";
import {Col, Form, Input, Row, Select} from "antd";
import {FormInstance} from "antd/lib/form";

import {DividerForm} from "../../DividerForm";
import {useVerificationActOptions} from "../../../hooks/useVerificationActOptions";
import {ErrorAntd, FieldData} from "../../../../../../types";
import "./styles.css";

interface OtherSideFormProps {
  form: FormInstance<any>;
  onFinish?: (values: any) => void;
  fields?: FieldData[];
  onChange?: (value: any) => void;
  onError?: (params: {
    values: any;
    errorFields: ErrorAntd;
    outOfDate: boolean;
  }) => void;
  serial: number;
  isRequiredPartName?: boolean;
}

export const OtherSideForm: FC<OtherSideFormProps> = ({
  serial,
  onFinish,
  form,
  fields,
  onChange,
  isRequiredPartName = true,
  onError
}) => {
  const [loading, setLoading] = useState(false);

  const { getCtoOptions, ctos } = useVerificationActOptions();
  

  const handleLoadCto = async (open: boolean) => {
    if (!open) {
      return;
    }

    try {
      setLoading(true);
      await getCtoOptions();
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="verification-act-other-side__modal-form">
      <DividerForm title={`Сторона ${serial}`} />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={onChange}
        onFinishFailed={onError}
        fields={fields}
      >
        <Row gutter={[32, 24]}>
          <Col span={12}>
            <Form.Item
              name="ctoName"
              label="Наименование ОСТ/СТО"
              rules={[{ required: true, message: "Заполните поле" }]}
            >
              <Select
                loading={loading}
                options={ctos}
                onDropdownVisibleChange={handleLoadCto}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="partyName"
              label="Структурное подразделение"
              rules={[{ required: isRequiredPartName, message: "Заполните поле" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
