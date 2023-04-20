import { IEntity } from "../interfaces";
import { description } from '../types';


export class SuTypes implements IEntity {
    @description('Идентификатор')
    id: number = 0;
    @description('Тип')
    type: string = '';
    @description('Тип измерения')
    measureType: string = '';
}  

