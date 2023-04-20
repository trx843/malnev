import { Button, Col, Modal, Popover, Row, Tooltip } from "antd";
import React, { FunctionComponent, useState } from "react";
import LinkOutlined from "@ant-design/icons/LinkOutlined";
import FileOutlined from "@ant-design/icons/FileOutlined";
import FolderOutlined from "@ant-design/icons/FolderOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/ExclamationCircleOutlined";
import { SiknOffItem } from "../../classes";
import { apiBase, asciiToUint8Array, dateToLongDateString } from "../../utils";

interface IMenuProps {
  data: SiknOffItem;
  setPropToNull: (key: keyof SiknOffItem) => Promise<void>;
  reDraw: () => void;
}

const { confirm } = Modal;

export const MenuRenderer: FunctionComponent<IMenuProps> = (
  props: IMenuProps
) => {
  const [item, setItem] = useState(props.data);
  const [actBtnLoading, setActBtnLoading] = useState<boolean>(false);
  const [invActBtnLoading, setInvActBtnLoading] = useState<boolean>(false);

  const flag = (item: SiknOffItem) =>
    item.actReference !== null ||
    item.investigateActReference !== null ||
    item.actFileReference !== null ||
    item.investigateActFileReference !== null;

  const clickHandler = (path: string) => {
    const url: string = `${apiBase}/siknoff/GetFile?path=${path}`;
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
  };

  const content: JSX.Element = (
    <div>
      <div
        style={{
          display: item.actReference !== null ? "flex" : "none",
          marginBottom: 8,
        }}
      >
        <Button
          type={"link"}
          onClick={() => clickHandler(item.actReference as string)}
          icon={<LinkOutlined />}
        >
          Открыть акт отключения
        </Button>
        <Button
          type={"link"}
          style={{ marginLeft: "auto" }}
          onClick={() => {
            confirm({
              title: "Вы уверены, что хотите удалить ссылку на акт отключения?",
              icon: <ExclamationCircleOutlined />,
              okText: "Удалить",
              cancelText: "Отмена",
              async onOk() {
                try {
                  await props.setPropToNull("actReference");
                  const newItem: SiknOffItem = { ...item, actReference: null };
                  setItem(newItem);
                  if (!flag(newItem)) {
                    props.reDraw();
                  }
                } catch (err) {
                  return console.log(err);
                }
              },
              onCancel() {},
            });
          }}
          icon={<DeleteOutlined />}
        />
      </div>
      <div
        style={{
          display: item.investigateActReference !== null ? "flex" : "none",
          marginBottom: 8,
        }}
      >
        <Button
          type={"link"}
          onClick={() => clickHandler(item.investigateActReference as string)}
          icon={<LinkOutlined />}
        >
          Открыть акт расследования
        </Button>
        <Button
          type={"link"}
          style={{ marginLeft: "auto" }}
          onClick={() => {
            confirm({
              title:
                "Вы уверены, что хотите удалить ссылку на акт расследования?",
              icon: <ExclamationCircleOutlined />,
              okText: "Удалить",
              cancelText: "Отмена",
              async onOk() {
                try {
                  await props.setPropToNull("investigateActReference");
                  const newItem: SiknOffItem = {
                    ...item,
                    investigateActReference: null,
                  };
                  setItem(newItem);
                  if (!flag(newItem)) {
                    props.reDraw();
                  }
                } catch (err) {
                  return console.log(err);
                }
              },
              onCancel() {},
            });
          }}
          icon={<DeleteOutlined />}
        />
      </div>
      <div
        style={{
          display: item.actFileReference !== null ? "flex" : "none",
          marginBottom: 8,
        }}
      >
        <Button
          loading={actBtnLoading}
          type={"link"}
          onClick={() => {
            setActBtnLoading(true);
            let fileName: string = `Акт отключения_${dateToLongDateString(
              new Date()
            )}`;
            fetch(`${apiBase}/siknoff/${item.id}/GetActFile`, {
              credentials: "include",
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
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
                } else {
                  throw "Невозможно скачать акт";
                }
              })
              .then((blob) => {
                const href = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = href;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                setActBtnLoading(false);
              })
              .catch((err) => console.error(err));
          }}
          icon={<FileOutlined />}
        >
          Скачать акт отключения
        </Button>
        <Button
          style={{ marginLeft: "auto" }}
          type={"link"}
          onClick={() => {
            confirm({
              title: "Вы уверены, что хотите удалить скан акта отключения?",
              icon: <ExclamationCircleOutlined />,
              okText: "Удалить",
              cancelText: "Отмена",
              async onOk() {
                try {
                  await props.setPropToNull("actFileReference");
                  const newItem: SiknOffItem = {
                    ...item,
                    actFileReference: null,
                  };
                  setItem(newItem);
                  if (!flag(newItem)) {
                    props.reDraw();
                  }
                } catch (err) {
                  return console.log(err);
                }
              },
              onCancel() {},
            });
          }}
          icon={<DeleteOutlined />}
        />
      </div>
      <div
        style={{
          display: item.investigateActFileReference !== null ? "flex" : "none",
          marginBottom: 8,
        }}
      >
        <Button
          loading={invActBtnLoading}
          type={"link"}
          onClick={() => {
            setInvActBtnLoading(true);
            let fileName: string = `Акт расследования_${dateToLongDateString(
              new Date()
            )}.docx`;
            fetch(`${apiBase}/siknoff/${item.id}/GetInvestigateActFile`, {
              credentials: "include",
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
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
                } else {
                  throw "Невозможно скачать акт";
                }
              })
              .then((blob) => {
                const href = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = href;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                setInvActBtnLoading(false);
              })
              .catch((err) => console.error(err));
          }}
          icon={<FileOutlined />}
        >
          Скачать акт расследования
        </Button>
        <Button
          type={"link"}
          style={{ marginLeft: "auto" }}
          onClick={() => {
            confirm({
              title: "Вы уверены, что хотите удалить скан акта расследования?",
              icon: <ExclamationCircleOutlined />,
              okText: "Удалить",
              cancelText: "Отмена",
              async onOk() {
                try {
                  await props.setPropToNull("investigateActFileReference");
                  const newItem: SiknOffItem = {
                    ...item,
                    investigateActFileReference: null,
                  };
                  setItem(newItem);
                  if (!flag(newItem)) {
                    props.reDraw();
                  }
                } catch (err) {
                  return console.log(err);
                }
              },
              onCancel() {},
            });
          }}
          icon={<DeleteOutlined />}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Popover
        title={`Скачать для ` + props.data.siknFullName}
        arrowPointAtCenter
        content={content}
        trigger="hover"
        placement="bottomRight"
      >
        <Button
          type={"link"}
          style={{ width: "100%" }}
          icon={<FolderOutlined />}
        />
      </Popover>
    </div>
  );
};
