import { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { UploadFile } from "antd/lib/upload/interface";
import { getAddAttachmentUrl, getDownloadAttachmentUrl } from "./utils";
import { StateType } from "../../../../../types";
import { AttachmentButton } from "../../../../../components/AttachmentButton";
import { AttachmentsDrawer } from "../../../../../components/Attachments";
import { UploadAttachment } from "../../../../../components/UploadAttachment";
import { IVerificationScheduleCardStore } from "../../../../../slices/pspControl/verificationScheduleCard";
import {
  deleteScheduleAttachmentThunk,
  getScheduleAttachmentsThunk,
  setScheduleMainFileThunk,
} from "../../../../../thunks/pspControl/verificationScheduleCard";
import { isOperationButtonDisabled } from "../../utils";
import { mapAttachments } from "components/UploadAttachment/utils";
import styles from "./Attachments.module.css";

const cx = classNames.bind(styles);

export const Attachments: FC<{ verificationLevelCouseDisabled?: boolean }> = ({ verificationLevelCouseDisabled }) => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const { verificationScheduleCardInfo, attachments } = useSelector<
    StateType,
    IVerificationScheduleCardStore
  >((state) => state.verificationScheduleCard);

  const scheduleId = verificationScheduleCardInfo?.id;

  useEffect(() => {
    dispatch(getScheduleAttachmentsThunk(scheduleId));
  }, [scheduleId]);

  const handleDeleteFile = async (file: UploadFile) => {
    await dispatch(deleteScheduleAttachmentThunk(file.uid));
  };

  const handleFavoriteFile = async (file: UploadFile) => {
    await dispatch(setScheduleMainFileThunk(file.uid));
  };

  return (
    <>
      <AttachmentButton onClick={() => setVisible(true)} size="large" />
      <AttachmentsDrawer
        className={cx("attachmentsDrawer")}
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <UploadAttachment
          onFileUploadCompleted={(isSuccess: boolean) =>
            isSuccess && dispatch(getScheduleAttachmentsThunk(scheduleId))
          }
          uploadAttachmentUrl={getAddAttachmentUrl(scheduleId) as string}
          onDeleteFile={handleDeleteFile}
          onFavorite={handleFavoriteFile}
          fileList={mapAttachments(attachments, getDownloadAttachmentUrl)}
          disabled={
            !scheduleId ||
            isOperationButtonDisabled(
              verificationScheduleCardInfo?.verificationStatusId
            )
          }
          verificationLevelCouseDisabled={verificationLevelCouseDisabled}
        />
      </AttachmentsDrawer>
    </>
  );
};
