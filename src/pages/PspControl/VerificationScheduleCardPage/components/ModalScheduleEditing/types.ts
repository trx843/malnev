import { IPspViewModel } from "../../../../../slices/pspControl/verificationScheduleCard/types";
import { FormFields } from "./constants";

export enum OstValues {
  PaoTransneft = 1, // ПАО "Транснефть"
  AoTransneftMetrology = 2, // АО "Транснефть-метрология"
  Ost = 3, // ОСТ
}

export interface IFormValues {
  [FormFields.psps]: IPspViewModel[];
}
