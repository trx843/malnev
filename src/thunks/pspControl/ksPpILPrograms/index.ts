import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { ApiRoutes } from "../../../api/api-routes.enum";
import {
  LoadingsNames,
  setKsPpILProgramList,
  setLoading,
  setPageInfo,
} from "../../../slices/pspControl/ksPpILPrograms";
import {
  IProgramKsPpIlListModel,
  IProgramKsPpIlModel,
  IProgramKsPpIlModelDto,
} from "../../../slices/pspControl/ksPpILPrograms/types";
import {  PagedModel } from "../../../types";
import { apiBase, downloadFile, getErrorMessage } from "../../../utils";
import { ThunkApi } from "../../types";
import { ListFilterBase } from "interfaces";

// Получить список журнала с фильтром
export const getKsPpILProgramsThunk = createAsyncThunk<
  void,
  ListFilterBase,
  ThunkApi
>(
  "pspControl/ksPpILPrograms/getKsPpILProgramsThunk",
  async (appliedFilter, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.ProgramKspp}/filter`;

      dispatch(
        setLoading({
          name: LoadingsNames.isKsPpILProgramListLoading,
          value: true,
        })
      );
      const response = await axios.put<PagedModel<IProgramKsPpIlListModel>>(
        url,
        appliedFilter
      );
      dispatch(
        setLoading({
          name: LoadingsNames.isKsPpILProgramListLoading,
          value: false,
        })
      );

      const data = response.data;

      if (data) {
        dispatch(setKsPpILProgramList(data.entities));
        dispatch(
          setPageInfo({
            ...data.pageInfo,
            pageNumber: data.pageInfo.pageNumber || 1,
          })
        );
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isKsPpILProgramListLoading,
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

// Создание программы
export const createProgramKsPp = async (data: IProgramKsPpIlModelDto) => {
  try {
    const url = `${apiBase}${ApiRoutes.ProgramKspp}`;
    const response = await axios.post<IProgramKsPpIlModel>(url, data);

    if (response.status === 200 && response.data) {
      return response.data.id;
    }

    return null;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return null;
  }
};

// Замена программы
export const replaceProgramKsPp = async (
  id: string,
  data: IProgramKsPpIlModelDto
) => {
  try {
    const url = `${apiBase}${ApiRoutes.ProgramKspp}/${id}`;
    const response = await axios.put(url, data);

    if (response.status === 200 && response.data) {
      return response.data.id;
    }

    return null;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return null;
  }
};

// Отмена программы
export const cancelProgramKsPp = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.ProgramKspp}/${id}/cancel`;
    const response = await axios.put(url);

    if (response.status === 200) {
      message.success({
        content: "Программа отменена успешно",
        duration: 2,
      });
    }
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

// Добавление вложений
export const uploadAttachmentProgramKsPp = async (id: string, file: any) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${apiBase}${ApiRoutes.ProgramKspp}/${id}/file`;
    const response = await axios.post(url, formData);

    if (response.status === 200) {
      message.success({
        content: "Программа создана/заменена успешно",
        duration: 2,
      });
    }
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

// Скачать вложение
export const downloadAttachmentProgramKsPp = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.ProgramKspp}/file/${id}`;
    const response = await fetch(url, { credentials: "include" });
    const blob = await response.blob();

    if (response.status === 200) {
      downloadFile(blob, "");
    }
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

// Получение программы
export const getProgramKsPp = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.ProgramKspp}/${id}`;
    const response = await axios.get<IProgramKsPpIlModel>(url);

    const data = response.data;

    if (data) return data;

    return null;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return null;
  }
};
