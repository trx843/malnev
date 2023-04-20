import React, { FC } from "react";
import { Button, Tooltip } from "antd";
import ProfileOutlined from "@ant-design/icons/ProfileOutlined";
import { Link } from "react-router-dom";
import { ApiRoutes } from "../../../../api/api-routes.enum";
import { IdType } from "../../../../types";

export const PspControlInfoButton: FC<{
  id: IdType;
  className?: string;
}> = ({ id, className }) => (
  <Tooltip
    arrowPointAtCenter
    title={<span style={{ color: "black" }}>Открыть ПСП</span>}
    color="#ffffff"
    placement="bottomLeft"
  >
    <Link to={`${ApiRoutes.CheckingObjects}/${id}`} className={className}>
      <Button
        type="link"
        style={{ width: "100%" }}
        icon={<ProfileOutlined />}
      />
    </Link>
  </Tooltip>
);
