import React, { FC } from "react";
import { useVerificationModals } from "../../Provider";
import { OtherSideEditModal } from "../../modals/OtherSideModal/OtherSideEditModal";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../../../../../types";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import maxBy from "lodash/maxBy";
import { OtherPartDtoParams } from "../../../../../../slices/verificationActs/verificationAct/params";
import {
  addVerificationOtherPartItemThunk,
  editVerificationOtherPartItemThunk
} from "../../../../../../thunks/verificationActs/verificationAct";
import { OtherSideModal } from "../../modals/OtherSideModal";

export const OtherSideModals: FC = () => {
  const modalsState = useVerificationModals();
  const dispatch = useDispatch();
  const verificationAct = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );

  const handleCreate = async (values: any) => {
    if (!verificationAct.currentId) {
      return;
    }
    const items =
      verificationAct.memoizePages[verificationAct.currentId].otherSides.items;
    const page = verificationAct.memoizePages[verificationAct.currentId].page;

    if (!Array.isArray(items) || !page) {
      return;
    }

    const maxSerial = maxBy(items, item => item.serial)?.serial || 0;

    const payload: OtherPartDtoParams = {
      serial: Number(maxSerial) + 1,
      partyName: values.partyName,
      ctoName: values.ctoName,
      ostRnuPspId: page.ostRnuPspId,
      verificationActId: verificationAct.currentId
    };
    await dispatch(
      addVerificationOtherPartItemThunk({
        actId: verificationAct.currentId,
        data: payload
      })
    );
    modalsState.onToggleCreateModal(false);
  };

  const handleEdit = async (values: any) => {
    if (!verificationAct.currentId) {
      return;
    }

    const page = verificationAct.memoizePages[verificationAct.currentId].page;

    if (!page) {
      return;
    }

    const payload: OtherPartDtoParams = {
      id: modalsState.editModalVisible.id as string,
      serial: values.serial,
      partyName: values.partyName,
      ctoName: values.ctoName,
      ostRnuPspId: page.ostRnuPspId,
      verificationActId: verificationAct.currentId
    };
    await dispatch(
      editVerificationOtherPartItemThunk({
        actId: verificationAct.currentId,
        data: payload
      })
    );
    modalsState.onCloseEditModal();
  };

  return (
    <>
      <OtherSideModal
        visible={modalsState.addModalVisible}
        onClose={() => modalsState.onToggleCreateModal(false)}
        onCreate={handleCreate}
      />
      <OtherSideEditModal
        visible={modalsState.editModalVisible.visible}
        onClose={modalsState.onCloseEditModal}
        id={modalsState.editModalVisible.id as string}
        onEdit={handleEdit}
      />
    </>
  );
};
