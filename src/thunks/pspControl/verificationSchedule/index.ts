import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import update from "immutability-helper";
import _ from "lodash";
import { message } from "antd";
import { ApiRoutes } from "../../../api/api-routes.enum";
import { PagedModel } from "../../../types";
import { apiBase, getErrorMessage } from "../../../utils";
import {
  setVerificationScheduleList,
  setPageInfo,
  setLoading,
  LoadingsNames,
  setFilterConfig,
  setAppliedFilter,
  setSelectedTreeNode,
} from "../../../slices/pspControl/verificationSchedule";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import { ThunkApi } from "../../types";
import { IGenericFilterConfig } from "../../../components/CustomFilter/interfaces";
import { partiallyReset } from "../../../components/ModalCustomFilter/helpers";
import { IVerificationSchedulesModel } from "slices/pspControl/verificationSchedule/types";
import { StatusesIds } from "enums";

// получить список графиков
export const getVerificationSchedulesListThunk = createAsyncThunk<
  void,
  undefined,
  ThunkApi
>(
  "pspControl/verificationSchedulePage/getVerificationSchedulesList",
  async (_, thunkApi) => {
    const { getState, dispatch } = thunkApi;

    const state = getState();

    const appliedFilter = state.verificationSchedule.appliedFilter;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}/filter`;
      dispatch(
        setLoading({
          name: LoadingsNames.isVerificationScheduleListLoading,
          value: true,
        })
      );
      const response = await axios.put<PagedModel<IVerificationSchedulesModel>>(
        url,
        appliedFilter
      );
      dispatch(
        setLoading({
          name: LoadingsNames.isVerificationScheduleListLoading,
          value: false,
        })
      );

      if (response.data) {
        dispatch(setVerificationScheduleList(response.data.entities));
        dispatch(setPageInfo(response.data.pageInfo));
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isVerificationScheduleListLoading,
          value: false,
        })
      );

      message.error({
        content: getErrorMessage(error),
        duration: 2,
      });

      return;
    }
  }
);

// удалить график
export const deleteVerificationScheduleThunk = createAsyncThunk<
  void,
  string,
  ThunkApi
>(
  "pspControl/verificationSchedulePage/deleteVerificationScheduleThunk",
  async (verificationScheduleId, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}/${verificationScheduleId}`;

      dispatch(
        setLoading({
          name: LoadingsNames.isDeletingVerificationSchedule,
          value: true,
        })
      );
      const response = await axios.delete(url);
      dispatch(
        setLoading({
          name: LoadingsNames.isDeletingVerificationSchedule,
          value: false,
        })
      );

      if (response.status === 200) {
        // @ts-ignore
        dispatch(getVerificationSchedulesListThunk());
        message.success({
          content: "График был удален успешно.",
          duration: 2,
        });
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isDeletingVerificationSchedule,
          value: false,
        })
      );

      message.error({
        content: getErrorMessage(error),
        duration: 2,
      });
    }
  }
);

// получить описание(схема) фильтра
export const getVerificationSchedulesFilterDescriptionThunk = createAsyncThunk<
  void,
  undefined,
  ThunkApi
>(
  "pspControl/verificationSchedulePage/getVerificationSchedulesFilterDescriptionThunk",
  async (_, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}/filterDescription`;
      const response = await axios.get<IGenericFilterConfig>(url);
      if (response.data) {
        dispatch(setFilterConfig(response.data));
      }
    } catch (error) {
      message.error({
        content: getErrorMessage(error),
        duration: 2,
      });
    }
  }
);

// получить значения для филдов фильтра
export const getVerificationSchedulesFilterValues = async (
  filterName: string,
  controller: string,
  filterData: ListFilterBase
): Promise<string[]> => {
  try {
    const url = `${apiBase}/${controller}/filterValues?filterName=${filterName}`;

    const response = await axios.put<IGenericFilterConfig>(url, filterData);

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// получить список графиков по выбранной ноде
export const getVerificationSchedulesListBySelectedTreeNodeThunk =
  createAsyncThunk<void, SelectedNode, ThunkApi>(
    "pspControl/verificationSchedulePage/getVerificationSchedulesListBySelectedTreeNodeThunk",
    async (selectedNode, thunkApi) => {
      const { getState, dispatch } = thunkApi;

      const state = getState();

      dispatch(setSelectedTreeNode(selectedNode));

      const filterConfig = state.verificationSchedule.filterConfig;
      const baseFilter = state.verificationSchedule.appliedFilter;

      const newFilter = partiallyReset(
        filterConfig,
        baseFilter,
        "isDependsTree"
      );

      const filter = update(baseFilter, {
        filter: (values) =>
          update(values, {
            $set: {
              ...newFilter,
              filterModel: baseFilter.filter.filterModel ?? {},
              treeFilter: {
                nodePath: selectedNode.key,
                isOwn: values.treeFilter.isOwn,
              },
            },
          }),
        pageIndex: { $set: 1 },
      });
      dispatch(setAppliedFilter(filter));
    }
  );

// Изменение статуса карточки графика
export const signVerificationScheduleThunk = createAsyncThunk<
  { verificationStatus: string; verificationStatusId: number },
  { id: string; newStatus: StatusesIds },
  ThunkApi
>(
  "pspControl/verificationSchedulePage/signVerificationScheduleThunk",
  async ({ id, newStatus }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    const url = `${apiBase}${ApiRoutes.VerificationSchedules}/${id}/status`;
    try {
      const response = await axios.post<{
        verificationStatus: string;
        verificationStatusId: number;
      }>(url, undefined, { params: { newStatus } });

      return response.data;
    } catch (error) {
      message.error({
        content: getErrorMessage(error, undefined, "response.data.message"),
        duration: 2,
      });
      return rejectWithValue({ planId: id });
    }
  }
);

// Генерация и добавление вложения через службу
export const verificationSchedulesAttachmentSendThunk = createAsyncThunk<
  void,
  { scheduleId: string, oldStatus: number },
  ThunkApi
>(
  "pspControl/verificationSchedulePage/verificationSchedulesAttachmentSendThunk",
  async ({ scheduleId, oldStatus }) => {
    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}/${scheduleId}/attachment/send`;
      await axios.post(url, undefined, {
        params: {
          isOriginalFormat: false,
          oldStatus
        }
      });
    } catch (error) {
      message.error({
        content: getErrorMessage(error, undefined, "response.data.message"),
        duration: 2,
      });
    }
  }
);
