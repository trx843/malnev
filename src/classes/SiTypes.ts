import { IEntity } from "../interfaces";
import { description, String } from '../types';


export class SiTypes implements IEntity {
    @description('Идентификатор')
    id: number = 0;
    @description('Краткое название')
    shortName: string = '';
    @description('Полное название')
    fullName: string = '';
    @description('Шаблон в модели AF')
    template: string = '';
    @description('Подлежит поверке КМХ')
    kmh: boolean = false;
    @description('Отображать ли СИ и техпозиции на форме ТО-КМХ (тип 0)')
    showToKmh: boolean = false;
    @description('Отображать ли СИ и техпозиции на форме изменения коэффициентов (тип 1)')
    showCoefficients: boolean = false;
    @description('Единицы измерения')
    measurement: String = '';
    @description('Является ли тип для СИ')
    isSiType: boolean = false;
}  

