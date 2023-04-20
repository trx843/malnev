import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Button } from "antd";
import {
  CheckCircleOutlined,
  ExportOutlined,
  FileSyncOutlined,
  PlusCircleFilled,
  SolutionOutlined,
} from "@ant-design/icons";
import { useModals } from "components/ModalProvider";
import { TypicalViolationModalTypes } from "containers/ActPlanEliminationOfTypicalViolations/constants";
import {
  isEditButtonVisible,
  isExportButtonVisible,
  isFinishCreationButtonVisible,
  isFinishEditingButtonVisible,
  isRevisionButtonVisible,
  isSeDApprovalButtonVisible,
} from "./utils";
import { PlanStatuses } from "enums";
import { StateType } from "types";
import { ActionPlanTypicalViolationsStore } from "slices/pspControl/actionPlanTypicalViolations/types";
import { changePlanTypicalStatusThunk } from "thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { isOperationButtonDisabled } from "containers/ActPlanEliminationOfTypicalViolations/utils";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

export const TopPanel: FC = () => {
  const dispatch = useDispatch();
  const { setModal } = useModals();
  const [isStatusChanging, setIsStatusChanging] = React.useState(false);

  const { typicalPlanCard } = useSelector<
    StateType,
    ActionPlanTypicalViolationsStore
  >((state) => state.actionPlanTypicalViolations);

  const planId = typicalPlanCard?.id;
  const planStatusId = typicalPlanCard?.planStatusId;

  const handleAddModal = () => {
    setModal({
      payload: {},
      type: TypicalViolationModalTypes.ADD_VIOLATION,
    });
  };

  const handleChangeStatus = async (newStatus: PlanStatuses) => {
    if (planId) {
      setIsStatusChanging(true);
      await dispatch(
        changePlanTypicalStatusThunk({
          id: planId,
          newStatus,
        })
      );
      setIsStatusChanging(false);
    }
  };

  return (
    <div className="typical-violation-top-panel">
      <div>
        <Button
          type={"link"}
          icon={<PlusCircleFilled />}
          onClick={handleAddModal}
          disabled={isOperationButtonDisabled(planStatusId)}
        >
          Добавить нарушение
        </Button>
      </div>

      <div>
        {isSeDApprovalButtonVisible(planStatusId) && (
          <Button
            className={cx("buttonGrey")}
            icon={<SolutionOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.SEDApproval)}
            disabled={isStatusChanging}
            type="link"
          >
            Согласовать в СЭД
          </Button>
        )}
        {isRevisionButtonVisible(planStatusId) && (
          <Button
            className={cx("buttonGrey")}
            icon={<FileSyncOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.Revision)}
            disabled={isStatusChanging}
            type="link"
          >
            Доработать
          </Button>
        )}
        {isEditButtonVisible(planStatusId) && (
          <Button
            className={cx("buttonGrey")}
            onClick={() => handleChangeStatus(PlanStatuses.Editing)}
            icon={<CheckCircleOutlined />}
            disabled={isStatusChanging}
            type="link"
          >
            Редактировать
          </Button>
        )}
        {isFinishEditingButtonVisible(planStatusId) && (
          <Button
            className={cx("buttonGrey")}
            icon={<FileSyncOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.Signed)}
            disabled={isStatusChanging}
            type="link"
          >
            Завершить редактирование
          </Button>
        )}
        {isFinishCreationButtonVisible(planStatusId) && (
          <Button
            className={cx("buttonGrey")}
            icon={<CheckCircleOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.Signed)}
            disabled={isStatusChanging}
            type="link"
          >
            Завершить создание
          </Button>
        )}
        {isExportButtonVisible(planStatusId) && (
          <Button
            className={cx("buttonGrey")}
            type="link"
            icon={<ExportOutlined />}
          >
            Экспортировать
          </Button>
        )}
      </div>
    </div>
  );
};
