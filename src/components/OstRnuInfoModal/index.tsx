import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Modal, Spin } from "antd";
import { StateType } from "../../types";
import {
  IOstRnuInfoStore,
  setOstRnuInfo,
  toggleOstRnuInfoModalVisibility,
} from "../../slices/ostRnuInfo";
import { getOstRnuInfoThunk } from "../../thunks/ostRnuInfo";
import { AgGridTable } from "../AgGridTable";
import { TableColumns } from "./constants";
import styles from "./ostRnuInfoModal.module.css";

const cx = classNames.bind(styles);

export const OstRnuInfoModal: React.FC = () => {
  const dispatch = useDispatch();

  const {
    isOstRnuInfoModalVisible,
    isOstRnuInfoLoading,
    ostRnuInfo,
    infoRequest,
  } = useSelector<StateType, IOstRnuInfoStore>((state) => state.ostRnuInfo);

  React.useEffect(() => {
    if (infoRequest) {
      dispatch(getOstRnuInfoThunk(infoRequest));
    }
  }, [infoRequest]);

  const handleCloseModal = () => {
    dispatch(toggleOstRnuInfoModalVisibility());
    dispatch(setOstRnuInfo([]));
  };

  return (
    <Modal
      width={1436}
      visible={isOstRnuInfoModalVisible}
      title="Данные по ОСТ и РНУ (количество)"
      onCancel={handleCloseModal}
      footer={null}
      destroyOnClose
      centered
    >
      <Spin spinning={isOstRnuInfoLoading}>
        <AgGridTable
          className={cx("table")}
          rowData={ostRnuInfo}
          columnDefs={TableColumns}
        />
      </Spin>
    </Modal>
  );
};
