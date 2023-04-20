import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Popconfirm, Tooltip } from "antd";
import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { Link } from "react-router-dom";
import { EventPlanItem } from "../../classes";
import { RendererProps } from "../../../../../components/ItemsTable";
import { isDeleteButtonVisible } from "./utils";
import { deleteActionPlanThunk } from "../../../../../thunks/pspControl/actionPlans";
import "./styles.css";
import { ActionsEnum, Can } from "../../../../../casl";
import { ActionPlansElements, elementId } from "pages/PspControl/ActionPlans/constant";
import { StateType } from "types";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

export const ActionColumn: React.FC<RendererProps<EventPlanItem>> = ({
  data
}) => {
  const dispatch = useDispatch();



  return (
    <React.Fragment>
      <Can
        I={ActionsEnum.View}
        a={elementId(ActionPlansElements[ActionPlansElements.OpenActionPlan])}
      >
        <Link to={`/pspcontrol/action-plans/cards/${data.id}`}>
          <Tooltip title="Открыть план мероприятий">
            <Button
              className="action-plans-page-action-column__button-file"
              icon={<FileSearchOutlined />}
              type="text"
              size="small"
            />
          </Tooltip>
        </Link>
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(ActionPlansElements[ActionPlansElements.DelActionPlan])}
      >
        {isDeleteButtonVisible(data.verificationStatus) && (
          <Tooltip title="Удалить план мероприятий">
            <Popconfirm
              title="Вы уверены, что хотите удалить мероприятие?"
              okText="Удалить"
              cancelText="Отмена"
              onConfirm={() =>
                dispatch(deleteActionPlanThunk(data.id.toString()))
              }
            >
              <Button
                className="action-plans-page-action-column__button-delete"
                icon={<DeleteOutlined />}
                type="text"
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        )}
      </Can>
    </React.Fragment>
  );
};
