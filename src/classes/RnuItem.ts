import { IEntity } from "../interfaces";
import { apiquery, boundId, description, propName, String} from '../types';
import { apiBase } from "../utils";

export class RnuItem implements IEntity {
    @description('Идентификатор ПСП')
    id: number = 0;
    @description('Идентификатор ОСТ')
    ost_Id: number = 0;
    @description('Наименование ОСТ')
    @apiquery(`${apiBase}/osts`)
    @boundId('ost_Id')
    @propName('fullName')
    ostName: String = '';
    @description('Порядок отображения в отчётах/формах')
    sortOrder: number = 0;
    @description('Полное наименование')
    fullName: string = '';
    @description('Краткое наименование')
    shortName: string = '';
}


        