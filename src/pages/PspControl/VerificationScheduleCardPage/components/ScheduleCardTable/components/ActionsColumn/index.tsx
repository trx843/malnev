import React from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { ISiknLabRsuVerificationSchedulesGroup } from "slices/pspControl/verificationScheduleCard/types";
import { ITableCellRendererParams } from "../../../../../../../components/AgGridTable/types";
import { Nullable, StateType } from "../../../../../../../types";
import { deleteVerificationSchedulePspThunk } from "thunks/pspControl/verificationScheduleCard";
import { IVerificationScheduleCardStore } from "slices/pspControl/verificationScheduleCard";
import {
  isCreateActButtonDisabled,
  isDeleteCheckingObjectButtonDisabled,
  isEditCheckingObjectButtonDisabled,
  isOpenPspButtonDisabled,
} from "./utils";
import { ActionsEnum, Can } from "../../../../../../../casl";
import {
  elementId,
  VerificationScheduleElements,
} from "pages/PspControl/VerificationSchedulePage/constant";
import { ApiRoutes } from "api/api-routes.enum";
import styles from "./actionsColumn.module.css";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

const cx = classNames.bind(styles);

interface IProps
  extends ITableCellRendererParams<ISiknLabRsuVerificationSchedulesGroup> {
  handleEditSchedule: (data: ISiknLabRsuVerificationSchedulesGroup) => void;
  openModalCreateAct: (ostRnuPspId: Nullable<string>) => void;
}

export const ActionsColumn: React.FC<IProps> = ({
  data,
  handleEditSchedule,
  openModalCreateAct,
}) => {
  const dispatch = useDispatch();

  const { verificationScheduleCardInfo } = useSelector<
    StateType,
    IVerificationScheduleCardStore
  >((state) => state.verificationScheduleCard);
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, verificationScheduleCardInfo?.verificationLevel);

  const verificationScheduleId = verificationScheduleCardInfo?.id;
  const verificationStatusId =
    verificationScheduleCardInfo?.verificationStatusId;

  const ostRnuPspId = data.id;
  const listOfSiknLabRsuIds = data.listOfSiknLabRsuIds;
  const hasDates = data.hasDates;
  const isActExist = data.isActExist;

  const handleDeleteVerificationSchedulePspThunk = () => {
    if (verificationScheduleId) {
      dispatch(
        deleteVerificationSchedulePspThunk({
          verificationScheduleId: verificationScheduleId,
          pspId: ostRnuPspId,
          listOfSiknLabRsuIds: listOfSiknLabRsuIds,
          hasDates: hasDates
        })
      );
    }
  };

  return (
    <React.Fragment>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationScheduleElements[
          VerificationScheduleElements.EditSchedule
          ]
        )}
      >
        <Tooltip title="Редактировать объект проверки">
          <Button
            onClick={() => handleEditSchedule(data)}
            icon={<EditOutlined />}
            disabled={isEditCheckingObjectButtonDisabled(verificationStatusId) || isOperationDisabled}
            type="link"
          />
        </Tooltip>
      </Can>

      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationScheduleElements[VerificationScheduleElements.DelCheckObject]
        )}
      >
        <Tooltip title="Удалить объект проверки">
          <Popconfirm
            title="Вы уверены, что хотите удалить объект графика?"
            okText="Удалить"
            cancelText="Отмена"
            onConfirm={handleDeleteVerificationSchedulePspThunk}
            disabled={isDeleteCheckingObjectButtonDisabled(verificationStatusId) || isOperationDisabled}
          >
            <Button
              className={cx("button-delete")}
              icon={<DeleteOutlined />}
              type="link"
              disabled={isDeleteCheckingObjectButtonDisabled(
                verificationStatusId
              ) || isOperationDisabled}
            />
          </Popconfirm>
        </Tooltip>
      </Can>

      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationScheduleElements[VerificationScheduleElements.AddCheckAct]
        )}
      >
        <Tooltip title="Создать акт проверки">
          <Button
            onClick={() => openModalCreateAct(ostRnuPspId)}
            icon={<FileAddOutlined />}
            disabled={isCreateActButtonDisabled(verificationStatusId, isActExist) || isOperationDisabled}
            type="link"
          />
        </Tooltip>
      </Can>

      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationScheduleElements[VerificationScheduleElements.OpenPSP]
        )}
      >
        <Tooltip title="Открыть ПСП">
          <Link to={`${ApiRoutes.CheckingObjects}/${ostRnuPspId}`}>
            <Button
              icon={<ProfileOutlined />}
              type="link"
              disabled={isOpenPspButtonDisabled(verificationStatusId)}
            />
          </Link>
        </Tooltip>
      </Can>

      <Tooltip title="Перейти в акт проверки">
        <Link to={`/pspcontrol/verification-acts/${data?.objectsInfo?.verificationActId}`}>
          <span style={{ cursor: !isActExist ? 'not-allowed' : 'pointer' }}>
            <Button
              icon={<FileSearchOutlined />}
              type="link"
              disabled={!isActExist}
              style={{ pointerEvents: 'none' }}
            />
          </span>
        </Link>
      </Tooltip>
    </React.Fragment>
  );
};
