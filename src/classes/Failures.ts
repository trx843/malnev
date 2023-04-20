import { ExtendTimeEnum } from "../enums";
import { IEntity } from "../interfaces";
import { description, IdType, Nullable, String } from "../types";
import { pureDate, zeroGuid } from "../utils";

export class Failures implements IEntity {
  @description("Уникальный идентификатор отключения")
  id: string = zeroGuid;

  @description("Идентификатор СИКН")
  siknId: number = 0;

  @description("СИКН")
  siknFullName: string = "";
  @description("Идентификатор СИ")
  siId: Nullable<IdType>;

  @description("Дата начала")
  startDateTime: Nullable<Date> = new Date();

  @description("Дата окончания")
  endDateTime: Nullable<Date> = pureDate(new Date());

  @description("Идентификатор технологической позиции")
  techPositionId: Nullable<number> = 0;

  @description("Технологическая позиция")
  techPositionName: String = "";

  @description("Идентификатор события в AF")
  eventFrameId: Nullable<number> = 0;

  @description("МСС")
  eventFrameExist: boolean = false;
  @description("Достоверность ID")
  resultQualityID: Nullable<number> = 0;
  @description("Достоверность")
  resultQualityShortName: string = "";

  @description("Учитывать в отчётах")
  useInReports: boolean = true;

  @description("Идентфикатор типа признака отказа (МСС)")
  mssFailureTypeId: number;

  @description("Тип признака отказа")
  mssFailureTypeName: String = "";

  @description("Признак квитирования")
  isAcknowledged: boolean = true;

  @description("Комментарий при квитировании")
  comment: String = "";

  @description("Время квитирования")
  acknowledgedTimestamp: Nullable<Date> = pureDate(new Date());

  @description("Кем было квитировано")
  acknowledgedBy: String = "";

  @description("Дата обнаружения отказа")
  appearDate: Nullable<Date> = pureDate(new Date());

  @description("Дата устранения отказа")
  fixDate: Nullable<Date> = pureDate(new Date());

  @description("Краткие сведения об отказе")
  shortInfo: String = "";

  @description("Сведения об отказе")
  fullInfo: String = "";

  @description("Последствия отказа (идентификатор)")
  failureConsequencesIdList: Array<number>;

  @description("Последствия отказа")
  failureConsequencesName: String = "";

  @description("Этап работ, на котором обнаружен отказ (идентификатор)")
  sequenceId: Nullable<number> = 0;

  @description("Этап работ, на котором обнаружен отказ")
  sequenceName: String = "";

  @description("Код отказа (идентификатор)")
  failureReportCodeId: Nullable<number> = 0;

  @description("Код отчета об отказе")
  failureReportCodeName: String = "";

  @description("Принятые меры")
  measuresTaken: String = "";

  @description("Краткое описание принятых мер")
  shortMeasuresTaken: String = "";

  @description("Не учитывать по причине")
  dontUseInReportsComment: String = "";

  afPath: string;
  attributeNameList: Array<string>;
  customTrendFormName: Nullable<string>;
  afServerName: string;
  owned: boolean;
  rootPathType: string;

  siCompName;

  isDate: boolean;

  extendTime: ExtendTimeEnum = ExtendTimeEnum.Extend;

  @description("Идентификатор зоны ответственности")
  responsibilityAreaId: Nullable<number> = 0;

  @description("Зона ответственности")
  failureResponsibilityAreaText: String = "";

  public static InitTechPos(techPosId: number): Failures {
    let result = new Failures();
    result.techPositionId = techPosId;

    result.endDateTime = null;
    result.techPositionName = null;
    result.eventFrameId = null;
    result.mssFailureTypeName = null;
    result.comment = null;
    result.appearDate = null;
    result.fixDate = null;
    result.shortInfo = null;
    result.fullInfo = null;
    result.failureConsequencesIdList = [];
    result.failureConsequencesName = null;
    result.sequenceId = null;
    result.sequenceName = null;
    result.failureReportCodeId = null;
    result.failureReportCodeName = null;
    result.measuresTaken = null;
    result.shortMeasuresTaken = null;
    result.acknowledgedBy = null;
    result.acknowledgedTimestamp = null;
    result.responsibilityAreaId = null;
    result.failureResponsibilityAreaText = null;

    return result;
  }

  public static Default(): Failures {
    let result = new Failures();

    result.startDateTime = null;
    result.endDateTime = null;
    result.techPositionId = null;
    result.techPositionName = null;
    result.eventFrameId = null;
    result.mssFailureTypeName = null;
    result.comment = null;
    result.appearDate = null;
    result.fixDate = null;
    result.shortInfo = null;
    result.fullInfo = null;
    result.failureConsequencesIdList = [];
    result.failureConsequencesName = null;
    result.sequenceId = null;
    result.sequenceName = null;
    result.failureReportCodeId = null;
    result.failureReportCodeName = null;
    result.measuresTaken = null;
    result.shortMeasuresTaken = null;
    result.acknowledgedBy = null;
    result.acknowledgedTimestamp = null;
    result.responsibilityAreaId = null;
    result.failureResponsibilityAreaText = null;

    return result;
  }
}
