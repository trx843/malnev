import { useState, FC } from "react";
import classNames from "classnames/bind";
import { Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useModals } from "components/ModalProvider";
import { VerificationCommissionModals } from "../../../../constants";
import { StatusesIds } from "../../../../../../../enums";
import { isOperationButtonDisabled } from "pages/PspControl/VerificationScheduleCardPage/utils";
import styles from "./actionColumn.module.css";
import { useSelector } from "react-redux";
import { StateType } from "types";
import { IVerificationScheduleCardStore } from "slices/pspControl/verificationScheduleCard";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

const cx = classNames.bind(styles);

interface IProps {
  data: any;
  verificationStatusId: StatusesIds;
  onDelete: (id: string) => void;
}

export const ActionsColumn: FC<IProps> = ({
  data,
  verificationStatusId,
  onDelete,
}) => {
  const [pending, setPending] = useState(false);
  const { setModal } = useModals();
  const { verificationScheduleCardInfo } = useSelector<
    StateType,
    IVerificationScheduleCardStore
  >((state) => state.verificationScheduleCard);
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, verificationScheduleCardInfo?.verificationLevel);

  const handleAdd = () => {
    setModal({
      type: VerificationCommissionModals.EDIT_MODAL,
      payload: data.id,
    });
  };

  const handleDelete = async () => {
    try {
      setPending(true);
      await onDelete?.(data.id);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Tooltip title="Редактировать">
        <Button
          onClick={handleAdd}
          disabled={isOperationButtonDisabled(verificationStatusId) || isOperationDisabled}
          icon={<EditOutlined />}
          type="link"
        />
      </Tooltip>
      <Tooltip title="Удалить">
        <Popconfirm
          title="Вы уверены, что хотите удалить?"
          okText="Удалить"
          cancelText="Отмена"
          disabled={isOperationButtonDisabled(verificationStatusId) || isOperationDisabled}
          onConfirm={handleDelete}
        >
          <Button
            className={cx("button-delete")}
            icon={<DeleteOutlined />}
            loading={pending}
            disabled={isOperationButtonDisabled(verificationStatusId) || isOperationDisabled}
            type="link"
          />
        </Popconfirm>
      </Tooltip>
    </>
  );
};
