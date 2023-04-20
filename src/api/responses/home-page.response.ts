import { IdType } from "types";

export type EventGroupCountType = {
    eventGroupId: IdType;
    count: number;
    isCountHasValues: boolean;
    criticalCount : number;
    isCritialCountHasValues: boolean;
};
