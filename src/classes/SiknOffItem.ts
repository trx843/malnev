import { ExtendTimeEnum } from "../enums";
import { IEntity } from "../interfaces";
import { description, IdType, Nullable, String } from "../types";
import { pureDate, zeroGuid } from "../utils";

export class SiknOffItem implements IEntity {
  id: string = zeroGuid;
  controlDirId: number = 1;
  @description("СИКН")
  siknFullName: string = "СИКН ";
  siknNumber: number = -1;
  controlDirFullName: string = "";
  send: string;
  receive: string;
  toInspection: String;
  eventFrameID: string = zeroGuid;
  @description("Дата начала")
  startDateTime: Date = new Date();
  duration: Nullable<number> = 0;
  @description("Продолжительность чч:мм")
  durationText: String = "";
  durationHour: Nullable<number> = 0;
  durationMinute: Nullable<number> = 0;
  @description("Дата окончания")
  endDateTime: Nullable<Date> = new Date();
  rsuId: Nullable<number> = 0;
  @description("РСУ")
  rsuName: String = "";
  calcMethodId: Nullable<number> = 0;
  stopReasonId: Nullable<number> = 0;
  stopReasonText: String = "";
  @description("МСС")
  eventFrameExist: Nullable<boolean> = false;
  actExist: boolean = false;
  isInvestigateActExist: boolean = false;
  investigateActReference: String = "";
  investigateActExist: String = "";
  @description("График")
  inPlanSiknOff: Nullable<boolean> = false;
  actNum: Nullable<number> = 0;
  actReference: String = "";
  actInfoDate: Nullable<Date> = pureDate(new Date());
  actInfoSource: String = "";
  @description("В отчёте")
  useInReports: boolean = true;
  hiddenBy: String = "";
  hiddenTimestamp: Nullable<Date> = pureDate(new Date());
  massStart: Nullable<number> = 0;
  volumeStart: Nullable<number> = 0;
  mass: Nullable<number> = 0;
  volume: Nullable<number> = 0;
  @description("Признак квитирования")
  isAcknowledged: boolean = true;
  comment: String = "";
  planSiknOffId: String = "";
  askidConfirmed: Nullable<number>;
  elisConfirmed: Nullable<number>;
  @description("Подтверждение по АСКИД")
  askidConfirmedText: String = "";
  @description("Подтверждение по ЕЛИС")
  elisConfirmedText: String = "";
  differenceReason: String = "";

  owned: boolean;

  withFile: boolean = false;

  rsuDuration: Nullable<number> = 0;

  rsuDurationText: string = "";
  @description("Продолжительность работы СИКН на резервной системе учета Часы")
  rsuDurationHours: Nullable<number> = 0;
  @description(
    "Продолжительность работы СИКН на резервной системе учета Минуты"
  )
  rsuDurationMinutes: Nullable<number> = 0;

  normalOperation: String = "";

  remark: String = "";

  recommendations: String = "";

  investigationAct: InvestigationAct;

  siknOffAct: SiknOffAct;

  actFileReference: Nullable<IdType>;

  investigateActFileReference: Nullable<IdType>;
  isDiffPeople: boolean;

  attributeNameList: Array<string>;
  afPath: String;
  afServerName: String;
  customTrendFormName: String;
  rootPathType: string;

  extendTime: ExtendTimeEnum = ExtendTimeEnum.Extend;

  public static Default(nodeId: number): SiknOffItem {
    let result = new SiknOffItem();

    result.controlDirId = nodeId;
    result.duration = null;
    result.rsuId = null;
    result.rsuName = null;
    result.calcMethodId = null;
    result.stopReasonId = null;
    result.stopReasonText = null;
    result.eventFrameExist = null;
    result.actNum = null;
    result.actReference = null;
    result.actInfoDate = null;
    result.actInfoSource = null;
    result.hiddenBy = null;
    result.hiddenTimestamp = null;
    result.massStart = null;
    result.volumeStart = null;
    result.mass = null;
    result.volume = null;
    result.investigateActReference = null;
    result.investigateActExist = null;
    result.comment = null;
    result.planSiknOffId = null;
    result.askidConfirmed = null;
    result.elisConfirmed = null;
    result.normalOperation = null;
    result.remark = null;
    result.rsuDuration = null;
    result.askidConfirmedText = null;
    result.elisConfirmedText = null;
    result.toInspection = null;
    result.siknOffAct = {
      offSendPeople: [{ fio: "", post: "" }],
      offReceivePeople: [{ fio: "", post: "" }],
      offToPeople: [{ fio: "", post: "" }],
      onSendPeople: [{ fio: "", post: "" }],
      onReceivePeople: [{ fio: "", post: "" }],
      onToPeople: [{ fio: "", post: "" }],
    };
    result.differenceReason = null;
    return result;
  }
}

export type MemberType = {
  post: string;
  fio: string;
};
export type SiknOffEventsType = {
  content: String;
  date: Nullable<Date>;
  performers: Array<MemberType>;
  notes: String;
};

export class SiknOffPosts implements IEntity {
  @description("Идентификатор должности")
  id: string = zeroGuid;
  @description("Наименование должности")
  name: string = "";
}

export class InvestigationActInfo {
  reconcilingPosts: Array<SiknOffPosts>;
  approverPosts: Array<SiknOffPosts>;
  commissionChairmanPosts: Array<SiknOffPosts>;
  commissionMembersPosts: Array<SiknOffPosts>;
  performersPosts: Array<SiknOffPosts>;
  reconciling: MemberType;
  approver: MemberType;
  commissionChairman: MemberType;
  commissionMembers: Array<MemberType>;
  events: Array<SiknOffEventsType>;
}

export class InvestigationAct {
  reconcilingPost: string = "";

  reconcilingFio: string = "";

  approverPost: string = "";

  approverFio: string = "";

  commissionChairmanPost: string = "";

  commissionChairmanFio: string = "";

  commissionMembers: Array<MemberType> = [{ fio: "", post: "" }];

  siknOffEvents: Array<SiknOffEventsType> = [
    {
      content: "",
      date: pureDate(new Date()),
      performers: [{ fio: "", post: "" }],
      notes: "",
    },
  ];
}

export class SiknOffActInfo {
  receivePosts: Array<SiknOffPosts>;
  toPosts: Array<SiknOffPosts>;
  sendPosts: Array<SiknOffPosts>;
  offSendPeople: Array<MemberType>;
  offReceivePeople: Array<MemberType>;
  offToPeople: Array<MemberType>;
  onSendPeople: Array<MemberType>;
  onReceivePeople: Array<MemberType>;
  onToPeople: Array<MemberType>;
}

export class SiknOffAct {
  offSendPeople: Array<MemberType> = [{ fio: "", post: "" }];
  offReceivePeople: Array<MemberType> = [{ fio: "", post: "" }];
  offToPeople: Array<MemberType> = [{ fio: "", post: "" }];
  onSendPeople: Array<MemberType> = [{ fio: "", post: "" }];
  onReceivePeople: Array<MemberType> = [{ fio: "", post: "" }];
  onToPeople: Array<MemberType> = [{ fio: "", post: "" }];
}
