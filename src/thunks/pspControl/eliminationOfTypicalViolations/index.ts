import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { apiBase, getErrorMessage } from "../../../utils";
import { mapIdentifiedTypicalViolationsWithElimination } from "./utils";
import { ThunkApi } from "../../types";
import { IListFilter, PagedModel } from "../../../types";
import { getSettingsPsp } from "../../../api/requests/eliminationOfTypicalViolations";
import {
  ITypicalViolationForEliminationFilter,
  IIdentifiedTypicalViolationsWithEliminationModel,
  LoadingsNames,
} from "../../../slices/pspControl/eliminationOfTypicalViolations/types";
import { ApiRoutes } from "../../../api/api-routes.enum";
import {
  setFilterConfig,
  setIdentifiedTypicalViolations,
  setLoading,
  setPageInfo,
  setSettingsPsp,
} from "../../../slices/pspControl/eliminationOfTypicalViolations";
import { IGenericFilterConfig } from "../../../components/CustomFilter/interfaces";

// Список журнала с фильтром
export const getTypicalViolationsThunk = createAsyncThunk<
  void,
  IListFilter<ITypicalViolationForEliminationFilter>,
  ThunkApi
>(
  "pspControl/eliminationOfTypicalViolations/getTypicalViolationsThunk",
  async (listFilter, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.EliminationTypical}/filter`;

      dispatch(
        setLoading({
          name: LoadingsNames.isTypicalViolationsLoading,
          value: true,
        })
      );
      const response = await axios.put<
        PagedModel<IIdentifiedTypicalViolationsWithEliminationModel>
      >(url, listFilter);
      dispatch(
        setLoading({
          name: LoadingsNames.isTypicalViolationsLoading,
          value: false,
        })
      );

      if (response.data) {
        const adjustedEntities = mapIdentifiedTypicalViolationsWithElimination(
          response.data.entities
        );
        dispatch(setIdentifiedTypicalViolations(adjustedEntities));
        dispatch(setPageInfo(response.data.pageInfo));
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isTypicalViolationsLoading,
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

// получить конфиг фильтрации
export const getTypicalViolationsFilterDescriptionThunk = createAsyncThunk<
  void,
  undefined,
  ThunkApi
>(
  "pspControl/eliminationOfTypicalViolations/getTypicalViolationsFilterDescriptionThunk",
  async (_, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.EliminationTypical}/filterDescription`;
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

// Получение настройки для ПСП
export const getSettingsPspThunk = createAsyncThunk<void, string, ThunkApi>(
  "pspControl/eliminationOfTypicalViolations/getSettingsPspThunk",
  async (pspId, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      dispatch(
        setLoading({
          name: LoadingsNames.isSettingsPspLoading,
          value: true,
        })
      );
      const settingsPsp = await getSettingsPsp(pspId);
      dispatch(
        setLoading({
          name: LoadingsNames.isSettingsPspLoading,
          value: false,
        })
      );

      if (settingsPsp) {
        dispatch(setSettingsPsp(settingsPsp));
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isSettingsPspLoading,
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
