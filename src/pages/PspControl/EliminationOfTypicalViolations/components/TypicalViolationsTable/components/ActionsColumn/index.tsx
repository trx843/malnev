import React from "react";
import { Button, Tooltip } from "antd";
import { ExceptionOutlined, FileTextOutlined } from "@ant-design/icons";

interface IProps {
  data: any;
  openModalAddValidationInformation: (typicalViolation) => void;
  openModalVerificationInformation: (typicalViolation) => void;
}

export const ActionsColumn: React.FC<IProps> = ({
  data,
  openModalAddValidationInformation,
  openModalVerificationInformation,
}) => {

  return (
    <React.Fragment>
      <Tooltip title="Открыть информацию о проверке">
        <Button
          onClick={() => openModalVerificationInformation(data)}
          icon={<FileTextOutlined />}
          type="link"
        />
      </Tooltip>
      <Tooltip title="Отметить нарушение">
        <Button
          onClick={() => openModalAddValidationInformation(data)}
          icon={<ExceptionOutlined style={{ color: "#FF0000" }}/>}
          type="link"
        />
      </Tooltip>
    </React.Fragment>
  );
};
