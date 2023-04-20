import { useModals } from "components/ModalProvider";
import { MatchingModals } from "pages/PspControl/PlanCardPage/components/Matchings/constants";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlanStatusId } from "slices/pspControl/actionPlanTypicalViolations";
import { ActionPlanTypicalViolationsStore } from "slices/pspControl/actionPlanTypicalViolations/types";
import { IPlanCardStore } from "slices/pspControl/planCard";
import { getCommissionsThunk, removeCommissionThunk } from "thunks/pspControl/planCard";
import { StateType } from "types";

const usePresenter = () => {
    const dispatch = useDispatch();
    const {
        isMatchingsTabLoading,
        typicalPlanCard,
        planStatusId,
    } =
        useSelector<StateType, ActionPlanTypicalViolationsStore>(
            (state) => state.actionPlanTypicalViolations
        );
    console.log(typicalPlanCard?.planStatusId)
    const {
        commissions
    } = useSelector<StateType, IPlanCardStore>(
        (state) => state.planCard
    );
    const { setModal } = useModals();

    useEffect(() => {
        if (typicalPlanCard) {
            dispatch(getCommissionsThunk(typicalPlanCard.id));
            dispatch(setPlanStatusId(typicalPlanCard.planStatusId));
        };
    }, [typicalPlanCard]);

    const handleDelete = useCallback((id: string) => {
        dispatch(removeCommissionThunk(id));
    }, []);

    const handleAdd = useCallback(() => {
        setModal({
            type: MatchingModals.ADD_MODAL,
            payload: {},
        });
    }, [MatchingModals.ADD_MODAL]);

    const handleSort = useCallback(() => {
        setModal({
            type: MatchingModals.SORT_MODAL,
            payload: {},
        });
    }, [MatchingModals.SORT_MODAL]);

    return {
        isMatchingsTabLoading,
        commissions,
        handleDelete,
        handleAdd,
        handleSort,
        planStatusId,
        typicalPlanCard,
    };
};

export default usePresenter;