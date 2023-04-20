import { Event } from "../../classes";
import { SiknRsuItem } from "../../classes/SiknRsuItem";
import { IAction } from "../../interfaces";
import { Nullable, PagedModel } from "../../types";
import RiskRatingInfoConstants from "./constants";

export function riskRatingInfoFetched(
  items: PagedModel<Event>
): IAction<RiskRatingInfoConstants.RRINFO_FETCHED, PagedModel<Event>> {
  return {
    type: RiskRatingInfoConstants.RRINFO_FETCHED,
    payload: items,
  };
}

export function siknSelected(
  sikn: Nullable<SiknRsuItem>
): IAction<RiskRatingInfoConstants.RRINFO_SIKN_SELECTED, Nullable<SiknRsuItem>> {
  return {
    type: RiskRatingInfoConstants.RRINFO_SIKN_SELECTED,
    payload: sikn,
  };
}
