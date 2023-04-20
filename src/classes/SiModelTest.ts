import { IEntity } from "../interfaces";
import { description, IdType } from "../types";
import { pureDate, zeroGuid } from "../utils";

export class SiModelTest implements IEntity {
    @description('Идентификатор записи')
    id: IdType = zeroGuid;
    @description('Краткое название')
    shortName: string = '';
    @description('Тип СИ')
    siTypeId: IdType = zeroGuid;
    @description('Номер в гос. реестре')
    grNumber: number = 0;
    @description('Производитель')
    manufacturer: string = '';
    @description('Дата и время последнего изменения')
    changeDate: Date = pureDate(new Date());
    @description('Кем внесено')
    changedBy: string = '';
    @description('Является ли архивной')
    isArchival: boolean = false;
}