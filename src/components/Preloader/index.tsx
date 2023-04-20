import { Row, Col, Spin } from "antd";
import React, { FC } from "react";

export const Preloader: FC = () => {
  return (
    <div style={{ padding: 15 }}>
      <Row align="middle" style={{ marginTop: 150 }}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Spin size="large" tip="Загрузка приложения..." />
        </Col>
      </Row>
    </div>
  );
};
