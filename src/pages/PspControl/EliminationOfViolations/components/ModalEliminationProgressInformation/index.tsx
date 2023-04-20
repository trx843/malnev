import React from "react";
import classNames from "classnames/bind";
import { Button, List, Modal, Spin, Tooltip } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { getTableColumns } from "./utils";
import {
  EliminationAttachmentModel,
  IInfoCourse,
} from "../../../../../slices/pspControl/eliminationOfViolations/types";
import {
  downloadEliminationAttachment,
  getEliminationInfoCourse,
} from "../../../../../thunks/pspControl/eliminationOfViolations";
import { Nullable } from "../../../../../types";
import styles from "./modalEliminationProgressInformation.module.css";

const cx = classNames.bind(styles);

interface IProps {
  eliminationId: Nullable<string>;
  isVisible: boolean;
  onCancel: () => void;
}

export const ModalEliminationProgressInformation: React.FC<IProps> = ({
  eliminationId,
  isVisible,
  onCancel,
}) => {
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [data, setData] = React.useState<IInfoCourse[]>([]);
  const [eliminationAttachments, setEliminationAttachments] = React.useState<
    EliminationAttachmentModel[]
  >([]);

  React.useEffect(() => {
    async function init() {
      setIsDataLoading(true);
      const eliminationInfoCourse = await getEliminationInfoCourse(
        eliminationId as string
      );
      setIsDataLoading(false);
      setData(eliminationInfoCourse);
    }

    if (eliminationId) init();
  }, [eliminationId]);

  const handleOpenEliminationAttachments = (
    attachments: EliminationAttachmentModel[]
  ) => {
    setEliminationAttachments(attachments);
  };

  const handleCancelModal = () => {
    onCancel();
    setData([]);
    setEliminationAttachments([]);
  };

  const renderListItem = (attachment: EliminationAttachmentModel) => {
    const url = attachment.url;

    if (url) {
      return (
        <List.Item
          className={cx("list-item")}
          extra={
            <Tooltip title="Открыть ссылку">
              <Button
                href={url}
                target="_blank"
                type="link"
                icon={<FileSearchOutlined />}
              />
            </Tooltip>
          }
        >
          <p className={cx("item-name")}>{url}</p>
        </List.Item>
      );
    }

    return (
      <List.Item
        className={cx("list-item")}
        extra={
          <Tooltip title="Скачать файл">
            <Button
              onClick={() =>
                downloadEliminationAttachment(
                  attachment.id,
                  attachment.fileName as string
                )
              }
              type="link"
              icon={<FileSearchOutlined />}
            />
          </Tooltip>
        }
      >
        <p className={cx("item-name")}>{attachment.fileName}</p>
      </List.Item>
    );
  };

  return (
    <Modal
      width={1050}
      visible={isVisible}
      title="Информация о ходе устранения"
      okText="Закрыть"
      onCancel={handleCancelModal}
      onOk={handleCancelModal}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      destroyOnClose
      centered
    >
      <Spin spinning={isDataLoading}>
        <AgGridTable
          className={cx("table")}
          rowData={data}
          columnDefs={getTableColumns(handleOpenEliminationAttachments)}
          defaultColDef={{ resizable: true }}
          isAutoSizeColumns={false}
        />

        {!!eliminationAttachments.length && (
          <List
            className={cx("attachment-list")}
            dataSource={eliminationAttachments}
            renderItem={renderListItem}
            itemLayout="vertical"
            bordered
          />
        )}
      </Spin>
    </Modal>
  );
};
