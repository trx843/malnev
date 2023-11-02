import { IEventsState } from "../interfaces";
import * as actions from "../actions/events/creators";
import EventsConstants from "../actions/events/constants";
import { ActionTypes } from "../types";
import { techPosTreeConstant, zeroGuid } from "../utils";

const date = new Date();

// состояние фильтров и дерева событий по-умолчанию
const initialState: IEventsState = {
  items: {
    entities: [],
    pageInfo: {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    },
  },
  filteredItems: [],
  node: {
    id: zeroGuid,
    nodeId: 0,
    title: "Все",
    key: "0",
    type: "all",
    owned: true,
    isSiType: false,
    path: "\\" // путь по умолчанию
  },
  filterDates: {
    //startDate: new Date(date.getFullYear(), date.getMonth(), 1),
    // диапазон дат по умолчанию со вчера до сегодня
    startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ),
  },
  viewName: techPosTreeConstant,
  selected: null,
  ownedFilter: null,
  levelFilter: null,
  eventTypesFilter: [],
};

export function eventsReducer(
  state = initialState,
  action: ActionTypes<typeof actions>
): IEventsState {
  switch (action.type) {
    case EventsConstants.EVENTS_FETCHED:
      return {
        ...state,
        items: action.payload ?? initialState.items,
      };
    case EventsConstants.EVENTS_FILTERED:
      return {
        ...state,
        filteredItems: action.payload?.slice() ?? [],
      };
    case EventsConstants.NODE_CHANGED:
      return {
        ...state,
        node: action.payload ?? initialState.node,
      };
    case EventsConstants.DATE_CHANGED:
      return {
        ...state,
        filterDates: action.payload ?? initialState.filterDates,
      };
    case EventsConstants.TREE_CHANGED:
      return {
        ...state,
        viewName: action.payload ?? initialState.viewName,
      };
    case EventsConstants.EVENT_SELECTED:
      return {
        ...state,
        selected: action.payload ?? null,
      };
    case EventsConstants.EVENT_LEVEL_FILTER:
      return {
        ...state,
        levelFilter: action.payload ?? undefined,
      };
    case EventsConstants.EVENT_OWNED_TYPE_FILTER:
      return {
        ...state,
        ownedFilter: action.payload ?? null,
      };
    case EventsConstants.EVENT_TYPE_CHANGED:
      return {
        ...state,
        eventTypesFilter: action.payload?.slice() ?? [],
      };
    default:
      return state;
  }
}
