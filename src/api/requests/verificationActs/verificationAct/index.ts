import axios from "axios";
import { message } from "antd";
import { IdType } from "../../../../types"
import { apiBase, asciiToUint8Array, getErrorMessage } from "../../../../utils";
import { ApiRoutes } from "../../../api-routes.enum";

export const exportToDoc = async (id:IdType, name:string) => {
  const url = `${apiBase}${ApiRoutes.VerificationActs}/${id}/actCard/exportToDoc?name=${name}`;
  let fileName: string = 'download.xls';
  let error: string = 'Ошибка серверной части';
  // Запрос
  let response = await fetch(url, {
    credentials: "include",
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
  });

  // Формирование имени файла
  if(response.ok) {
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
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', fileName);
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
      duration: 4
    });
  }
}

// Проверка на отмеченное основное вложение
export const verificationActHasMain = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.VerificationActs}/${id}/hasMain`;
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