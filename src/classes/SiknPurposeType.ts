import { IEntity } from "../interfaces";
import { description } from '../types';


export class SiknPurposeType implements IEntity {
    @description('Идентификатор')
    id: number = 0;
    @description('Тип')
    type: string = '';
}