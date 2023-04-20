import EditOutlined from "@ant-design/icons/EditOutlined";
import { ICellRendererParams } from "ag-grid-community";
import { Button } from "antd";
import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { setSelectedRiskId } from "../../../slices/riskSettings";
import { RiskItem } from "../../RisksEditor/types";

export const RiskEditRenderer: FC<ICellRendererParams> = ( props: ICellRendererParams) => {
  const dispatch = useDispatch()

  const item = props.data as RiskItem;

  const onClick = () => {
    dispatch(setSelectedRiskId(item.id))
  }

  return (
    <div>
      <Button
        type="link"
        onClick={onClick}
        style={{ width: "100%" }}
        icon={<EditOutlined />}
      />
    </div>
  )
}