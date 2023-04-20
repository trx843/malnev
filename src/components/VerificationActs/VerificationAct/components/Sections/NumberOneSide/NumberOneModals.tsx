import React, { FC } from "react";
import { useVerificationModals } from "../../Provider";
import { AddOSUModal } from "../../modals/AddOSUModal";

export const NumberOneModals: FC = () => {
  const modalsState = useVerificationModals();
  return (
    <>
      <AddOSUModal
        visible={modalsState.addModalVisible}
        onClose={() => modalsState.onToggleCreateModal(false)}
      />
    </>
  );
};
