import React from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileAddOutlined,
  VerticalAlignMiddleOutlined,
} from "@ant-design/icons";

import { getAdjustedValues, isButtonCreateVisible, isButtonSortVisible } from "./utils";
import { ModalModes } from "../../modals/ModalForAddingOrEditingEvent/constants";
import { Nullable } from "types";
import { useModals } from "components/ModalProvider";
import { TypicalViolationModalTypes } from "containers/ActPlanEliminationOfTypicalViolations/constants";
import { isOperationButtonDisabled } from "containers/ActPlanEliminationOfTypicalViolations/utils";
import "./styles.css";

interface IProps {
  data: any;
  status?: number;
  onCreate: (data: any) => void;
  onDelete: (data: any) => void;
  onEdit: (data: any) => void;
  length: number;
  rowIndex: number;
  handleAddingOrEditingEvent: (
    entity: Nullable<{ [key: string]: any }>,
    type: ModalModes
  ) => void;
}

export const ActionColumn: React.FC<IProps> = ({
  status,
  data,
  onCreate,
  onEdit,
  onDelete,
  length,
  rowIndex,
  handleAddingOrEditingEvent,
  ...props
}) => {
  const { setModal } = useModals();
  const handleEditingEvent = () => {
    const adjustedValues = getAdjustedValues(data, ModalModes.edit);
    handleAddingOrEditingEvent(adjustedValues, ModalModes.edit);
  };

  const handleAddingEvent = () => {
    const adjustedValues = getAdjustedValues(data, ModalModes.create);
    handleAddingOrEditingEvent(adjustedValues, ModalModes.create);
  };

  const handleDelete = () => {
    onDelete({ id: data.id, violationsId: data.typicalViolationId });
  };

  const handleSortModal = () => {
    setModal({
      payload: { id: data.identifiedTypicalViolationId },
      type: TypicalViolationModalTypes.SORT_TYPICAL_VIOLATION,
    });
  };

  return (
    <>
      <Tooltip title="Редактировать мероприятие">
        <Button
          className="plan-card-page-action-column__button-blue"
          onClick={handleEditingEvent}
          icon={<EditOutlined />}
          disabled={isOperationButtonDisabled(status)}
          type="link"
        />
      </Tooltip>
      {isButtonSortVisible(data) && (
        <Tooltip title="Изменить порядок">
          <Button
            className="ais-table-actions__item"
            icon={<VerticalAlignMiddleOutlined />}
            type="link"
            onClick={handleSortModal}
            disabled={isOperationButtonDisabled(status)}
          />
        </Tooltip>
      )}
      <Tooltip title="Удалить мероприятие">
        <Popconfirm
          title="Вы уверены, что хотите удалить мероприятие?"
          okText="Удалить"
          cancelText="Отмена"
          onConfirm={handleDelete}
          disabled={isOperationButtonDisabled(status)}
        >
          <Button
            className="plan-card-page-action-column__button-red"
            icon={<DeleteOutlined />}
            disabled={isOperationButtonDisabled(status)}
            type="link"
          />
        </Popconfirm>
      </Tooltip>
      {isButtonCreateVisible(data) && (
        <Tooltip title="Создать мероприятие">
          <Button
            className="plan-card-page-action-column__button-blue"
            onClick={handleAddingEvent}
            icon={<FileAddOutlined />}
            disabled={isOperationButtonDisabled(status)}
            type="link"
          />
        </Tooltip>
      )}
    </>
  );
};
