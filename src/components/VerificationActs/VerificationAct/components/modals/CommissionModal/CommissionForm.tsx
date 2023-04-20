import React, { FC, useState } from "react";
import { Checkbox, Col, Form, Row, Select } from "antd";
import { ErrorAntd, FieldData, StateType } from "../../../../../../types";
import { useVerificationActOptions } from "components/VerificationActs/VerificationAct/hooks/useVerificationActOptions";
import { FioSelect } from "components/DictionarySelects/FioSelect";
import { PositionSelect } from "components/DictionarySelects/PositionSelect";
import { DropdownSelectTypes } from "components/DropdownSelect/constants";
import { getCtoThunk } from "thunks/verificationActs/verificationAct";
import { getCtoRequest } from "api/requests/verificationActs";
import { useSelector } from "react-redux";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";

interface CommissionFormProps {
  onFinish?: (values: any) => void;
  fields: FieldData[];
  onChange: (value: any) => void;
  onError?: (params: {
    values: any;
    errorFields: ErrorAntd;
    outOfDate: boolean;
  }) => void;
}

export const CommissionForm: FC<CommissionFormProps> = ({
  onFinish,
  fields,
  onChange,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [ctos, setCtos] = useState<any[]>([]);

  const state = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );

  const actId = state.act?.id

  React.useEffect(() => {
    if (actId) initCto(actId)
  }, [actId])

  const initCto = async (actId: string) => {
    setLoading(true)
    const options = await getCtoRequest(actId)
    const adjustedOptions = options.reduce((acc, o) => {
      const label = o.label
      if (label) return [...acc, { value: label, label: label }]
      return acc
    }, [])
    setCtos(adjustedOptions)
    setLoading(false)
  }

  return (
    <Form
      fields={fields}
      layout="vertical"
      onValuesChange={onChange}
      onFinishFailed={onError}
      onFinish={onFinish}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            name="organizationName"
            label="От (Наименование организации)"
            rules={[
              {
                required: true,
                message: "Заполните поле",
              },
            ]}
          >
            <Select
              options={ctos}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            name="jobTitle"
            label="Должность"
            rules={[{ required: true, message: "Заполните поле" }]}
          >
            <PositionSelect type={DropdownSelectTypes.antd} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            name="fullName"
            label="ФИО"
            rules={[{ required: true, message: "Заполните поле" }]}
          >
            <FioSelect type={DropdownSelectTypes.antd} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            name="isInPresence"
            valuePropName="checked"
            labelAlign="right"
            initialValue={false}
          >
            <Checkbox>В присутствии</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
