import { PageInfo } from "types";
/**
  *
 * Пагинированная коллекция
 */
export type AcquaintancePagedModel = {
  /**
   * Срез
   */
  entities: AcquaintanceItem[];
  /**
   * Страница
   */
  pageInfo: PageInfo
};


export type AcquaintanceItem = {
  verificationLevel: string;
  verificationLevelId: number;
  verificationType: string;
  dateAct: string;
  ostName: string;
  psp: string;
  actUrl: string;
  planUrl: string;
  acquainted: string;
  verificationActId: string;
  verificationPlanId: string;
};

export type AcquaintanceVerificationAct = {
  id: string;
  acquaintanceDate: string;
  fullName: string;
  jobTitle: string;
  acquaintedWithAct: string;
  acquaintedWithPlan: string;
}

export type AcquaintanceVerificationActResponse = AcquaintanceVerificationAct[]

export type AcquaintanceModelDto = {
  createdOn: string;
  isAct: boolean;
  isPlan: boolean;
  verificationActId: string;
  verificationPlanId: string;
}
