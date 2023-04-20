import { ControlMaintEvents } from '../../classes/ControlMaintEvents';
import { FilterDates, IAction, IWrittenItem, SelectedNode } from '../../interfaces';
import { OwnedType } from '../../types';
import { PagedModel } from '../../types';
import ToKmhConstants from './constants';

export function tokmhFetched(items: PagedModel<ControlMaintEvents>): IAction<ToKmhConstants.TOKMH_FETCHED, PagedModel<ControlMaintEvents>> {
    return {
        type: ToKmhConstants.TOKMH_FETCHED,
        payload: items
    };
}

export function tokmhFiltered(items: Array<ControlMaintEvents>): IAction<ToKmhConstants.TOKMH_FILTERED, Array<ControlMaintEvents>> {
    return {
        type: ToKmhConstants.TOKMH_FILTERED,
        payload: items
    };
}


export function nodeChanged(node: SelectedNode): IAction<ToKmhConstants.NODE_CHANGED, SelectedNode> {
    return {
        type: ToKmhConstants.NODE_CHANGED,
        payload: node
    };
}


export function dateChanged(dates: FilterDates): IAction<ToKmhConstants.DATE_CHANGED, FilterDates> {
    return {
        type: ToKmhConstants.DATE_CHANGED,
        payload: dates
    };
}


export function treeChanged(viewName: string): IAction<ToKmhConstants.TREE_CHANGED, string> {
    return {
        type: ToKmhConstants.TREE_CHANGED,
        payload: viewName
    };
}

export function tokmhOwnedFilter(type: OwnedType): IAction<ToKmhConstants.TOKMH_OWNED_TYPE_FILTER, OwnedType> {
    return {
        type: ToKmhConstants.TOKMH_OWNED_TYPE_FILTER,
        payload: type
    };
}
export function tokmhUpdated(item: IWrittenItem<ControlMaintEvents> | null): IAction<ToKmhConstants.TOKMH_UPDATED, IWrittenItem<ControlMaintEvents> | null> {
    return {
        type: ToKmhConstants.TOKMH_UPDATED,
        payload: item
    };
}

