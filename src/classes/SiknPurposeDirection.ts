import { IEntity } from "../interfaces";
import { description } from '../types';


export class SiknPurposeDirection implements IEntity {
    @description('Идентификатор')
    id: number = 0;
    @description('Прием или сдача')
    direction: string = '';
}