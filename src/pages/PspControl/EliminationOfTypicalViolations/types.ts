import { IdType } from "types";
import { ModalConfirmationOfOperationsModes } from "./components/ModalConfirmationOfOperations/constants";

export interface IModalConfirmationOfOperationsInfo {
  visible: boolean;
  mode: ModalConfirmationOfOperationsModes;
}



export interface IModalForEliminateViolationInfoInfo {
  visible: boolean;
  violationsIds: IdType[];
}