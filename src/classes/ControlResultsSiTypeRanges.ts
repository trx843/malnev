import { IEntity } from "../interfaces";
import { Nullable } from "../types";
import { zeroGuid } from "../utils";

export class ControlResultsSiTypeRanges implements IEntity {
  id: string = zeroGuid;
  eventType: Nullable<number>;
  siType: Nullable<number>;
  qjMin: Nullable<number>;
  qjMax: Nullable<number>;
  kjMin: Nullable<number>;
  kjMax: Nullable<number>;
  kjCalcMin: Nullable<number>;
  kjCalcMax: Nullable<number>;
  deltaMin: Nullable<number>;
  deltaMax: Nullable<number>;
  tjMin: Nullable<number>;
  tjMax: Nullable<number>;
  pjprMin: Nullable<number>;
  pjprMax: Nullable<number>;
  vjMin: Nullable<number>;
  vjMax: Nullable<number>;
  pjMin: Nullable<number>;
  pjMax: Nullable<number>;
  note: string;
  qjType: Nullable<number>;
  kjType: Nullable<number>;
  kjCalcType: Nullable<number>;
  deltaType: Nullable<number>;
  tjType: Nullable<number>;
  pjprType: Nullable<number>;
  vjType: Nullable<number>;
  pjType: Nullable<number>;
}
