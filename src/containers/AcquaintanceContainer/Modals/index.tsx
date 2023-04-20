import { FC } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";

import {
  AddingAcquaintanceValues,
  AddingFactAcquaintanceModal
} from "./AddingFactAcquaintance";
import { AcquaintanceModalTypes } from "./Provider/enums";
import { User } from "../../../classes";
import { InformationAboutPersonsModal } from "./InformationAboutPersons";
import { setAcquaintanceThunk } from "thunks/pspControl/acquaintance";
import { IdType } from "types";
import { ExportFormModal } from "containers/AcquaintanceContainer/Modals/ExportForm";
import { useModals } from "components/ModalProvider";

export const AcquaintanceModals: FC = () => {
  const dispatch = useDispatch();
  const currentUser = JSON.parse(
    localStorage.getItem("userContext") as string
  ) as User;
  const modals = useModals();

  const handleCloseModal = () => {
    modals.onClose();
  };

  const handleAcquaintanceSubmit = async (values: AddingAcquaintanceValues) => {
    const payload = modals.modal.payload as {
      verificationPlanId: string;
      verificationActId: string;
    } | null;

    if (!payload) {
      return;
    }

    await dispatch(
      setAcquaintanceThunk({
        ...values,
        createdOn: moment(values.createdOn),
        verificationActId: payload.verificationActId,
        verificationPlanId: payload.verificationPlanId
      })
    );

    handleCloseModal();
  };

  const isAddingFactAcquaintanceModal =
    modals.modal.type === AcquaintanceModalTypes.AddingFactAcquaintanceModal;

  const isInfoPersonsModal =
    modals.modal.type === AcquaintanceModalTypes.InformationAboutPersons;

  const isExportModal =
    modals.modal.type === AcquaintanceModalTypes.ExportModal;

  return (
    <>
      <AddingFactAcquaintanceModal
        visible={isAddingFactAcquaintanceModal}
        onClose={handleCloseModal}
        onSubmit={handleAcquaintanceSubmit}
        profile={{
          fullname: currentUser.fullName || "ФИО",
          position: currentUser.position || "Должность"
        }}
      />
      <InformationAboutPersonsModal
        visible={isInfoPersonsModal}
        onClose={handleCloseModal}
        verificationActId={
          (modals.modal.payload as null | { verificationActId: IdType })
            ?.verificationActId
        }
      />
      <ExportFormModal
        visible={isExportModal}
        onClose={handleCloseModal}
      />
    </>
  );
};
