import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { importAttemptsHistoryCard, importAttemptsHistoryCardActions } from "slices/importAttemptsHistoryCard";
import { getAttemptHeadTC, getCardDataTC, getMessageTypesListTC } from "thunks/importAttemptsHistory/importAttemptsHistoryCard";
import moment from "moment";
import { useParams } from "react-router-dom";

const usePresenter = () => {
    const dispatch = useDispatch();
    const { attemptId } = useParams<{ attemptId: string }>();

    const importAttemptsHistoryCardState = useSelector(importAttemptsHistoryCard);

    useEffect(() => {
        if (attemptId) {
            dispatch(getCardDataTC({
                page: importAttemptsHistoryCardState.currentPage,
                importAttemptId: attemptId,
                filters: {
                    rowNumber: importAttemptsHistoryCardState.rowNumberId,
                    messageTypeIds: importAttemptsHistoryCardState.messageTypesId,
                }
            }));
            dispatch(getAttemptHeadTC(attemptId));
        }

        dispatch(getMessageTypesListTC());

        return () => {
            dispatch(importAttemptsHistoryCardActions.clearState());
        }
    }, [])

    useEffect(() => {
        if (attemptId) {
            dispatch(getCardDataTC({
                page: importAttemptsHistoryCardState.currentPage,
                importAttemptId: attemptId,
                filters: {
                    rowNumber: importAttemptsHistoryCardState.rowNumberId,
                    messageTypeIds: importAttemptsHistoryCardState.messageTypesId,
                }
            }));
            dispatch(getAttemptHeadTC(attemptId));
        }
    }, [
        attemptId,
        importAttemptsHistoryCardState.currentPage,
        importAttemptsHistoryCardState.rowNumberId,
        importAttemptsHistoryCardState.messageTypesId,
    ])

    useEffect(() => {
        const modifiedRowData = importAttemptsHistoryCardState.rowData.map(row => ({ ...row, timeStamp: moment(row.timeStamp).format("YYYY-MM-DD HH:mm:ss") }))
        dispatch(importAttemptsHistoryCardActions.setModifiedRowData(modifiedRowData))
    }, [importAttemptsHistoryCardState.rowData]);

    const [collapsed, setCollapsed] = useState<boolean>(false);

    const onCollapseHandler = useCallback(() => {
        setCollapsed(!collapsed);
    }, [collapsed]);

    const setRowNumbersIdHandler = useCallback((value) => {
        dispatch(importAttemptsHistoryCardActions.setRowNumberId(value));
    }, []);

    const setMessageTypeIdHandler = useCallback((values: any) => {
        const eventTypes = values.map(type => +type.split('-').pop());
        dispatch(importAttemptsHistoryCardActions.setCheckedMessageTypeId(values));
        dispatch(importAttemptsHistoryCardActions.setMessageTypesId(eventTypes));
    }, []);

    const setCurrentPageHandler = useCallback((value) => {
        dispatch(importAttemptsHistoryCardActions.setCurrentPage(value));
    }, []);

    return {
        importAttemptsHistoryCardState,
        collapsed,
        onCollapseHandler,
        setRowNumbersIdHandler,
        setMessageTypeIdHandler,
        setCurrentPageHandler,
    }
};

export default usePresenter;