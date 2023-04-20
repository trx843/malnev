import { IEntity } from "../interfaces";
import { description, IdType, Nullable } from "../types";
import { zeroGuid } from "../utils";
import { SiEquipment } from "./SiEquipment";
import { TechPositions } from "./TechPositions";

export class SiEquipmentLimits implements IEntity {
  id: IdType = zeroGuid;

  @description("Тип")
  siTypeFullName: string = "";

  @description("Имя")
  siName: string = "";

  @description("Модель СИ")
  siModelName: string = "";

  @description("Заводской номер")
  manufNumber: string = "";

  @description("По инструкции")
  limitManual: string = "";

  @description("По методике измерений")
  limitMet: string = "";

  @description("По типу")
  limitType: string = "";

  @description("По поверке")
  limitValid: string = "";

  techLimits: Array<TechPosLimits>;
  siEqLimits: Array<SiLimits>;
  siknLimits: Array<SiknLimits>;
  siTypeMeasurement: string;

  owned: boolean;
  @description("Когда изменено")
  changeDate: Nullable<Date> = new Date();
  @description("Кем изменено")
  changedBy: string = "";

  @description("Количество знаков после запятой для СИ")
  digitsAfterDot: number;
  techPosId: number;
  techPosName: String;
}

export class SiLimits {
  id: IdType;
  siLimitTypeId: number;

  siLimitTypeName: string;

  lowerLimit: Nullable<number>;

  upperLimit: Nullable<number>;
  siId: IdType;

  siTypeMeasurement: string;
  upperHasChanged: boolean;
  lowerHasChanged: boolean;
}

export class TechPosLimits {
  @description("Идентификатор записи")
  id: IdType;
  siLimitTypeId: number;

  siLimitTypeName: string;
  @description("Нижняя граница")
  lowerLimit: Nullable<number>;
  @description("Верхняя граница")
  upperLimit: Nullable<number>;
  @description("Идентификатор ТП СИКН")
  techPositionId: IdType;

  siTypeMeasurement: string;
  upperHasChanged: boolean;
  lowerHasChanged: boolean;
}

export class SiknLimits {
  @description("Идентификатор записи")
  id: IdType;
  @description("Идентификатор ТП СИКН")
  techPositionId: number;
  @description("Идентификатор типа измерения")
  measureTypeID: number;
  @description("Тип границ")
  siLimitTypeID: number;
  @description("Верхняя граница")
  upperLimit: Nullable<number>;
  @description("Нижняя граница")
  lowerLimit: Nullable<number>;
  @description("Когда изменено")
  changeDate: Nullable<Date> = new Date();
  @description("Кем изменено")
  changedBy: string = "";

  siLimitTypeName: string;
  upperHasChanged: boolean;
  lowerHasChanged: boolean;
}

export class HistoryLimit implements IEntity {
  @description("Идентификатор записи")
  id: IdType;
  @description("Когда изменено")
  changeDate: Nullable<Date> = new Date();
  @description("Кем изменено")
  changedBy: string = "";
  @description("По методике")
  limitMet: string = "";
  @description("По инструкции")
  limitManual: string = "";
  @description("По типу")
  limitType: string = "";
  @description("По поверке")
  limitValid: string = "";
  @description("Единицы измерения")
  meas: string = "";
}
