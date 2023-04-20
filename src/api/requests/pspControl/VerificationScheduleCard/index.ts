import { Button, message, notification } from "antd";
import axios, { AxiosRequestConfig } from "axios";
import {
  ICommissionVerificationModel,
  IPsp,
  IPspCard,
  IVerificationLevelsOst,
  NotificationVerSched,
} from "slices/pspControl/verificationScheduleCard/types";
import { IDictionary, IdType } from "../../../../types";
import { apiBase, asciiToUint8Array, getErrorMessage } from "../../../../utils";
import { ApiRoutes } from "../../../api-routes.enum";

export const exportToExcel = async (name: string, id: IdType) => {
  const url = `${apiBase}${ApiRoutes.VerificationSchedules}/cardSchedule/${id}/exportToExcel?name=${name}`;
  let fileName: string = "download.xls";
  let error: string = "Ошибка серверной части";
  // Запрос
  let response = await fetch(url, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Формирование имени файла
  if (response.ok) {
    let fileNameHeader = response.headers.get("FileName");
    if (fileNameHeader !== null && fileNameHeader !== undefined) {
      let headerSplit = fileNameHeader.split(";");
      if (headerSplit.length > 0) {
        let asciiFile = headerSplit[0];
        let code = asciiToUint8Array(asciiFile);
        fileName = new TextDecoder().decode(code);
      }
    }

    // Выгрузка файла
    let blob = await response.blob();
    const href = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  } else {
    let errorHeader = response.headers.get("Error");
    if (errorHeader !== null && errorHeader !== undefined) {
      let headerSplit = errorHeader.split(";");
      if (headerSplit.length > 0) {
        let asciiFile = headerSplit[0];
        let code = asciiToUint8Array(asciiFile);
        error = new TextDecoder().decode(code);
      }
    }
    return message.error({
      content: error,
      duration: 4,
    });
  }
};

export const createVerificationCommissionRequest = async (
  id: string,
  body: ICommissionVerificationModel
): Promise<ICommissionVerificationModel> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationSchedules}/${id}/commission`,
    body
  );

  return data;
};

export const updateVerificationCommissionRequest = async (
  body: ICommissionVerificationModel
): Promise<ICommissionVerificationModel> => {
  const { data } = await axios.put(
    `${apiBase}${ApiRoutes.VerificationSchedules}/commission/${body.id}`,
    body
  );

  return data;
};

export const getVerificationCommissionsRequest = async (
  id: string
): Promise<ICommissionVerificationModel[]> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.VerificationSchedules}/${id}/commissions`
  );

  return data;
};

export const removeVerificationCommissionsRequest = async (
  id: string
): Promise<void> => {
  const { data } = await axios.delete(
    `${apiBase}${ApiRoutes.VerificationSchedules}/commission/${id}`
  );

  return data;
};

export const sortVerificationCommissionsRequest = async (
  serials: { id: string; newSerial: number }[]
): Promise<void> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationSchedules}/commission/sort`,
    serials
  );

  return data;
};

// Справичник типов поверки
export const getInspectionTypes = async () => {
  try {
    const url = `${apiBase}${ApiRoutes.VerificationActs}/inspectionType`;
    const response = await axios.get<IDictionary[]>(url);

    const data = response.data;

    if (Array.isArray(data) && data.length) return data;

    return [];
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// Создание акта проверки
export const createVerificationAct = async (params) => {
  try {
    const url = `${apiBase}${ApiRoutes.VerificationActs}`;
    const response = await axios.post<string>(url, params);
    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error, undefined, "response.data.message"),
      duration: 2,
    });
  }
};

// Проверка на отмеченное основное вложение
export const verificationSchedulesHasMain = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.VerificationSchedules}/${id}/hasMain`;
    const response = await axios.get<boolean>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return false;
  }
};

// получить список уровней
export const getVerificationLevelsOst = async () => {
  try {
    const url = `${apiBase}${ApiRoutes.GetVerificationLevels}/ost`;
    const response = await axios.get<IVerificationLevelsOst[]>(url);

    const data = response.data;

    if (Array.isArray(data) && data.length) return data;

    return [];
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// получить список объектов проверки
export const getVerificationObjectsPps = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.GetPsp}/${id}`;
    const response = await axios.get<IPspCard>(url);

    const osus = response.data.osus;

    if (Array.isArray(osus) && osus.length) return osus;

    return [];
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// получить список объектов проверки
export const getVerificationPsps = async (
  scheduleId: string,
  pspId: string,
  listOfSiknLabRsuIds: IdType[],
  hasDates: boolean
) => {
  try {
    const url = `${apiBase}${ApiRoutes.VerificationSchedules}/${scheduleId}/psp/${pspId}/list?hasDates=${hasDates}`;
    const response = await axios.post<IPsp[]>(url, listOfSiknLabRsuIds);

    const data = response.data;

    if (Array.isArray(data) && data.length) return data;

    return [];
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// отредактировать объект графика
export const editVerificationSchedule = async (
  scheduleId: string,
  pspId: string,
  listOfSiknLabRsuIds: IdType[],
  params: any
) => {
  try {
    const url = `${apiBase}${ApiRoutes.VerificationSchedules}/${scheduleId}/psp/${pspId}`;
    const siknLabRsuverificationSchedule: {
      listOfSiknLabRsuIds: IdType[];
      siknLabRsuVerificationSchedule: any;
    } = {
      listOfSiknLabRsuIds: listOfSiknLabRsuIds,
      siknLabRsuVerificationSchedule: params,
    };
    const response = await axios.put<NotificationVerSched[]>(url, siknLabRsuverificationSchedule);

    if (response.status === 200) return response.data;

    return undefined;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return undefined;
  }
};
