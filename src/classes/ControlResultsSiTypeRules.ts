import { IEntity } from "../interfaces";
import { Nullable } from "../types";
import { zeroGuid } from "../utils";

export class ControlResultsSiTypeRules implements IEntity {
  id: string = zeroGuid;
  eventType: number;
  siType: number;
  qjRule: number;
  kjRule: number;
  kjCalcRule: number;
  deltaRule: number;
  tjRule: number;
  pjprRule: number;
  vjRule: number;
  pjRule: number;
  valControlSiRule: number;
  valStanSiRule: number;
  note: String;
}
