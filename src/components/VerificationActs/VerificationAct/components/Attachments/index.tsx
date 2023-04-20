import { FC, useState, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { UploadFile } from "antd/lib/upload/interface";
import { AttachmentsDrawer } from "../../../../Attachments";
import { AttachmentButton } from "../../../../AttachmentButton";
import { UploadAttachment } from "../../../../UploadAttachment";
import { StateType } from "../../../../../types";
import { VerificationActStore } from "../../../../../slices/verificationActs/verificationAct/types";
import { getAddAttachmentUrl, getDownloadAttachmentUrl } from "./utils";
import {
  deleteActAttachmentThunk,
  getActAttachmentsThunk,
  setMainFileThunk,
} from "../../../../../thunks/verificationActs/verificationAct";
import { ActionsEnum, Can } from "../../../../../casl";
import {
  elementId,
  VerificationActsElements,
} from "pages/VerificationActs/constant";
import { useActStatusPermission } from "../../hooks/useActStatusPermission";
import { mapAttachments } from "components/UploadAttachment/utils";
import styles from "./Attachments.module.css";

const cx = classNames.bind(styles);

export const VerificationAttachments: FC<{ verificationLevelCouseDisabled?: boolean }> = memo(({ verificationLevelCouseDisabled }) => {
  const buttonProps = useActStatusPermission();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const { act, attachments } = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const actId = act?.id ?? null;

  useEffect(() => {
    dispatch(getActAttachmentsThunk(actId));
  }, [actId]);

  const handleDeleteFile = async (file: UploadFile) => {
    await dispatch(deleteActAttachmentThunk(file.uid));
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
        <Can
          I={ActionsEnum.Edit}
          a={elementId(
            VerificationActsElements[VerificationActsElements.Attachments]
          )}
        >
          <UploadAttachment
            onFileUploadCompleted={(isSuccess: boolean) =>
              isSuccess && dispatch(getActAttachmentsThunk(actId))
            }
            uploadAttachmentUrl={getAddAttachmentUrl(actId) as string}
            onDeleteFile={handleDeleteFile}
            onFavorite={handleFavoriteFile}
            fileList={mapAttachments(attachments, getDownloadAttachmentUrl)}
            disabled={!actId || buttonProps.disabled}
            verificationLevelCouseDisabled={verificationLevelCouseDisabled}
          />
        </Can>
      </AttachmentsDrawer>
    </>
  );
});
