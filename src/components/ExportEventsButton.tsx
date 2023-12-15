import { FunctionComponent, useState } from "react";
import { Button } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import { apiBase, asciiToUint8Array } from "utils";
import axios from "axios";
import { IEventsFilter } from "containers/EventsContainer";

interface IExportEventsButton {
  eventsFilter: IEventsFilter;
}

const exportEndPoint = `${apiBase}/events-export`;

export const ExportEventsButton: FunctionComponent<IExportEventsButton> = ({ eventsFilter }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setLoading(true);

    // console.warn(eventsFilter);

    /*  await axios.post<string>(
       exportEndPoint,
       eventsFilter
     ).then((response) => {
       console.log(response);
 
       let fileNameHeader = response.headers.get("FileName");
 
       if (fileNameHeader !== null && fileNameHeader !== undefined) {
         let headerSplit = fileNameHeader.split(";");
 
         if (headerSplit.length > 0) {
           let asciiFile = headerSplit[0];
           let code = asciiToUint8Array(asciiFile);
           let fileName = new TextDecoder().decode(code);
         }
       }
 
       return response.blob();     
     }).catch((error) => {
       console.error(error);
     }).finally(() => {
       setLoading(false);
     }); */

    let fileName: string = "download.xlsx";

    fetch(exportEndPoint, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventsFilter)
    })
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <Button
      type="link"
      loading={loading}
      icon={<VerticalAlignBottomOutlined />}
      onClick={handleClick}
    >
      Экспортировать события
    </Button>
  );
};