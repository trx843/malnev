import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";
import update from "immutability-helper";

import { ApiRoutes } from "../../../api/api-routes.enum";
import { VerificationScheduleItem } from "../../../pages/PspControl/VerificationSchedulePage/classes";
import { GenericResponse, IdType, PagedModel } from "../../../types";
import { apiBase, getErrorMessage } from "../../../utils";
import {
  DictionariesNames,
  IVerificationActs,
  setAppliedFilter,
  setCheckingObjects,
  setCheckingObjectsPending,
  setDictionaries,
  setIsAddToOrCreateSchedule,
  setIsCreatePlan,
  setSelectedTreeNode,
} from "../../../slices/pspControl/checkingObjects";
import { ThunkApi } from "../../types";
import { PspcontrolVerificationSchedulesParams } from "../../../api/params/put-pspcontrol-verification-schedules.params";
import { IPspcontrolVerificationLevelsResponse } from "../../../api/responses/get-pspcontrol-verification-levels.response";
import { history } from "../../../history/history";
import { IPostPspcontrolVerificationSchedulesParams } from "../../../api/params/post-pspcontrol-verification-schedules.params";
import { CheckingObjectsItem } from "../../../components/PspControl/CheckingObjects/classes";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import { partiallyReset } from "../../../components/ModalCustomFilter/helpers";
import { apiRoutes } from "../../../api/api-routes";
import { IVerificationPlanModel } from "../../../api/params/post-pspcontrol-plan.params";
import { OwnStatuses } from "../../../slices/pspControl/verificationSchedule/constants";
import { setNotificationVerSched } from "slices/pspControl/verificationScheduleCard";
import { NotificationVerSched } from "slices/pspControl/verificationScheduleCard/types";

export const getCheckingObjectsThunk = createAsyncThunk<
  PagedModel<VerificationScheduleItem>[] | void,
  { page?: number } | undefined,
  ThunkApi
>(
  "pspControl/checkingObjects/getCheckingObjectsThunk",
  async (params, thunkApi) => {
    const { getState, dispatch } = thunkApi;

    dispatch(setCheckingObjectsPending(true));

    const baseFilter = getState().checkingObjects.appliedFilter;

    try {
      const url = apiRoutes.checkingObjects.pageByFilter();
      const response = await axios.put<PagedModel<CheckingObjectsItem>>(
        url,
        baseFilter
      );
      dispatch(setCheckingObjects(response.data));
    } catch (error) {
      message.error({
        content: error,
        duration: 2,
      });
    }
  }
);

export const getCheckingObjectsBySelectedTreeThunk = createAsyncThunk<
  PagedModel<VerificationScheduleItem>[] | void,
  SelectedNode,
  ThunkApi
>(
  "pspControl/checkingObjects/getCheckingObjectsBySelectedTreeThunk",
  async (selectedNode, thunkApi) => {
    const { getState, dispatch } = thunkApi;
    dispatch(setCheckingObjectsPending(true));
    dispatch(setSelectedTreeNode(selectedNode));

    const baseFilter: ListFilterBase = getState().checkingObjects.appliedFilter;

    const filter = update(baseFilter, {
      filter: (values) =>
        update(values, {
          $set: {
            ...baseFilter,
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

// получение списка графиков
/* export const getVerificationSchedulesThunk = createAsyncThunk<
  PagedModel<VerificationScheduleItem>[] | void,
  number,
  ThunkApi
>(
  "pspControl/checkingObjects/getVerificationSchedulesThunk",
  async (ownType, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}/ownType/${ownType}`;
      const response = await axios.get<VerificationScheduleItem[]>(url);
      dispatch(
        setDictionaries({
          name: DictionariesNames.verificationSchedules,
          value: response.data,
        })
      );
    } catch (error) {
      message.error({
        content: error,
        duration: 2,
      });

      return;
    }
  }
); */

// добавление графика
export const addToScheduleThunk = createAsyncThunk<
  void,
  PspcontrolVerificationSchedulesParams,
  ThunkApi
>("pspControl/checkingObjects/addToScheduleThunk", async (params, thunkApi) => {
  const { dispatch } = thunkApi;

  try {
    const url = `${apiBase}${ApiRoutes.VerificationSchedules}/${params.verificationScheduleId}`;

    dispatch(setIsAddToOrCreateSchedule(true));
    const response = await axios.put<GenericResponse<NotificationVerSched[]>>(
      url,
      params.siknLabRsuInfoArray
    );
    dispatch(setIsAddToOrCreateSchedule(false));
    if (response.data.success) {
      history.push(
        `/pspcontrol/verification-schedule/${params.verificationScheduleId}`
      );
      if (response.data.result && response.data.result.length > 0)
        dispatch(setNotificationVerSched(response.data.result));
    } else {
      message.error({
        content: response.data.message,
        duration: 2,
      });
    }
  } catch (error) {
    dispatch(setIsAddToOrCreateSchedule(false));

    message.error({
      content: error,
      duration: 2,
    });
  }
});

// создание графика
export const createVerificationScheduleThunk = createAsyncThunk<
  void,
  IPostPspcontrolVerificationSchedulesParams,
  ThunkApi
>(
  "pspControl/checkingObjects/createVerificationScheduleThunk",
  async (params, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}`;
      dispatch(setIsAddToOrCreateSchedule(true));
      const response = await axios.post<
        GenericResponse<VerificationScheduleItem>
      >(url, params);
      dispatch(setIsAddToOrCreateSchedule(false));

      if (response.data.success) {
        history.push(
          `/pspcontrol/verification-schedule/${response.data.result.id}`
        );
        if (
          response.data.result.exVerificationSheduleIds &&
          response.data.result.exVerificationSheduleIds.length > 0
        )
          dispatch(
            setNotificationVerSched(
              response.data.result.exVerificationSheduleIds
            )
          );
      } else {
        message.error({
          content: response.data.message,
          duration: 2,
        });
      }
    } catch (error) {
      dispatch(setIsAddToOrCreateSchedule(false));

      message.error({
        content: error,
        duration: 2,
      });
    }
  }
);

// получение актов по айди psp
export const getVerificationActsById = createAsyncThunk<
  IVerificationActs[] | void,
  string,
  ThunkApi
>(
  "pspControl/checkingObjects/getVerificationActsByIdThunk",
  async (pspId, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.GetPsp}/${pspId}/acts`;
      const response = await axios.get(url);
      dispatch(
        setDictionaries({
          name: DictionariesNames.verificationActs,
          value: response.data,
        })
      );
    } catch (error) {
      message.error({
        content: error,
        duration: 2,
      });
    }
  }
);

// создание нового плана
export const createPlan = createAsyncThunk<
  void,
  IVerificationPlanModel,
  ThunkApi
>("pspControl/checkingObjects/createPlanThunk", async (params, thunkApi) => {
  const { dispatch } = thunkApi;

  try {
    const url = `${apiBase}${ApiRoutes.Plan}`;

    dispatch(setIsCreatePlan(true));
    const response = await axios.post(url, {
      ...params,
      Status: 1,
    });
    dispatch(setIsCreatePlan(false));

    if (response.data) {
      history.push(`/pspcontrol/action-plans/cards/${response.data}`);
    }
  } catch (error) {
    dispatch(setIsCreatePlan(false));

    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
});

// получение списка графиков
export const getVerificationSchedules = async (
  ownType: OwnStatuses,
  ostIds: IdType[]
) => {
  try {
    const url = `${apiBase}${ApiRoutes.VerificationSchedules}/ownType/${ownType}`;
    const response = await axios.post<VerificationScheduleItem[]>(url, ostIds);

    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });

    return [];
  }
};

// получение уровней проверки
export const getVerificationLevels = async () => {
  try {
    const url = `${apiBase}${ApiRoutes.GetVerificationLevels}`;
    const response = await axios.get<IPspcontrolVerificationLevelsResponse[]>(
      url
    );

    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });

    return [];
  }
};

// получение уровней проверки
export const getVerificationLevelsByOwned = async (owned: OwnStatuses) => {
  try {
    const url = `${apiBase}${ApiRoutes.GetVerificationLevels}/ownType/${owned}`;
    const response = await axios.get<IPspcontrolVerificationLevelsResponse[]>(
      url
    );

    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });

    return [];
  }
};
