import { IViolationValues } from "components/ModalForAddingOrEditingEvent/types";
import { Nullable } from "types";
import { ModalModes } from "../ModalForAddingOrEditingEvent/constants";

export interface IModalForAddingOrEditingEventInfo {
  values: Nullable<IViolationValues>;
  visible: boolean;
  type: ModalModes;
}
