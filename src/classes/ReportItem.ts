import { IEntity } from '../interfaces';
import {  String } from "../types";
import { zeroGuid } from '../utils';

export class ReportItem implements IEntity {
    id: string = zeroGuid;
    route: string = '';
    name: string = '';
    featureId: String = '';
    url: string = '';
}