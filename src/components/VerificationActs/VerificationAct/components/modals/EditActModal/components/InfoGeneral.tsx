import React, { FC, useState } from "react";
import { Col, DatePicker, Form, Input, Row } from "antd";
import locale from "antd/lib/date-picker/locale/ru_RU";

import "./styles.css";



export const InfoGeneral: FC = () => {

  
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
            <DatePicker locale={locale} format="DD.MM.YYYY" allowClear={false} />
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
    </Row>
  );
};
