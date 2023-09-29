import { ExtendTimeEnum } from "../enums";
import { IEntity } from "../interfaces";
import { description, Nullable, String } from "../types";
import { pureDate, zeroGuid } from "../utils";
import { MssEventSecurityLevel } from "./MssEventSecurityLevel";

export class EventItem implements IEntity {
  id: string = zeroGuid;
  siknId: Nullable<number>;

  @description("Начало")
  startDateTime: Date = pureDate(new Date());

  @description("Окончание")
  endDateTime: Nullable<Date> = pureDate(new Date());

  @description("СИКН")
  sikn: string = "";

  @description("Тех. позиция")
  techposition: string = "";

  @description("Событие")
  eventName: string = "";

  @description("Назначение")
  purpose: string = "";
  
  @description("Владелец")
  owner: string = "";

  @description("Риск")
  riskRatio: number = 0;  

  @description("СИКН")
  siknFullName: string = "";  

  @description("ПСП")
  pspName: string = "";

  @description("ПСП")
  receivingPoint: string = "";

  @description("Технологическая позиция")
  techPositionName: string = "";  

  @description("Идентификатор технологической позиции")
  techPositionId: Nullable<number> = 0;  

  @description("Идентификатор СИ")
  siId: String = zeroGuid;

  @description("Идентификатор события МКО ТКО")
  mssEventTypeId: number = 0;

  @description("Тип события МКО ТКО")
  mssEventTypeName: string = "";

  @description("Критичность")
  mssEventSeverityLevelName: string = "";

  mssEventSeverityLevels: MssEventSecurityLevel = {
    id: 0,
    shortName: "н/д",
    color: "000000",
  };

  @description("Достоверность")
  resultQualityID: Nullable<number> = 0;

  @description("Достоверность")
  resultQualityShortName: string = "";

  isAcknowledged: number = 0;

  @description("Признак квитирования")
  isAcknowledgedStatus: string = "";

  @description("Комментарий")
  comment: string = "";

  @description("Время квитирования")
  acknowledgedTimestamp: Nullable<Date> = pureDate(new Date());

  @description("Кем было квитировано")
  acknowledgedBy: string = "";
  
  mssEventSeverityLevelId: number = 0;
  afPath: string;
  attributeNameList: Array<string>;
  customTrendFormName: Nullable<string>;
  orgStructTrendName: Nullable<string>;
  rootPathType: string;

  afServerName: string;
  owned: boolean;
  useInReports: boolean;
  extendTime: ExtendTimeEnum = ExtendTimeEnum.Extend;

  public static Default() {
    let event = new EventItem();
    event.attributeNameList = [];
    return event;
  }
}
