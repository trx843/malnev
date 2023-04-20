import React from "react";
import classNames from "classnames/bind";
import { Modal, Spin } from "antd";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { TableColumns } from "./constants";
import { Nullable } from "../../../../../types";
import { IEliminationInfo } from "../../../../../slices/pspControl/eliminationOfViolations/types";
import { getEliminationInfo } from "../../../../../thunks/pspControl/eliminationOfViolations";
import { IVerificationInformationInfo } from "../ViolationsTable/types";
import styles from "./modalVerificationInformation.module.css";

const cx = classNames.bind(styles);

interface IProps {
  verificationInformationInfo: Nullable<IVerificationInformationInfo>;
  isVisible: boolean;
  onCancel: () => void;
}

export const ModalVerificationInformation: React.FC<IProps> = ({
  verificationInformationInfo,
  isVisible,
  onCancel,
}) => {
  const [isEliminationInfoLoading, setIsEliminationInfoLoading] =
    React.useState(false);
  const [eliminationInfo, setEliminationInfo] = React.useState<
    IEliminationInfo[]
  >([]);

  const { id, title } = verificationInformationInfo ?? {};

  React.useEffect(() => {
    async function init() {
      setIsEliminationInfoLoading(true);
      const eliminationInfo = await getEliminationInfo(id as string);
      setIsEliminationInfoLoading(false);
      setEliminationInfo(eliminationInfo);
    }

    if (id) init();
  }, [id]);

  return (
    <Modal
      width="85%"
      visible={isVisible}
      title={title}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      centered
    >
      <Spin wrapperClassName={cx("spin")} spinning={isEliminationInfoLoading}>
        <AgGridTable
          defaultColDef={{
            width: 200,
            autoHeight: true,
            wrapText: true,
            cellClass: cx("cell"),
          }}
          className={cx("table")}
          rowData={eliminationInfo}
          columnDefs={TableColumns}
          isAutoSizeColumns={false}
        />
      </Spin>
    </Modal>
  );
};
