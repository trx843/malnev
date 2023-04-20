import React from "react";
import _ from "lodash";
import classNames from "classnames/bind";
import { Button, Spin, Upload } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/lib/upload/interface";
import { textFilesAndImagesValidator } from "utils";
import { uploadAttachment } from "api/requests/uploadAttachment";
import { AttachFile, UploadAttachmentBeforeUploadValueType } from "./types";
import { FileItem } from "./FileItem";
import styles from "./UploadAttachment.module.css";

const cx = classNames.bind(styles);
interface IProps<T = any> extends UploadProps {
  action?:
  | string
  | ((file: RcFile) => string)
  | ((file: RcFile) => PromiseLike<string>);
  fileList?: Array<UploadFile<T>>;
  onChange?: (info: UploadChangeParam) => void;
  withCredentials?: boolean;
  beforeUpload?: (
    file: RcFile,
    FileList?: RcFile[]
  ) =>
    | UploadAttachmentBeforeUploadValueType
    | Promise<UploadAttachmentBeforeUploadValueType>;
  onDownloadFile?: (file: AttachFile<T>) => void | Promise<void>;
  onDeleteFile?: (file: AttachFile<T>) => void | Promise<void>;
  onFavorite?: (file: AttachFile<T>) => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  validator?: (file: RcFile) => string | true;
  onFileUploadCompleted?: (isSuccess: boolean) => void;
  uploadAttachmentUrl: string;
  isStarsDisabled?: boolean;
  verificationLevelCouseDisabled?: boolean;
}

export const UploadAttachment: React.FC<IProps> = ({
  action,
  fileList,
  onChange,
  withCredentials = true,
  beforeUpload,
  onDownloadFile,
  onDeleteFile,
  onFavorite,
  isLoading = false,
  disabled,
  className,
  validator = textFilesAndImagesValidator,
  onFileUploadCompleted,
  uploadAttachmentUrl,
  verificationLevelCouseDisabled,
  ...props
}) => {
  const [pendingFavoriteId, setPendingFavoriteId] = React.useState<
    string | null
  >(null);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(
    null
  );
  const [pendingDownload, setPendingDownloadId] = React.useState<string | null>(
    null
  );
  const [uploadAttachmentLoading, setUploadAttachmentLoading] =
    React.useState(false);

  const handleFavorite = async (file: AttachFile) => {
    try {
      setPendingFavoriteId(file.uid);
      await onFavorite?.(file);
    } finally {
      setPendingFavoriteId(null);
    }
  };

  const handleDelete = async (file: AttachFile) => {
    try {
      setPendingDeleteId(file.uid);
      await onDeleteFile?.(file);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleDownload = async (file: AttachFile) => {
    try {
      setPendingDownloadId(file.uid);
      await onDownloadFile?.(file);
    } finally {
      setPendingDownloadId(null);
    }
  };

  const handleBeforeUpload = async (file: RcFile) => {
    const isFileValid = validator ? validator(file) : true;

    if (_.isBoolean(isFileValid) && isFileValid) {
      setUploadAttachmentLoading(true);
      const isSuccess = await uploadAttachment(uploadAttachmentUrl, file);
      setUploadAttachmentLoading(false);
      onFileUploadCompleted?.(isSuccess);
    }

    return false;
  };

  return (
    <Spin
      wrapperClassName={cx("spin-wrapper")}
      spinning={isLoading || uploadAttachmentLoading}
    >
      <Upload
        {...props}
        className={classNames(cx("wrapper"), className)}
        fileList={fileList}
        {...(action && { action })}
        onChange={onChange}
        beforeUpload={handleBeforeUpload}
        withCredentials={withCredentials}
        itemRender={(_, file: AttachFile) => (
          <FileItem
            file={file}
            pendingDeleteId={pendingDeleteId}
            pendingDownload={pendingDownload}
            pendingFavoriteId={pendingFavoriteId}
            onDeleteFile={handleDelete}
            onDownloadFile={handleDownload}
            onFavorite={handleFavorite}
            disabled={disabled}
            deleteBtnDisabled={verificationLevelCouseDisabled}
          />
        )}

      >
        <Button
          className={cx("button-upload")}
          icon={<PlusCircleFilled />}
          type="text"
          disabled={disabled || verificationLevelCouseDisabled}
        >
          Добавить файл
        </Button>
      </Upload>
    </Spin>
  );
};
