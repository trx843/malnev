import { FC, useState } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { RendererProps } from "components/ItemsTable";
import { IdType, StateType } from "types";
import { NumberOneSideItem } from "../../../../../classes";
import { useActStatusPermission } from "../../../../../hooks/useActStatusPermission";
import { ActionsEnum, Can } from "../../../../../../../../casl";
import {
  elementId,
  VerificationActsElements,
} from "pages/VerificationActs/constant";
import { useSelector } from "react-redux";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

interface TableActActionsProps extends RendererProps<NumberOneSideItem> {
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

  return (
    <div className="ais-table-actions">
      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationActsElements[VerificationActsElements.DelAccountingSystem]
        )}
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
            disabled={buttonProps.disabled || data.hasViolations}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              type="link"
              loading={loading}
              disabled={buttonProps.disabled || loading || data.hasViolations || isOperationDisabled}
              className="ais-table-actions__item"
            />
          </Popconfirm>
        </Tooltip>
      </Can>
    </div>
  );
};
