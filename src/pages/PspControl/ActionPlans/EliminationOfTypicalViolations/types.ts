import { ITypicalViolationValues } from "components/ModalForAddingOrEditingEvent/types";
import { ModalModes } from "enums";
import { ITypicalViolationsForPlanCardWithActionPlanModel } from "slices/pspControl/actionPlanTypicalViolations/types";
import { Nullable } from "types";
import { IFormValues } from "./components/ModalPlanEditing/types";

export interface IModalPlanEditingInfo {
  payload: Nullable<IFormValues>;
  visible: boolean;
  mode: ModalModes;
}

export interface IViolationEditingModalInfo {
  violationId: Nullable<string>;
  visible: boolean;
  mode: ModalModes;
  violationValues: any;
}

export type HandleViolationEditingModalInfo = (
  violationId: Nullable<string>,
  mode: ModalModes,
  violationValues: any
) => void;

export interface ISortingViolationsModalInfo {
  payload: ITypicalViolationsForPlanCardWithActionPlanModel[];
  visible: boolean;
}

export type HandleSetSortingViolationsModalInfo = (
  payload: ITypicalViolationsForPlanCardWithActionPlanModel[]
) => void;

export interface IModalForAddingOrEditingEventInfo {
  payload: Nullable<ITypicalViolationValues>;
  visible: boolean;
  type: ModalModes;
}

export type HandleSetModalForAddingOrEditingEventInfo = (
  payload: Nullable<ITypicalViolationValues>,
  type: ModalModes
) => void;
