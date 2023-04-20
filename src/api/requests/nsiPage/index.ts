import axios from "axios";
import { apiBase } from "../../../utils";
import { SchemeDataType, SchemeType, SchemeWithRowType } from "../../params/nsi-page.params";
import { AllSchemesResponseType, SchemeDataResponseType, SelectorsResponseType } from "../../responses/nsi-page.response";

const BASE_URL = `${apiBase}/nsi`;

export const nsiApi = {
  getAllSchemes() {
    return axios.get<AllSchemesResponseType>(`${BASE_URL}/get-tables-info`);
  },
  getSchemeData(scheme: SchemeType) {
    return axios.post<SchemeDataResponseType>(`${BASE_URL}/get-data`, scheme);
  },
  getSelectorsForDifferentColumns(scheme: SchemeType) {
    return axios.post<SelectorsResponseType>(`${BASE_URL}/get-selectors`, scheme)
  },
  addNewRowToSchemeData(schemeWithNewRow: SchemeWithRowType) {
    return axios.post<SchemeDataType>(`${BASE_URL}/add`, schemeWithNewRow);
  },
  updateRowInSchemeData(schemeWithUpdatedRow: SchemeWithRowType) {
    return axios.put<SchemeDataType>(`${BASE_URL}/update`, schemeWithUpdatedRow);
  },
  deleteRowInSchemeData(rowId: any, scheme: SchemeType) { 
    return axios.put(`${BASE_URL}/delete?id=${rowId}`, scheme);
  },
};
