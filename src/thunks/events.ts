import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetEventsCardFilterBody,
  GetEventsCardParams,
} from "../api/params/get-events-card.params";
import {
  getCardEvents,
  getCardEventsFilters,
  postEventComment,
} from "../api/requests/eventsPage";
import {
  EventsCardFilterValues,
  CardEvents,
} from "../api/responses/get-events-card";
import { EventItem } from "../classes";
import { ErrorType } from "../slices/events";
import { GenericResponse, PagedModel, StateType } from "../types";

export const getCardEventsFiltersTC = createAsyncThunk<
  EventsCardFilterValues,
  { userId: string },
  { rejectValue: string; state: StateType }
>("events/getCardEventsFilters", async ({ userId }, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const response = await getCardEventsFilters(userId);
    return response;
  } catch (e) {
    const error: ErrorType = e;
    return rejectWithValue(error.message ? error.message : "unknown error");
  }
});
export const getCardEventsTC = createAsyncThunk<
  CardEvents,
  { params: GetEventsCardParams; filter: GetEventsCardFilterBody },
  { rejectValue: string; state: StateType }
>("events/getCardEvents", async ({ params, filter }, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const response = await getCardEvents(params, filter);
    return response;
  } catch (e) {
    const error: ErrorType = e;
    return rejectWithValue(error.message ? error.message : "unknown error");
  }
});

export const postEventCommentTC = createAsyncThunk<
  GenericResponse<EventItem>,
  EventItem,
  { rejectValue: string; state: StateType }
>("events/postEventComment", async (event, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const response = await postEventComment(event);
    return response;
  } catch (e) {
    const error: ErrorType = e;
    return rejectWithValue(error.message ? error.message : "unknown error");
  }
});


