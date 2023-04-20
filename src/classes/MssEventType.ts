import { description } from "../types";

export class MssEventType {
    id: number = 0;
    @description('Тип события')
    shortName: string = '';
    mssEventSeverityLevelId: number;
    @description('Критичность')
    mssEventSeverityLevelStr: string = '';
    efTemplate: string;
    eventFrameId: null;
    eventGroupId: number;
    eventSubGroupId: number;
    @description('Риск')
    riskRatio: number = 0;
};