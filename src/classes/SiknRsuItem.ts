import { IEntity } from "../interfaces";
import { MssEventSecurityLevel } from "./MssEventSecurityLevel";
import { apiquery, boundId, description, IdType, Nullable, propName, String} from '../types';
import { apiBase } from "../utils";

export class SiknRsuItem implements IEntity {
    @description('Идентификатор СИКН')
    id: IdType = 0;
    @description('Полное наименование')
    fullName: string = '';
    @description('Короткое наименование')
    shortName: string = '';
    @description('Владелец')
    owner: string = '';
    @description('Принадлежность к Компании')
    ownerCompany_ID: number = 0;

    @description('Признак собственный')
    owned: boolean = false;



    @description('Идентификатор ОСТ')
    ostId: number = 0;

    @description('Наименование ОСТ')
    @apiquery(`${apiBase}/osts`)
    @boundId('ostId')
    @propName('fullName')
    ostName: String = '';

    mssEventSeverityLevel: MssEventSecurityLevel;
    criticalness: string;
    riskRatio: number;
    eventsRiskRatio: number;
    sumRiskRatio: number;
    maxSecurityLevel: number;
}
