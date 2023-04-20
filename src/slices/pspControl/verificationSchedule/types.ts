import { Nullable } from "types";

export interface IVerificationSchedulesModel {
  id: string; // Ид графика
  verificationLevelId: number; // Ид уровня проверки
  verificationLevel: string; // Наименование уровня проверки
  checkTypeId: Nullable<string>; // ИД типа проверки
  checkType: Nullable<string>; // Наименование типа проверки
  isVisibilityInspection: boolean; // Отображать или нет тип поверки
  ost: Nullable<string>; // Наименование ОСТ
  inspectionYear: Nullable<string>; // Год проверки
  yearText: Nullable<string>; // Год проверки (текст)
  createdOn: Nullable<string>; // Дата создания графика
  status: number; // Статус графика
  statusText: Nullable<string>; // Наименование статуса
  name: Nullable<string>; // Наименование графика
  siknLabRsuInfoArray: Nullable<ISiknLabRsuInfo[]>; // Перечент СУ
  onceSigned: boolean; // Свойство указывающее на то, был ли график ранее уже подписан
}

export interface ISiknLabRsuInfo {
  ostRnuPspId: Nullable<string>; // Идентификатор ПСП
  siknLabRsuId: Nullable<string>; // Идентификатор СУ
}
