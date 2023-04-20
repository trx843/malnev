import { IRecommendationValues } from "components/ModalForAddingOrEditingEvent/types";
import { Nullable } from "types";
import { ModalModes } from "../ModalForAddingOrEditingEvent/constants";

export interface IModalForAddingOrEditingEventInfo {
  values: Nullable<IRecommendationValues>;
  visible: boolean;
  type: ModalModes;
}
