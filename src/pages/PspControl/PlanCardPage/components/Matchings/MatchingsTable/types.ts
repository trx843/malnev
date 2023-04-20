import { Nullable } from "types";
import { ModalModes } from "../../ModalForAddingOrEditingEvent/constants";

export interface IModalForAddingOrEditingEventInfo {
  recommendation: Nullable<any>;
  visible: boolean;
  type: ModalModes;
}
