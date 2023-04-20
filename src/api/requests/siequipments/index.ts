import axios from "axios";
import { IdType, Nullable, String } from "types";
import { SiEquipment } from "../../../classes";
import { apiBase } from "../../../utils";

const BASE_URL = `${apiBase}/siequipments`;
const BASE_URL_B_VARIANT = `${apiBase}/SiEquipmentBindings`;

export const siequipmentsApi = {
  getSiequipmentsbySiType(siTypeId: number) {
    return axios.get<SiEquipment[]>(`${BASE_URL}?siTypeId=${siTypeId}`);
  },
  getObjectAffectedInfo(oldSiId: IdType, newSiId: IdType, oldSiDescription: String, newSiDescription: String) {
    return axios.get<IObjectAffectedInfo>(`${BASE_URL}/getevents`, {
      params: {
        oldSiId,
        newSiId,
        oldSiDescription,
        newSiDescription
      }
    })
  },
  checkPseudonims(techPositionId: number, inputPseudonims: Array<string>, effectiveFrom: string, bindingId: IdType) {
    return axios.post<Array<ICheckPseudonimsResponse> | null>(`${BASE_URL_B_VARIANT}/checkPseudonims?techPositionId=${techPositionId}&effectiveFrom=${effectiveFrom}&bindingId=${bindingId}`, inputPseudonims);
  },
};

export interface IObjectAffectedInfo {
  oldPlannedEvents: number;
  newPlannedEvents: number;
  oldFactEvents: number;
  newFactEvents: number;
  oldSiDescription: string;
  newSiDescription: string;
  eventsTableModel: Array<IEventTableRow>;
};

export interface IEventTableRow {
  siDescription: string;
  eventDate: Date;
  eventType: string;
  isFactText: string;
};

export interface ICheckPseudonimsResponse {
  pseudonimName: string;
  techPosName: string;
  siTypeId: string;
  siModel: string,
  effectiveFrom: Date;
  effectiveFor: Date;
  manufNumber: string;
  isDuplicate: boolean;
  message: string;
}