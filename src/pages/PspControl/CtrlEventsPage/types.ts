import { IdType, Nullable } from "../../../types";

export interface CtrlEventsItem {
  id: IdType;
  forExecution: boolean;
  createdOn: Date;
  createdOnText: string;
  eventTypeName: string;
  ostName: string;
  pspName: string;
  verificationLevelName: string;
  checkTypeName: string;
  checkYear: Nullable<number>;
  isAcquaintance: boolean;
  link: string;
}

export enum CtrlEventHandleTypeEnum
    {
        /// <summary>
        /// Ознакомлен
        /// </summary>
        IsAcquaintance = 1,
        /// <summary>
        /// К исполнения 
        /// </summary>
        ForExecution,
        /// <summary>
        /// Ознакомлен и к исполнению
        /// </summary>
        IsAcquaintanceAndForExecution

    }