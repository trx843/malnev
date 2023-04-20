import React from "react";
import { ITableCellRendererParams } from "components/AgGridTable/types";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { NumberOneSideItem } from "components/VerificationActs/VerificationAct/classes";
import { AccreditationValues } from "./constants";

export const AccreditationColumn: React.FC<
  ITableCellRendererParams<NumberOneSideItem>
> = ({ data }) => {
  if (!data.hasAccreditationIl) return null;

  if (data.hasAccreditationIl === AccreditationValues.yes) {
    return <CheckCircleOutlined style={{ color: "#219653" }} />;
  } else {
    return <CloseCircleOutlined style={{ color: "#FF4D4F" }} />;
  }
};
