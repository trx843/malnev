import { CardResponseType, MessageType } from "api/responses/importAttemptsHistory";
import axios from "axios";
import { apiBase } from "utils";

const BASE_URL = `${apiBase}/import`;

export const importAttemptsHistoryCardApi = {
    getCardData(page: number, importAttemptId: string, filters: ImportLogsFilterType) {
        return axios.post<CardResponseType>(`${BASE_URL}/logs?page=${page}&importAttemptId=${importAttemptId}`, filters);
    },
    getMessageTypesList() {
        return axios.get<Array<MessageType>>(`${apiBase}/SqlTree?viewName=ImportMessageTypesTree`);
    },
    getAttemptHead(importAttemptId: string) {
        return axios.get(`${BASE_URL}/headattempt?importAttemptId=${importAttemptId}`)
    },
};

export type ImportLogsFilterType = {
    rowNumber: number | null;
    messageTypeIds: Array<number>;
}