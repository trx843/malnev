import { IAction, IConstructor, IErrorRecord } from "../../interfaces";
import { IdType } from "../../types";
import ItemsConstants from "./constants";

export function itemsFetchStart(ctor: IConstructor<object>): IAction<string> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEMS_FETCH_START}`
    };
}

export function itemDeleteStart(id: IdType, ctor: IConstructor<object>): IAction<string, IdType> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_DELETE_START}`,
        payload: id
    };
}

export function itemsFetchError(error: IErrorRecord, ctor: IConstructor<object>): IAction<string, IErrorRecord> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEMS_FETCH_ERROR}`,
        payload: error
    };
}

export function itemInsertError(error: IErrorRecord, ctor: IConstructor<object>): IAction<string, IErrorRecord> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_INSERT_ERROR}`,
        payload: error
    };
}

export function itemUpdateError(error: IErrorRecord, ctor: IConstructor<object>): IAction<string, IErrorRecord> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_UPDATE_ERROR}`,
        payload: error
    };
}

export function itemDeleteError(error: IErrorRecord, ctor: IConstructor<object>): IAction<string, IErrorRecord> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_DELETE_ERROR}`,
        payload: error
    };
}

export function itemInserted(ctor: IConstructor<object>): IAction<string> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_INSERTED}`
    };
}

export function itemUpdated(ctor: IConstructor<object>): IAction<string> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_UPDATED}`
    };
}

export function itemDeleted(ctor: IConstructor<object>): IAction<string> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_DELETED}`
    };
}

export function itemInsertFail(ctor: IConstructor<object>): IAction<string> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_INSERT_FAIL}`
    };
}

export function itemUpdateFail(ctor: IConstructor<object>): IAction<string> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_UPDATE_FAIL}`
    };
}

export function itemDeleteFail(ctor: IConstructor<object>): IAction<string> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_DELETE_FAIL}`
    };
}