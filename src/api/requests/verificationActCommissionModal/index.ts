import axios from "axios";
import { apiBase } from "../../../utils";

const BASE_URL = `${apiBase}/pspcontrol/dictionaries`;
 
export const commissionModalApi = {
    getCommissionTypes() {
        return axios.get<Array<UniType>>(`${BASE_URL}/commisionTypes`);
    },
    getFullNames() {
        return axios.get(`${BASE_URL}/fullnames`);
    },
    addFullName(fullName: string) {
        return axios.post(`${BASE_URL}/fullname?fullName=${fullName}`)
    },
    deleteFullName(id: string) {
        return axios.delete(`${BASE_URL}/fullname/${id}`)
    },
    getJobTitles() {
        return axios.get(`${BASE_URL}/jobTitles`);
    },
    addJobTitle(jobTitle: string) {
        return axios.post(`${BASE_URL}/jobTitle?jobTitle=${jobTitle}`)
    },
    deleteJobTitle(id: string) {
        return axios.delete(`${BASE_URL}/jobTitle/${id}`)
    },
};

export type UniType = {
    id: string;
    label: string;
};