import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AddViolationsModal } from "../../AddViolationsModal";
import { SortViolationModal } from "../../modals/SortViolations";
import { useModals } from "components/ModalProvider";
import { TypicalViolationModalTypes } from "containers/ActPlanEliminationOfTypicalViolations/constants";
import { TypicalPlanSections } from "slices/pspControl/actionPlanTypicalViolations/types";
import { StateType } from "types";
import { TypicalPlanCardFilterEntitiesDto } from "api/requests/pspControl/plan-typical-violations/dto-types";
import { sortViolationsThunk } from "thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { useTypicalPlanSectionFetch } from "containers/ActPlanEliminationOfTypicalViolations/hooks/useTypicalPlanSectionFetch";

interface ActPlanTypicalViolationsModalsProps {
  selectedSection: TypicalPlanSections;
}

export const ActPlanEliminationOfTypicalViolationsModals: FC<ActPlanTypicalViolationsModalsProps> =
  ({ selectedSection }) => {
    const {
      getViolationsBySectionData
    } = useTypicalPlanSectionFetch(selectedSection);
  
    const dispatch = useDispatch();
    const { modal, setModal } = useModals();

    const entities = useSelector<StateType, TypicalPlanCardFilterEntitiesDto[]>(
      (state) => {
        const planId = state.actionPlanTypicalViolations.currentId;

        return (
          state.actionPlanTypicalViolations.memoizePages[planId || ""]?.[
            selectedSection
          ]?.entities || []
        );
      }
    );

    const handleSort = async (values: any[], id: string) => {
      await dispatch(sortViolationsThunk({items: values, idIdentifiedViolation: id}))
      await getViolationsBySectionData()
      await handleClose()
    };

    const handleClose = () => {
      setModal({
        payload: null,
        type: null,
      });
    };

    const isSortVisibleModal =
      TypicalViolationModalTypes.SORT_TYPICAL_VIOLATION === modal.type;

    const isAddVisibleModal =
      TypicalViolationModalTypes.ADD_VIOLATION === modal.type;

    return (
      <>
        <AddViolationsModal visible={isAddVisibleModal} onClose={handleClose} />
        <SortViolationModal
          id={modal.payload?.id as string}
          items={entities}
          visible={isSortVisibleModal}
          onClose={handleClose}
          onSave={handleSort}
        />
      </>
    );
  };
