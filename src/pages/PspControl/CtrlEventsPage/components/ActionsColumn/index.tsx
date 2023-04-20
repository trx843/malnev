import React from "react";
import { Button, message, Tooltip, Modal } from "antd";
import { FileDoneOutlined, FileSearchOutlined } from "@ant-design/icons";
import { ITableCellRendererParams } from "components/AgGridTable/types";
import { CtrlEventHandleTypeEnum, CtrlEventsItem } from "../../types";
import { useDispatch } from "react-redux";
import { сtrlEventHandleTC } from "thunks/pspControl/ctrlEvents";
import { useHistory } from "react-router";
const { confirm } = Modal;

export const ActionsColumn: React.FC<
  ITableCellRendererParams<CtrlEventsItem>
> = ({ data }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <React.Fragment>
      <Tooltip title={"Ознакомиться"}>
        <Button
          icon={
            <FileSearchOutlined
              style={{
                alignContent: "center",
                fontSize: "20px",
                color: "#1890FF",
              }}
            />
          }
          type="text"
          onClick={() => {
            if (data.link) history.push(data.link);
            else {
              message.error("Отсутсвует ссылка на объект события");
              return;
            }
            if (!data.isAcquaintance)
              dispatch(
                сtrlEventHandleTC({
                  event: data,
                  handleType: CtrlEventHandleTypeEnum.IsAcquaintance,
                })
              );
          }}
        />
      </Tooltip>
      {!data.forExecution && (
        <Tooltip title={"К исполнению"}>
          <Button
            icon={
              <FileDoneOutlined
                style={{
                  alignContent: "center",
                  fontSize: "20px",
                  color: "#1890FF",
                }}
              />
            }
            type="text"
            onClick={() => {
              confirm({
                title: "Уверены, что хотите поставить к исполнению?",
                onOk() {
                  return new Promise<void>(async (resolve) => {
                    await dispatch(
                      сtrlEventHandleTC({
                        event: data,
                        handleType: CtrlEventHandleTypeEnum.ForExecution,
                      })
                    );
                    resolve();
                  });
                },
                okText: "Да",
                cancelText: "Отменить",
                onCancel() {},
              });
            }}
          />
        </Tooltip>
      )}
    </React.Fragment>
  );
};
