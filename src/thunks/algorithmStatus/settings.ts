import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import { message } from 'antd';
import axios from 'axios';
import { ApiRoutes } from '../../api/api-routes.enum';
import { PostSetPointsParams } from '../../api/params/post-set-points.params';
import { GetAlgorithmTreeResponse } from '../../api/responses/get-algorithm-tree.response';
import { OperandNode } from '../../customHooks/useNodeTableData';
import {
  setAlgorithmsLoading,
  setAlgTreeData,
  setIsFormLoading,
  setOperandsLoading,
  setOperandsTreeData,
} from '../../slices/algorithmStatus/settings';

import { StateType } from '../../types';
import { apiBase } from '../../utils';

export const getAfAlgorithmTreeThunk = createAsyncThunk<
  GetAlgorithmTreeResponse | void,
  string,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('settings/getAlgorithmTree', async (id, thunkApi) => {
  const { dispatch } = thunkApi;
  try {
    const url = `${apiBase}${ApiRoutes.operandsAlgorithmsAf}${id}`;
    dispatch(setAlgorithmsLoading(true));
    const response = await axios.get(url);

    dispatch(setAlgTreeData(response.data));
    dispatch(setAlgorithmsLoading(false));
  } catch (error) {
    dispatch(setAlgorithmsLoading(false));
    message.error({
      content: error,
      duration: 2,
    });
  }
});

export const getSettingsOperandsTreeThunk = createAsyncThunk<
  OperandNode | void,
  undefined,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('settings/getOperandsTree', async (_, thunkApi) => {
  const { dispatch } = thunkApi;
  try {
    const url = `${apiBase}${ApiRoutes.GetOperands}`;
    dispatch(setOperandsLoading(true));
    const response = await axios.get(url);
    dispatch(setOperandsTreeData(response.data));
    dispatch(setOperandsLoading(false));
  } catch (error) {
    dispatch(setOperandsLoading(false));
    message.error({
      content: error,
      duration: 2,
    });
  }
});

export const postSetPoints = createAsyncThunk<
  Promise<void>,
  PostSetPointsParams,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('settings/postSetPoints', async (params, thunkApi) => {
  const { dispatch } = thunkApi;
  dispatch(setIsFormLoading(true));
  const url = `${apiBase}${ApiRoutes.PostSetPoints}`;
  await axios.post(url, params);
  dispatch(setIsFormLoading(false));
  try {
  } catch (error) {
    message.error({
      content: 'Ошибка отправки данных формы.',
      duration: 2,
    });
    dispatch(setIsFormLoading(false));
  }
});
