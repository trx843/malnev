import { Nullable } from "types";
import { TypesOfOperations } from "../ModalOfOperations/constants";

export interface IVerificationInformationInfo {
  id: string;
  title: string;
}

export interface IModalOfOperationsInfo {
  violation: Nullable<any>;
  visible: boolean;
  typeOfOperation: TypesOfOperations;
}
