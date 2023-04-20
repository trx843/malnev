import { IEntity } from "../interfaces";
import { description, IdType, Nullable, String } from "../types";
import { pureDate, zeroGuid } from "../utils";

export class ControlMaintEvents implements IEntity {
  id: IdType = zeroGuid;
  eventTypeId: number;
  eventType: string;
  @description("Событие")
  controlMaintEventType: string = "";
  siId: IdType = zeroGuid;
  siModelName: String;
  siknId: number;
  @description("СИКН")
  siknFullName: String = "";
  ostId: number;
  ostName: String;
  @description("Тех. позиция")
  techPositionText: String = "";
  @description("Позиция в составе блока")
  positionInBlock: string = "";
  @description("Тип СИ")
  siTypeText: String = "";
  @description("Заводской номер СИ")
  manufNumber: String = "";
  @description("Плановая дата")
  planDate: Nullable<Date> = new Date();
  @description("Фактическая дата")
  factDate: Nullable<Date> = new Date();
  @description("Идентификатор Event Frame подтверждения")
  eventFrameId: String = "";
  @description("МСС")
  eventFrameExist: boolean = false;
  @description("Результат")
  resultsExistText: String = "";
  @description("Номер протокола")
  protocolNum: string;
  @description("Имя файла протокола поверки/КМХ")
  protocolFileName: String = null;
  protocolFileExist: Nullable<boolean>;
  @description("Найден файл протокола")
  protocolFileExistsText: String = "";
  @description("Загружены результаты КМХ или поверки")
  resultsExist: Nullable<boolean> = false;
  @description("Идентификатор Event Frame смены коэффициентов преобразования")
  coefChangeEventFrameId: String = "";
  @description("Изменены коэффициенты")
  coefChangeEventFrameText: String = "";
  @description("Признак что событие соответствует графику")
  graphOk: Nullable<number> = 0;
  @description("Соблюдение графика")
  graphOkText: String = "";
  @description("Признак того, что не нарушена периодичность")
  periodOk: Nullable<number> = 0;
  @description("Соблюдение периодичности")
  periodOkText: String = "";
  @description("Идентификатор технологической позиции")
  techPositionId: Nullable<number> = 0;
  @description("Примечание")
  note: string = "";

  controlResults: ControlResultsModel[];
  siName?: string;
  afPath?: string;

  valControlSi: number;
  valStanSi: number;
  standartType: string = "";
  standartModel: string = "";
  standartNumber: string = "";

  toirName: string;

  pspName: string;

  eventTypeResults: boolean;
  resultsFromImport: boolean;

  owned: boolean;
  controlResultsModel: Array<ControlResultsModel> = [new ControlResultsModel()];
  inPlan: boolean;
  siTypeId: Nullable<number> = 0;

  deltaText: String;

  vis_avg: Nullable<number>;

  dens_avg: Nullable<number>;

  t_avg: Nullable<number>;

  public static Default(): ControlMaintEvents {
    let result = new ControlMaintEvents();

    result.planDate = null;
    result.factDate = null;
    result.siknFullName = null;
    result.eventFrameId = null;
    result.coefChangeEventFrameId = null;
    result.coefChangeEventFrameText = null;
    result.protocolFileExist = null;
    result.protocolFileExistsText = null;
    result.graphOk = null;
    result.graphOkText = null;
    result.periodOk = null;
    result.periodOkText = null;
    result.resultsExist = null;
    result.resultsExistText = null;
    result.techPositionId = null;
    result.techPositionText = null;
    result.siTypeText = null;
    result.manufNumber = null;
    result.siTypeId = null;
    result.deltaText = null;

    return result;
  }

  public static InitTechPos(nodeId: number): ControlMaintEvents {
    let result = new ControlMaintEvents();
    result.techPositionId = nodeId;
    result.planDate = null;
    result.factDate = null;
    result.siknFullName = null;
    result.eventFrameId = null;
    result.coefChangeEventFrameId = null;
    result.coefChangeEventFrameText = null;
    result.protocolFileExist = null;
    result.protocolFileExistsText = null;
    result.graphOk = null;
    result.graphOkText = null;
    result.periodOk = null;
    result.periodOkText = null;
    result.resultsExist = null;
    result.resultsExistText = null;
    result.techPositionText = null;
    result.siTypeText = null;
    result.manufNumber = null;
    result.siTypeId = null;
    result.deltaText = null;

    return result;
  }
}

export class ControlResultsModel implements IEntity {
  id: string = zeroGuid;
  number: string;
  ost: string = "";
  toirArea: string = "";
  areaName: string = "";
  objectName: string = "";
  positionInBlock: string = "";
  siType: string = "";
  siDescription: string = "";
  siNumber: string = "";
  interval: string = "";
  planDate: Date = new Date();
  factDate: Date = new Date();
  protocolNum: string = "";
  eventType: string = "";
  qj: number;
  kj: number;
  kjCalc: number;
  delta: number;
  valControlSi: number;
  valStanSi: number;
  standartType: string = "";
  standartModel: string = "";
  standartNumber: string = "";
  tj: number;
  pjpr: number;
  vj: number;
  pj: number;
  note: string = "";
  year: number;
  createdOn: Date = new Date();
  fileName: string = "";
  techPositionId: number;
  siId: string = zeroGuid;
  controlMaintEventId: string = zeroGuid;
  eventTypeId: number;
  siTypeId: number;
  deltaText: String;
}
