import React, { FunctionComponent } from "react";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { Tooltip } from "antd";

interface ICheckBoxCellProps {
  value: boolean;
}

export const CheckBoxCell: FunctionComponent<ICheckBoxCellProps> = (
  props: ICheckBoxCellProps
) => {
  if (props.value) {
    return (
      <Tooltip title={"Да"}>
        <CheckCircleOutlined
          style={{ alignContent: "center", fontSize: "20px", color: "#219653" }}
        />
      </Tooltip>

    );
  } else {
    return (
      <Tooltip title={"Нет"}>
        <CloseCircleOutlined
          style={{ alignContent: "center", fontSize: "20px", color: "#FF4D4F" }}
        />
      </Tooltip>
    );
  }
};
