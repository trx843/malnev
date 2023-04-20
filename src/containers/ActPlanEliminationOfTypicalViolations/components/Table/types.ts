import { ModalModes } from "components/ModalForAddingOrEditingEvent/constants";
import { ITypicalViolationValues } from "components/ModalForAddingOrEditingEvent/types";
import { Nullable } from "types";

export interface IModalForAddingOrEditingEventInfo {
  values: Nullable<ITypicalViolationValues>;
  visible: boolean;
  type: ModalModes;
}
