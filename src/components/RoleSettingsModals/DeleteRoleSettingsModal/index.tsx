import { Modal } from "antd";
import "antd/dist/antd.css";
import React, { FC } from "react";


type PropsType = {
  isButtonLoading: boolean;
  isModalVisible: boolean;
  onCancelHandler: () => void;
  onOkHandler: () => void;
  modalText: string;
};

export const DeleteRoleSettingsModal: FC<PropsType> = React.memo(
  ({
    isModalVisible,
    onOkHandler,
    onCancelHandler,
    isButtonLoading,
    modalText
  }) => {
    return (
      <>
         <Modal
            title="Удаление"
            visible={isModalVisible}
            onOk={onOkHandler}
            confirmLoading={isButtonLoading}
            okType={"danger"}
            okText={"Удалить"}
            cancelText={"Отмена"}
            destroyOnClose
            onCancel={onCancelHandler}
          >
            <p>{modalText}</p>
          </Modal>
      </>
    );
  }
);
