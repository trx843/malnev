import { IEntity } from "../interfaces";
import { description } from '../types';


export class TOiRRegion implements IEntity {
    @description('Идентификатор')
    id: number = 0;
    @description('Идентификатор ОСТа')
    ostId: number = 0;
    @description('Краткое наименование')
    shortName: string = '';
}  

