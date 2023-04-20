import { Moment } from "moment";
import { AcquaintanceModelDto } from "../../../api/requests/pspControl/acquaintance/types";

export interface AcquaintanceCreateModel
  extends Omit<AcquaintanceModelDto, "createdOn"> {
  createdOn: Moment;
}
