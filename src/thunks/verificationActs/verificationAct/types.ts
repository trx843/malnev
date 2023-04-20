import {
  ActPage,
  CheckingObject
} from "../../../slices/verificationActs/verificationAct/types";
import { VerificationActSection } from "../../../containers/VerificationActs/VerificationAct/types";
import { OtherSideItem } from "../../../components/VerificationActs/VerificationAct/classes";

export interface ActAction {
  actId: string;
}

export interface SectionAction extends ActAction {
  sectionType: VerificationActSection;
}

export interface GetVerificationActPageParams {
  actId: string;
  force?: boolean;
}

export interface VerificationActSectionPageResponse {
  page: ActPage;
  actId: string;
}

export interface SetVerificationOsuItemThunk extends ActAction {
  data: CheckingObject;
}

export interface RemoveVerificationOsuItemThunkParams extends ActAction {
  id: string;
}

export interface RemoveVerificationOsuItemThunk extends SectionAction {
  id: string;
}

export interface AddVerificationOtherPartItemThunkParams extends ActAction {
  ostName: string;
}

export interface AddVerificationOtherPartItemThunkResponse extends ActAction {
  data: OtherSideItem;
}

export interface RemoveVerificationOtherPartItemThunkParams extends ActAction {
  id: string;
}

export interface RemoveVerificationOtherPartItemThunkResponse
  extends SectionAction {
  id: string;
}
