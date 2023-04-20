import { FC, useState } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { RendererProps } from "../../../../../../ItemsTable";
import { IdType, StateType } from "../../../../../../../types";
import { CommissionItem } from "../../../../classes";
import { useVerificationModals } from "../../../Provider";
import { useActStatusPermission } from "../../../../hooks/useActStatusPermission";
import { ActionsEnum, Can } from "../../../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";
import { useSelector } from "react-redux";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

interface TableActActionsProps extends RendererProps<CommissionItem> {
  onDelete?: (id: IdType) => Promise<void>;
}

export const TableActions: FC<TableActActionsProps> = ({ onDelete, data }) => {
  const { act } = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, act?.verificationLevelId);

  const modalsState = useVerificationModals();
  const buttonProps = useActStatusPermission();
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
        a={elementId(VerificationActsElements[VerificationActsElements.EditCommitteeMember])}
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
            disabled={buttonProps.disabled || isOperationDisabled}
          />
        </Tooltip>
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(VerificationActsElements[VerificationActsElements.DelCommitteeMember])}
      ></Can>

      <Tooltip
        arrowPointAtCenter
        title={<span style={{ color: "black" }}>Удалить</span>}
        color="#ffffff"
        placement="bottomLeft"
      >
        <Popconfirm
          title="Вы уверены, что хотите удалить?"
          onConfirm={handleDelete}
          okText="Удалить"
          cancelText="Отмена"
          disabled={buttonProps.disabled || isOperationDisabled}
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            type="link"
            loading={loading}
            disabled={buttonProps.disabled || loading || isOperationDisabled}
            className="ais-table-actions__item"
          />
        </Popconfirm>
      </Tooltip>
    </div>
  );
};
