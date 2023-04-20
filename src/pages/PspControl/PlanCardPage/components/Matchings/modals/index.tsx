import { FC } from "react";
import { useModals } from "components/ModalProvider";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import maxBy from "lodash/maxBy";
import { CommissionModal } from "./MatchingModal";
import { SortCommissionModal } from "./SortModal";
import { MatchingModals } from "../constants";
import {
  createCommissionThunk,
  updateCommissionThunk,
  sortCommissionThunk,
} from "thunks/pspControl/planCard";
import { ICommissionPlanModel } from "slices/pspControl/planCard/types";
import { IPlanCardStore } from "slices/pspControl/planCard";
import { StateType } from "types";
import { ActionPlanTypicalViolationsStore } from "slices/pspControl/actionPlanTypicalViolations/types";

type PropsType = {
  isTypical?: boolean;
}

export const CommissionsModals: FC<PropsType> = ({ isTypical }) => {
  const { commissions } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );
  const { planId } = useParams<{ planId }>();
  const dispatch = useDispatch();
  const { modal, onClose } = useModals();
  const { typicalPlanCard } = useSelector<StateType, ActionPlanTypicalViolationsStore>(
    (state) => state.actionPlanTypicalViolations
  );

  const handleCreateCommission = async (values: ICommissionPlanModel) => {
    const maxSerial = maxBy(commissions, (item) => item.serial)?.serial || 0;

    await dispatch(
      createCommissionThunk({
        id: planId ? planId : typicalPlanCard?.id,
        commission: {
          ...values,
          verificationPlanId: planId ? planId : typicalPlanCard?.id,
          serial: maxSerial + 1,
        },
      })
    );
    await onClose();
  };

  const handleUpdateCommission = async (values: ICommissionPlanModel) => {
    await dispatch(
      updateCommissionThunk({
        id: planId ? planId : typicalPlanCard?.id,
        commission: { ...values, verificationPlanId: planId ? planId : typicalPlanCard?.id },
      })
    );
    await onClose();
  };

  const handleSaveSortCommission = async (values: ICommissionPlanModel[]) => {
    await dispatch(sortCommissionThunk(values));
    await onClose();
  };

  const isCreateModalVisible = MatchingModals.ADD_MODAL === modal.type;
  const isUpdateModalVisible = MatchingModals.EDIT_MODAL === modal.type;
  const isSortModalVisible = MatchingModals.SORT_MODAL === modal.type;

  return (
    <>
      <CommissionModal
        onSubmit={handleCreateCommission}
        onClose={onClose}
        visible={isCreateModalVisible}
        isTypical={isTypical}
      />
      <CommissionModal
        onSubmit={handleUpdateCommission}
        onClose={onClose}
        visible={isUpdateModalVisible}
        id={modal.payload as string}
        isTypical={isTypical}
      />
      <SortCommissionModal
        onClose={onClose}
        visible={isSortModalVisible}
        onSave={handleSaveSortCommission}
      />
    </>
  );
};
