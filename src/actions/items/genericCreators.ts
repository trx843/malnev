import { IAction, IConstructor, IWrittenItem } from "../../interfaces";
import ItemsConstants from "./constants";

export function itemInsertStart<T>(item: T, ctor: IConstructor<object>): IAction<string, T> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_INSERT_START}`,
        payload: item
    };
}

export function itemUpdateStart<T>(item: IWrittenItem<T>, ctor: IConstructor<object>): IAction<string, IWrittenItem<T>> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_UPDATE_START}`,
        payload: item
    };
}

export function itemsFetched<T>(items: Array<T>, ctor: IConstructor<object>): IAction<string, Array<T>> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEMS_FETCHED}`,
        payload: items
    };
}

export function itemSelected<T>(item: T, ctor: IConstructor<object>): IAction<string, T> {
    return {
        type: `${ctor.name}_${ItemsConstants.ITEM_SELECTED}`,
        payload: item
    };
}