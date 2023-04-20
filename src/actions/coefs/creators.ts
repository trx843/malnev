import { CoefChangeEventSigns } from '../../classes/CoefChangeEventSigns';
import { FilterDates, IAction, SelectedNode } from '../../interfaces';
import { OwnedType, PagedModel } from '../../types';
import CoefConstants from './constants';

export function coefFetched(items: PagedModel<CoefChangeEventSigns>): IAction<CoefConstants.COEF_FETCHED, PagedModel<CoefChangeEventSigns>> {
    return {
        type: CoefConstants.COEF_FETCHED,
        payload: items
    };
}


export function nodeChanged(node: SelectedNode): IAction<CoefConstants.NODE_CHANGED, SelectedNode> {
    return {
        type: CoefConstants.NODE_CHANGED,
        payload: node
    };
}


export function dateChanged(dates: FilterDates): IAction<CoefConstants.DATE_CHANGED, FilterDates> {
    return {
        type: CoefConstants.DATE_CHANGED,
        payload: dates
    };
}


export function treeChanged(viewName: string): IAction<CoefConstants.TREE_CHANGED, string> {
    return {
        type: CoefConstants.TREE_CHANGED,
        payload: viewName
    };
}


export function coefOwnedFilter(type: OwnedType): IAction<CoefConstants.COEF_OWNED_TYPE_FILTER, OwnedType> {
    return {
        type: CoefConstants.COEF_OWNED_TYPE_FILTER,
        payload: type
    };
}

