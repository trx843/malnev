import { Nullable } from "types";

export interface ISuAbout {
  suName: Nullable<string>; // Наименование
  suOwner: Nullable<string>; // Владелец
  suPurpose: Nullable<string>; // Назначение
  suAffiliation: Nullable<string>; // Принадлежность
  transportedProduct: Nullable<string>; // Продукт
  suReceive: Nullable<string>; // Принимающая сторона
  suSender: Nullable<string>; // Сдающая сторона
  ownedText: Nullable<string>; // Соственный сторониий
  suTerritorialLocation: Nullable<string>; // Расположение
  rsuName: Nullable<string>; // Наименовние РСУ
  rsuOwner: Nullable<string>; // Владелец РСУ
  ilName: Nullable<string>; // Наименование ИЛ
  hasIlAccredition: Nullable<string>; // Наличие у ИЛ акредитации
  ilOwner: Nullable<string>; // Владелец ИЛ
  address: Nullable<string>;
}
