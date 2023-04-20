import axios from "axios";
import { message } from "antd";
import { ThunkApi } from "../../types";
import {
  DictionariesNames,
  LoadingsNames,
  setAttachments,
  setCheckingObjects,
  setDictionaries,
  setFilterList,
  setLoading,
  setNotificationVerSched,
  setTableData,
  setVerificationScheduleCardInfo,
} from "../../../slices/pspControl/verificationScheduleCard";
import { apiBase, getErrorMessage } from "../../../utils";
import { ApiRoutes } from "../../../api/api-routes.enum";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  IPsp,
  IPspCard,
  IPspViewModel,
  IScheduleAttachments,
  IVerificationLevelsOst,
  ISiknLabRsuVerificationSchedulesModel,
  ICommissionVerificationModel,
} from "../../../slices/pspControl/verificationScheduleCard/types";
import { adjustParams, mapVerificationPsps } from "./utils";
import {
  ICustomAttrFilterConfig,
  IdType,
  Nullable,
  PagedModel,
} from "../../../types";
import { CheckingObjectsItem } from "../../../components/PspControl/CheckingObjects/classes";
import { OstValues } from "pages/PspControl/VerificationScheduleCardPage/components/ModalScheduleEditing/types";
import {
  createVerificationCommissionRequest,
  getVerificationCommissionsRequest,
  removeVerificationCommissionsRequest,
  sortVerificationCommissionsRequest,
  updateVerificationCommissionRequest,
} from "api/requests/pspControl/VerificationScheduleCard";
import { moveSerialsLeft } from "slices/verificationActs/verificationAct/helpers";
import minBy from "lodash/minBy";

// получить данные графика проверки
export const getVerificationScheduleCardInfoThunk = createAsyncThunk<
  void,
  string,
  ThunkApi
>(
  "pspControl/verificationScheduleCard/getVerificationScheduleCardInfoThunk",
  async (scheduleId, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}/cardSchedule/${scheduleId}`;

      dispatch(
        setLoading({
          name: LoadingsNames.isVerificationScheduleCardInfoLoading,
          value: true,
        })
      );
      const response = await axios.get<ISiknLabRsuVerificationSchedulesModel>(
        url
      );
      dispatch(
        setLoading({
          name: LoadingsNames.isVerificationScheduleCardInfoLoading,
          value: false,
        })
      );

      if (response.data) {
        dispatch(setVerificationScheduleCardInfo(response.data));
        dispatch(setTableData(response.data.groups));
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isVerificationScheduleCardInfoLoading,
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

// получить журнал объектов проверки в модалке с фильтрацией
export const getCheckingObjectsThunk = createAsyncThunk<
  void,
  {
    id: string;
    ostName?: string;
    isOwn: Nullable<boolean>;
  },
  ThunkApi
>(
  "pspControl/verificationScheduleCard/getCheckingObjectsThunk",
  async (params, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    const state = getState();
    const baseFilter = state.verificationScheduleCard.baseFilter;

    const adjustedBaseFilter = {
      ...baseFilter,
      filter: {
        ...baseFilter.filter,
        ...(params.ostName && { ostName: params.ostName }),
        isOwn: params.isOwn,
      },
    };

    try {
      const url = `${apiBase}${ApiRoutes.CheckingObjects}/schedule/${params.id}/modalFilter`;

      dispatch(
        setLoading({
          name: LoadingsNames.isCheckingObjectsLoading,
          value: true,
        })
      );
      const response = await axios.put<PagedModel<CheckingObjectsItem>>(
        url,
        adjustedBaseFilter
      );
      dispatch(
        setLoading({
          name: LoadingsNames.isCheckingObjectsLoading,
          value: false,
        })
      );

      const entities = response.data.entities;

      if (entities) {
        dispatch(setCheckingObjects(entities));
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isCheckingObjectsLoading,
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

// добавление в график новых объетов проверки
export const addPspsToVerificationScheduleThunk = createAsyncThunk<
  void,
  {
    id: string;
    psps: string[];
  },
  ThunkApi
>(
  "pspControl/verificationScheduleCard/addPspsToVerificationScheduleThunk",
  async (params, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}/${params.id}/psps`;

      dispatch(
        setLoading({
          name: LoadingsNames.isAddPspsToVerificationSchedulePending,
          value: true,
        })
      );
      const response = await axios.post(url, params.psps);
      dispatch(
        setLoading({
          name: LoadingsNames.isAddPspsToVerificationSchedulePending,
          value: false,
        })
      );

      if (response.status === 200) {
        message.success({
          content: "Объект(ы) успешно добавлены",
          duration: 2,
        });

        // @ts-ignore
        dispatch(getVerificationScheduleCardInfoThunk(params.id));
        if (response.data && response.data.length > 0)
          dispatch(setNotificationVerSched(response.data));
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isAddPspsToVerificationSchedulePending,
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

// получить модель фильтра объектов проверки в графике проверки -  http://vdc01-deintkd01:8081/swagger/ui/index#!/CheckingObjects/CheckingObjects_GetFilterConfigSchedule
export const getFilterDescriptionSchedule = createAsyncThunk<
  void,
  undefined,
  ThunkApi
>(
  "pspControl/verificationScheduleCard/getFilterDescriptionSchedule",
  async (_, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.CheckingObjects}${ApiRoutes.GetFilter}/schedule`;

      dispatch(
        setLoading({
          name: LoadingsNames.isFilterListLoading,
          value: true,
        })
      );
      const response = await axios.get<ICustomAttrFilterConfig>(url);
      dispatch(
        setLoading({
          name: LoadingsNames.isFilterListLoading,
          value: false,
        })
      );

      const filterList = response.data.filterList;

      if (filterList) {
        dispatch(setFilterList(filterList));
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isFilterListLoading,
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

// Получение вложений
export const getScheduleAttachmentsThunk = createAsyncThunk<
  IScheduleAttachments[],
  string | undefined,
  ThunkApi
>(
  "pspControl/verificationScheduleCard/getPlanAttachmentsThunk",
  async (scheduleId, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    if (!scheduleId) return rejectWithValue("not found id");

    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}/${scheduleId}/attachments`;

      const response = await axios.get<IScheduleAttachments[]>(url);

      const attachments = response.data.sort((a, b) => a.serial - b.serial);

      return attachments;
    } catch (error) {
      message.error({
        content: getErrorMessage(error),
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

// Удаление вложения
export const deleteScheduleAttachmentThunk = createAsyncThunk<
  string,
  string,
  ThunkApi
>(
  "pspControl/verificationScheduleCard/deletePlanAttachmentThunk",
  async (attachmentId, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}/file/${attachmentId}`;

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

export const setScheduleMainFileThunk = createAsyncThunk<
  string,
  string,
  ThunkApi
>(
  "pspControl/verificationScheduleCard/setScheduleMainFileThunk",
  async (fileId, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      await axios.post(
        `${apiBase}${ApiRoutes.VerificationSchedules}/file/${fileId}/main`
      );

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

// Удаление объект графика проверки
export const deleteVerificationSchedulePspThunk = createAsyncThunk<
  void,
  {
    verificationScheduleId: string;
    pspId: string;
    listOfSiknLabRsuIds: IdType[];
    hasDates: boolean;
  },
  ThunkApi
>(
  "pspControl/verificationScheduleCard/deleteVerificationSchedulePsp",
  async (params, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationSchedules}/${params.verificationScheduleId}/psp/${params.pspId}/delete?hasDates=${params.hasDates}`;

      dispatch(
        setLoading({
          name: LoadingsNames.isDeletingVerificationSchedulePsp,
          value: true,
        })
      );
      const response = await axios.post(url, params.listOfSiknLabRsuIds);
      dispatch(
        setLoading({
          name: LoadingsNames.isDeletingVerificationSchedulePsp,
          value: false,
        })
      );

      if (response.status === 200) {
        message.success({
          content: "Объект графика удален успешно",
          duration: 2,
        });

        dispatch(
          // @ts-ignore
          getVerificationScheduleCardInfoThunk(params.verificationScheduleId)
        );
      } else {
        dispatch(
          setLoading({
            name: LoadingsNames.isDeletingScheduleAttachment,
            value: false,
          })
        );

        message.error({
          content: "Объекта графика не удален",
          duration: 2,
        });
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isDeletingVerificationSchedulePsp,
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

export const getVerificationCommissionsThunk = createAsyncThunk<
  ICommissionVerificationModel[],
  string,
  ThunkApi
>(
  "pspControl/verificationScheduleCard/getCommissionsThunk",
  async (id, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      const items = await getVerificationCommissionsRequest(id);

      return items;
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const createVerificationCommissionThunk = createAsyncThunk<
  ICommissionVerificationModel,
  { id: string; commission: ICommissionVerificationModel },
  ThunkApi
>("pspControl/planCard/createCommissionThunk", async (params, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const result = await createVerificationCommissionRequest(
      params.id,
      params.commission
    );

    return result;
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
    return rejectWithValue(error.response.data);
  }
});

export const updateVerificationCommissionThunk = createAsyncThunk<
  ICommissionVerificationModel,
  { id: string; commission: ICommissionVerificationModel },
  ThunkApi
>(
  "pspControl/verificationScheduleCard/updateCommissionThunk",
  async (params, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      const result = await updateVerificationCommissionRequest(
        params.commission
      );

      return result;
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeVerificationCommissionThunk = createAsyncThunk<
  string,
  string,
  ThunkApi
>(
  "pspControl/verificationScheduleCard/removeCommissionThunk",
  async (id, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
      const items = getState().planCard.commissions;
      const index = items.findIndex((item) => id === item.id);

      await removeVerificationCommissionsRequest(id);

      // сдвинуть номера после удаления
      if (index !== -1 && index !== items.length - 1) {
        const movedItemSerials = moveSerialsLeft(items, index);

        const serials = movedItemSerials.map((item) => ({
          id: item.id,
          newSerial: item.serial,
        }));

        await sortVerificationCommissionsRequest(serials);
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

export const sortVerificationCommissionThunk = createAsyncThunk<
  ICommissionVerificationModel[],
  ICommissionVerificationModel[],
  ThunkApi
>(
  "pspControl/verificationScheduleCard/sortCommissionThunk",
  async (serial, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      const serials = serial.map((item) => ({
        id: item.id,
        newSerial: item.serial,
      }));

      await sortVerificationCommissionsRequest(serials);

      return serial;
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);
