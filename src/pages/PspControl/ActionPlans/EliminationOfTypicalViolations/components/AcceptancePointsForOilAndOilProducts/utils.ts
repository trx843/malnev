import { RowSpanParams } from "ag-grid-community";
import classNames from "classnames/bind";
import styles from "./acceptancePointsForOilAndOilProducts.module.css";

const cx = classNames.bind(styles);

const getRowSpan = (attrName: string) => (params: RowSpanParams) => {
  const rowSpan = params.data[attrName];
  return rowSpan;
};

export const IdentifiedTypicalViolationSerialRowSpan = getRowSpan(
  "_identifiedTypicalViolationSerialRowSpan"
);

export const TypicalViolationSerialRowSpan = getRowSpan(
  "_typicalViolationSerialRowSpan"
);

const getCellClassRules = (attrName: string) => {
  return {
    [cx("row-span-cell")]: (params: any) => params.data[attrName] > 1,
  };
};

export const IdentifiedTypicalViolationSerialCellClassRules = getCellClassRules(
  "_identifiedTypicalViolationSerialRowSpan"
);
export const TypicalViolationSerialCellClassRules = getCellClassRules(
  "_typicalViolationSerialRowSpan"
);
