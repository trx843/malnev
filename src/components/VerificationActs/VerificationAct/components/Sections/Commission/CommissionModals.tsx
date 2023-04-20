import React, { FC } from "react";
import { useVerificationModals } from "../../Provider";
import { CommissionModal } from "../../modals/CommissionModal";
import { CommissionEditModal } from "../../modals/CommissionModal/CommissionEditModal";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../../../../../types";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import maxBy from "lodash/maxBy";
import {
  addVerificationCommissionsItemThunk,
  editVerificationCommissionsItemThunk,
  getVerificationActSectionPageThunk
} from "../../../../../../thunks/verificationActs/verificationAct";
import { VerificationActSection } from "containers/VerificationActs/VerificationAct/types";

export const CommissionModals: FC = () => {
  const dispatch = useDispatch();
  const state = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );

  const actId = state.act?.id
  const commission = state.commission

  const modalsState = useVerificationModals();

  const handleCreate = async (values: any) => {
    if (!actId) return

    const maxSerial =
      maxBy(
        commission,
        item => item.serial
      )?.serial || 0;

    await dispatch(
      addVerificationCommissionsItemThunk({
        actId,
        data: {
          ...values,
            isInPresence: values.isInPresence,
          verificationActId: actId,
          serial: Number(maxSerial) + 1
        }
      })
    );
    await dispatch(
      getVerificationActSectionPageThunk({
        actId,
        sectionType: VerificationActSection.Commission
      })
    );
    modalsState.onToggleCreateModal(false);
  };

  const handleEdit = async (values: any) => {
    if (!actId) return;

    await dispatch(
      editVerificationCommissionsItemThunk({
        actId,
        data: {
          id: modalsState.editModalVisible.id,
          ...values,
          pageCount: Number(values.pageCount),
          verificationActId: actId
        }
      })
    );
    await dispatch(
      getVerificationActSectionPageThunk({
        actId,
        sectionType: VerificationActSection.Commission
      })
    );
    modalsState.onCloseEditModal();
  };

  return (
    <>
      <CommissionModal
        visible={modalsState.addModalVisible}
        onClose={() => modalsState.onToggleCreateModal(false)}
        onCreate={handleCreate}
      />
      <CommissionEditModal
        visible={modalsState.editModalVisible.visible}
        onClose={modalsState.onCloseEditModal}
        onEdit={handleEdit}
        initialValues={modalsState.editModalVisible.payload}
      />
    </>
  );
};
