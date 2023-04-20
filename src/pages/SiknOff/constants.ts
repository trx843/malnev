export const SiknOffRoute = "/siknoff";
export enum SiknOffElements {
  SiknOffAdd,
  SIKNOffActData,
  InvestActData,
  SIKNOffSchedLoad,
  SIKNOffSchedCorrLoad,
  Export,
  PIVisionTrend,
  AttachToSIKN,
  AttachSIKNOffAct,
  AttachInvestAct,
  AttachSIKNOffActLink,
  AttachInvestActLink
}

export const elementId = (name: string): string => `${SiknOffRoute}${name}`;

