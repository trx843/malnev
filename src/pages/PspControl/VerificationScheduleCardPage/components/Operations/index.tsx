import React from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { Button, message } from "antd";
import {
  CheckCircleOutlined,
  ExportOutlined,
  FileSyncOutlined,
} from "@ant-design/icons";
import { Attachments } from "../Attachments";
import { StateType } from "../../../../../types";
import { IVerificationScheduleCardStore } from "../../../../../slices/pspControl/verificationScheduleCard";
import {
  exportToExcel,
  verificationSchedulesHasMain,
} from "../../../../../api/requests/pspControl/VerificationScheduleCard";
import {
  signVerificationScheduleThunk,
  verificationSchedulesAttachmentSendThunk,
} from "../../../../../thunks/pspControl/verificationSchedule";
import { ActionsEnum, Can } from "../../../../../casl";
import {
  elementId,
  VerificationScheduleElements,
} from "../../../VerificationSchedulePage/constant";
import {
  isEditButtonVisible,
  isExportButtonVisible,
  isFinishCreationButtonVisible,
  isFinishEditingButtonVisible,
  isRevisionButtonVisible,
  isSeDApprovalButtonVisible,
} from "./utils";
import { StatusesIds } from "enums";
import { MainAttachmentErrorMessage } from "../../../../../constants";
import { getScheduleAttachmentsThunk } from "thunks/pspControl/verificationScheduleCard";
import styles from "./operations.module.css";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

const cx = classNames.bind(styles);

export const Operations: React.FC = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const dispatch = useDispatch();

  const { verificationScheduleCardInfo, isScheduleAttachmentsLoading } = useSelector<
    StateType,
    IVerificationScheduleCardStore
  >((state) => state.verificationScheduleCard);
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, verificationScheduleCardInfo?.verificationLevel);

  const verificationStatusId =
    verificationScheduleCardInfo?.verificationStatusId;
  const verificationScheduleId = verificationScheduleCardInfo?.id;
  const [exportDisabled, setExportDisabled] = React.useState<{ disabled: boolean, loading: boolean }>({ disabled: false, loading: false });
  const [approvalInSedBtn, setApprovalInSedBtn] = React.useState<{ disabled: boolean, loading: boolean }>({ disabled: false, loading: false });
  const [modificationBtn, setModificationBtn] = React.useState<{ disabled: boolean, loading: boolean }>({ disabled: false, loading: false });
  const [editingBtn, setEditingBtn] = React.useState<{ disabled: boolean, loading: boolean }>({ disabled: false, loading: false });
  const [signedBtn, setSignedBtn] = React.useState<{ disabled: boolean, loading: boolean }>({ disabled: false, loading: false });

  const exportClickHandler = async () => {
    setExportDisabled({ disabled: false, loading: true });
    await exportToExcel(
      verificationScheduleCardInfo?.header ?? "Н/д",
      scheduleId
    );
    setExportDisabled({ disabled: false, loading: false });
  };

  const handleChangeStatus = async (newStatus: StatusesIds) => {
    if (verificationScheduleId) {
      setApprovalInSedBtn({ disabled: true, loading: false });
      setModificationBtn({ disabled: true, loading: false });
      setEditingBtn({ disabled: true, loading: false });
      setSignedBtn({ disabled: true, loading: false });
      setExportDisabled({ disabled: true, loading: false });

      if (newStatus === StatusesIds.Signed) {
        setSignedBtn({ disabled: false, loading: true });
        const hasMain = await verificationSchedulesHasMain(
          verificationScheduleId
        );

        if (!hasMain) {
          message.error({
            content: MainAttachmentErrorMessage,
            duration: 2,
          });
          setSignedBtn({ disabled: false, loading: false });
          setModificationBtn({ disabled: false, loading: false });
          setEditingBtn({ disabled: false, loading: false });
          setExportDisabled({ disabled: false, loading: false });
          setApprovalInSedBtn({ disabled: false, loading: false });
          return;
        }
      }

      if (newStatus === StatusesIds.Modification) {
        setModificationBtn({ disabled: false, loading: true });
      }
      if (newStatus === StatusesIds.Editing) {
        setEditingBtn({ disabled: false, loading: true });
      }
      if (newStatus === StatusesIds.ApprovalInSED) {
        setApprovalInSedBtn({ disabled: false, loading: true });
      }
      await dispatch(
        signVerificationScheduleThunk({
          id: verificationScheduleId,
          newStatus,
        })
      );
      setSignedBtn({ disabled: false, loading: false });
      setModificationBtn({ disabled: false, loading: false });
      setEditingBtn({ disabled: false, loading: false });
      setExportDisabled({ disabled: false, loading: false });

      if (newStatus === StatusesIds.ApprovalInSED && verificationStatusId) {
        await dispatch(
          verificationSchedulesAttachmentSendThunk({
            scheduleId: verificationScheduleId,
            oldStatus: verificationStatusId
          })
        );
        dispatch(getScheduleAttachmentsThunk(verificationScheduleId));
      }
      setApprovalInSedBtn({ disabled: false, loading: false });
    }
  };

  return (
    <React.Fragment>
      {isSeDApprovalButtonVisible(verificationStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            VerificationScheduleElements[VerificationScheduleElements.ApproveInSED]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            onClick={() => handleChangeStatus(StatusesIds.ApprovalInSED)}
            icon={<CheckCircleOutlined />}
            type="link"
            disabled={approvalInSedBtn.disabled || isScheduleAttachmentsLoading || isOperationDisabled}
            loading={approvalInSedBtn.loading}
          >
            Согласовать в СЭД
          </Button>
        </Can>
      )}
      {isRevisionButtonVisible(verificationStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            VerificationScheduleElements[VerificationScheduleElements.Finalize]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            icon={<FileSyncOutlined />}
            onClick={() => handleChangeStatus(StatusesIds.Modification)}
            type="link"
            disabled={modificationBtn.disabled || isScheduleAttachmentsLoading || isOperationDisabled}
            loading={modificationBtn.loading}
          >
            Доработать
          </Button>
        </Can>
      )}
      {isEditButtonVisible(verificationStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            VerificationScheduleElements[VerificationScheduleElements.Edit]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            onClick={() => handleChangeStatus(StatusesIds.Editing)}
            icon={<CheckCircleOutlined />}
            type="link"
            disabled={editingBtn.disabled || isScheduleAttachmentsLoading || isOperationDisabled}
            loading={editingBtn.loading}
          >
            Редактировать
          </Button>
        </Can>
      )}
      {isFinishEditingButtonVisible(verificationStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            VerificationScheduleElements[VerificationScheduleElements.CompleteEditing]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            onClick={() => handleChangeStatus(StatusesIds.Signed)}
            type="link"
            disabled={signedBtn.disabled || isScheduleAttachmentsLoading || isOperationDisabled}
            loading={signedBtn.loading}
          >
            Завершить редактирование
          </Button>
        </Can>
      )}
      {isFinishCreationButtonVisible(verificationStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            VerificationScheduleElements[VerificationScheduleElements.CompleteCreation]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            onClick={() => handleChangeStatus(StatusesIds.Signed)}
            icon={<CheckCircleOutlined />}
            type="link"
            disabled={signedBtn.disabled || isScheduleAttachmentsLoading || isOperationDisabled}
            loading={signedBtn.loading}
          >
            Завершить создание
          </Button>
        </Can>
      )}
      {isExportButtonVisible(verificationStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            VerificationScheduleElements[VerificationScheduleElements.Export]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            loading={exportDisabled.loading}
            onClick={exportClickHandler}
            icon={<ExportOutlined />}
            disabled={exportDisabled.disabled || isScheduleAttachmentsLoading}
            type="link"
          >
            Экспортировать
          </Button>
        </Can>
      )}
      <Attachments verificationLevelCouseDisabled={isOperationDisabled} />
    </React.Fragment>
  );
};
