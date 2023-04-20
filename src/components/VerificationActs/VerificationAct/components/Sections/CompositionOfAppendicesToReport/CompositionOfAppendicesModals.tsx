import { FC } from "react";
import maxBy from "lodash/maxBy";
import { useDispatch, useSelector } from "react-redux";
import { useVerificationModals } from "../../Provider";
import { AddReportModal } from "../../modals/AddReportModal";
import { ReportEditModal } from "../../modals/AddReportModal/ReportEditModal";
import { StateType } from "../../../../../../types";
import {
  ReportItemModel,
  VerificationActStore,
} from "../../../../../../slices/verificationActs/verificationAct/types";
import {
  addVerificationReportItemThunk,
  changeOrderReportThunk,
  editVerificationReportItemThunk,
  getVerificationActSectionPageThunk,
} from "../../../../../../thunks/verificationActs/verificationAct";
import { ReportTypeModals } from "./constants";
import { ChangeOrderReport } from "../../modals/ChangeOrderReport";
import { VerificationActSection } from "containers/VerificationActs/VerificationAct/types";

export const CompositionOfAppendicesModals: FC = () => {
  const modalsState = useVerificationModals();
  const dispatch = useDispatch();
  const verificationAct = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const actId = verificationAct.act?.id
  const compositionOfAppendicesToReport = verificationAct.compositionOfAppendicesToReport;

  const handleCreate = async (values: any) => {
    if (!actId) {
      return;
    }

    const maxSerial =
      maxBy(
        compositionOfAppendicesToReport,
        (item) => item.serial
      )?.serial || 0;
    await dispatch(
      addVerificationReportItemThunk({
        actId,
        data: {
          ...values,
          pageCount: Number(values.pageCount),
          verificationActId: actId,
          serial: Number(maxSerial) + 1,
        },
      })
    );
    await dispatch(
      getVerificationActSectionPageThunk({
        actId,
        sectionType: VerificationActSection.CompositionOfAppendicesToReport,
      })
    );
    handleClose();
  };

  const handleEdit = async (values: any) => {
    if (!actId) {
      return;
    }

    await dispatch(
      editVerificationReportItemThunk({
        actId,
        data: {
          id: modalsState.editModalVisible.id as string,
          ...values,
          pageCount: Number(values.pageCount),
          verificationActId: actId,
        },
      })
    );
    await dispatch(
      getVerificationActSectionPageThunk({
        actId,
        sectionType: VerificationActSection.CompositionOfAppendicesToReport,
      })
    );
    handleClose();
  };

  const handleOrder = async (items: ReportItemModel[]) => {
    if (!actId) return

    await dispatch(changeOrderReportThunk({ items }));
    await dispatch(
      getVerificationActSectionPageThunk({
        actId,
        sectionType: VerificationActSection.CompositionOfAppendicesToReport,
      })
    );
    await handleClose();
  };

  const handleClose = () => {
    modalsState.setModal({
      visible: false,
      payload: null,
      type: null,
    });
  };

  const isAddModal =
    modalsState.modal.type === ReportTypeModals.NEW_REPORT_MODAL &&
    modalsState.modal.visible;

  const isEditModal =
    modalsState.modal.type === ReportTypeModals.EDIT_REPORT_MODAL &&
    modalsState.modal.visible;

  const isOrderModal =
    modalsState.modal.type === ReportTypeModals.ORDER_REPORT_MODAL &&
    modalsState.modal.visible;

  return (
    <>
      <AddReportModal
        visible={isAddModal}
        onClose={handleClose}
        onCreate={handleCreate}
      />
      <ReportEditModal
        visible={isEditModal}
        onClose={handleClose}
        id={modalsState.modal.payload?.id as string}
        onEdit={handleEdit}
      />
      <ChangeOrderReport
        visible={isOrderModal}
        onClose={handleClose}
        onSave={handleOrder}
      />
    </>
  );
};
