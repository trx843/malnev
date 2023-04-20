import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";
import { message } from "antd";
import update from "immutability-helper";
import { ApiRoutes } from "../../../api/api-routes.enum";
import { PagedModel } from "../../../types";
import { apiBase, getErrorMessage } from "../../../utils";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import { ThunkApi } from "../../types";
import {
  LoadingsNames,
  setActionPlans,
  setAppliedFilter,
  setFilterConfig,
  setLoading,
  setPageInfo,
  setSelectedTreeNode
} from "../../../slices/pspControl/actionPlans";
import { EventPlanItem } from "../../../pages/PspControl/ActionPlans/classes";
import { IGenericFilterConfig } from "../../../components/CustomFilter/interfaces";
import { partiallyReset } from "../../../components/ModalCustomFilter/helpers";
import { PlanStatuses } from "enums";

// получить список Планов мероприятий
export const getActionPlansThunk = createAsyncThunk<
  EventPlanItem[] | void,
  undefined,
  ThunkApi
>("pspControl/actionPlans/getActionPlans", async (_, thunkApi) => {
  const { getState, dispatch } = thunkApi;

  const state = getState();

  const appliedFilter = state.actionPlans.appliedFilter;
  try {
    const url = `${apiBase}${ApiRoutes.GetActionPlans}`;
    dispatch(
      setLoading({ name: LoadingsNames.isActionPlansLoading, value: true })
    );
    const response = await axios.put<PagedModel<EventPlanItem>>(
      url,
      appliedFilter,
      { isDeserializingDisabled: true } as AxiosRequestConfig
    );
    dispatch(
      setLoading({ name: LoadingsNames.isActionPlansLoading, value: false })
    );
    dispatch(setActionPlans(response.data.entities));
    dispatch(setPageInfo(response.data.pageInfo));
  } catch (error) {
    dispatch(
      setLoading({ name: LoadingsNames.isActionPlansLoading, value: false })
    );

    message.error({
      content: error,
      duration: 2
    });
  }
});


export const getActionPlansFilterDescriptionThunk = createAsyncThunk<
  IGenericFilterConfig | void,
  undefined,
  ThunkApi
>("pspControl/actionPlans/getEventsFilterDescription", async (_, thunkApi) => {
  const { dispatch } = thunkApi;

  try {
    const url = `${apiBase}${ApiRoutes.GetActionPlansFilterDescription}`;
    const response = await axios.get<IGenericFilterConfig>(url);
    dispatch(setFilterConfig(response.data));
  } catch (error) {
    message.error({
      content: error,
      duration: 2
    });
  }
});

export const getActionPlansFilterValues = async (
  filterName: string,
  controller: string,
  filterData: ListFilterBase
): Promise<any> => {
  try {
    const url = `${apiBase}/${controller}/filterValues?filterName=${filterName}`;
    const response = await axios.put<Array<string>>(url, filterData);
    return response.data;
  } catch (error) {
    message.error({
      content: error,
      duration: 2
    });
  }
};


export const deleteActionPlanThunk = createAsyncThunk<
  string | void,
  string,
  ThunkApi
>("pspControl/actionPlans/deleteActionPlanThunk", async (planId, thunkApi) => {
  const { dispatch } = thunkApi;

  try {
    const url = `${apiBase}${ApiRoutes.Plan}/${planId}`;

    dispatch(
      setLoading({ name: LoadingsNames.isDeletingActionPlan, value: true })
    );
    const response = await axios.delete(url);
    dispatch(
      setLoading({ name: LoadingsNames.isDeletingActionPlan, value: false })
    );

    if (response.status === 200) {
      // @ts-ignore
      dispatch(getActionPlansThunk());
    }
  } catch (error) {
    dispatch(
      setLoading({ name: LoadingsNames.isDeletingActionPlan, value: false })
    );

    message.error({
      content: error,
      duration: 2
    });
  }
});

// Изменение статуса карточки плана
export const signActionPlanThunk = createAsyncThunk<
  { verificationStatus: string; verificationStatusId: number },
  { id: string, newStatus?: PlanStatuses },
  ThunkApi
>("pspControl/actionPlans/signActionPlanThunk", async ({ id, newStatus} , thunkApi) => {
  const { rejectWithValue } = thunkApi;
  const url = `${apiBase}${ApiRoutes.Plan}/${id}/status`;
  try {
    const response = await axios.post<{
      verificationStatus: string;
      verificationStatusId: number;
    }>(url, undefined, { params: { newStatus } });

    return response.data;
  } catch (error) {
    console.log(getErrorMessage(error, undefined, "response.data.message"));
    message.error({
      content: getErrorMessage(error, undefined, "response.data.message"),
      duration: 2
    });
    return rejectWithValue({ id });
  }
});
