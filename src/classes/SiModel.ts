import { IEntity } from "../interfaces";
import { description, IdType } from '../types';


export class SiModel implements IEntity {
    
    id: IdType = 0;
    @description("СИКН")
    siknFullName: string = "СИКН ";
    
    @description("Модель СИ")
    shortName: string = "";

    siTypeId: number;
    @description("Тип СИ")
    siTypeName: string = '';

    @description("Номер в гос.реестре")
    grNumber: string = '';

    @description("Производитель модели СИ")
    manufacturer: string = '';

    @description("Дата изменения")
    changeDate: Date = new Date();
    @description("Архив")
    isArchival: boolean = false;
}  
