import React, { FC, useState } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { ActionsEnum, Can } from "../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";
import { useSelector } from "react-redux";
import { StateType } from "types";
import { HomeStateType } from "slices/home";
import { VerificationItem } from "components/VerificationActs/classes";
import { verificationLevelHandler } from "utils";

interface RemoveActionProps {
  className?: string;
  onRemove: (id: string) => Promise<void>;
  id: string;
  disabled: boolean;
  data: VerificationItem;
}

export const RemoveAction: FC<RemoveActionProps> = ({
  id,
  onRemove,
  disabled,
  className,
  data,
}) => {
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, data.verificationLevelId);

  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    try {
      setLoading(true);
      onRemove(id);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Can
      I={ActionsEnum.View}
      a={elementId(VerificationActsElements[VerificationActsElements.DelAct])}
    >
      <Popconfirm
        title="Вы уверены, что хотите удалить акт?"
        onConfirm={handleDelete}
        okText="Удалить"
        cancelText="Отмена"
        disabled={disabled || isOperationDisabled}
      >
        <Tooltip title="Удалить акт">
          <Button
            type="link"
            className={className}
            danger
            icon={<DeleteOutlined />}
            disabled={disabled || loading || isOperationDisabled}
            loading={loading}
          />
        </Tooltip>
      </Popconfirm>
    </Can>
  );
};
