import { IEntity } from "../interfaces";
import { description, IdType, Nullable } from "../types";
import { pureDate, zeroGuid } from "../utils";
import { SiLimits, TechPosLimits } from "./SiEquipmentLimits";

export class DataSi implements IEntity {
  @description("Идентификатор записи")
  id: IdType = zeroGuid;
  @description("Имя СИ")
  siName: string = "";
  siTypeId: IdType;
  @description("Идентификатор СИ в ПиКТС")
  piKtsRef: string = "";
  @description("Год выпуска")
  manufYear: number = 0;
  manufYearDate: Date;
  installDate: Nullable<Date> = new Date();
  @description("Дата ввода в эксплуатацию")
  installDateText: string = "";
  @description("Тип СИ")
  siTypeName: string = "";
  siModelId: Nullable<IdType> = 1;
  @description("Модель СИ")
  siModelName: string = "";
  @description("Заводской номер СИ")
  manufNumber: string = "";
  @description("Интервал между КМХ")
  intervalKmh: Nullable<number> = 0;
  @description("Интервал между поверками")
  intervalPov: Nullable<number> = 0;
  @description("Код по ОР-17.120.00-КТН-159-16")
  reglamentCode: number = 0;
  @description("Интервал между ТО-3, дни")
  intervalTo3: Nullable<number> = 0;

  isBinding: boolean;

  treeId: string;
  @description("Архив")
  isArchival: Nullable<boolean> = false;

  public static Default(): DataSi {
    let result = new DataSi();

    result.intervalKmh = null;
    result.intervalPov = null;
    result.siModelId = null;
    result.intervalTo3 = null;
    result.isArchival = null;

    return result;
  }
}

export class DataSiInfo implements IEntity {
  @description("Идентификатор СИ")
  id: IdType = zeroGuid;
  @description("Тип СИ")
  siTypeName: string = "";
  @description("Имя СИКН")
  siknFullName: string;
  @description("Заводской номер СИ")
  siManufactureNumber: string = "";
  @description("Год выпуска")
  siManufactureYear: number = 0;
  @description("Модель СИ")
  siModel: string = "";
  @description("Дата ввода в эксплуатацию")
  installDate: Date = new Date();
  @description("Идентификатор СИ в ПиКТС")
  piKTSRef: string = "";
  @description("Код по ОР-17.120.00-КТН-159-16")
  reglamentCode: number;
  @description("Фактическая дата КМХ")
  factDateKmh: Date = new Date();
  @description("Плановая дата КМХ")
  planDateKmh: Date = new Date();
  @description("Фактическая дата по поверке")
  factDateValid: Date = new Date();
  @description("Плановая дата по поверке")
  planDateValid: Date = new Date();
  @description("Фактическая дата по ТО3")
  factDateTo3: Date = new Date();
  @description("Плановая дата по ТО3")
  planDateTo3: Date = new Date();
  @description("Время начала отказа")
  failuresStartDateTime: Date = new Date();
  @description("Время окончания отказа")
  failuresEndDateTime: Date = new Date();
  @description("Текст типа признака отказа")
  typeRefuseText: string = "";
  @description("Признак Учитывать в отчетах")
  useInReports: boolean;
  @description("Признак квитирования")
  isAcknowledged: boolean;
  @description("Дата последнего изменения коэффициентов")
  koefDateChange: Date = new Date();
  @description("наименование СИ")
  siFullName: string = "";
  @description("Признак в графике")
  graphOk: boolean;
  @description("Признак поверки")
  controlMaintExits: boolean;
  @description("Дата фиксации")
  fixedDate: Date = new Date();
  @description("Наработка")
  worktime: string;
  @description("Технологическая позиция")
  techPos: string = "";
  @description("")
  eventFrameExist: boolean;

  techLimits: Array<TechPosLimits>;
  siEqLimits: Array<SiLimits>;
}
