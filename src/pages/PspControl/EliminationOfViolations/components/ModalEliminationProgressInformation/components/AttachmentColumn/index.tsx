import React from "react";
import classNames from "classnames/bind";
import { Button, Tooltip } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";
import {
  EliminationAttachmentModel,
  IInfoCourse,
} from "../../../../../../../slices/pspControl/eliminationOfViolations/types";
import styles from "./attachmentColumn.module.css";

const cx = classNames.bind(styles);

interface IProps {
  data: IInfoCourse;
  handleOpenEliminationAttachments: (
    attachments: EliminationAttachmentModel[]
  ) => void;
}

export const AttachmentColumn: React.FC<IProps> = ({
  data,
  handleOpenEliminationAttachments,
}) => {

  return (
    <Tooltip title="Открыть информацию о ходе устранения ">
      <Button
        className={cx("blue-button")}
        onClick={() =>
          handleOpenEliminationAttachments(data.eliminationAttachment)
        }
        icon={<PaperClipOutlined />}
        type="link"
        disabled={!data.eliminationAttachment.length}
      />
    </Tooltip>
  );
};
