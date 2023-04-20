import { FC, useState, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { UploadFile } from "antd/lib/upload/interface";
import { AttachmentsDrawer } from "../../../../components/Attachments";
import { AttachmentButton } from "../../../../components/AttachmentButton";
import { UploadAttachment } from "../../../../components/UploadAttachment";
import { StateType } from "../../../../types";
import { ActionPlanTypicalViolationsStore } from "../../../../slices/pspControl/actionPlanTypicalViolations/types";
import { getAddAttachmentUrl, getDownloadAttachmentUrl } from "./utils";
import {
  deletePlanTypicalAttachmentThunk,
  getPlanTypicalAttachmentsThunk,
  setMainFileThunk,
} from "../../../../thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { isOperationButtonDisabled } from "containers/ActPlanEliminationOfTypicalViolations/utils";
import { mapAttachments } from "components/UploadAttachment/utils";
import styles from "./Attachments.module.css";

const cx = classNames.bind(styles);

export const PlanAttachments: FC = memo(() => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const { attachments, typicalPlanCard, isAttachmentsLoading } = useSelector<
    StateType,
    ActionPlanTypicalViolationsStore
  >((state) => state.actionPlanTypicalViolations);

  const typicalPlanId = typicalPlanCard?.id ?? null;

  useEffect(() => {
    dispatch(getPlanTypicalAttachmentsThunk(typicalPlanId));
  }, [typicalPlanId]);

  const handleDeleteFile = async (file: UploadFile) => {
    await dispatch(deletePlanTypicalAttachmentThunk(file.uid));
    dispatch(getPlanTypicalAttachmentsThunk(typicalPlanId));
  };

  const handleFavoriteFile = async (file: UploadFile) => {
    await dispatch(setMainFileThunk(file.uid));
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
            isSuccess && dispatch(getPlanTypicalAttachmentsThunk(typicalPlanId))
          }
          uploadAttachmentUrl={getAddAttachmentUrl(typicalPlanId) as string}
          onDeleteFile={handleDeleteFile}
          onFavorite={handleFavoriteFile}
          fileList={mapAttachments(attachments, getDownloadAttachmentUrl)}
          disabled={
            !typicalPlanId ||
            isOperationButtonDisabled(typicalPlanCard?.planStatusId)
          }
          isLoading={isAttachmentsLoading}
        />
      </AttachmentsDrawer>
    </>
  );
});
