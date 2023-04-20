import { useState, FC } from "react";
import classNames from "classnames/bind";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useModals } from "components/ModalProvider";
import { MatchingModals } from "../../../constants";
import { PlanStatuses } from "enums";
import { isOperationButtonDisabled } from "pages/PspControl/PlanCardPage/utils";
import styles from "./actionsColumn.module.css";
import { useSelector } from "react-redux";
import { StateType } from "types";
import { IPlanCardStore } from "slices/pspControl/planCard";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

const cx = classNames.bind(styles);

interface IProps {
  data: any;
  planStatusId: PlanStatuses;
  onDelete: (id: string) => void;
}

export const ActionsColumn: FC<IProps> = ({ data, planStatusId, onDelete }) => {

  const { planCardInfo } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);


  const [pending, setPending] = useState(false);
  const { setModal } = useModals();

  const handleAdd = () => {
    setModal({
      type: MatchingModals.EDIT_MODAL,
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
          disabled={isOperationButtonDisabled(planStatusId)}
          icon={<EditOutlined />}
          type="link"
        />
      </Tooltip>
      <Tooltip title="Удалить">
        <Popconfirm
          title="Вы уверены, что хотите удалить?"
          okText="Удалить"
          cancelText="Отмена"
          disabled={isOperationButtonDisabled(planStatusId) || pending}
          onConfirm={handleDelete}
        >
          <Button
            className={cx("button-delete")}
            icon={<DeleteOutlined />}
            loading={pending}
            type="link"
            disabled={isOperationButtonDisabled(planStatusId) || pending}
          />
        </Popconfirm>
      </Tooltip>
    </>
  );
};
