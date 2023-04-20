import { AcknowledgedStatus } from "../../enums";

export interface GetEventsCardParams {
  userId: string;
  page: number;
}

export interface GetEventsCardFilterBody {
  startTime: string;
  endTime: string;
  type?: number;
  level?: number;
  acknowledge?: AcknowledgedStatus;
}
