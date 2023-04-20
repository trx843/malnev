import { IMeasRangeState } from '../interfaces';
import * as CreatorsActions from '../actions/measRange/creators';
import { ActionTypes } from '../types';
import { MeasRangeConstants } from '../actions/measRange';
import { techPosTreeConstant, zeroGuid } from '../utils';

const initialState: IMeasRangeState = {
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
    writtenItem: null,
    insertedItem: null,
    viewName: techPosTreeConstant,
    node: {
        id: zeroGuid,
        nodeId: 0,
        title: '',
        key: '0',
        type: 'all',
        owned: null,
        isSiType: false,
    },
    ownedFilter: null,
};

export function measRangeReducer(
    state = initialState,
    action: ActionTypes<typeof CreatorsActions>,
): IMeasRangeState {
    switch (action.type) {
        case MeasRangeConstants.MEASRANGE_FETCHED:
            return {
                ...state,
                items: action.payload ?? initialState.items,
                writtenItem: null,
                insertedItem: null,
            };
        case MeasRangeConstants.MEASRANGE_FILTERED:
            return {
                ...state,
                filteredItems: action.payload?.slice() ?? [],
                writtenItem: null,
                insertedItem: null,
            };
        case MeasRangeConstants.MEASRANGE_UPDATED:
            return {
                ...state,
                writtenItem: action.payload ?? null,
            };
        case MeasRangeConstants.MEASRANGE_INSERTED:
            return {
                ...state,
                insertedItem: action.payload ?? null,
            };
        case MeasRangeConstants.TREE_CHANGED:
            return {
                ...state,
                viewName: action.payload ?? initialState.viewName,
            };
        case MeasRangeConstants.NODE_CHANGED:
            return {
                ...state,
                items: initialState.items,
                writtenItem: null,
                insertedItem: null,
                node: action.payload ?? initialState.node,
            };
        case MeasRangeConstants.MEASRANGE_OWNED_TYPE_FILTER:
            return {
                ...state,
                ownedFilter: action.payload ?? null,
            };
        default:
            return state;
    }
}
