import React, { FC } from "react";
import { Button, Card, Space, Typography } from "antd";
import cn from "classnames";
import {
  DeleteOutlined,
  EditOutlined,
  FileSearchOutlined,
  StarFilled,
  StarOutlined
} from "@ant-design/icons";
import { CardProps } from "antd/es/card";
import "./styles.css";

export interface AttachmentItemProps extends Partial<CardProps> {
  isFavorite?: boolean;
  title: string;
  onFavoriteClick?: (state: boolean) => void;
  favoriteLoading?: boolean;
  onDelete?: () => void;
  deleteLoading?: boolean;
  className?: string;
}

export const AttachmentItem: FC<AttachmentItemProps> = ({
  className,
  deleteLoading,
  favoriteLoading,
  isFavorite = false,
  onDelete,
  onFavoriteClick,
  title,
  ...props
}) => {
  return (
    <Card {...props} size="small" className={cn("ais-attachment", className)}>
      <div className="ais-attachment__header">
        <Typography.Text className="ais-attachment__title" title={title}>
          {title}
        </Typography.Text>
        <Button
          onClick={() => onFavoriteClick?.(isFavorite)}
          loading={favoriteLoading}
          type="link"
          icon={isFavorite ? <StarFilled /> : <StarOutlined />}
        />
      </div>
      <div>
        <Space>
          <Button icon={<FileSearchOutlined />} type="link" />
          <Button icon={<EditOutlined />} type="link" />
          <Button
            icon={<DeleteOutlined />}
            type="link"
            onClick={onDelete}
            danger
            loading={deleteLoading}
          />
        </Space>
      </div>
    </Card>
  );
};
