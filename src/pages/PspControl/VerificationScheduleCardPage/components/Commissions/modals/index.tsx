import { FC } from "react";
import { useModals } from "components/ModalProvider";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import maxBy from "lodash/maxBy";
import { CommissionModal } from "./CommissionModal";
import { SortCommissionModal } from "./SortModal";
import { VerificationCommissionModals } from "../../../constants";
import { StateType } from "types";
import { createVerificationCommissionThunk, sortVerificationCommissionThunk, updateVerificationCommissionThunk } from "thunks/pspControl/verificationScheduleCard";
import { ICommissionVerificationModel } from "slices/pspControl/verificationScheduleCard/types";
import { IVerificationScheduleCardStore } from "slices/pspControl/verificationScheduleCard";

export const CommissionsModals: FC = () => {
  const { commissions } = useSelector<StateType, IVerificationScheduleCardStore>(
    (state) => state.verificationScheduleCard
  );
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const dispatch = useDispatch();
  const { modal, onClose } = useModals();

  const handleCreateCommission = async (values: ICommissionVerificationModel) => {
    const maxSerial = maxBy(commissions, (item) => item.serial)?.serial || 0;

    await dispatch(
      createVerificationCommissionThunk({
        id: scheduleId,
        commission: {
          ...values,
          verificationScheduleId: scheduleId,
          serial: maxSerial + 1,
        },
      })
    );
    await onClose();
  };

  const handleUpdateCommission = async (values: ICommissionVerificationModel) => {
    await dispatch(
      updateVerificationCommissionThunk({
        id: scheduleId,
        commission: { ...values, verificationScheduleId: scheduleId },
      })
    );
    await onClose();
  };

  const handleSaveSortCommission = async (values: ICommissionVerificationModel[]) => {
    await dispatch(sortVerificationCommissionThunk(values));
    await onClose();
  };

  const isCreateModalVisible = VerificationCommissionModals.ADD_MODAL === modal.type;
  const isUpdateModalVisible = VerificationCommissionModals.EDIT_MODAL === modal.type;
  const isSortModalVisible = VerificationCommissionModals.SORT_MODAL === modal.type;

  return (
    <>
      <CommissionModal
        onSubmit={handleCreateCommission}
        onClose={onClose}
        visible={isCreateModalVisible}
      />
      <CommissionModal
        onSubmit={handleUpdateCommission}
        onClose={onClose}
        visible={isUpdateModalVisible}
        id={modal.payload as string}
      />
      <SortCommissionModal
        onClose={onClose}
        visible={isSortModalVisible}
        onSave={handleSaveSortCommission}
      />
    </>
  );
};
