import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { ModalModes } from "../ModalForAddingOrEditingEvent/constants";
import {
  getAdjustedValues,
  isButtonCreateDisabled,
  isButtonCreateVisible,
  isButtonDeleteDisabled,
  isButtonEditAndDeleteVisible,
  isButtonEditDisabled,
} from "./utils";
import { deleteActionPlanThunk } from "thunks/pspControl/planCard";
import { Nullable, StateType } from "types";
import { PlanStatuses } from "../../../../../enums";
import { ActionsEnum, Can } from "../../../../../casl";
import {
  elementId,
  ActionPlansElements,
} from "pages/PspControl/ActionPlans/constant";
import { ModalEntityTypes } from "components/ModalForAddingOrEditingEvent/constants";
import styles from "./actionColumn.module.css";
import { IPlanCardStore } from "slices/pspControl/planCard";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

const cx = classNames.bind(styles);

interface IProps {
  data: any;
  planStatusId: PlanStatuses;
  handleAddingOrEditingEvent: (
    entity: Nullable<{ [key: string]: any }>,
    type: ModalModes
  ) => void;
  entityType: ModalEntityTypes;
}

export const ActionsColumn: React.FC<IProps> = ({
  data,
  planStatusId,
  handleAddingOrEditingEvent,
  entityType,
}) => {
  const dispatch = useDispatch();


  const handleEditingEvent = () => {
    const adjustedValues = getAdjustedValues(data, entityType, ModalModes.edit);
    handleAddingOrEditingEvent(adjustedValues, ModalModes.edit);
  };

  const handleAddingEvent = () => {
    const adjustedValues = getAdjustedValues(
      data,
      entityType,
      ModalModes.create
    );
    handleAddingOrEditingEvent(adjustedValues, ModalModes.create);
  };

  return (
    !data.violation_disableforCheck ? (<>
      {isButtonEditAndDeleteVisible(data) && (
        <>
          <Can
            I={ActionsEnum.View}
            a={elementId(ActionPlansElements[ActionPlansElements.EditAction])}
          >
            <Tooltip title="Редактировать мероприятие">
              <Button
                onClick={handleEditingEvent}
                disabled={isButtonEditDisabled(planStatusId)}
                icon={<EditOutlined />}
                type="link"
              />
            </Tooltip>
          </Can>
          <Can
            I={ActionsEnum.View}
            a={elementId(ActionPlansElements[ActionPlansElements.DelAction])}
          >
            <Tooltip title="Удалить мероприятие">
              <Popconfirm
                title="Вы уверены, что хотите удалить мероприятие?"
                okText="Удалить"
                cancelText="Отмена"
                onConfirm={() =>
                  dispatch(deleteActionPlanThunk(data?.actionPlan_id))
                }
                disabled={isButtonDeleteDisabled(planStatusId)}
              >
                <Button
                  className={cx("button-delete")}
                  icon={<DeleteOutlined />}
                  disabled={isButtonDeleteDisabled(planStatusId)}
                  type="link"
                />
              </Popconfirm>
            </Tooltip>
          </Can>
        </>
      )}
      {isButtonCreateVisible(data) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(ActionPlansElements[ActionPlansElements.AddAction])}
        >
          <Tooltip title="Создать мероприятие">
            <Button
              onClick={handleAddingEvent}
              icon={<FileAddOutlined />}
              disabled={isButtonCreateDisabled(planStatusId)}
              type="link"
            />
          </Tooltip>
        </Can>
      )}
    </>) : (null)
  );
};
