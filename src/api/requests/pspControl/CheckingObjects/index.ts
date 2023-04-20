import axios from "axios";
import { message } from "antd";
import {
  apiBase,
  asciiToUint8Array,
  downloadFile,
  getErrorMessage,
} from "../../../../utils";
import { ApiRoutes } from "../../../api-routes.enum";
import { ISuAbout } from "./types";
import { IPspcontrolVerificationLevelsResponse } from "api/responses/get-pspcontrol-verification-levels.response";
import { IdType } from "types";
import { ListFilterBase } from "interfaces";
import { TableColumnInfo } from "components/TableColumnSettingsModal/types";

export const exportToExcel = async () => {
  const url = `${apiBase}${ApiRoutes.CheckingObjects}/exportToExcel`;
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

export const exportWithFiltersToExcel = async (
  listFilter: ListFilterBase,
  columnState: TableColumnInfo[]
) => {
  const url = `${apiBase}${ApiRoutes.CheckingObjects}/exportWithFiltersToExcel`;
  let fileName: string = "download.xls";
  let error: string = "Ошибка серверной части";
  // Запрос
  let response = await fetch(url, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      checkingObjectsListFilter: listFilter,
      tableColumnInfo: columnState,
    }),
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

// Сведения об ОСУ
export const aboutOsu = async (pspId: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.CheckingObjects}/${pspId}/about`;
    const response = await axios.get<ISuAbout[]>(url);

    const data = response.data;

    if (data) return data;

    return [];
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// Экспорт шаблона для импорта акта
export const downloadTemplate = async (
  setIsButtonLoading: (isLoading: boolean) => void,
  pspId: IdType,
  verificationScheduleId: string | null,
  verificationLevelId: string | null,
  checkTypeId: string | null,
  isOriginalFormat: boolean
) => {
  setIsButtonLoading(true);
  try {
    const url = `${apiBase}${ApiRoutes.CheckingObjects}/templateExport?pspId=${pspId}&verificationScheduleId=${verificationScheduleId}&verificationLevelId=${verificationLevelId}&checkTypeId=${checkTypeId}&isOriginalFormat=${isOriginalFormat}`;

    const response = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.blob();
    const fileName = response.headers.get("FileName");

    if (data) {
      if (fileName) {
        const code = asciiToUint8Array(fileName);
        const adjustedFileName = new TextDecoder().decode(code);

        downloadFile(data, adjustedFileName);
      } else {
        downloadFile(data, "download.xls");
      }
    }
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
  setIsButtonLoading(false);
};

// Получить список уровней проверки для фильтра "Просрочена проверка для уровня"
export const getvlwithOverdue = async () => {
  try {
    const url = `${apiBase}${ApiRoutes.CheckingObjects}/getvlwithOverdue`;
    const response = await axios.get<IPspcontrolVerificationLevelsResponse[]>(
      url
    );

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// Последняя дата обновления БДМИ
export const getBdmiLastDate = async () => {
  try {
    const url = `${apiBase}${ApiRoutes.BdmiLastDate}`;
    const response = await axios.get<string>(url);
    const data = response.data;
    return data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error, "Неизвестная ошибка", "response.data.message"),
      duration: 2,
    });
    return null;
  }
};
