import { AddActionPlanDtoType } from "./dto-types";
import { Moment } from "moment";

export interface TypicalActionPlanParams
  extends Omit<AddActionPlanDtoType, "eliminatedOn"> {
  eliminatedOn: Moment;
}
