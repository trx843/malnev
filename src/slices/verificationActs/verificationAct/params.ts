export interface ViolationDtoParams {
  id?: string;
  areaOfResponsibility: string;
  сlassifficationTypeId: number;
  identifiedViolationsId: number;
  siknLabRsuId: string;
  isDuplicate: boolean;
  pspFullName: string;
  sourceRemark: string;
  specialOpinion: string;
  typicalViolationNumber: number;
  verificationActId: string;
  serial: number;
  violations: {
    serial: number;
    violationText: string;
    pointNormativeDocuments: string;
  }[];
}

export interface CommissionsDtoParams {
  id?: string;
  organizationName: string;
  jobTitle: string;
  fullName: string;
  serial: number;
}

export interface RecommendationDtoParams {
  id?: string;
  serial: number;
  recommendationsText: string;
  verificationActId: string;
}

export interface OtherPartDtoParams {
  id?: string;
  serial: number;
  verificationActId: string;
  ostRnuPspId: string;
  ctoName: string;
  partyName: string;
}

export interface ReportDtoParams {
  id?: string;
  serial: number;
  pageCount: number;
  name: string;
  verificationActId: string;
}
