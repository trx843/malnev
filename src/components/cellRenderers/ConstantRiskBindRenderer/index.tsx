import { ICellRendererParams } from "ag-grid-community";
import React, { FC, useState } from "react";
import { Button, } from "antd";
import { SiknEditorTableItem } from "../../SiknEditor/types";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { useDispatch } from "react-redux";
import { RiskSettingsModals, setOpenedModal, setSelectedSiknArr } from "../../../slices/riskSettings";

export const ConstantRiskBindRenderer: FC<ICellRendererParams> = (
  props: ICellRendererParams
) => {
  const dispatch = useDispatch()

  const item = props.data as SiknEditorTableItem;

  const toggleModal = () => {
    dispatch(setSelectedSiknArr([item.id]));
    dispatch(setOpenedModal(RiskSettingsModals.riskBindModal));
  };

  return(
    <div>
      <Button
        type="link"
        onClick={toggleModal}
        style={{ width: "100%" }}
        icon={<EditOutlined />}
      />
    </div>
  );
};