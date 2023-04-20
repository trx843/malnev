import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Button, message } from "antd";
import {
  CheckCircleOutlined,
  ExportOutlined,
  FileSyncOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import {
  isEditButtonVisible,
  isExportButtonVisible,
  isFinishCreationButtonVisible,
  isFinishEditingButtonVisible,
  isRevisionButtonVisible,
  isSeDApprovalButtonVisible,
} from "./utils";
import { ModalModes, PlanStatuses } from "enums";
import { Nullable, StateType } from "types";
import { ActionPlanTypicalViolationsStore } from "slices/pspControl/actionPlanTypicalViolations/types";
import { changePlanTypicalStatusThunk, getPlanTypicalAttachmentsThunk, typicalPlanAttachmentSendThunk } from "thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { PlanAttachments } from "containers/ActPlanEliminationOfTypicalViolations/components/Attachments";
import { IFormValues } from "../ModalPlanEditing/types";
import styles from "./operations.module.css";
import { ActionPlanErrorMessage, MainAttachmentErrorMessage } from "../../../../../../constants";
import { planCardActionPlan, planCardHasMain } from "api/requests/pspControl/planCardPage";
import { exportToExcelTypical } from "api/requests/pspControl/plan-typical-violations";
import { getDataRange } from "../BasicInformation/utils";
import { ActionsEnum, Can } from "casl/index";
import { ActionPlansElements, elementId } from "../../../../ActionPlans/constant";


const cx = classNames.bind(styles);

interface IProps {
  handleEditPlan: (payload: Nullable<IFormValues>, mode: ModalModes) => void;
}

export const Operations: React.FC<IProps> = ({ handleEditPlan }) => {
  const dispatch = useDispatch();

  const {
    typicalPlanCard,
  } = useSelector<
    StateType,
    ActionPlanTypicalViolationsStore
  >((state) => state.actionPlanTypicalViolations);

  const [verificationPeriodFrom, verificationPeriodBy] = getDataRange(typicalPlanCard);
  const [isApproveToSedOrRefineBtnLoading, setIsApproveToSedOrRefineBtnLoading] = useState(false);
  const [isCompleteBtnLoading, setIsCompleteBtnLoading] = useState(false);
  const [isExportBtnLoading, setIsExportBtnLoading] = useState(false);

  const planId = typicalPlanCard?.id;
  const planStatusId = typicalPlanCard?.planStatusId;

  const handleChangeStatus = async (newStatus: PlanStatuses) => {
    if (planId) {
      if (newStatus === PlanStatuses.SEDApproval
        || newStatus === PlanStatuses.Revision) {
        setIsApproveToSedOrRefineBtnLoading(true);
      } else if (newStatus === PlanStatuses.Signed) {
        setIsCompleteBtnLoading(true);
      }

      await dispatch(
        changePlanTypicalStatusThunk({
          id: planId,
          newStatus,
        })
      );

      if (newStatus === PlanStatuses.Signed) {
        const hasMain = await planCardHasMain(planId);
        const hasActionPlan = await planCardActionPlan(planId);

        if (!hasActionPlan) {
          message.error({
            content: ActionPlanErrorMessage,
            duration: 2,
          });
          setIsCompleteBtnLoading(false);
          return;
        }

        if (!hasMain) {
          message.error({
            content: MainAttachmentErrorMessage,
            duration: 2,
          });
          setIsCompleteBtnLoading(false);
          return;
        }
      }

      if (newStatus === PlanStatuses.SEDApproval && planStatusId) {
        const hasActionPlan = await planCardActionPlan(planId);

        if (!hasActionPlan) {
          message.error({
            content: ActionPlanErrorMessage,
            duration: 2,
          });
          setIsCompleteBtnLoading(false);
          return;
        }

        await dispatch(
          typicalPlanAttachmentSendThunk({
            yearFrom: verificationPeriodFrom ? +verificationPeriodFrom : new Date().getFullYear(),
            yearTo: verificationPeriodBy ? +verificationPeriodBy : new Date().getFullYear(),
            oldStatus: planStatusId
          })
        );
        dispatch(getPlanTypicalAttachmentsThunk(planId));
      }
      setIsApproveToSedOrRefineBtnLoading(false);
      setIsCompleteBtnLoading(false);
    }
  };

  const exportClickHandler = async () => {
    setIsExportBtnLoading(true);
    await exportToExcelTypical(typicalPlanCard?.planName ?? "Н/д");
    setIsExportBtnLoading(false);
  };

  return (
    <React.Fragment>
      {isSeDApprovalButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ActionPlansElements[ActionPlansElements.TypicalApproveInSED]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            icon={<SolutionOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.SEDApproval)}
            loading={isApproveToSedOrRefineBtnLoading}
            disabled={isCompleteBtnLoading || isExportBtnLoading}
            type="link"
          >
            Согласовать в СЭД
          </Button>
        </Can>
      )}
      {isRevisionButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ActionPlansElements[ActionPlansElements.TypicalFinalize]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            icon={<FileSyncOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.Revision)}
            loading={isApproveToSedOrRefineBtnLoading}
            disabled={isCompleteBtnLoading || isExportBtnLoading}
            type="link"
          >
            Доработать
          </Button>
        </Can>
      )}
      {isEditButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ActionPlansElements[ActionPlansElements.TypicalEditing]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            onClick={() => handleEditPlan(null, ModalModes.edit)}
            icon={<CheckCircleOutlined />}
            type="link"
          >
            Редактировать
          </Button>
        </Can>
      )}
      {isFinishEditingButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ActionPlansElements[ActionPlansElements.TypicalCompleteEditing]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            icon={<FileSyncOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.Signed)}
            loading={isCompleteBtnLoading}
            disabled={isApproveToSedOrRefineBtnLoading
              || isExportBtnLoading
            }
            type="link"
          >
            Завершить редактирование
          </Button>
        </Can>
      )}
      {isFinishCreationButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ActionPlansElements[ActionPlansElements.TypicalCompleteEditing]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            icon={<CheckCircleOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.Signed)}
            loading={isCompleteBtnLoading}
            disabled={isApproveToSedOrRefineBtnLoading
              || isExportBtnLoading
            }
            type="link"
          >
            Завершить создание
          </Button>
        </Can>
      )}
      {isExportButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ActionPlansElements[ActionPlansElements.TypicalExport]
          )}
        >
          <Button
            className={cx("buttonGrey")}
            type="link"
            icon={<ExportOutlined />}
            loading={isExportBtnLoading}
            disabled={isApproveToSedOrRefineBtnLoading || isCompleteBtnLoading}
            onClick={exportClickHandler}
          >
            Экспортировать
          </Button>
        </Can>
      )}

      <PlanAttachments />
    </React.Fragment>
  );
};
