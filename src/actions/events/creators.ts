import { Event } from "../../classes";
import { FilterDates, IAction, SelectedNode } from "../../interfaces";
import { Nullable, OwnedType, WarningType } from "../../types";
import { PagedModel } from "../../types";
import EventsConstants from './constants';

export function eventsFetched(items: PagedModel<Event>): IAction<EventsConstants.EVENTS_FETCHED, PagedModel<Event>> {
    return {
        type: EventsConstants.EVENTS_FETCHED,
        payload: items
    };
}

export function eventsFiltered(items: Array<Event>): IAction<EventsConstants.EVENTS_FILTERED, Array<Event>> {
    return {
        type: EventsConstants.EVENTS_FILTERED,
        payload: items
    };
}

export function nodeChanged(node: SelectedNode): IAction<EventsConstants.NODE_CHANGED, SelectedNode> {
    return {
        type: EventsConstants.NODE_CHANGED,
        payload: node
    };
}

export function dateChanged(dates: FilterDates): IAction<EventsConstants.DATE_CHANGED, FilterDates> {
    return {
        type: EventsConstants.DATE_CHANGED,
        payload: dates
    };
}

export function treeChanged(viewName: string): IAction<EventsConstants.TREE_CHANGED, string> {
    return {
        type: EventsConstants.TREE_CHANGED,
        payload: viewName
    };
}

export function eventSelected(item: Event | null): IAction<EventsConstants.EVENT_SELECTED, Event | null> {
    return {
        type: EventsConstants.EVENT_SELECTED,
        payload: item
    }
}

export function eventLevelFilter(level: Nullable<number> | undefined): IAction<EventsConstants.EVENT_LEVEL_FILTER, Nullable<number> | undefined> {
    return {
        type: EventsConstants.EVENT_LEVEL_FILTER,
        payload: level
    }
}

export function eventOwnedFilter(type: OwnedType): IAction<EventsConstants.EVENT_OWNED_TYPE_FILTER, OwnedType> {
    return {
        type: EventsConstants.EVENT_OWNED_TYPE_FILTER,
        payload: type
    }
}

// Недостоверные события
export function eventWarningFilter(type: WarningType): IAction<EventsConstants.EVENT_WARNING_TYPE_FILTER, WarningType> {
    return {
        type: EventsConstants.EVENT_WARNING_TYPE_FILTER,
        payload: type
    }
}

export function eventTypeChanged(types: Array<string>): IAction<EventsConstants.EVENT_TYPE_CHANGED, Array<string>> {
    return {
        type: EventsConstants.EVENT_TYPE_CHANGED,
        payload: types
    }
}