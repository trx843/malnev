import React, { FC, memo } from "react";
import classNames from "classnames/bind";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  ClusterOutlined,
  DeleteOutlined,
  DownloadOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { AttachFile } from "./types";
import { isValidUrl } from "./utils";
import styles from "./UploadAttachment.module.css";

const cx = classNames.bind(styles);

interface FileItemProps {
  onDownloadFile?: (file: AttachFile) => void;
  onDeleteFile?: (file: AttachFile) => void | Promise<void>;
  onFavorite?: (file: AttachFile) => void | Promise<void>;
  pendingDownload?: string | null;
  pendingFavoriteId?: string | null;
  pendingDeleteId?: string | null;
  file: AttachFile;
  disabled?: boolean;
  deleteBtnDisabled?: boolean;
}

export const FileItem: FC<FileItemProps> = memo(
  ({
    onDeleteFile,
    onDownloadFile,
    onFavorite,
    file,
    pendingDeleteId,
    pendingFavoriteId,
    pendingDownload,
    disabled,
    deleteBtnDisabled,
    ...props
  }) => (
    <div {...props} className={cx("file-container")}>
      <Tooltip title={file.name} placement="topLeft">
        <p className={cx("file-name")}>{file.name}</p>
      </Tooltip>

      <Tooltip title="Скачать файл">
        <Button
          onClick={() => onDownloadFile?.(file)}
          disabled={pendingDownload === file.uid}
          loading={pendingDownload === file.uid}
          icon={<DownloadOutlined />}
          type="link"
          {...(file.fileUrl && {
            href: file.fileUrl,
          })}
        />
      </Tooltip>
      <Tooltip
        title={
          <React.Fragment>
            <p className={cx("url-title")}>Открыть карточку СЭД</p>
            {!isValidUrl(file.url) && (
              <p className={cx("url-link")}>{file.url}</p>
            )}
          </React.Fragment>
        }
      >
        <Button
          target="_blank"
          icon={<ClusterOutlined />}
          type="link"
          href={file.url}
          disabled={!isValidUrl(file.url)}
        />
      </Tooltip>
      <Popconfirm
        title="Вы действительно хотите удалить файл?"
        onConfirm={() => onDeleteFile?.(file)}
        okText="Удалить"
        cancelText="Отмена"
        disabled={disabled || deleteBtnDisabled}
      >
        <Tooltip title="Удалить файл">
          <Button
            className={cx("delete-button")}
            icon={<DeleteOutlined />}
            type="link"
            disabled={pendingDeleteId === file.uid || disabled || deleteBtnDisabled}
            loading={pendingDeleteId === file.uid}
          />
        </Tooltip>
      </Popconfirm>
      <div className={cx("file__favorite-button")}>
        <Tooltip title="Пометить как основное">
          <Button
            className={cx("download-button")}
            type="link"
            loading={pendingFavoriteId === file.uid}
            disabled={pendingFavoriteId === file.uid || disabled}
            onClick={() => onFavorite?.(file)}
            icon={file.isFavorite ? <StarFilled /> : <StarOutlined />}
          />
        </Tooltip>
      </div>
    </div>
  )
);
