import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { ICellRendererParams } from "ag-grid-community";
import { CheckBoxCell } from "../../../../components/cellRenderers/CheckBoxCell";
import { FC } from "react";

export const AccreditationDataRenderer: FC<ICellRendererParams> = (
  props: ICellRendererParams
) => {
  if (props.data.osuTypeId === 1 || props.data.osuTypeId === 2) {
    return null;
  } else {
    return <CheckBoxCell value={props.data.isAccredited} />;
  }
};
