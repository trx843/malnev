import React, { FC } from "react";
import { useVerificationModals } from "../../Provider";
import { RecommendationModal } from "../../modals/RecommendationModal";
import { RecommendationEditModal } from "../../modals/RecommendationModal/RecommendationEditModal";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../../../../../../types";
import {
  RecommendationItemModel,
  VerificationActStore,
} from "../../../../../../slices/verificationActs/verificationAct/types";
import maxBy from "lodash/maxBy";
import {
  addVerificationRecommendationItemThunk,
  changeOrderRecommendationThunk,
  editVerificationRecommendationItemThunk,
  getVerificationActSectionPageThunk,
} from "../../../../../../thunks/verificationActs/verificationAct";
import { RecommendationsTypeModals } from "./constants";
import { ChangeOrderRecommendationModal } from "../../modals/ChangeOrderRecommendationModal";
import { VerificationActSection } from "containers/VerificationActs/VerificationAct/types";

export const RecommendationsModals: FC = () => {
  const modalsState = useVerificationModals();
  const dispatch = useDispatch();
  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const actId = state.act?.id
  const recommendations = state.recommendations

  const handleCreate = async (values: any) => {
    if (!actId) return;

    const maxSerial =
      maxBy(
        recommendations,
        (item) => item.serial
      )?.serial || 0;
    await dispatch(
      addVerificationRecommendationItemThunk({
        actId,
        data: {
          ...values,
          verificationActId: actId,
          serial: Number(maxSerial) + 1,
        },
      })
    );
    await dispatch(
      getVerificationActSectionPageThunk({
        actId,
        sectionType: VerificationActSection.Recommendations
      })
    );
    handleClose();
  };

  const handleEdit = async (values: any) => {
    if (!actId) return;

    await dispatch(
      editVerificationRecommendationItemThunk({
        actId,
        data: {
          id: modalsState.editModalVisible.id as string,
          ...values,
          verificationActId: actId,
        },
      })
    );
    await dispatch(
      getVerificationActSectionPageThunk({
        actId,
        sectionType: VerificationActSection.Recommendations
      })
    );
    handleClose();
  };

  const handleOrderSave = async (values: RecommendationItemModel[]) => {
    if (!actId) return;

    await dispatch(changeOrderRecommendationThunk({items: values}))
    await dispatch(
      getVerificationActSectionPageThunk({
        actId,
        sectionType: VerificationActSection.Recommendations
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
    modalsState.modal.type ===
      RecommendationsTypeModals.NEW_RECOMMENDATION_MODAL &&
    modalsState.modal.visible;

  const isEditModal =
    modalsState.modal.type ===
      RecommendationsTypeModals.EDIT_RECOMMENDATION_MODAL &&
    modalsState.modal.visible;

  const isOrderModal =
    modalsState.modal.type ===
      RecommendationsTypeModals.ORDER_RECOMMENDATION_MODAL &&
    modalsState.modal.visible;

  return (
    <>
      <RecommendationModal
        visible={isAddModal}
        onClose={handleClose}
        onCreate={handleCreate}
      />
      <RecommendationEditModal
        visible={isEditModal}
        onClose={handleClose}
        initialValues={modalsState.modal.payload}
        onEdit={handleEdit}
      />
      <ChangeOrderRecommendationModal
        onClose={handleClose}
        visible={isOrderModal}
        onSave={handleOrderSave}
      />
    </>
  );
};
