import { createAsyncThunk } from "@reduxjs/toolkit";
import { authRequest, getEventsWidgetAsync } from "api/requests/homePage";
import { EventGroupCountType } from "api/responses/home-page.response";
import { User } from "classes";
import { ErrorResponse, StateType } from "../types";

export const authRequestTC = createAsyncThunk<
  User,
  undefined,
  { rejectValue: any; state: StateType }
>("home/authRequest", async (_, thunkApi) => {
  const { rejectWithValue } = thunkApi;
  try {
    const response = await authRequest();
    return response;
  } catch (e) {
    return rejectWithValue({ e });
  }
});

export const getEventsWidgetTC = createAsyncThunk<
  EventGroupCountType[],
  undefined,
  { rejectValue: ErrorResponse; state: StateType }
>("home/getEventsWidgetAsync", async (_, thunkApi) => {
  const { rejectWithValue } = thunkApi;
  try {
    const response = await getEventsWidgetAsync();
    return response;
  } catch (e) {
    return rejectWithValue(e);
  }
});
