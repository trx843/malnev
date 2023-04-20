import { IEntity } from "../interfaces";
import { description } from '../types';


export class SiLimitsTypes implements IEntity {
    @description('Идентификатор')
    id: number = 0;
    @description('Краткое название')
    shortName: string = '';
    @description('Признак принадлежности техпозиции')
    isTechPositionLimit: boolean = false;
    @description("Признак типа диапазона СИКН")
    isSIKNLimit: boolean = false;
}  
