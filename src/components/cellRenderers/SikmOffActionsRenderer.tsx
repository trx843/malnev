import { ICellRendererParams } from "ag-grid-community";
import React, { FunctionComponent } from "react";
import { AttachButton } from "./SiknOffAttachButton";
import { MenuRenderer } from "./MenuRenderer";
import { SiknOffItem, TimeSpan } from "../../classes";
import axios from "axios";
import { apiBase } from "../../utils";
import { Col, Row } from "antd";
import { PiVisionButton } from "./PiVisionButton";

export const ActionsRenderer: FunctionComponent<ICellRendererParams> = (
  props: ICellRendererParams
) => {
  const item = props.data as SiknOffItem;
  const flag =
    item.actReference !== null ||
    item.investigateActReference !== null ||
    item.actFileReference !== null ||
    item.investigateActFileReference !== null;
  return (
    <Row gutter={10}>
      <Col>
        <PiVisionButton data={item} />
      </Col>
      <Col>
        <AttachButton
          data={item}
          submitCallback={async (item) => {
            try {
              let response = await axios.put(
                `${apiBase}/siknoff/reference/${item.id}`,
                item
              );
              let rowNode = props.api.getRowNode(item.id);
              rowNode.setData(response.data.result);
              return Promise.resolve();
            } catch (err) {
              return Promise.reject(err);
            }
          }}
          reDraw={() =>
            props.api.redrawRows({
              rowNodes: [props.api.getRowNode(item.id)],
            })
          }
          setNewItem={(newItem) => {
            // поскольку ответ в аплоад приходит не через аксиос
            // надо делать обработку дат вручную
            const dataStr = JSON.stringify(newItem);
            const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z?)$/;
            const reviver = (_key: string, value: any) => {
              if (typeof value === "string" && dateFormat.test(value)) {
                return new Date(value);
              }
              if (value !== null) {
                if (
                  typeof value === "object" &&
                  TimeSpan.intanceOf(value, TimeSpan)
                ) {
                  return TimeSpan.fromObject(value, TimeSpan);
                }
              }
              return value;
            };
            newItem = JSON.parse(dataStr, reviver);
            props.api.getRowNode(newItem.id).setData(newItem);
            return newItem;
          }}
        />
      </Col>
      <Col>
        {flag && (
          <MenuRenderer
            data={item}
            setPropToNull={async (key) => {
              let newItem = item;
              newItem[key] = null as never;
              try {
                await axios.put(
                  `${apiBase}/siknoff/reference/${item.id}`,
                  newItem
                );
                let rowNode = props.api.getRowNode(item.id);
                rowNode.setData(newItem);
                return Promise.resolve();
              } catch (err) {
                return Promise.reject(err);
              }
            }}
            reDraw={() =>
              props.api.redrawRows({
                rowNodes: [props.api.getRowNode(item.id)],
              })
            }
          />
        )}
      </Col>
    </Row>
  );
};
