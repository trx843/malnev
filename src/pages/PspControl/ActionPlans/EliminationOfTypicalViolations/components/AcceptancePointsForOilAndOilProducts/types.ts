import { ModalModes } from "components/ModalForAddingOrEditingEvent/constants";
import { ITypicalViolationValues } from "components/ModalForAddingOrEditingEvent/types";
import { ITypicalViolationsForPlanCardWithActionPlanModel } from "slices/pspControl/actionPlanTypicalViolations/types";
import { Nullable } from "types";

export interface IModalForAddingOrEditingEventInfo {
  payload: Nullable<ITypicalViolationValues>;
  visible: boolean;
  type: ModalModes;
}

export interface ISortingViolationsModalInfo {
  payload: ITypicalViolationsForPlanCardWithActionPlanModel[];
  visible: boolean;
}
