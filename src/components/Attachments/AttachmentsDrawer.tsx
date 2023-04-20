import React, { FC } from "react";
import { Drawer, Space, Typography } from "antd";
import cn from "classnames";
import ArrowRightOutlined from "@ant-design/icons/ArrowRightOutlined";

import { AttachmentButton } from "../AttachmentButton";
import "./styles.css";

export interface AttachmentsDrawerProps {
  className?: string;
  visible?: boolean;
  onClose?: () => void;
}

export const AttachmentsDrawer: FC<AttachmentsDrawerProps> = ({
  children,
  className,
  onClose,
  visible,
  ...props
}) => (
  <Drawer
    {...props}
    className={cn("ais-attachment-drawer", className)}
    placement="right"
    visible={visible}
    onClose={onClose}
    title={
      <div className="ais-attachment-drawer__header">
        <Space>
          <AttachmentButton size="large" />
          <Typography.Title level={5}>Вложения</Typography.Title>
        </Space>
      </div>
    }
    closeIcon={<ArrowRightOutlined />}
    destroyOnClose
  >
    {children}
  </Drawer>
);
