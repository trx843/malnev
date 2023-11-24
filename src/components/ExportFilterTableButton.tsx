import { Component, FC, useState } from "react";
import { Button } from "antd";
import ExportOutlined from "@ant-design/icons/ExportOutlined";
import { FiltersModel, NodeType } from "../types";
import { ListFilterBase } from "../interfaces";
import { apiBase, asciiToUint8Array } from "utils";

interface IExportTableButtonProps {
  init: RequestInit;
}

export const ExportFilterTableButton: FC<IExportTableButtonProps> = ({
  init,
}) => {
  const [loadings, setLoadings] = useState(false);
  const clickHandler = async () => {
    setLoadings(true);
    var url = `${apiBase}/export`;
    let fileName: string = "download.xlsx";
    fetch(url, init)
      .then((response) => {
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
          return response.blob();
        }
        return;
      })
      .then((blob: Blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        setLoadings(false);
      })
      .catch((err) => {
        setLoadings(false);
      });
  };

  return (
    <Button
      type="link"
      loading={loadings}
      icon={<ExportOutlined />}
      onClick={clickHandler}
    >
      Экспортировать
    </Button>
  );
};
