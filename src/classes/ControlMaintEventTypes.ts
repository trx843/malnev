import { IEntity } from "../interfaces";
import { description } from '../types';


export class ControlMaintEventTypes implements IEntity {
    @description('Идентификатор вида расчетного метода')
    id: number = 0;
    @description('Название')
    shortName: string = '';
    @description('Результат')
    results: boolean = false;
}