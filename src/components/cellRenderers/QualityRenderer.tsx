/**
 * 0 - Недостоверно #FF4D4F
 * 1 - Сомнительно #F2994A
 * 2 - Достоверно #219653
 */

import { ICellRendererParams } from "ag-grid-community";
import React, { FunctionComponent } from "react";
import { Nullable } from "../../types";

export const QualityRenderer: FunctionComponent<ICellRendererParams> = (
  props: ICellRendererParams
) => {
  let id = props.value as Nullable<number>;
  let text = "";
  let color: string | undefined = undefined;
  if (id !== null) {
    switch (id) {
      case 0:
        text = "Недостоверно";
        color = "#FF4D4F";
        break;
      case 1:
        text = "Сомнительно";
        color = "#F2994A";
        break;
      case 2:
        text = "Достоверно";
        color = "#219653";
        break;
    }
  }
  return <div style={{ color: color }}>{text}</div>;
};
