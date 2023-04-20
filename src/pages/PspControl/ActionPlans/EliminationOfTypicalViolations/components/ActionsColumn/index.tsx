import React from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames/bind";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileAddOutlined,
  VerticalAlignMiddleOutlined,
  FormOutlined,
} from "@ant-design/icons";
import {
  getAdjustedValues,
  isButtonCreateDisabled,
  isButtonCreateVisible,
  isButtonDeleteDisabled,
  isButtonEditAndDeleteVisible,
  isButtonEditDisabled,
  isButtonEditTypicalViolation,
  isButtonSortVisible,
  isOperationButtonDisabled,
} from "./utils";
import { ModalModes, PlanStatuses } from "../../../../../../enums";
import {
  getViolationsByAreaOfResponsibilityThunk,
  removeActionPlanPageThunk,
} from "thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { AreasOfResponsibility } from "../../constants";
import { Nullable } from "types";
import {
  HandleSetModalForAddingOrEditingEventInfo,
  HandleSetSortingViolationsModalInfo,
} from "../../types";
import styles from "./actionColumn.module.css";

const cx = classNames.bind(styles);

interface IProps {
  data: any;
  planStatusId: PlanStatuses;
  handleAddingOrEditingEvent: HandleSetModalForAddingOrEditingEventInfo;
  openSortingViolationsModal: HandleSetSortingViolationsModalInfo;
  areasOfResponsibility: AreasOfResponsibility;
  handleViolationEditing: (
    payload: Nullable<string>,
    mode: ModalModes,
    violationValues: any
  ) => void;
}

export const ActionsColumn: React.FC<IProps> = ({
  data,
  planStatusId,
  handleAddingOrEditingEvent,
  openSortingViolationsModal,
  areasOfResponsibility,
  handleViolationEditing,
}) => {
  const dispatch = useDispatch();

  const handleEditingEvent = () => {
    const adjustedValues = getAdjustedValues(data, ModalModes.edit);
    handleAddingOrEditingEvent(adjustedValues, ModalModes.edit);
  };

  const handleAddingEvent = () => {
    const adjustedValues = getAdjustedValues(data, ModalModes.create);
    handleAddingOrEditingEvent(adjustedValues, ModalModes.create);
  };

  const handleDeleteActionPlan = async () => {
    await dispatch(removeActionPlanPageThunk(data?.actionPlan_id));
    dispatch(getViolationsByAreaOfResponsibilityThunk(areasOfResponsibility));
  };

  return (
    <React.Fragment>
      {isButtonEditAndDeleteVisible(data) && (
        <React.Fragment>
          <Tooltip title="Редактировать мероприятие">
            <Button
              onClick={handleEditingEvent}
              disabled={isButtonEditDisabled(planStatusId)}
              icon={<EditOutlined />}
              type="link"
            />
          </Tooltip>

          <Tooltip title="Удалить мероприятие">
            <Popconfirm
              title="Вы уверены, что хотите удалить мероприятие?"
              okText="Удалить"
              cancelText="Отмена"
              onConfirm={handleDeleteActionPlan}
              disabled={
                isButtonDeleteDisabled(planStatusId) ||
                data.typicalViolation_actionPlan.length < 2
              }
            >
              <Button
                className={cx("button-delete")}
                icon={<DeleteOutlined />}
                disabled={
                  isButtonDeleteDisabled(planStatusId) ||
                  data.typicalViolation_actionPlan.length < 2
                }
                type="link"
              />
            </Popconfirm>
          </Tooltip>
        </React.Fragment>
      )}
      {isButtonCreateVisible(data) && (
        <Tooltip title="Создать мероприятие">
          <Button
            onClick={handleAddingEvent}
            icon={<FileAddOutlined />}
            disabled={isButtonCreateDisabled(planStatusId)}
            type="link"
          />
        </Tooltip>
      )}

      {isButtonSortVisible(data) && (
        <Tooltip title="Изменить порядок">
          <Button
            onClick={() =>
              openSortingViolationsModal(data?._typicalViolations || [])
            }
            icon={<VerticalAlignMiddleOutlined />}
            disabled={isOperationButtonDisabled(planStatusId)}
            type="link"
          />
        </Tooltip>
      )}
      {isButtonEditTypicalViolation(data) && (
        <Tooltip title="Редактировать нарушение">
          <Button
            onClick={() =>
              handleViolationEditing(
                data.typicalViolation_identifiedTypicalViolationId,
                ModalModes.edit,
                null
              )
            }
            icon={<FormOutlined />}
            disabled={isOperationButtonDisabled(planStatusId)}
            type="link"
          />
        </Tooltip>
      )}
    </React.Fragment>
  );
};
