import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";
import { message } from "antd";
import { ApiRoutes } from "../../../api/api-routes.enum";
import { apiBase, downloadFile, getErrorMessage } from "../../../utils";
import { ThunkApi } from "../../types";
import {
  LoadingsNames,
  setAttachments,
  setLoading,
  setPlanInfo,
  setTableData,
  setPlanCardInfo,
  setRecommendations,
} from "../../../slices/pspControl/planCard";
import {
  IActionPlanModel,
  ICommissionPlanModel,
  IPlanAttachments,
  IPlanCard,
} from "../../../slices/pspControl/planCard/types";
import { mapRecommendations, mapViolations } from "./utils";
import { Nullable } from "../../../types";
import {
  createCommissionRequest,
  getCommissionsRequest,
  removeCommissionsRequest,
  sortCommissionsRequest,
  updateCommissionRequest,
} from "api/requests/pspControl/planCard";
import { moveSerialsLeft } from "slices/verificationActs/verificationAct/helpers";
import minBy from "lodash/minBy";
import { setIsMatchingsTabLoading } from "slices/pspControl/actionPlanTypicalViolations";

// получить информацию о плане
export const getPlanInfoThunk = createAsyncThunk<void, string, ThunkApi>(
  "pspControl/planCard/getPlanInfoThunk",
  async (planId, thunkApi) => {
    const { dispatch } = thunkApi;
    try {
      const url = `${apiBase}${ApiRoutes.Plan}/${planId}`;

      dispatch(
        setLoading({
          name: LoadingsNames.isPlanInfoLoading,
          value: true,
        })
      );
      const response = await axios.get(url);
      dispatch(
        setLoading({
          name: LoadingsNames.isPlanInfoLoading,
          value: false,
        })
      );

      if (response.data) {
        dispatch(setPlanInfo(response.data));
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isPlanInfoLoading,
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

// получить карточку плана
export const getPlanCardThunk = createAsyncThunk<void, string, ThunkApi>(
  "pspControl/planCard/getPlanCardThunk",
  async (planId, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.Plan}/${planId}/planCard`;

      dispatch(
        setLoading({
          name: LoadingsNames.isPlanCardLoading,
          value: true,
        })
      );
      const response = await axios.get<IPlanCard>(url, { isDeserializingDisabled: true } as AxiosRequestConfig);

      if (response.data) {
        dispatch(setPlanCardInfo(response.data));
        const data = mapViolations(response.data.violations);
        const recommendations = mapRecommendations(
          response.data.recommendation
        );

        dispatch(setTableData(data));
        dispatch(setRecommendations(recommendations));
        dispatch(
          setLoading({
            name: LoadingsNames.isPlanCardLoading,
            value: false,
          })
        );
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isPlanCardLoading,
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

// создать мероприятие
export const createActionPlanThunk = createAsyncThunk<
  void,
  IActionPlanModel,
  ThunkApi
>("pspControl/planCard/createActionPlanThunk", async (values, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  const state = getState();

  const {
    violation_id,
    violation_identifiedViolationsId,
    _maxActionPlanSerial = 0,
  } = state.planCard.violationsWithActionPlanInfo ?? {};
  const verificationPlanId = state.planCard.planCardInfo?.id;

  try {
    const url = `${apiBase}${ApiRoutes.Plan}/${verificationPlanId}/actionPlan`;
    const params = {
      ...values,
      violationsId: violation_id,
      identifiedViolationsId: violation_identifiedViolationsId,
      serial: _maxActionPlanSerial + 1,
      verificationPlanId,
    };

    dispatch(
      setLoading({ name: LoadingsNames.isAddOrEditEventPending, value: true })
    );
    const response = await axios.post(url, params);
    if (response.status === 200) {
      dispatch(
        setLoading({
          name: LoadingsNames.isAddOrEditEventPending,
          value: false,
        })
      );
      // @ts-ignore
      dispatch(getPlanCardThunk(verificationPlanId));
    }
  } catch (error) {
    dispatch(
      setLoading({ name: LoadingsNames.isAddOrEditEventPending, value: false })
    );

    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
});

// удалить мероприятие
export const deleteActionPlanThunk = createAsyncThunk<void, string, ThunkApi>(
  "pspControl/planCard/deleteActionPlanThunk",
  async (actionPlanId, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    const state = getState();

    const verificationPlanId = state.planCard.planCardInfo?.id;

    try {
      const url = `${apiBase}${ApiRoutes.Plan}/actionPlan/${actionPlanId}`;

      dispatch(
        setLoading({ name: LoadingsNames.isDeleteEventPending, value: true })
      );
      const response = await axios.delete(url);
      if (response.status === 200) {
        dispatch(
          setLoading({ name: LoadingsNames.isDeleteEventPending, value: false })
        );
        // @ts-ignore
        dispatch(getPlanCardThunk(verificationPlanId));
      }
    } catch (error) {
      dispatch(
        setLoading({ name: LoadingsNames.isDeleteEventPending, value: false })
      );

      message.error({
        content: getErrorMessage(error),
        duration: 2,
      });
    }
  }
);

// получить мероприятие по айди
export const getActionPlanThunk = createAsyncThunk<
  IActionPlanModel | null | void,
  undefined,
  ThunkApi
>("pspControl/planCard/getActionPlanThunk", async (_, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  const actionPlanId =
    getState().planCard.violationsWithActionPlanInfo?.actionPlan_id;

  try {
    const url = `${apiBase}${ApiRoutes.Plan}/actionPlan/${actionPlanId}`;

    dispatch(
      setLoading({ name: LoadingsNames.isActionPlanThunkLoading, value: true })
    );
    const response = await axios.get<IActionPlanModel>(url);

    if (response.data) {
      dispatch(
        setLoading({
          name: LoadingsNames.isActionPlanThunkLoading,
          value: false,
        })
      );
      return response.data;
    }

    return null;
  } catch (error) {
    dispatch(
      setLoading({ name: LoadingsNames.isActionPlanThunkLoading, value: false })
    );

    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return null;
  }
});

// отредактировать мероприятие
export const editActionPlanThunk = createAsyncThunk<
  void,
  IActionPlanModel,
  ThunkApi
>("pspControl/planCard/editActionPlanThunk", async (params, thunkApi) => {
  const { dispatch, getState } = thunkApi;

  const state = getState();

  const verificationPlanId = state.planCard.planCardInfo?.id;

  try {
    const url = `${apiBase}${ApiRoutes.Plan}/actionPlan/${params.id}`;

    dispatch(
      setLoading({ name: LoadingsNames.isAddOrEditEventPending, value: true })
    );
    const response = await axios.put(url, params);

    if (response.status === 200) {
      dispatch(
        setLoading({
          name: LoadingsNames.isAddOrEditEventPending,
          value: false,
        })
      );
      // @ts-ignore
      dispatch(getPlanCardThunk(verificationPlanId));
    }
  } catch (error) {
    dispatch(
      setLoading({
        name: LoadingsNames.isAddOrEditEventPending,
        value: false,
      })
    );

    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
});

// Получение вложений
export const getPlanAttachmentsThunk = createAsyncThunk<
  IPlanAttachments[],
  Nullable<string> | undefined,
  ThunkApi
>("pspControl/planCard/getPlanAttachmentsThunk", async (planId, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  if (!planId) return rejectWithValue("not found id");

  try {
    const url = `${apiBase}${ApiRoutes.Plan}/${planId}/attachments`;

    const response = await axios.get<IPlanAttachments[]>(url);
    const attachments = response.data.sort((a, b) => a.serial - b.serial);

    return attachments;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
    return rejectWithValue(error.response.data);
  }
});

// Удаление вложения
export const deletePlanAttachmentThunk = createAsyncThunk<
  string,
  string,
  ThunkApi
>(
  "pspControl/planCard/deletePlanAttachmentThunk",
  async (attachmentId, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.Plan}/file/${attachmentId}`;

      const response = await axios.delete(url);

      if (response.status === 200) {
        message.success({
          content: "Файл удален успешно",
          duration: 2,
        });
      } else {
        message.error({
          content: "Неизвестная ошибка",
          duration: 2,
        });
      }
      return attachmentId;
    } catch (error) {
      message.error({
        content: getErrorMessage(error),
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const setPlanMainFileThunk = createAsyncThunk<string, string, ThunkApi>(
  "pspControl/planCard/setPlanMainFileThunk",
  async (fileId, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      await axios.post(`${apiBase}${ApiRoutes.Plan}/file/${fileId}/main`);

      return fileId;
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

// Скачать вложения
export const downloadPlanAttachmentThunk = createAsyncThunk<
  void,
  {
    id: string;
    fileName: string;
  },
  ThunkApi
>(
  "pspControl/planCard/downloadPlanAttachmentThunk",
  async (params, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.Plan}/file/${params.id}`;

      dispatch(
        setLoading({
          name: LoadingsNames.isDownloadingPlanAttachment,
          value: true,
        })
      );
      const response = await fetch(url, {
        credentials: "include",
      });
      const blob = await response.blob();
      dispatch(
        setLoading({
          name: LoadingsNames.isDownloadingPlanAttachment,
          value: false,
        })
      );

      if (blob) {
        downloadFile(blob, params.fileName);
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isDownloadingPlanAttachment,
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

export const getCommissionsThunk = createAsyncThunk<
  ICommissionPlanModel[],
  string,
  ThunkApi
>("pspControl/planCard/getCommissionsThunk", async (id, thunkApi) => {
  const { rejectWithValue, dispatch } = thunkApi;
  dispatch(setIsMatchingsTabLoading(true));
  try {
    const items = await getCommissionsRequest(id);
    dispatch(setIsMatchingsTabLoading(false));
    return items;
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
    dispatch(setIsMatchingsTabLoading(false));
    return rejectWithValue(error.response.data);
  }
});

export const createCommissionThunk = createAsyncThunk<
  ICommissionPlanModel,
  { id: string; commission: ICommissionPlanModel },
  ThunkApi
>("pspControl/planCard/createCommissionThunk", async (params, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const result = await createCommissionRequest(params.id, params.commission);

    return result;
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
    return rejectWithValue(error.response.data);
  }
});

export const updateCommissionThunk = createAsyncThunk<
  ICommissionPlanModel,
  { id: string; commission: ICommissionPlanModel },
  ThunkApi
>("pspControl/planCard/updateCommissionThunk", async (params, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const result = await updateCommissionRequest(params.commission);

    return result;
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
    return rejectWithValue(error.response.data);
  }
});

export const removeCommissionThunk = createAsyncThunk<string, string, ThunkApi>(
  "pspControl/planCard/removeCommissionThunk",
  async (id, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
      const items = getState().planCard.commissions;
      const index = items.findIndex((item) => id === item.id);

      await removeCommissionsRequest(id);

      // сдвинуть номера после удаления
      if (index !== -1 && index !== items.length - 1) {
        const movedItemSerials = moveSerialsLeft(items, index);

        const serials = movedItemSerials.map((item) => ({
          id: item.id,
          newSerial: item.serial,
        }));

        await sortCommissionsRequest(serials);
      }

      return id;
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const sortCommissionThunk = createAsyncThunk<
  ICommissionPlanModel[],
  ICommissionPlanModel[],
  ThunkApi
>("pspControl/planCard/sortCommissionThunk", async (serial, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const serials = serial.map((item) => ({
      id: item.id,
      newSerial: item.serial,
    }));

    await sortCommissionsRequest(serials);

    return serial;
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
    return rejectWithValue(error.response.data);
  }
});
