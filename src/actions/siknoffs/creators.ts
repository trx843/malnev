import { SiknOffItem } from '../../classes';
import { FilterDates, IAction, IWrittenItem, SelectedNode } from '../../interfaces';
import { OwnedType } from '../../types';
import { PagedModel } from '../../types';
import SiknOffConstants from './constants';

export function offsFetched(items: PagedModel<SiknOffItem>): IAction<SiknOffConstants.OFFS_FETCHED, PagedModel<SiknOffItem>> {
    return {
        type: SiknOffConstants.OFFS_FETCHED,
        payload: items
    };
}

export function offUpdated(item: IWrittenItem<SiknOffItem> | null): IAction<SiknOffConstants.OFF_UPDATED, IWrittenItem<SiknOffItem> | null> {
    return {
        type: SiknOffConstants.OFF_UPDATED,
        payload: item
    };
}

export function offInserted(item: SiknOffItem | null): IAction<SiknOffConstants.OFF_INSERTED, SiknOffItem | null> {
    return {
        type: SiknOffConstants.OFF_INSERTED,
        payload: item
    };
}

export function offsFiltered(items: Array<SiknOffItem>): IAction<SiknOffConstants.OFFS_FILTERED, Array<SiknOffItem>> {
    return {
        type: SiknOffConstants.OFFS_FILTERED,
        payload: items
    };
}

export function nodeChanged(node: SelectedNode): IAction<SiknOffConstants.NODE_CHANGED, SelectedNode> {
    return {
        type: SiknOffConstants.NODE_CHANGED,
        payload: node
    };
}


export function dateChanged(dates: FilterDates): IAction<SiknOffConstants.DATE_CHANGED, FilterDates> {
    return {
        type: SiknOffConstants.DATE_CHANGED,
        payload: dates
    };
}

export function rsuFiltered(filter: boolean): IAction<SiknOffConstants.RSU_FILTER, boolean> {
    return {
        type: SiknOffConstants.RSU_FILTER,
        payload: filter
    };
}

export function reportFiltered(filter: boolean): IAction<SiknOffConstants.REPORT_FILTER, boolean> {
    return {
        type: SiknOffConstants.REPORT_FILTER,
        payload: filter
    };
}




export function offOwnedFilter(type: OwnedType): IAction<SiknOffConstants.OFF_OWNED_TYPE_FILTER, OwnedType> {
    return {
        type: SiknOffConstants.OFF_OWNED_TYPE_FILTER,
        payload: type
    };
}