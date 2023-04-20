import { createAsyncThunk } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import axios from "axios";
import update from "immutability-helper";
import { ApiRoutes } from "../../../api/api-routes.enum";
import { IGenericFilterConfig } from "../../../components/CustomFilter/interfaces";
import { partiallyReset } from "../../../components/ModalCustomFilter/helpers";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import {
  setAppliedFilter,
  setFilterConfig,
  setIdentifiedViolations,
  setLoading,
  setSelectedTreeNode,
} from "../../../slices/pspControl/eliminationOfViolations";
import {
  IEliminationInfo,
  IInfoCourse,
  LoadingsNames,
} from "../../../slices/pspControl/eliminationOfViolations/types";
import { PagedModel } from "../../../types";
import { apiBase, downloadFile, getErrorMessage } from "../../../utils";
import { ThunkApi } from "../../types";
import { mapIdentifiedViolations } from "./utils";

export const getViolationsThunk = createAsyncThunk<
  void,
  ListFilterBase,
  ThunkApi
>(
  "pspControl/eliminationOfViolations/getViolationsThunk",
  async (appliedFilter, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.Elimination}/filter`;

      dispatch(
        setLoading({ name: LoadingsNames.isViolationsLoading, value: true })
      );
      const response = await axios.put<PagedModel<any>>(url, appliedFilter);
      dispatch(
        setLoading({ name: LoadingsNames.isViolationsLoading, value: false })
      );

      if (response.data) {
        const adjustedViolations = mapIdentifiedViolations(
          response.data.entities
        );
        dispatch(setIdentifiedViolations(adjustedViolations));
      }
    } catch (error) {
      dispatch(
        setLoading({ name: LoadingsNames.isViolationsLoading, value: false })
      );

      message.error({
        content: getErrorMessage(error),
        duration: 2,
      });
    }
  }
);

// получить конфиг фильтрации
export const getEliminationFilterDescriptionThunk = createAsyncThunk<
  void,
  undefined,
  ThunkApi
>(
  "pspControl/eliminationOfViolations/getEliminationFilterDescriptionThunk",
  async (_, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.Elimination}/filterDescription`;
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

export const getViolationsBySelectedNodeThunk = createAsyncThunk<
  void,
  SelectedNode,
  ThunkApi
>(
  "pspControl/eliminationOfViolations/getViolationsBySelectedNodeThunk",
  async (selectedNode, thunkApi) => {
    const { getState, dispatch } = thunkApi;

    const state = getState();

    dispatch(setSelectedTreeNode(selectedNode));

    const filterConfig = state.actionPlans.filterConfig;
    const baseFilter = state.actionPlans.appliedFilter;

    const newFilter = partiallyReset(filterConfig, baseFilter, "isDependsTree");

    const filter = update(baseFilter, {
      filter: (values) =>
        update(values, {
          $set: {
            ...newFilter,
            treeFilter: {
              nodePath: selectedNode.key,
              isOwn: values.treeFilter.isOwn,
            },
          },
        }),
      pageIndex: { $set: 1 },
    });

    dispatch(setAppliedFilter(filter));


    const updatedFilter = update(filter, { sortedField: { $set: "" } });

    // @ts-ignore
    dispatch(getViolationsThunk(updatedFilter));
  }
);

// Получение статистики по ОСТ или РНУ(филиал)
export const getEliminationInfo = async (actId: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.Elimination}/act/${actId}/info`;
    const response = await axios.get<IEliminationInfo>(url);

    if (response.data) {
      return [response.data];
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

// Информация о ходе устранения
export const getEliminationInfoCourse = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.Elimination}/${id}/infoCourse`;
    const response = await axios.get<IInfoCourse[]>(url);

    if (response.data) {
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

// Создание материалов исполнения нарушения
export const createEliminationMaterials = async (
  id: string, // ид плана мероприятия
  formData: FormData
) => {
  try {
    const url = `${apiBase}${ApiRoutes.Elimination}/${id}/materials`;
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status === 200) {
      message.success({
        content: "Успешно",
        duration: 2,
      });
    }
  } catch (error) {
    notification.error({
      message: getErrorMessage(error, "Неизвестная ошибка", "response.data.message"),
      duration: 0
    })
  }
};

// Создание запроса на продление
export const delayEliminationMaterials = async (
  id: string, // ид плана мероприятия
  formData: FormData
) => {
  try {
    const url = `${apiBase}${ApiRoutes.Elimination}/${id}/delay`;
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      message.success({
        content: "Успешно",
        duration: 2,
      });
    }
  } catch (error) {
    notification.error({
      message: getErrorMessage(error, "Неизвестная ошибка", "response.data.message"),
      duration: 0
    })
  }
};

// Принять запрос материалов
export const acceptEliminationMaterials = async (
  id: string, // ид исполнения нарушения
  formData: FormData
) => {
  try {
    const url = `${apiBase}${ApiRoutes.Elimination}/${id}/accept`;
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      message.success({
        content: "Успешно",
        duration: 2,
      });
    }
  } catch (error) {
    notification.error({
      message: getErrorMessage(error, "Неизвестная ошибка", "response.data.message"),
      duration: 0
    })
  }
};

// Отклонить запрос материалов
export const declineEliminationMaterials = async (
  id: string, // ид исполнения нарушения
  formData: FormData
) => {
  try {
    const url = `${apiBase}${ApiRoutes.Elimination}/${id}/decline`;
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      message.success({
        content: "Успешно",
        duration: 2,
      });
    }
  } catch (error) {
    notification.error({
      message: getErrorMessage(error, "Неизвестная ошибка", "response.data.message"),
      duration: 0
    })
  }
};

// Принять запрос на продление
export const acceptDelayEliminationMaterials = async (
  id: string, // ид исполнения нарушения
  formData: FormData
) => {
  try {
    const url = `${apiBase}${ApiRoutes.Elimination}/${id}/acceptDelay`;
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      message.success({
        content: "Успешно",
        duration: 2,
      });
    }
  } catch (error) {
    notification.error({
      message: getErrorMessage(error, "Неизвестная ошибка", "response.data.message"),
      duration: 0
    })
  }
};

// Отклонить запрос продления
export const declineDelayEliminationMaterials = async (
  id: string, // ид исполнения нарушения
  formData: FormData
) => {
  try {
    const url = `${apiBase}${ApiRoutes.Elimination}/${id}/declineDelay`;
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      message.success({
        content: "Успешно",
        duration: 2,
      });
    }
  } catch (error) {
    notification.error({
      message: getErrorMessage(error, "Неизвестная ошибка", "response.data.message"),
      duration: 0
    })
  }
};

// Скачать вложение
export const downloadEliminationAttachment = async (
  id: string, // ид файлы
  fileName: string
) => {
  try {
    const url = `${apiBase}${ApiRoutes.Elimination}/file/${id}`;
    const response = await fetch(url, { credentials: "include" });
    const blob = await response.blob();

    if (response.status === 200) {
      message.success({
        content: "Успешно",
        duration: 2,
      });

      downloadFile(blob, fileName);
    }
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};
