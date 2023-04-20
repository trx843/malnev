import { AcknowledgedStatus } from "../../enums";

export interface GetCtrlEventsCardParams {
  userId: string;
  page: number;
}

export interface GetCtrlEventsCardFilterBody {
  startTime: string;
  endTime: string;
  type?: number;
  forExecution: boolean;
  onlyRead: boolean;
}
