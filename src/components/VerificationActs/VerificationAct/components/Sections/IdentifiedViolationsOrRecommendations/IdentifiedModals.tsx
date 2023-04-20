import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import maxBy from "lodash/maxBy";

import { useVerificationModals } from "../../Provider";
import {
  EditViolationModal,
  ViolationsModal,
} from "../../modals/ViolationsModal/NewViolation";
import { StateType } from "types";
import {
  IViolationListItemModel,
  IViolationListModel,
  VerificationActStore,
} from "slices/verificationActs/verificationAct/types";
import {
  addVerificationViolationsItemThunk,
  changeOrderAreaViolationsThunk,
  changeOrderViolationsThunk,
  editVerificationViolationsItemThunk,
  getVerificationActPageThunk,
  getVerificationActSectionPageThunk,
  getViolationsThunk,
} from "../../../../../../thunks/verificationActs/verificationAct";
import { VerificationActSection } from "containers/VerificationActs/VerificationAct/types";
import { ViolationActModals } from "./constants";
import { AddTypicalViolationFromDirectory } from "../../modals/ViolationsModal/AddTypicalViolationFromDirectory";
import { TypicalViolationModal } from "../../modals/ViolationsModal/TypicalViolation";
import { ChangeOrderViolationsModal } from "../../modals/ChangeOrderViolations";
import { ChangeOrderAreaViolations } from "../../modals/ChangeOrderAreaViolations";
import { getAdjustedSerial } from "./helpers";
import { useActStatusPermission } from "components/VerificationActs/VerificationAct/hooks/useActStatusPermission";

export const IdentifiedModals: FC = () => {
  const modalsState = useVerificationModals();
  const dispatch = useDispatch();
  const verificationAct = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const actId = state.act?.id;

  const handleAddViolation = async (values: any) => {
    if (!actId) {
      return;
    }

    const violations =
      verificationAct.identifiedViolationsOrRecommendations
        .find((v) => v.areaOfResponsibility === values.areaOfResponsibility)
        ?.violations.flat() || [];

    const maxSerial = maxBy(violations, (item) => item.serial)?.serial || 0;

    await dispatch(
      addVerificationViolationsItemThunk({
        actId,
        data: {
          ...values,
          serial: Number(maxSerial) + 1,
          verificationActId: actId,
          violations: values.violations.map((item: any, index: number) => ({
            ...item,
            serial: index + 1,
          })),
          siknLabRsu: values.siknLabRsu.map((s) => ({ id: s })),
        },
      })
    );

    await dispatch(
      getViolationsThunk({
        actId,
      })
    );
    await dispatch(getVerificationActPageThunk(actId));
  };

  const handleCreate = async (values: any) => {
    handleAddViolation(values);
    handleCloseIdentifiedViolationModal();
    modalsState.onToggleCreateModal(false);
  };

  const handleEdit = async (values: any) => {
    if (!actId) {
      return;
    }

    await dispatch(
      editVerificationViolationsItemThunk({
        actId,
        data: {
          id: modalsState.editModalVisible.id as string,
          ...values,
          verificationActId: actId,
          violations: values.violations.map((item: any, index: number) => ({
            ...item,
            serial: index + 1,
          })),
          siknLabRsu: values.siknLabRsu.map((s) => ({ id: s })),
          serial: getAdjustedSerial(values, modalsState, verificationAct.identifiedViolationsOrRecommendations)
        },
      })
    );

    await dispatch(
      getViolationsThunk({
        actId,
      })
    );

    await dispatch(getVerificationActPageThunk(actId));

    handleCloseIdentifiedViolationModal();

    modalsState.onCloseEditModal();
  };

  const handleAddTypicalViolation = async (values: any) => {
    handleAddViolation(values);
    handleCloseIdentifiedViolationModal();
  };

  const handleCloseIdentifiedViolationModal = () => {
    modalsState.setModal({
      visible: false,
      payload: null,
      type: null,
    });
  };

  const handleChangeOrderViolations = async ({
    id,
    violations,
    area,
  }: {
    id: string;
    area: string;
    violations: IViolationListItemModel[];
  }) => {
    if (!actId) {
      return;
    }

    await dispatch(changeOrderViolationsThunk({ area, id, violations }));
    await handleCloseIdentifiedViolationModal();
    await dispatch(
      getViolationsThunk({
        actId,
      })
    );
  };

  const handleChangeAreaOrderViolations = async ({
    id,
    violations,
    area,
  }: {
    id: string;
    area: string;
    violations: IViolationListModel[];
  }) => {
    if (!actId) {
      return;
    }

    await dispatch(changeOrderAreaViolationsThunk({ area, violations }));
    await handleCloseIdentifiedViolationModal();
    await dispatch(
      getViolationsThunk({
        actId,
      })
    );
  };

  const isNewViolationModal =
    modalsState.modal.type === ViolationActModals.NEW_VIOLATION_MODAL ??
    modalsState.modal.visible;

  const isTypicalViolationModalFromDir =
    modalsState.modal.type ===
    ViolationActModals.TYPICAL_VIOLATION_MODAL_FROM_DIR ??
    modalsState.modal.visible;

  const isTypicalViolationModal =
    modalsState.modal.type === ViolationActModals.TYPICAL_VIOLATION_MODAL ??
    modalsState.modal.visible;

  const isEditNewTypicalViolation =
    modalsState.modal.type === ViolationActModals.EDIT_NEW_VIOLATION_MODAL ??
    modalsState.modal.visible;

  const isEditTypicalViolation =
    modalsState.modal.type ===
    ViolationActModals.EDIT_TYPICAL_VIOLATION_MODAL ??
    modalsState.modal.visible;

  const isNewViolationFromDirModal =
    modalsState.modal.type ===
    ViolationActModals.NEW_VIOLATION_FROM_DIR_MODAL ??
    modalsState.modal.visible;

  const isNewTypicalViolationModal =
    modalsState.modal.type === ViolationActModals.NEW_TYPICAL_VIOLATION_MODAL ??
    modalsState.modal.visible;

  const isCopyViolationModal =
    modalsState.modal.type === ViolationActModals.COPY_VIOLATION_MODAL ??
    modalsState.modal.visible;

  const isChangeOrderViolationsModal =
    modalsState.modal.type ===
    ViolationActModals.CHANGE_VIOLATION_ORDER_MODAL ??
    modalsState.modal.visible;

  const isChangeOrderAreaViolationsModal =
    modalsState.modal.type ===
    ViolationActModals.CHANGE_AREA_VIOLATION_ORDER_MODAL ??
    modalsState.modal.visible;

  return (
    <>
      <ViolationsModal
        visible={isNewViolationModal}
        onClose={handleCloseIdentifiedViolationModal}
        onSubmit={handleCreate}
      />
      <AddTypicalViolationFromDirectory
        visible={isTypicalViolationModalFromDir}
        onClose={handleCloseIdentifiedViolationModal}
      />
      <EditViolationModal
        visible={isEditNewTypicalViolation}
        onClose={handleCloseIdentifiedViolationModal}
        id={modalsState.modal.payload?.violationId as string}
        area={modalsState.modal.payload?.areaOfResponsibility}
        onSubmit={handleEdit}
      />
      <EditViolationModal
        visible={isEditTypicalViolation}
        onClose={handleCloseIdentifiedViolationModal}
        id={modalsState.modal.payload?.violationId as string}
        area={modalsState.modal.payload?.areaOfResponsibility}
        onSubmit={handleEdit}
      />
      <TypicalViolationModal
        visible={isTypicalViolationModal}
        onClose={handleCloseIdentifiedViolationModal}
      />
      <ViolationsModal
        visible={isNewViolationFromDirModal}
        onClose={handleCloseIdentifiedViolationModal}
        data={modalsState.modal.payload}
        onSubmit={handleAddTypicalViolation}
      />
      <ViolationsModal
        onSubmit={handleAddTypicalViolation}
        data={modalsState.modal.payload}
        onClose={handleCloseIdentifiedViolationModal}
        visible={isNewTypicalViolationModal}
      />
      <ViolationsModal
        visible={isCopyViolationModal}
        data={modalsState.modal.payload}
        onClose={handleCloseIdentifiedViolationModal}
        onSubmit={handleCreate}
        visibleTypicalButton={
          modalsState.modal.payload?.identifiedTypicalViolationId === null
        }
      />
      <ChangeOrderViolationsModal
        visible={isChangeOrderViolationsModal}
        onClose={handleCloseIdentifiedViolationModal}
        id={modalsState.modal.payload?.id}
        area={modalsState.modal.payload?.area}
        onSave={handleChangeOrderViolations}
      />
      <ChangeOrderAreaViolations
        visible={isChangeOrderAreaViolationsModal}
        onClose={handleCloseIdentifiedViolationModal}
        area={modalsState.modal.payload}
        onSave={handleChangeAreaOrderViolations}
      />
    </>
  );
};
