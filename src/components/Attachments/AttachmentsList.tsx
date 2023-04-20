import React, { FC } from "react";
import { Button, Space } from "antd";

import { AttachmentItem, AttachmentItemProps } from "./AttachmentItem";
import "./styles.css";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";

export interface AttachmentsListProps<T> {
  renderItem?: (item: T, index: number) => React.ReactNode;
  dataSource?: T[];
  className?: string;
  loading?: boolean;
  rowKey?: ((item: T) => string) | string;
}

interface AttachmentsListComponents {
  Attachment: FC<AttachmentItemProps>;
}

export const ControlComponent: FC<AttachmentsListProps<any>> = ({
  renderItem,
  rowKey,
  loading,
  children,
  className,
  dataSource,
  ...props
}) => {
  const keys: Record<string, string> = {};

  const renderInnerItem = (item: any, index: number) => {
    if (!renderItem) return null;

    let key;

    if (typeof rowKey === "function") {
      key = rowKey(item);
    } else if (typeof rowKey === "string") {
      key = item[rowKey];
    } else {
      key = item.key;
    }

    if (!key) {
      key = `attachment-item-${index}`;
    }

    keys[index] = key;

    return renderItem(item, index);
  };

  const renderItems = () => {
    if (dataSource === undefined) return null;

    const items = dataSource.map((item: any, index: number) =>
      renderInnerItem(item, index)
    );
    const childrenList = React.Children.map(items, (child: any, index) =>
      React.cloneElement(child, { key: keys[index], ...child.props })
    );

    return childrenList;
  };

  return (
    <div {...props} className="ais-attachment-list">
      <div className="ais-attachment-list__add-item">
        <Button type="text" icon={<PlusCircleFilled />}>
          Добавить файл
        </Button>
      </div>
      <Space className="ais-attachment-list__items" direction="vertical">
        {renderItems()}
      </Space>
    </div>
  );
};

export const AttachmentsList = ControlComponent as FC<
  AttachmentsListProps<any>
> &
  AttachmentsListComponents;

AttachmentsList.Attachment = AttachmentItem;
