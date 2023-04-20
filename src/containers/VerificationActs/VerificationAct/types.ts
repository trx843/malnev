export enum VerificationActSection {
  Commission = "commission",
  CompositionOfAppendicesToReport = "compositionOfAppendicesToReport",
  IdentifiedViolationsOrRecommendations = "identifiedViolationsOrRecommendations",
  NumberOneSide = "numberOneSide",
  OtherSides = "otherSides",
  Recommendations = "recommendations"
}

export enum VerificationActOptions {
  OSUS = "osus",
  AreaOfResponsibility = "areaOfResponsibility",
  ClassificationNumber = "classificationNumber",
  SourceViolations = "sourceViolations",
  CTO = "cto",
  InspectionType = "inspectionType",
  SourceRemark = 'sourceRemark',
}

export type CheckingObjectCard = {
  id: string;
  createdOn: string;
  verificatedOn: string;
  inspectedType: string | null;
  verificationPlace: string;
  ostName: string;
  filial: string;
  psp: string;
  pspAffiliation: string | null;
  pspOwned: string;
  verificationSchedulesId: string;
  verificationStatus: string;
};
