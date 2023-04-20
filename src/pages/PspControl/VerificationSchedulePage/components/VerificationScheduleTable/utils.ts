import { ValueFormatterParams } from "ag-grid-community";
import moment from "moment";

export const dateValueFormatter = (params: ValueFormatterParams) => {
  const date = params.value;

  if (!date) return "";

  const momentDateObj = moment(date);

  if (momentDateObj.isValid()) return momentDateObj.format("DD.MM.YYYY");

  return "";
};
