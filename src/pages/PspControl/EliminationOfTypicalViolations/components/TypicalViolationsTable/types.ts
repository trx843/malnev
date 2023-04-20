import { Nullable } from "types";

export interface IVerificationInformationInfo {
  id: string;
  title: string;
}

export interface IModalAddValidationInformationInfo {
  visible: boolean;
  typicalViolation: Nullable<any>;
}
