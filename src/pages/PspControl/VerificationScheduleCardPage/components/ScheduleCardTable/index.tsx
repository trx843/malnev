import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Button, notification } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import { ModelUpdatedEvent } from "ag-grid-community";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { Nullable, StateType } from "../../../../../types";
import { getVerificationScheduleCardInfoThunk } from "../../../../../thunks/pspControl/verificationScheduleCard";
import {
  IVerificationScheduleCardStore,
  setNotificationVerSched,
  setVerificationScheduleGroupInfo,
} from "../../../../../slices/pspControl/verificationScheduleCard";
import {
  ISiknLabRsuVerificationSchedulesGroup,
  NotificationVerSched,
} from "slices/pspControl/verificationScheduleCard/types";
import { InitModalInfo } from "./constants";
import { ModalScheduleEditing } from "../ModalScheduleEditing";
import { ModalForAddingCheckingObjects } from "../ModalForAddingCheckingObjects";
import { CreateActModal } from "../CreateActModal";
import { getTableColumns, isAddCheckingObjectsButtonDisabled } from "./utils";
import { autoSizeAll } from "components/AgGridTable/utils";
import { ActionsEnum, Can } from "../../../../../casl";
import {
  elementId,
  VerificationScheduleElements,
} from "../../../VerificationSchedulePage/constant";
import { IModalInfo } from "./types";
import styles from "./scheduleCardTable.module.css";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";
import { basename } from "../../../../../history/history";

const cx = classNames.bind(styles);

export const ScheduleCardTable: FC = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const dispatch = useDispatch();
  const { tableData, verificationScheduleCardInfo, notificationVerSched } =
    useSelector<StateType, IVerificationScheduleCardStore>(
      (state) => state.verificationScheduleCard
    );
  const { isUserAllowedOst } = useSelector<StateType, HomeStateType>(
    (state) => state.home
  );

  const isOperationDisabled = verificationLevelHandler(
    isUserAllowedOst,
    verificationScheduleCardInfo?.verificationLevel
  );

  const [isModalScheduleEditingVisible, setModalScheduleEditingVisibility] =
    useState(false);

  const [
    isModalForAddingCheckingObjectsVisible,
    setModalForAddingCheckingObjectsVisibility,
  ] = useState(false);

  const [modalCreateActModalInfo, setModalCreateActModalInfo] =
    useState<IModalInfo>(InitModalInfo);

  useEffect(() => {
    function init() {
      dispatch(getVerificationScheduleCardInfoThunk(scheduleId));
    }

    if (scheduleId) init();
  }, [scheduleId]);

  useEffect(() => {
    if (notificationVerSched.length > 0) {
      createNotificationForVerSched(notificationVerSched);
      dispatch(setNotificationVerSched([]));
    }
  }, [notificationVerSched]);

  const toggleModalScheduleEditingVisibility = () => {
    setModalScheduleEditingVisibility(!isModalScheduleEditingVisible);
  };

  const toggleModalForAddingCheckingObjectsVisibility = () => {
    setModalForAddingCheckingObjectsVisibility(
      !isModalForAddingCheckingObjectsVisible
    );
  };

  const handleSetModalCreateActModalInfo = (
    ostRnuPspId: Nullable<string> = null
  ) => {
    setModalCreateActModalInfo({
      ostRnuPspId,
      visible: !modalCreateActModalInfo.visible,
    });
  };

  const handleCloseModalScheduleEditing = () => {
    dispatch(setVerificationScheduleGroupInfo(null));
    toggleModalScheduleEditingVisibility();
  };

  const handleEditSchedule = (data: ISiknLabRsuVerificationSchedulesGroup) => {
    dispatch(setVerificationScheduleGroupInfo(data));
    toggleModalScheduleEditingVisibility();
  };

  const createNotificationForVerSched = (data: NotificationVerSched[]) => {

    data.forEach((element) => {
      const key = `verSchedLink-${element.verificationScheduleId}`;
      notification.warn({
        message:
          "Введенные интервалы пересекаются с существующим графиком проверки",
        description: element.verificationScheduleName,
        duration: 0,
        btn: (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              notification.close(key);
            }}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${basename}pspcontrol/verification-schedule/${element.verificationScheduleId}`}
            >
              Перейти в график
            </a>
          </Button>
        ),
        key,
      });
    });
  };

  return (
    <div className={cx("wrapper")}>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationScheduleElements[
          VerificationScheduleElements.AddCheckObject
          ]
        )}
      >
        <Button
          className={cx("addCheckingObjectsButton")}
          onClick={toggleModalForAddingCheckingObjectsVisibility}
          disabled={
            isAddCheckingObjectsButtonDisabled(
              verificationScheduleCardInfo?.verificationStatusId
            ) || isOperationDisabled
          }
          icon={<PlusCircleFilled />}
          type="link"
        >
          Добавить объекты проверки
        </Button>
      </Can>

      <AgGridTable
        defaultColDef={{
          sortable: false,
          resizable: true,
        }}
        rowData={tableData}
        columnDefs={getTableColumns(
          handleEditSchedule,
          handleSetModalCreateActModalInfo
        )}
        rowHeight={220}
      />

      <ModalScheduleEditing
        isVisible={isModalScheduleEditingVisible}
        onCancel={handleCloseModalScheduleEditing}
        scheduleId={scheduleId}
      />
      <ModalForAddingCheckingObjects
        isVisible={isModalForAddingCheckingObjectsVisible}
        onCancel={toggleModalForAddingCheckingObjectsVisibility}
      />
      <CreateActModal
        isVisible={modalCreateActModalInfo.visible}
        ostRnuPspId={modalCreateActModalInfo.ostRnuPspId}
        onCancel={handleSetModalCreateActModalInfo}
      />
    </div>
  );
};
