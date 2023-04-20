import { IEntity } from '../interfaces';
import { description } from '../types';

export class OstItem implements IEntity {
    @description('Идентификатор ОСТ')
    id: number = -1;
    @description('Порядок отображения в отчётах/формах')
    sortOrder: number = -1;
    @description('Полное наименование')
    fullName: string = '';
    @description('Краткое наименование')
    shortName: string = '';
}