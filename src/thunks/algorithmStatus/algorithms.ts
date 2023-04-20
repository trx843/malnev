import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import { message } from 'antd';
import axios from 'axios';
import { ApiRoutes } from '../../api/api-routes.enum';
import {
  AlgTemplatesResponse,
  GetAlgConfigurationResponse,
} from '../../api/responses/get-alg-configuration.response';
import { GetAlgHistoryParamsResponse } from '../../api/responses/get-alg-history.response';
import { GetAlgorithmTreeResponse } from '../../api/responses/get-algorithm-tree.response';
import {
  AlgorithmModalsIds,
  setAlgorithmHistory,
  setConfiguration,
  setPagination,
  setTemplates,
  setTreeData,
} from '../../slices/algorithmStatus/algorithms';
import { StateType } from '../../types';
import { apiBase } from '../../utils';

export const getAlgorithmTreeThunk = createAsyncThunk<
  GetAlgorithmTreeResponse | void,
  undefined,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('algorithms/getAlgorithmTree', async (_, thunkApi) => {
  try {
    const { dispatch } = thunkApi;
    const url = `${apiBase}${ApiRoutes.GetAlgorithmTree}`;
    const response = await axios.get(url);
    dispatch(setTreeData(response.data));
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });
  }
});

export const getAlgorithmHistoryThunk = createAsyncThunk<
  GetAlgHistoryParamsResponse | void,
  undefined,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('algorithms/getAlgorithmHistory', async (_, thunkApi) => {
  try {
    const { dispatch, getState } = thunkApi;
    const state = getState();
    const id = state.algorithms.selectedAlgorithmId;
    const { filterParams } = state.algorithms;

    const url = `${apiBase}/algs/get-history?id=${id}`;

    const response = await axios.post(url, filterParams);

    dispatch(setAlgorithmHistory(response.data));
    dispatch(setPagination(response.data.algHistory.pageInfo));
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
  }
});

export const getAlgorithmConfigurationThunk = createAsyncThunk<
  GetAlgConfigurationResponse | void,
  undefined,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('algorithms/getAlgorithmConfiguration', async (_, thunkApi) => {
  try {
    const { dispatch, getState } = thunkApi;
    const state = getState();
    const id = state.algorithms.selectedAlgorithmId;

    const url = `${apiBase}${ApiRoutes.GetAlgConfiguration}?id=${id}`;

    const response = await axios.get(url);

    const isOpen =
      getState().algorithms.openedModal === AlgorithmModalsIds.AlgConfiguration; // нужно актуальное состояние store после выполнения запроса

    isOpen && dispatch(setConfiguration(response.data.categories));
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
  }
});

export const getConfigurationThunk = createAsyncThunk<
  GetAlgConfigurationResponse | void,
  undefined,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('algorithms/getAlgorithmConfiguration', async (_, thunkApi) => {
  try {
    const { dispatch, getState } = thunkApi;

    const url = `${apiBase}${ApiRoutes.GetConfiguration}`;

    const response = await axios.get(url);

    const state = getState();
    const isOpen = state.algorithms.openedModal === AlgorithmModalsIds.AlgConfiguration;

    isOpen && dispatch(setConfiguration(response.data.categories));
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
  }
});

export const getOperandThunk = createAsyncThunk<
  AlgTemplatesResponse | void,
  undefined,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('algorithms/getAlgorithmOperands', async (_, thunkApi) => {
  try {
    const { dispatch, getState } = thunkApi;
    const state = getState();
    const id = state.algorithms.selectedAlgorithmId;

    const url = `${apiBase}${ApiRoutes.GetAlgTemplates}?id=${id}`;

    const response = await axios.get<AlgTemplatesResponse[]>(url);
    dispatch(setTemplates(response.data));
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
  }
});
