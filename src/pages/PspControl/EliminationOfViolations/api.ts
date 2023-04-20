import { message } from "antd";
import { ApiRoutes } from "api/api-routes.enum";
import { ListFilterBase } from "interfaces";
import { apiBase, asciiToUint8Array } from "utils";

export const exportToExcel = async (filter:  ListFilterBase) => {

  const url = `${apiBase}${ApiRoutes.Elimination}/export`;
  let fileName: string = "download.xls";
  let error: string = "Ошибка серверной части";
  // Запрос
  let response = await fetch(url, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filter),
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
