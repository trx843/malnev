export type IdentifiedViolationActViolationsDto = {
  id: string;
  serial: number;
  createdOn: string;
  violationText: string;
  pointNormativeDocuments: string;
  identifiedViolationsId: string;
};

export type IdentifiedViolationActDto = {
  id: string;
  createdOn: string;
  serial: number;
  siknLabRsuId: string;
  siknLabRsuName: string;
  classifficationTypeId: number;
  classifficationTypeName: string;
  isDuplicate: boolean;
  typicalViolationNumber: string;
  sourceRemark: string;
  areaOfResponsibility: string;
  specialOpinion: string;
  verificationActId: string;
  violations: IdentifiedViolationActViolationsDto[];
};

export type SourceRemarkDto = {
  id: number;
  label: string;
};
