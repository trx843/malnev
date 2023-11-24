import { Failures } from '../../classes';
import { FilterDates, IAction, IWrittenItem, SelectedNode } from '../../interfaces';
import { OwnedType, WarningType } from '../../types';
import { PagedModel } from '../../types';
import FailuresConstants from './constants';

export function failuresFetched(items: PagedModel<Failures>): IAction<FailuresConstants.FAILURES_FETCHED, PagedModel<Failures>> {
    return {
        type: FailuresConstants.FAILURES_FETCHED,
        payload: items
    };
}

export function failuresFiltered(items: Array<Failures>): IAction<FailuresConstants.FAILURES_FILTERED, Array<Failures>> {
    return {
        type: FailuresConstants.FAILURES_FILTERED,
        payload: items
    };
}

export function nodeChanged(node: SelectedNode): IAction<FailuresConstants.NODE_CHANGED, SelectedNode> {
    return {
        type: FailuresConstants.NODE_CHANGED,
        payload: node
    };
}

export function dateChanged(dates: FilterDates): IAction<FailuresConstants.DATE_CHANGED, FilterDates> {
    return {
        type: FailuresConstants.DATE_CHANGED,
        payload: dates
    };
}

export function treeChanged(viewName: string): IAction<FailuresConstants.TREE_CHANGED, string> {
    return {
        type: FailuresConstants.TREE_CHANGED,
        payload: viewName
    };
}

export function failuresSelected(item: Failures | null): IAction<FailuresConstants.FAILURE_SELECTED, Failures | null> {
    return {
        type: FailuresConstants.FAILURE_SELECTED,
        payload: item
    }
}

export function failureOwnedFilter(type: OwnedType): IAction<FailuresConstants.FAILURE_OWNED_TYPE_FILTER, OwnedType> {
    return {
        type: FailuresConstants.FAILURE_OWNED_TYPE_FILTER,
        payload: type
    }
}

// Недостоверные события
export function failureWarningFilter(type: WarningType): IAction<FailuresConstants.FAILURE_WARNING_TYPE_FILTER, WarningType> {
    return {
        type: FailuresConstants.FAILURE_WARNING_TYPE_FILTER,
        payload: type
    }
}

export function failuresInserted(item: Failures | null): IAction<FailuresConstants.FAILURES_INSERTED, Failures | null> {
    return {
        type: FailuresConstants.FAILURES_INSERTED,
        payload: item
    };
}

export function failuresUpdated(item: IWrittenItem<Failures> | null): IAction<FailuresConstants.FAILURE_UPDATED, IWrittenItem<Failures> | null> {
    return {
        type: FailuresConstants.FAILURE_UPDATED,
        payload: item
    }
}

export function failuresTypeChanged(types: Array<number>): IAction<FailuresConstants.FAILURE_TYPE_CHANGED, Array<number>> {
    return {
        type: FailuresConstants.FAILURE_TYPE_CHANGED,
        payload: types
    }
}

export function failuresConseqChanged(conseqs: Array<number>): IAction<FailuresConstants.FAILURE_CONSEQ_CHANGED, Array<number>> {
    return {
        type: FailuresConstants.FAILURE_CONSEQ_CHANGED,
        payload: conseqs
    }
}