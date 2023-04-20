import { FilterDocumentType, FilterStatusType, HistoryResponseType } from "api/responses/importAttemptsHistory";
import axios from "axios";
import { apiBase } from "utils";

const BASE_URL = `${apiBase}/import`;

export const importAttemptsHistoryApi = {
    getHistory(page: number, filters: HistoryFilterType) {
        return axios.post<HistoryResponseType>(`${BASE_URL}/attempts?page=${page}`, filters);
    },
    getDocumentTypes() {
        return axios.get<Array<FilterDocumentType>>(`${BASE_URL}/doctype`);
    },
    getStatusList() {
        return axios.get<Array<FilterStatusType>>(`${BASE_URL}/status`);
    },
};

export type HistoryFilterType = {
    startTime: string;
    endTime: string;
    docTypeId: number | null;
    importStatusId: number | null;
}