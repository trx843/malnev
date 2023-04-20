import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import { message } from 'antd';
import axios from 'axios';
import { ApiRoutes } from '../../api/api-routes.enum';
import { GetAlgorithmTreeResponse } from '../../api/responses/get-algorithm-tree.response';
import {
  setAlgorithmsLoading,
  setAlgTreeData,
  setOperandsLoading,
  setOperandsTreeData,
} from '../../slices/algorithmStatus/operands';
import { StateType } from '../../types';
import { apiBase } from '../../utils';

export const getAlgorithmTreeThunk = createAsyncThunk<
  GetAlgorithmTreeResponse | void,
  string,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('operands/getAlgorithmTree', async (id, thunkApi) => {
  const { dispatch } = thunkApi;
  try {
    const url = `${apiBase}${ApiRoutes.operandsAlgorithms}${id}`;
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

export const getOperandsTreeThunk = createAsyncThunk<
  any | void,
  undefined,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('operands/getOperandsTree', async (_, thunkApi) => {
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
