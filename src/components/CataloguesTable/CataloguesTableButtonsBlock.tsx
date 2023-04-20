import React, { FC } from "react";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import { Card, Col, Row, Tooltip } from "antd";
import { UniButton } from "../UniButton";

type PropsType = {
  setIsCreateModalVisible: (value: boolean) => void;
  setIsUpdateModalVisible: (value: boolean) => void;
  setIsDeleteModalVisible: (value: boolean) => void;
  setModalTitle: (modalTitle: string) => void;
  isButtonsDisabled: boolean;
};

export const CataloguesTableButtonsBlock: FC<PropsType> = React.memo(({ setIsCreateModalVisible,
  setIsUpdateModalVisible, setIsDeleteModalVisible, setModalTitle, isButtonsDisabled }) => {

  const createButtonHandler = (modalTitle: string) => {
    setModalTitle(modalTitle);
    setIsCreateModalVisible(true);
  };

  const updateButtonHandler = (modalTitle: string) => {
    setModalTitle(modalTitle);
    setIsUpdateModalVisible(true);
  };

  const deleteButtonHandler = (modalTitle: string) => {
    setModalTitle(modalTitle);
    setIsDeleteModalVisible(true);
  };

  return <Card >
    <Row>
      <Col>
        <Tooltip title="Добавить запись">
          <UniButton
            buttonHandler={() => createButtonHandler("Добавить запись")}
            icon={<PlusOutlined />}
            title={"Добавить запись"}
            type={"text"}
          />
        </Tooltip>
      </Col>
      <Col style={{ marginLeft: "15px" }}>
        <Tooltip title="Редактировать запись">
          <UniButton
            buttonHandler={() => updateButtonHandler("Редактировать запись")}
            isDisabled={isButtonsDisabled}
            icon={<EditOutlined />}
            title={"Редактировать запись"}
            type={"text"}
          />
        </Tooltip>
      </Col>
      <Col style={{ marginLeft: "15px" }}>
        <Tooltip title="Удалить запись">
          <UniButton
            buttonHandler={() => deleteButtonHandler("Удалить запись")}
            isDisabled={isButtonsDisabled}
            icon={<CloseOutlined />}
            title={"Удалить запись"}
            danger={true}
            type={"text"}
          />
        </Tooltip>
      </Col>
    </Row>
  </Card>
});