
import React from "react";
import { Button } from "antd";
import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";

interface IProps {
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export const VerificationSchedulePageActionsRenderer: React.FC<IProps> = ({
  onClick
}) => {
  return (
    <Button
      style={{ color: '#1890FF' }}
      type="text"
      icon={<FileSearchOutlined />}
      onClick={onClick}
      size="small"
    />

  );
};
