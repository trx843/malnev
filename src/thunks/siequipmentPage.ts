import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICheckPseudonimsResponse, siequipmentsApi } from "../api/requests/siequipments";
import { techpositionsApi } from "../api/requests/techpositions";
import { SiEquipment, TechPositions } from "../classes";
import { IdType, String, StateType, Nullable } from "../types";


export const getTechPosInfoTC = createAsyncThunk<
  TechPositions,
  { techPosId: number },
  { rejectValue: string; state: StateType }
>("siequipments/getTechPosInfo", async ({ techPosId }, { rejectWithValue }) => {
  try {
    const response = await techpositionsApi.getTechpositionById(techPosId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getSiequipmentsbySiTypeTC = createAsyncThunk<
  SiEquipment[],
  { siTypeId: number },
  { rejectValue: string; state: StateType }
>("siequipments/getSiequipmentsbySiType", async ({ siTypeId }, { rejectWithValue }) => {
  try {
    const response = await siequipmentsApi.getSiequipmentsbySiType(siTypeId);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getObjectAffectedInfoTC = createAsyncThunk<
  any,
  { oldSiId: IdType, newSiId: IdType, oldSiDescription: String, newSiDescription: String },
  { rejectValue: string; state: StateType }
>("siequipments/getObjectAffectedInfo", async ({
  oldSiId, newSiId, oldSiDescription, newSiDescription
}, { rejectWithValue }) => {
  try {
    const response = await siequipmentsApi.getObjectAffectedInfo(oldSiId, newSiId, oldSiDescription, newSiDescription);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const checkPseudonimsTC = createAsyncThunk<
  Array<ICheckPseudonimsResponse> | null,
  { techPositionId: number, inputPseudonims: Array<string>, effectiveFrom: string, bindingId: IdType },
  { rejectValue: string; state: StateType }
>("siequipments/checkPseudonims", async ({
  techPositionId, inputPseudonims, effectiveFrom, bindingId
}, { rejectWithValue }) => {
  try {
    const response = await siequipmentsApi.checkPseudonims(techPositionId, inputPseudonims, effectiveFrom, bindingId);

    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});