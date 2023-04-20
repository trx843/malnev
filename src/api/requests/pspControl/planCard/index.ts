import { message } from "antd";
import axios from "axios";
import { CommissionTypesStages } from "enums";
import {
  ICommissionPlanModel,
  IPlanCard,
} from "../../../../slices/pspControl/planCard/types";
import { apiBase, asciiToUint8Array } from "../../../../utils";
import { ApiRoutes } from "../../../api-routes.enum";
import { CommissionDto } from "./types";

export const exportToExcel = async (
  name: string,
  id: string | null | undefined
) => {
  if (!id) return;

  const url = `${apiBase}${ApiRoutes.Plan}/plancard/exportToExcel?name=${name}&id=${id}&isOriginalFormat=${true}`;
  let fileName: string = "download.xls";
  let error: string = "Ошибка серверной части";
  // Запрос
  let response = await fetch(url, {
    credentials: "include",
    method: "POST",
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

export const getCommissionTypesRequest = async (stage: CommissionTypesStages): Promise<
  { id: string; label: string }[]
> => {
  const { data } = await axios.get(
    `${apiBase}/pspcontrol/dictionaries/commissionTypes`,
    { params: { stage } }
  );

  return data;
};

export const createCommissionRequest = async (
  id: string,
  body: ICommissionPlanModel
): Promise<ICommissionPlanModel> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.Plan}/${id}/commission`,
    body
  );

  return data;
};

export const updateCommissionRequest = async (
  body: ICommissionPlanModel
): Promise<ICommissionPlanModel> => {
  const { data } = await axios.put(
    `${apiBase}${ApiRoutes.Plan}/commission/${body.id}`,
    body
  );

  return data;
};

export const getCommissionsRequest = async (
  id: string
): Promise<ICommissionPlanModel[]> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.Plan}/${id}/commissions`
  );

  return data;
};

export const removeCommissionsRequest = async (id: string): Promise<void> => {
  const { data } = await axios.delete(
    `${apiBase}${ApiRoutes.Plan}/commission/${id}`
  );

  return data;
};

export const sortCommissionsRequest = async (
  serials: { id: string; newSerial: number }[]
): Promise<void> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.Plan}/commission/sort`,
    serials
  );

  return data;
};
