import moment from "moment";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { importAttemptsHistory, importAttemptsHistoryActions } from "slices/importAttemptsHistory";
import { getDocumentTypesTC, getHistoryTC, getStatusListTC } from "thunks/importAttemptsHistory";

const usePresenter = () => {
    const dispatch = useDispatch();

    const importAttemptsHistoryState = useSelector(importAttemptsHistory);

    useEffect(() => {
        dispatch(getHistoryTC({
            page: importAttemptsHistoryState.currentPage,
            filters: {
                startTime: importAttemptsHistoryState.startTime,
                endTime: importAttemptsHistoryState.finishTime,
                docTypeId: importAttemptsHistoryState.documentTypeId,
                importStatusId: importAttemptsHistoryState.statusId,
            }
        }));
        dispatch(getDocumentTypesTC());
        dispatch(getStatusListTC());

        return () => {
            dispatch(importAttemptsHistoryActions.clearState());
        }
    }, []);

    useEffect(() => {
        dispatch(getHistoryTC({
            page: importAttemptsHistoryState.currentPage,
            filters: {
                startTime: importAttemptsHistoryState.startTime,
                endTime: importAttemptsHistoryState.finishTime,
                docTypeId: importAttemptsHistoryState.documentTypeId,
                importStatusId: importAttemptsHistoryState.statusId,
            }
        }));
    }, [
        importAttemptsHistoryState.currentPage,
        importAttemptsHistoryState.startTime,
        importAttemptsHistoryState.finishTime,
        importAttemptsHistoryState.documentTypeId,
        importAttemptsHistoryState.statusId,
    ]);

    useEffect(() => {
        const modifiedRowData = importAttemptsHistoryState.rowData.map(row => ({ ...row, timeStamp: moment(row.timeStamp).format("YYYY-MM-DD HH:mm:ss") }))
        dispatch(importAttemptsHistoryActions.setModifiedRowData(modifiedRowData))
    }, [importAttemptsHistoryState.rowData]);

    const setStartTimeHandler = useCallback((value) => {
        dispatch(importAttemptsHistoryActions.setStartTime(value));
    }, []);

    const setFinishTimeHandler = useCallback((value) => {
        dispatch(importAttemptsHistoryActions.setFinishTime(value));
    }, []);

    const setDocumentTypeIdHandler = useCallback((value) => {
        let checkedValue = value === undefined ? null : value
        dispatch(importAttemptsHistoryActions.setDocumentTypeId(checkedValue));
    }, []);

    const setStatusIdHandler = useCallback((value) => {
        let checkedValue = value === undefined ? null : value
        dispatch(importAttemptsHistoryActions.setStatusId(checkedValue));
    }, []);

    const setCurrentPageHandler = useCallback((value) => {
        dispatch(importAttemptsHistoryActions.setCurrentPage(value));
    }, []);

    return {
        importAttemptsHistoryState,
        setDocumentTypeIdHandler,
        setStatusIdHandler,
        setCurrentPageHandler,
        setStartTimeHandler,
        setFinishTimeHandler,
    }
};

export default usePresenter;