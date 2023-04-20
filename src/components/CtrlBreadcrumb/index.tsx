import { FC } from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

export const CtrlBreadcrumb: FC<{ pageName: string }> = ({ pageName }) => {
  const routes = [
    {
      path: "/pspcontrol/checkingobjects",
      name: "Объекты проверки",
    },
    {
      name: pageName,
    },
  ];

  const breadcrumbItems = routes.map((route) => {
    if (!route.path) {
      return <Breadcrumb.Item key={route.name}>{route.name}</Breadcrumb.Item>;
    }

    return (
      <Breadcrumb.Item key={route.name}>
        <Link to={route.path}>{route.name}</Link>
      </Breadcrumb.Item>
    );
  });

  return <Breadcrumb separator=">">{breadcrumbItems}</Breadcrumb>;
};
