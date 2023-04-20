import { Checkbox, Col, Modal, Row } from "antd";
import { FC } from "react";
import { TableColumnInfo } from "./types";

export const TableColumnSettingsModal: FC<{
  isVisible: boolean;
  columnState: TableColumnInfo[];
  onCheckboxChange: (colName: string | undefined, hide: boolean) => void;
  onCloseHandler: () => void;
  onSumbitHandler: (values) => void;
}> = ({
  columnState,
  isVisible,
  onCheckboxChange,
  onCloseHandler,
  onSumbitHandler,
}) => {
  return (
    <Modal
      title={"Настройка отображения колонок"}
      visible={isVisible}
      onCancel={onCloseHandler}
      onOk={onSumbitHandler}
      okText={"Сохранить"}
      cancelText={"Отменить"}
      footer={null}
    >
      {columnState &&
        columnState.map((col) => {
          return (
            col.field && (
              <Row>
                <Col>
                  <Checkbox
                    checked={!col.hide}
                    onChange={(e) =>
                      onCheckboxChange(col.field, e.target.checked)
                    }
                  >
                    {col.headerName}
                  </Checkbox>
                </Col>
              </Row>
            )
          );
        })}
    </Modal>
  );
};
