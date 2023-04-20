import React, {FC} from "react";
import {Button, Tooltip} from "antd";
import {FileAddOutlined} from "@ant-design/icons";

interface CreateActButtonProps {
  onClick: () => void;
  className?: string;
}

export const CreateActButton: FC<CreateActButtonProps> = ({
  onClick,
  className
}) => (
  <Tooltip
    arrowPointAtCenter
    title={<span style={{ color: "black" }}>Создать акт проверки</span>}
    color="#ffffff"
    placement="bottomLeft"
  >
    <Button
      className={className}
      onClick={onClick}
      type="link"
      style={{ width: "100%" }}
      icon={<FileAddOutlined />}
    />
  </Tooltip>
);
