import React, { FC, useState } from "react";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import locale from "antd/lib/date-picker/locale/ru_RU";

import "./styles.css";
import { Moment } from "moment";
import moment from "moment";

interface InfoGeneralProps {
  verificationOptions: { id: string; label: string }[];
  getVerificationOptions: () => Promise<void>;
  onSelectVerification: (id: string) => void;
  onVerificatedOnChange: (date: Moment) => void;
  isVisibleInspectType: boolean;
}

export const InfoGeneral: FC<InfoGeneralProps> = ({
  verificationOptions,
  getVerificationOptions,
  onSelectVerification,
  isVisibleInspectType,
  onVerificatedOnChange
}) => {

  React.useEffect(() => {
    onVerificatedOnChange(moment())
  }, []);

  const [loadingVerificationOptions, setLoadingVerificationOptions] =
    useState(false);

  const handleGetVerificationOptions = async (open: boolean) => {
    if (!open || verificationOptions.length !== 0) {
      return;
    }
    try {
      setLoadingVerificationOptions(true);
      await getVerificationOptions();
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoadingVerificationOptions(false);
    }
  };
  return (
    <Row gutter={[8, 8]}>
      <Col className="gutter-row" span={12}>
        <div>
          <Form.Item
            name="verificatedOn"
            label="Дата проведения"
            className="schedule-form__field"
            rules={[{ required: true, message: "Выберите дату проведения" }]}
          >
            <DatePicker locale={locale} format="DD.MM.YYYY" allowClear={false} onChange={onVerificatedOnChange} />
          </Form.Item>
        </div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div>
          <Form.Item
            name="preparedOn"
            label="Дата подготовки плана"
            className="schedule-form__field"
            rules={[
              { required: true, message: "Выберите дату подготовки плана" },
            ]}
          >
            <DatePicker locale={locale} format="DD.MM.YYYY" />
          </Form.Item>
        </div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div>
          <Form.Item
            name="verificationPlace"
            label="Место проведения"
            className="schedule-form__field"
            rules={[{ required: true, message: "Выберите место проведения" }]}
          >
            <Input />
          </Form.Item>
        </div>
      </Col>
      <Col className="gutter-row" span={12}>
        <div>
          {isVisibleInspectType && (
            <Form.Item
              name="inspectedTypeId"
              label="Тип поверки"
              className="schedule-form__field"
              rules={[{ required: true, message: "Выберите тип проверки" }]}
            >
              <Select
                onDropdownVisibleChange={handleGetVerificationOptions}
                loading={loadingVerificationOptions}
                notFoundContent={"Нет данных"}
                options={verificationOptions.map((item) => ({
                  ...item,
                  value: item.id,
                  label: item.label,
                }))}
              />
            </Form.Item>
          )}
        </div>
      </Col>
    </Row>
  );
};
