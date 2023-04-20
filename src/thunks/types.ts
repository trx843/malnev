import { Dispatch } from '@reduxjs/toolkit';
import { StateType } from '../types';

export interface ThunkApi {
  dispatch: Dispatch;
  state: StateType;
}
