import React from "react";
import classNames from "classnames/bind";
import { Modal, Spin } from "antd";
import { AgGridTable } from "components/AgGridTable";
import { TableColumns } from "./constants";
import { Nullable } from "types";
import { aboutOsu } from "api/requests/pspControl/CheckingObjects";
import { ISuAbout } from "api/requests/pspControl/CheckingObjects/types";
import styles from "./modalInformationOnOsu.module.css";

const cx = classNames.bind(styles);

interface IProps {
  pspId: Nullable<string>;
  isVisible: boolean;
  onCancel: () => void;
}

export const ModalInformationOnOsu: React.FC<IProps> = ({
  pspId,
  isVisible,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [osuInfo, setOsuInfo] = React.useState<ISuAbout[]>([]);

  React.useEffect(() => {
    if (pspId) init(pspId);
  }, [pspId]);

  const init = async (pspId: string) => {
    setIsLoading(true);
    const osuInfo = await aboutOsu(pspId);
    setOsuInfo(osuInfo);
    setIsLoading(false);
  };

  const handleCloseModal = () => {
    onCancel();
    setOsuInfo([]);
  };

  return (
    <Modal
      className={cx("modal")}
      width="75%"
      visible={isVisible}
      title="Информация по ОСУ"
      onCancel={handleCloseModal}
      footer={null}
      destroyOnClose
      centered
    >
      <Spin spinning={isLoading}>
        <AgGridTable
          className={cx("table")}
          rowData={osuInfo}
          columnDefs={TableColumns}
          defaultColDef={{
            resizable: true,
          }}
          isAutoSizeColumns={false}
        />
      </Spin>
    </Modal>
  );
};
