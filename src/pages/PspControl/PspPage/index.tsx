import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Layout } from "antd";

import { PspObjectContainer } from "../../../containers/PspsControl/PspObjectContainer";
import "./psp-page.css";

const routes = [
  {
    path: "/pspcontrol/checkingobjects",
    breadcrumbName: "Объекты проверки"
  },
  {
    path: "",
    breadcrumbName: `ПСП`
  }
];

export const PspPage: FC = () => {
  const extraBreadcrumbItems = routes.map((route, index) => {
    if (!route.path) {
      return (
        <Breadcrumb.Item key={route.breadcrumbName}>
          {route.breadcrumbName}
        </Breadcrumb.Item>
      );
    }
    return (
      <Breadcrumb.Item key={route.breadcrumbName}>
        <Link to={route.path}>{route.breadcrumbName}</Link>
      </Breadcrumb.Item>
    );
  });

  return (
    <Layout className="psp-page__container">
      <Breadcrumb className="psp-page__breadcrumb" separator=">">
        {extraBreadcrumbItems}
      </Breadcrumb>
      <PspObjectContainer />
    </Layout>
  );
};
