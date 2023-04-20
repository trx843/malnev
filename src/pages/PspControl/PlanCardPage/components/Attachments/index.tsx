import { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { UploadFile } from "antd/lib/upload/interface";
import { getAddAttachmentUrl, getDownloadAttachmentUrl } from "./utils";
import { IPlanCardStore } from "../../../../../slices/pspControl/planCard";
import { StateType } from "../../../../../types";
import { AttachmentButton } from "../../../../../components/AttachmentButton";
import { AttachmentsDrawer } from "../../../../../components/Attachments";
import { UploadAttachment } from "../../../../../components/UploadAttachment";
import {
  deletePlanAttachmentThunk,
  getPlanAttachmentsThunk,
  setPlanMainFileThunk,
} from "../../../../../thunks/pspControl/planCard";
import { mapAttachments } from "components/UploadAttachment/utils";
import { ActionsEnum, Can } from "../../../../../casl";
import {
  ActionPlansElements,
  elementId,
} from "pages/PspControl/ActionPlans/constant";
import { isButtonEditDisabled } from "../ActionsColumn/utils";
import { PlanStatuses } from "../../../../../enums";
import styles from "./Attachments.module.css";

const cx = classNames.bind(styles);

export const Attachments: FC<{ verificationLevelCouseDisabled?: boolean }> = ({ verificationLevelCouseDisabled }) => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const { planCardInfo, attachments } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );

  const planId = planCardInfo?.id;

  useEffect(() => {
    dispatch(getPlanAttachmentsThunk(planId));
  }, [planId]);

  const handleDeleteFile = async (file: UploadFile) => {
    await dispatch(deletePlanAttachmentThunk(file.uid));
  };
  const handleFavoriteFile = async (file: UploadFile) => {
    await dispatch(setPlanMainFileThunk(file.uid));
  };

  return (
    <>
      <AttachmentButton onClick={() => setVisible(true)} size="large" />
      <AttachmentsDrawer
        className={cx("attachmentsDrawer")}
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <Can
          I={ActionsEnum.Edit}
          a={elementId(ActionPlansElements[ActionPlansElements.Attachments])}
        >
          <UploadAttachment
            onFileUploadCompleted={(isSuccess: boolean) =>
              isSuccess && dispatch(getPlanAttachmentsThunk(planId))
            }
            uploadAttachmentUrl={getAddAttachmentUrl(planId) as string}
            onDeleteFile={handleDeleteFile}
            onFavorite={handleFavoriteFile}
            fileList={mapAttachments(attachments, getDownloadAttachmentUrl)}
            disabled={
              !planId ||
              isButtonEditDisabled(
                planCardInfo?.planStatusId || PlanStatuses.Signed
              )
            }
            verificationLevelCouseDisabled={verificationLevelCouseDisabled}
          />
        </Can>
      </AttachmentsDrawer>
    </>
  );
};
