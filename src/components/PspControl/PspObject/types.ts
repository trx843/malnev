import { IdType } from "../../../types";
import { OsusItem } from "./classes";

export interface IPspObject {
  id: IdType;
  ostName: string;
  rnuName: string;
  pspFullName: string;
  pspOwner: string;
  pspAffiliation: string;
  pspOwned: string;
  pspPurpose: string;
  osus: OsusItem[];
  bdmiStatus: boolean;
}

export interface IVerificationObject {
  id: IdType;
  checkType: string;
  verificationLevel: string;
  verificationDate: Date;
  verificationSchedulesId: string;
  actId: string;
  planId: string;
  actName: string;
  planName: string;
  verificationSchedulesName: string;
}
