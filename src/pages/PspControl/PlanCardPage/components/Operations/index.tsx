import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import { Button, message } from "antd";
import {
  CheckCircleOutlined,
  ExportOutlined,
  FileSyncOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { StateType } from "../../../../../types";
import { IPlanCardStore } from "../../../../../slices/pspControl/planCard";
import { exportToExcel } from "../../../../../api/requests/pspControl/planCard";
import { signActionPlanThunk } from "../../../../../thunks/pspControl/actionPlans";
import { Attachments } from "../Attachments";
import { ActionsEnum, Can } from "../../../../../casl";
import { ActionPlansElements, elementId } from "../../../ActionPlans/constant";
import {
  isExportButtonVisible,
  isFinishCreationButtonVisible,
  isFinishEditingButtonVisible,
  isRevisionButtonVisible,
  isSeDApprovalButtonVisible,
} from "./utils";
import { PlanStatuses } from "enums";
import {
  planAttachmentSend,
  planCardActionPlan,
  planCardHasMain,
} from "api/requests/pspControl/planCardPage";
import {
  ActionPlanErrorMessage,
  MainAttachmentErrorMessage,
} from "../../../../../constants";
import styles from "./operations.module.css";
import { getPlanAttachmentsThunk } from "thunks/pspControl/planCard";
import { HomeStateType } from "slices/home";

const cx = classNames.bind(styles);

export const Operations: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const dispatch = useDispatch();

  const { planCardInfo, isPlanAttachmentsLoading } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);


  const planStatusId = planCardInfo?.planStatusId;

  const [exportDisabled, setExportDisabled] = React.useState<{ disabled: boolean, loading: boolean }>({ disabled: false, loading: false });
  const [approvalInSedBtn, setApprovalInSedBtn] = React.useState<{ disabled: boolean, loading: boolean }>({ disabled: false, loading: false });
  const [revisionBtn, setRevisionBtn] = React.useState<{ disabled: boolean, loading: boolean }>({ disabled: false, loading: false });
  const [signedBtn, setSignedBtn] = React.useState<{ disabled: boolean, loading: boolean }>({ disabled: false, loading: false });


  const exportClickHandler = async () => {
    setExportDisabled({ disabled: false, loading: true });
    await exportToExcel(planCardInfo?.planName ?? "Н/д", planCardInfo?.id);
    setExportDisabled({ disabled: false, loading: false });
  };

  const handleChangeStatus = async (newStatus: PlanStatuses) => {
    setApprovalInSedBtn({ disabled: true, loading: false });
    setRevisionBtn({ disabled: true, loading: false });
    setSignedBtn({ disabled: true, loading: false });
    setExportDisabled({ disabled: true, loading: false });

    if (newStatus === PlanStatuses.Signed) {
      setSignedBtn({ disabled: false, loading: true });
      const hasMain = await planCardHasMain(planId);
      const hasActionPlan = await planCardActionPlan(planId);

      if (!hasActionPlan) {
        message.error({
          content: ActionPlanErrorMessage,
          duration: 2,
        });
        setSignedBtn({ disabled: false, loading: false });
        setRevisionBtn({ disabled: false, loading: false });
        setExportDisabled({ disabled: false, loading: false });
        setApprovalInSedBtn({ disabled: false, loading: false });
        return;
      }
      if (!hasMain) {
        message.error({
          content: MainAttachmentErrorMessage,
          duration: 2,
        });
        setSignedBtn({ disabled: false, loading: false });
        setRevisionBtn({ disabled: false, loading: false });
        setExportDisabled({ disabled: false, loading: false });
        setApprovalInSedBtn({ disabled: false, loading: false });
        return;
      }
    }

    if (newStatus === PlanStatuses.Revision) {
      setRevisionBtn({ disabled: false, loading: true });
    }
    if (newStatus === PlanStatuses.SEDApproval) {
      setApprovalInSedBtn({ disabled: false, loading: true });
      const hasActionPlan = await planCardActionPlan(planId);

      if (!hasActionPlan) {
        message.error({
          content: ActionPlanErrorMessage,
          duration: 2,
        });
        setSignedBtn({ disabled: false, loading: false });
        setRevisionBtn({ disabled: false, loading: false });
        setExportDisabled({ disabled: false, loading: false });
        setApprovalInSedBtn({ disabled: false, loading: false });
        return;
      }

    }
    await dispatch(
      signActionPlanThunk({
        id: planId,
        newStatus,
      })
    );
    setSignedBtn({ disabled: false, loading: false });
    setRevisionBtn({ disabled: false, loading: false });
    setExportDisabled({ disabled: false, loading: false });

    if (newStatus === PlanStatuses.SEDApproval && planStatusId) {
      const result = await planAttachmentSend(planId, planStatusId);
      if (result?.status === 200) dispatch(getPlanAttachmentsThunk(planId))
    }
    setApprovalInSedBtn({ disabled: false, loading: false });
  };

  return (
    <React.Fragment>
      {isSeDApprovalButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ActionPlansElements[ActionPlansElements.ApproveInSED]
          )}
        >
          <Button
            icon={<SolutionOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.SEDApproval)}
            type="text"
            disabled={approvalInSedBtn.disabled || isPlanAttachmentsLoading}
            loading={approvalInSedBtn.loading}
          >
            Согласовать в СЭД
          </Button>
        </Can>
      )}
      {isRevisionButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ActionPlansElements[ActionPlansElements.Finalize]
          )}
        >
          <Button
            icon={<FileSyncOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.Revision)}
            type="text"
            disabled={revisionBtn.disabled || isPlanAttachmentsLoading}
            loading={revisionBtn.loading}
          >
            Доработать
          </Button>
        </Can>
      )}
      {isFinishEditingButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ActionPlansElements[ActionPlansElements.CompleteEditing]
          )}
        >
          <Button
            icon={<FileSyncOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.Signed)}
            type="text"
            disabled={signedBtn.disabled || isPlanAttachmentsLoading}
            loading={signedBtn.loading}
          >
            Завершить редактирование
          </Button>
        </Can>
      )}
      {isFinishCreationButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ActionPlansElements[ActionPlansElements.CompleteActCreation]
          )}
        >
          <Button
            icon={<CheckCircleOutlined />}
            onClick={() => handleChangeStatus(PlanStatuses.Signed)}
            type="text"
            disabled={signedBtn.disabled || isPlanAttachmentsLoading}
            loading={signedBtn.loading}
          >
            Завершить создание
          </Button>
        </Can>
      )}
      {isExportButtonVisible(planStatusId) && (
        <Can
          I={ActionsEnum.View}
          a={elementId(ActionPlansElements[ActionPlansElements.Export])}
        >
          <Button
            loading={exportDisabled.loading}
            onClick={exportClickHandler}
            icon={<ExportOutlined />}
            disabled={exportDisabled.disabled || isPlanAttachmentsLoading}
            type="text"
          >
            Экспортировать
          </Button>
        </Can>
      )}
      <Can
        I={ActionsEnum.View}
        a={elementId(ActionPlansElements[ActionPlansElements.Attachments])}
      >
        <Attachments />
      </Can>
    </React.Fragment>
  );
};
