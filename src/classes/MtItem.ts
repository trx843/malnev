import { IEntity } from '../interfaces';
import { description } from '../types';

export class MtItem implements IEntity {
    @description('Идентификатор МН/МНПП')
    id: number = -1;
    @description('Полное наименование')
    fullName: string = '';
    @description('Краткое наименование')
    shortName: string = '';
    @description('Идентификатор МТ по справочнику')
    refId: string = '';
}