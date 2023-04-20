import { Modal } from "antd";
import { FC } from "react";

type PropsType = {
  isModalVisible: boolean;
  deleteHandler: () => void;
  cancelHandler: () => void;
  confirmLoading: boolean;
};

export const FAQDeleteFileModel: FC<PropsType> = ({
  isModalVisible,
  deleteHandler,
  cancelHandler,
  confirmLoading,
}) => {
  return (
    <>
      {isModalVisible && (
        <Modal
          maskClosable={false}
          title={"Удалить файл"}
          visible={isModalVisible}
          onOk={deleteHandler}
          onCancel={cancelHandler}
          okType={"danger"}
          okText={"Удалить"}
          cancelText={"Отмена"}
          destroyOnClose
          confirmLoading={confirmLoading}
        >
          <p>Вы уверены, что хотите удалить файл?</p>
        </Modal>
      )}
    </>
  );
};
