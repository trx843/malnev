import React from "react";
import { Button, Tooltip } from "antd";
import FileDoneOutlined from "@ant-design/icons/FileDoneOutlined";
import { RendererProps } from "components/ItemsTable";
import { useDispatch } from "react-redux";
import { setSelectedIdentifiedViolationId } from "slices/pspControl/eliminationOfTypicalViolations";
import { IEliminationTypicalViolationInfoModel } from "api/requests/eliminationOfTypicalViolations/types";

export const ActionColumn: React.FC<RendererProps<IEliminationTypicalViolationInfoModel>> = ({
  data
}) => {
  const dispatch = useDispatch();
  return (
    data.statusId === 1 ? (<Tooltip title="Отметить устранение">
      <Button
        icon={<FileDoneOutlined />}
        type="link"
        style={{ color: "#32CD32" }}
        onClick={() => dispatch(setSelectedIdentifiedViolationId(data.id))}
      />
    </Tooltip>) : (null)
  );
};
