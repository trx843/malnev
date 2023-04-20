import { IEntity } from "../interfaces";
import { description, IdType } from '../types';


export class SiknRsu implements IEntity {
    
    id: IdType = 0;
    
    @description("СИКН")
    fullName: string = "";

    ostId: number;
    ostName: string;
}  