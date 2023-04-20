import { message } from "antd";
import axios from "axios";
import { IGenericFilterConfig } from "components/CustomFilter/interfaces";
import { ListFilterBase } from "interfaces";

import { IdType } from "types";
import { apiBase, asciiToUint8Array, downloadFile, getErrorMessage } from "../../../../utils";
import { ApiRoutes } from "../../../api-routes.enum";
import { AcquaintanceModelDto, AcquaintanceVerificationActResponse, AcquaintancePagedModel } from "./types";

export const getAcquaintanceItemsByFilter = async (
  filter: ListFilterBase
): Promise<AcquaintancePagedModel> => {
  const url = `${apiBase}${ApiRoutes.Acquaintance}/filter`;
  const { data } = await axios.put<AcquaintancePagedModel>(url, filter);

  return data;
};

export const getAcquaintanceFilterDescription = async (): Promise<IGenericFilterConfig> => {
  const url = `${apiBase}${ApiRoutes.Acquaintance}/filterDescription`;

  const { data } = await axios.get<IGenericFilterConfig>(url);

  return data;
};

export const getAcquaintanceVerificationActByActId = async (
  id: IdType
): Promise<AcquaintanceVerificationActResponse> => {
  const url = `${apiBase}${ApiRoutes.Acquaintance}/verificationAct/${id}`;

  const { data } = await axios.get<AcquaintanceVerificationActResponse>(url);

  return data;
};

export const setAcquaintance = async (params: AcquaintanceModelDto): Promise<AcquaintanceModelDto> => {
  const url = `${apiBase}${ApiRoutes.Acquaintance}`

  const {data} = await axios.post<AcquaintanceModelDto>(url, params)

  return data
}

export const exportAcquaintanceToExcel = async (name: string, params) => {
  try {
    const url = `${apiBase}${ApiRoutes.Acquaintance}/exportToExcel?name=${name}&isOriginalFormat=true`;

    const response = await fetch(url, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: params,
      }),
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
};

