import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import { message } from 'antd';
import axios from 'axios';
import { ApiRoutes } from '../api/api-routes.enum';
import { BindConstantRiskParams } from '../api/params/post-bind-constant-risks.params';
import { PostConstantRiskParams } from '../api/params/post-constant-risk.params';
import { PutMssEventRiskParams } from '../api/params/put-mss-event-risk.params';
import { ConstantRisksResponse } from '../api/responses/get-constant-risks.response';
import { MssEventSeverityLevels } from '../api/responses/get-mss-event-severity-levels-response';
import { GetSiknRsusResponse } from '../api/responses/get-sikn-rsus.response';
import { MssEventType } from '../classes';
import { RiskItem } from '../components/RisksEditor/types';
import { SiknEditorTableItem } from '../components/SiknEditor/types';
import { SelectedNode } from '../interfaces';
import {
  setConstantRisks,
  setMssEventTypes,
  setSelectedRiskId,
  setSelectedSiknArr,
  setSiknRsusArr,
} from '../slices/riskSettings';
import { ThunkApi } from './types';
import { FiltersModel, GenericResponse, StateType } from '../types';
import { apiBase } from '../utils';

const getFilter = (): FiltersModel => {
  let filtersModel: FiltersModel = {};
  return filtersModel;
};

export const getSiknRsusThunk = createAsyncThunk<
  GetSiknRsusResponse | void,
  SelectedNode,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('riskSettings/getSiknRsus', async (params, thunkApi) => {
  try {
    const { dispatch } = thunkApi;
    const url = `${apiBase}/${params.type}/${params.nodeId}${ApiRoutes.SiknRsus}?page=0`;
    const response = await axios.post(url, getFilter());
    dispatch(setSiknRsusArr(response.data.entities));
    return response;
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });
    return undefined;
  }
});

export const getConstantRisksThunk = createAsyncThunk<
  ConstantRisksResponse | void,
  undefined,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('riskSettings/getConstantRisks', async (_, thunkApi) => {
  try {
    const { dispatch } = thunkApi;
    const url = `${apiBase}${ApiRoutes.ConstantRisks}`;
    const response = await axios.get(url);
    dispatch(setConstantRisks(response.data));
    return response;
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });
    return undefined;
  }
});

export const bindConstantRiskThunk = createAsyncThunk<
  SiknEditorTableItem[] | void,
  BindConstantRiskParams,
  ThunkApi
>('riskSettings/bindConstantRisk', async (params, thunkApi) => {
  try {
    const { dispatch } = thunkApi;
    const res = await axios.post(`${apiBase}${ApiRoutes.BindConstantRisks}`, params);
    dispatch(setSelectedSiknArr([]));
    return res.data;
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });
  }
});

export const getMssEventSeverityLevels =
  async (): Promise<MssEventSeverityLevels | void> => {
    try {
      const res = await axios.get(`${apiBase}${ApiRoutes.MssEventSeverityLevels}`);
      return res;
    } catch (error) {
      message.error({
        content: error,
        duration: 2,
      });
    }
  };

export const getMssEventSeverityLevelsThunk = createAsyncThunk<
  MssEventSeverityLevels | void,
  undefined,
  ThunkApi
>('riskSettings/getMssEventSeverityLevels', async (_, thunkApi) => {
  try {
    const { dispatch } = thunkApi;
    const res = await axios.get(`${apiBase}${ApiRoutes.MssEventSeverityLevels}`);
    if (Array.isArray(res.data)) {
      dispatch(setMssEventTypes(res.data));
    }
    return res;
  } catch (error) {
    return message.error({
      content: error,
      duration: 2,
    });
  }
});

export const postNewRiskThunk = createAsyncThunk<
  RiskItem | void,
  PostConstantRiskParams,
  ThunkApi
>('riskSettings/postNewRisk', async (params, thunkApi) => {
  try {
    const { dispatch, getState } = thunkApi;
    const { constantRisks } = getState().riskSettings;
    const res: { data: GenericResponse<RiskItem> } = await axios.post(
      `${apiBase}${ApiRoutes.CreateConstantRisk}`,
      params
    );
    if (res && res.data.result) {
      dispatch(setConstantRisks([res.data.result, ...constantRisks]));
    }

    return res.data.result;
  } catch (error) {
    return message.error({
      content: error,
      duration: 2,
    });
  }
});

export const putUpdatedRiskThunk = createAsyncThunk<
  RiskItem | void,
  { data: PostConstantRiskParams; id: string; index: number },
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('riskSettings/putUpdatedRisk', async (params, thunkApi) => {
  try {
    const { dispatch, getState } = thunkApi;
    const { constantRisks } = getState().riskSettings;
    const res = await axios.put(
      `${apiBase}${ApiRoutes.CreateConstantRisk}/${params.id}`,
      params.data
    );
    if (res && res.data.result) {
      const { result } = res.data;
      const copyRisks = [...constantRisks];
      copyRisks[params.index] = result;
      dispatch(setConstantRisks(copyRisks));
      dispatch(setSelectedRiskId(''));
    }
    return res.data.result;
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });
  }
});

export const getMssEventTypesThunk = createAsyncThunk<
  MssEventType[] | void,
  undefined,
  ThunkApi
>('riskSettings/getMssEventTypes', async (_, thunkApi) => {
  try {
    const { dispatch } = thunkApi;
    const res: { data: MssEventType[] } = await axios.get(`${apiBase}/MssEventTypes`);
    if (Array.isArray(res.data)) {
      dispatch(setMssEventTypes(res.data));
    }
    return res;
  } catch (error) {
    return message.error({
      content: error,
      duration: 2,
    });
  }
});

export const putMssEventTypesThunk = createAsyncThunk<
  MssEventType[] | void,
  PutMssEventRiskParams,
  ThunkApi
>('riskSettings/putMssEventTypes', async (params, thunkApi) => {
  try {
    const { dispatch, getState } = thunkApi;
    const { mssEventTypes } = getState().riskSettings;
    const res: { data: MssEventType[] } = await axios.put(
      `${apiBase}/msseventtypes/ratio/severity?ratio=${params.ratio}${
        params.severityId ? `&severityId=${params.severityId}` : ''
      }`,
      [...params.ids]
    );
    if (Array.isArray(res.data)) {
      const { data } = res;
      const newEventTypes = mssEventTypes.map(
        (item) => data.find((newItem) => newItem.id === item.id) || item
      );
      dispatch(setMssEventTypes(newEventTypes));
    }
    return res;
  } catch (error) {
    return message.error({
      content: error,
      duration: 2,
    });
  }
});
