import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, FileSearchOutlined } from "@ant-design/icons";
import { getDeleteButtonState } from "./utils";
import { deleteVerificationScheduleThunk } from "../../../../../thunks/pspControl/verificationSchedule";
import { ITableCellRendererParams } from "components/AgGridTable/types";
import { IVerificationSchedulesModel } from "slices/pspControl/verificationSchedule/types";
import styles from "./actionsColumn.module.css";
import { ActionsEnum, Can } from "../../../../../casl";
import { elementId, VerificationScheduleElements } from "pages/PspControl/VerificationSchedulePage/constant";
import { StateType } from "types";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

const cx = classNames.bind(styles);

export const ActionsColumn: React.FC<ITableCellRendererParams<IVerificationSchedulesModel>> =
  ({ data }) => {
    const dispatch = useDispatch();
    const { isUserAllowedOst } = useSelector<
      StateType,
      HomeStateType
    >((state) => state.home);

    const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, data.verificationLevelId);

    const isDeleteButtonDisabled = getDeleteButtonState(data.status);

    return (
      <React.Fragment>
        <Can
          I={ActionsEnum.View}
          a={elementId(VerificationScheduleElements[VerificationScheduleElements.OpenCheckSchedule])}
        >
          <Link to={`/pspcontrol/verification-schedule/${data.id}`}>
            <Tooltip title="Открыть график проверки">
              <Button icon={<FileSearchOutlined />} type="link" />
            </Tooltip>
          </Link>
        </Can>
        <Can
          I={ActionsEnum.View}
          a={elementId(VerificationScheduleElements[VerificationScheduleElements.DelCheckSchedule])}
        >
          <Tooltip
            title={
              isDeleteButtonDisabled
                ? "Удаление невозможно"
                : "Удалить график проверки"
            }
          >
            <Popconfirm
              title="Вы уверены, что хотите удалить график проверки?"
              okText="Удалить"
              cancelText="Отмена"
              onConfirm={() =>
                dispatch(deleteVerificationScheduleThunk(data.id.toString()))
              }
              disabled={isDeleteButtonDisabled || data.onceSigned || isOperationDisabled}
            >
              <Button
                className={cx("button-delete")}
                icon={<DeleteOutlined />}
                disabled={isDeleteButtonDisabled || data.onceSigned || isOperationDisabled}
                type="text"
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Can>
      </React.Fragment>
    );
  };
