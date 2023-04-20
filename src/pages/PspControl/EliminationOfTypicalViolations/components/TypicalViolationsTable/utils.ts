import { RowSpanParams } from "ag-grid-community";
import classNames from "classnames/bind";
import styles from "./typicalViolationsTable.module.css";

const cx = classNames.bind(styles);

const getRowSpan = (attrName: string) => (params: RowSpanParams) => {
  const rowSpan = params.data[attrName];
  return rowSpan;
};

export const IdentifiedTypicalViolationRowSpan = getRowSpan(
  "_rowSpanIdentifiedTypicalViolation"
);

export const TypicalViolationRowSpan = getRowSpan("_rowSpanTypicalViolation");

const getCellClassRules = (attrName: string) => {
  return {
    [cx("row-span-cell")]: (params: any) => params.data[attrName] > 1,
  };
};

export const IdentifiedTypicalViolationCellClassRules = getCellClassRules(
  "_rowSpanIdentifiedTypicalViolation"
);
export const TypicalViolationCellClassRules = getCellClassRules(
  "_rowSpanTypicalViolation"
);
