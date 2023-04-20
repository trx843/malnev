import axios from "axios";
import { IdType } from "types";
import { apiBase } from "../../../utils";
import { DocTypesResponseType, FileResponseType, ResponseFAQFilesType } from "../../responses/faq-page.response";

const BASE_URL = `${apiBase}/faq`;

export const FAQApi = {
    getAllFiles() {
        return axios.get<ResponseFAQFilesType>(`${BASE_URL}/get-files`);
    },
    getDocTypes() {
        return axios.get<Array<DocTypesResponseType>>(`${BASE_URL}/get-doctypes`);
    },
    addFile(file: any, docType: number) {
        return axios.post<FileResponseType>(`${BASE_URL}/load-file?docType=${docType}`, file); 
    },
    replaceFile(fileId: string | number, file: any, docType: number) {
        return axios.post<FileResponseType>(`${BASE_URL}/replace-file/${fileId}?docType=${docType}`, file);
    },
    deleteFile(id: IdType) {
        return axios.delete<FileResponseType>(`${BASE_URL}/${id}`); 
    },
};