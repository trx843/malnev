import moment from "moment";
import { IDictionary, Nullable } from "types";
import { formatDateRange } from "utils";

import { IFormValues } from "./types";

export const mapDictionary = (dictionary: IDictionary[]) => {
  return dictionary.map((i) => ({ value: i.id, label: i.label }));
};

const getName = (dateRange: Nullable<moment.Moment[]>) => {
  if (dateRange) {
    const date1 = dateRange[0];
    const date2 = dateRange[1];

    return `Журнал для ознакомления ОСТ с результатами проверок комиссией  по состоянию на ${date1.format(
      "DD.MM.YYYY"
    )} - ${date2.format("DD.MM.YYYY")}`;
  }

  return `Журнал для ознакомления ОСТ с результатами проверок комиссией  по состоянию на ${moment().format(
    "DD.MM.YYYY"
  )}`;
};

export const adjustValues = (values: IFormValues) => {
  const dateRange = values.acquaintanceDateInterval;

  return {
    ...values,
    acquaintanceDateInterval: dateRange ? formatDateRange(dateRange) : [],
    name: getName(dateRange),
  };
};
