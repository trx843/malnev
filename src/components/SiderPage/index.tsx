import React, { FC } from "react";
import { Card, Typography } from "antd";

import { SiderField, SiderFieldProps } from "./SiderField";
import { SidePageProvider } from "./SidePageProvider";
import "./styles.css";

interface SiderPageProps {
  title?: string;
  loading?: boolean;
}

interface SiderPageControls {
  Field: FC<SiderFieldProps>;
}

const SiderControl: FC<SiderPageProps> = ({ title, loading, children }) => {
  return (
    <Card className="page-sider__container">
      <Typography.Title level={4}>{title}</Typography.Title>
      <div className="page-sider__list-fields">
        <SidePageProvider loading={loading}>{children}</SidePageProvider>
      </div>
    </Card>
  );
};

export const SiderPage = SiderControl as FC<SiderPageProps> & SiderPageControls;

SiderPage.Field = SiderField;
