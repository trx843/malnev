
import { ICellRendererParams } from "ag-grid-community";
import React, { FunctionComponent } from "react";
import { MssEventSecurityLevel } from "../../classes";

export const CriticalnessRenderer: FunctionComponent<ICellRendererParams> = (
  props: ICellRendererParams
) => {
  let level = props.value as MssEventSecurityLevel;
  return <div style={{ color: `#${level.color}` }}>{level.shortName}</div>;
};
