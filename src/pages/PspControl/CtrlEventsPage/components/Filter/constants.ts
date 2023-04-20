import { assign } from "lodash";
import moment from "moment";
import { Nullable } from "types";
import { OwnTypes, TransportedProducts } from "../../../../../enums";

export enum FormFields {
  DateRange = "dateRange", // поле Даты
  ForExecution = "forExecution", // поле К исполнению
  OnlyUnread = "onlyUnread", // поле Только непрочитанные
  EventTypes = "eventTypes", // поле Тип события
}

export const InitialFormValues = {
  [FormFields.DateRange]: [moment().startOf("month"), moment()],
  [FormFields.ForExecution]: false,
  [FormFields.OnlyUnread]: false,
  [FormFields.EventTypes]: [] as string[],
};

export type IFormValues = typeof InitialFormValues;
