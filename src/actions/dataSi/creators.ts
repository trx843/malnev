import { DataSi } from '../../classes'
import { FilterDates, IAction, IWrittenItem, SelectedNode } from '../../interfaces';
import { OwnedType, PagedModel } from '../../types';
import DataSiConstants from './constants';


export function dataSiFetched(items: PagedModel<DataSi>): IAction<DataSiConstants.DATASI_FETCHED, PagedModel<DataSi>> {
    return {
        type: DataSiConstants.DATASI_FETCHED,
        payload: items
    };
}


export function dataSiFiltered(items: Array<DataSi>): IAction<DataSiConstants.DATASI_FILTERED, Array<DataSi>> {
    return {
        type: DataSiConstants.DATASI_FILTERED,
        payload: items
    };
}

export function dataSiUpdated(item: IWrittenItem<DataSi> | null): IAction<DataSiConstants.DATASI_UPDATED, IWrittenItem<DataSi> | null> {
    return {
        type: DataSiConstants.DATASI_UPDATED,
        payload: item
    };
}

export function dataSiInserted(item: DataSi | null): IAction<DataSiConstants.DATASI_INSERTED, DataSi | null> {
    return {
        type: DataSiConstants.DATASI_INSERTED,
        payload: item
    };
}

export function dataSiTreeChanged(viewName: string): IAction<DataSiConstants.TREE_CHANGED, string> {
    return {
        type: DataSiConstants.TREE_CHANGED,
        payload: viewName
    };
}

export function dataSiNodeChanged(node: SelectedNode | undefined): IAction<DataSiConstants.NODE_CHANGED, SelectedNode| undefined> {
    return {
        type: DataSiConstants.NODE_CHANGED,
        payload: node
    };
}

export function dataSiArchiveFiltered(filter: boolean): IAction<DataSiConstants.ARCHIVE_FILTER, boolean> {
    return {
        type: DataSiConstants.ARCHIVE_FILTER,
        payload: filter
    };
}

export function dataSiOwnedFilter(type: OwnedType): IAction<DataSiConstants.DATASI_OWNED_TYPE_FILTER, OwnedType> {
    return {
        type: DataSiConstants.DATASI_OWNED_TYPE_FILTER,
        payload: type
    };
}