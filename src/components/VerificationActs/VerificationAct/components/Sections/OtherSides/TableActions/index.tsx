import React, { FC, useState } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { RendererProps } from "../../../../../../ItemsTable";
import { IdType } from "../../../../../../../types";
import { OtherSideItem } from "../../../../classes";
import { useVerificationModals } from "../../../Provider";
import { useActStatusPermission } from "../../../../hooks/useActStatusPermission";
import { ActionsEnum, Can } from "../../../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";

interface TableActActionsProps extends RendererProps<OtherSideItem> {
  onDelete?: (id: IdType) => Promise<void>;
}

export const TableActions: FC<TableActActionsProps> = ({ onDelete, data }) => {
  const buttonProps = useActStatusPermission();
  const modalsState = useVerificationModals();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete?.(data.id);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    modalsState.onOpenEditModal(data.id as string, data);
  };

  return (
    <div className="ais-table-actions">
      <Can
        I={ActionsEnum.View}
        a={elementId(VerificationActsElements[VerificationActsElements.EditCamp])}
      >
        <Tooltip
          arrowPointAtCenter
          title={<span style={{ color: "black" }}>Редактировать</span>}
          color="#ffffff"
          placement="bottomLeft"
        >
          <Button
            icon={<EditOutlined />}
            type="link"
            className="ais-table-actions__item"
            onClick={handleEdit}
            disabled={buttonProps.disabled}
          />
        </Tooltip>
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(VerificationActsElements[VerificationActsElements.DelCamp])}
      >
        <Tooltip
          arrowPointAtCenter
          title={<span style={{ color: "black" }}>Удалить</span>}
          color="#ffffff"
          placement="bottomLeft"
        >
          <Popconfirm
            title="Вы уверены, что хотите удалить сторону?"
            onConfirm={handleDelete}
            okText="Удалить"
            cancelText="Отмена"
            disabled={buttonProps.disabled}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              type="link"
              loading={loading}
              disabled={buttonProps.disabled}
              className="ais-table-actions__item"
            />
          </Popconfirm>
        </Tooltip>
      </Can>
    </div>
  );
};
