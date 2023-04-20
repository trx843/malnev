import { IEntity } from "../interfaces";
import { description } from '../types';


export class CalcMethod implements IEntity {
    @description('Идентификатор вида расчетного метода')
    id: number = 0;
    @description('Вид расчетного метода')
    name: string = '';
}