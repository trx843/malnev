import { Nullable } from "../../types";

export interface IOstRnuInfoModel {
  allInfo: Nullable<IOstRnuCountModel>; // Статистика всего
  ostInfo: Nullable<IOstRnuCountModel>; // Статистика по ОСТ
  rnuInfo: Nullable<IOstRnuCountModel>; // Статистика по РНУ (филиал)
}

export interface IOstRnuCountModel {
  pspCount: Nullable<number>; // Количество ПСП
  pspOilCount: Nullable<number>; // Количество ПСП (нефть)
  pspGasCount: Nullable<number>; // Количество ПСП (НП)
  checkingObjectsCount: Nullable<number>; // Количество систем учёта
  siknCount: Nullable<number>; // Количество СИКН
  siknGasCount: Nullable<number>; // Количество СИКН (НП)
  siknOilCount: Nullable<number>; // Количество СИКН (нефть)
  siknRsuCount: Nullable<number>; // Количество СИКН РСУ
  ilCount: Nullable<number>; // Количество ИЛ
  ilOilCount: Nullable<number>; // Количество ИЛ (нефть)
  ilGasCount: Nullable<number>; // Количество ИЛ (НП)
}

export interface InfoRequestModel {
  ostPath: string; // Путь в дереве для ост
  rnuPath: string; // Путь в дереве для
}
