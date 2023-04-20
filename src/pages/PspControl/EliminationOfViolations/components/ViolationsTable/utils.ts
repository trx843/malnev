import { RowSpanParams } from "ag-grid-community";
import classNames from "classnames/bind";
import { dateValueFormatter as defaultDateValueFormatter } from "../../../../../utils";
import styles from "./violationsTable.module.css";

const cx = classNames.bind(styles);

const getRowSpan = (attrName: string) => (params: RowSpanParams) => {
  const rowSpan = params.data[attrName];
  return rowSpan;
};

export const identifiedViolationRowSpan = getRowSpan(
  "_rowSpanIdentifiedViolation"
);

export const violationRowSpan = getRowSpan("_rowSpanViolation");

const getCellClassRules = (attrName: string) => {
  return {
    [cx("row-span-cell")]: (params: any) => params.data[attrName] > 1,
  };
};

export const identifiedViolationCellClassRules = getCellClassRules(
  "_rowSpanIdentifiedViolation"
);
export const violationCellClassRules = getCellClassRules("_rowSpanViolation");

export const dateValueFormatter = defaultDateValueFormatter();
