import { zeroGuid } from "../utils";
import { Nullable, String } from "../types";
import {
  IFeature,
  IFeatureElements,
  IGroup,
  WebFeaturesTypes,
} from "../interfaces";

export class User {
  id: string = zeroGuid;
  sid: string = "";
  fullName: string = "";
  firstName: string = "";
  lastName: String = "";
  domain: string = "";
  login: string = "";
  eMail: string = "";
  hostName: string;
  hostNode: Nullable<boolean>;
  position: String = "";
  groupsList: IGroup[] = [];
  featuresList: IFeature[] = [];
  featureElementsList: IFeatureElements[] = [];
  webFeaturesTypes: WebFeaturesTypes = {
    userReportsList: [],
    cards: [],
    underUserNameList: [],
    special: [],
  };
  allowedOstIdsList: Array<string> = [];
  ignoreElementsSettings: Nullable<boolean>;
}
