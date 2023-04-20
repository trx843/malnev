import { NewObjectType, ParamType } from "api/requests/iotspd";
import React from "react";

export type ObjectType = {
    id?: string,
    nodeId?: number,
    title: string,
    key: string,
    type?: string,
    children: Array<ObjectType>,
    owned?: boolean,
    isSiType?: boolean,
    paramExists: number,
};

export type ObjectElementsType = {
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

export type ResponseParamType = {
    success: boolean,
    message: string,
    result: ParamType,
};

export type ResponseDeleteParamType = {
    success: boolean,
    message: string,
    result: FullParamType,
}

export type FullParamType = {
    id: string,
    dataType: string,
    paramGroup: string,
    param: string,
    paramNum: number,
    comment: string,
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
}

export type ResponseItemsType = {
    [key: string]: Array<SelectItemsType>,
};

export type SelectItemsType = {
    id: string,
    fullName: string,
};

export type ResponseObjectType = {
    success: boolean,
    message: string,
    result: NewObjectType,
};