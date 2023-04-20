import { CellClassParams, RowSpanParams } from "ag-grid-community";
import classNames from "classnames/bind";
import styles from "./recommendationsTable.module.css";

const cx = classNames.bind(styles);

export const getRecommendationRowSpan = (params: RowSpanParams) => {
  const rowSpan = params.data._recommendationRowSpan;
  return rowSpan;
};

export const getRecommendationCellClass = (params: CellClassParams) =>
  cx({
    "row-span-cell": params.data._recommendationRowSpan > 1,
    "row-span-cell-border": params.data._isFirstRowWithRowSpan,
  });
