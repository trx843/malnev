import {
    ObjectElementsType,
    ObjectType,
    ResponseDeleteParamType,
    ResponseItemsType,
    ResponseObjectType,
    ResponseParamType,
    SelectItemsType,
} from "api/responses/iotspd";
import axios from "axios";
import { apiBase } from "utils";

const BASE_URL = `${apiBase}/tspd`;

export const iotspdApi = {
    getTreeData() {
        return axios.get<Array<ObjectType>>(`${apiBase}/SqlTree?viewName=TspdObjectTree`);
    },
    getObjectElements(tspdTreeKey: string) {
        return axios.get<ObjectElementsType>(`${BASE_URL}/codes?tspdTreeKey=${tspdTreeKey}`);
    },
    getObjectItems() {
        return axios.get<ResponseItemsType>(`${BASE_URL}/object/items`);
    },
    getParams(filters: ObjectElementsType) {
        return axios.post<Array<ParamType>>(`${BASE_URL}/params`, filters);
    },
    getParamItems() {
        return axios.get<ResponseItemsType>(`${BASE_URL}/param/items`);
    },
    addParam(newParam: NewObjectType) {
        return axios.post<ResponseParamType>(`${BASE_URL}/params/add`, newParam);
    },
    updateParam(param: ParamType, paramId: string) {
        return axios.put<ResponseParamType>(`${BASE_URL}/params/update?paramId=${paramId}`, param);
    },
    deleteParam(paramId: string) {
        return axios.delete<ResponseDeleteParamType>(`${BASE_URL}/params/delete?paramId=${paramId}`);
    },
    getToNumList(toType: string) {
        return axios.get<Array<SelectItemsType>>(`${BASE_URL}/object/tonum?toType=${toType}`);
    },
    updateObject(object: UpdateObjectType) {
        return axios.put<ResponseObjectType>(`${BASE_URL}/object/update`, object);
    },
    getShortObjectCode(tspdTreeKey: string) {
        return axios.get<string>(`${BASE_URL}/shortcode?tspdTreeKey=${tspdTreeKey}`);
    },
};

export type NewObjectType = {
    paramList: Array<NewParamType>,
    ost: number,
    rnu: number,
    po: number,
    mt: number,
    uchMt: number,
    routeType: string,
    routenum: number,
    toType: string,
    toNum: number,
    saType: number,
    saTransmitterType: string,
    saTransmitterNum: number,
    tbType: string,
    tbNum: number,
    muType: string,
    muNum: number,
    docType: string,
    docSubType: string,
    tou: string,
    touNum: number,
};

export type NewParamType = {
    dataType: string,
    paramGroup: string,
    param: string,
    paramNum: number,
    comment: string,
}

export type ParamType = {
    id: string,
    comment: string,
    dataType: string,
    paramGroup: string,
    param: string,
    paramNum: number,
};

export type UpdateObjectType = {
    paramList: Array<ParamType>,
    ost: number,
    rnu: number,
    po: number,
    mt: number,
    uchMt: number,
    routeType: string,
    routenum: number,
    toType: string,
    toNum: number,
    saType: number,
    saTransmitterType: string,
    saTransmitterNum: number,
    tbType: string,
    tbNum: number,
    muType: string,
    muNum: number,
    docType: string,
    docSubType: string,
    tou: string,
    touNum: number,
};
