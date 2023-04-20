import { IConstructor, IEntity, IErrorRecord, ItemsState, IWrittenItem } from '../interfaces';
import { ActionTypes, IdType, ObjectFields } from '../types';
import * as actions from '../actions/items/creators';
import { itemInsertStart, itemUpdateStart, itemsFetched, itemSelected } from '../actions/items/genericCreators';
import ItemsConstants from '../actions/items/constants';

function makeFetch<T>() {
    return (items: T[], ctor: IConstructor<object>) => {
        return itemsFetched(items, ctor);
    }
}

function makeUpdate<T>() {
    return (item: IWrittenItem<T>, ctor: IConstructor<object>) => {
        return itemUpdateStart(item, ctor);
    }
}

function makeInsert<T>() {
    return (item: T, ctor: IConstructor<object>) => {
        return itemInsertStart(item, ctor);
    }
}

function makeSelect<T>() {
    return (item: T, ctor: IConstructor<object>) => {
        return itemSelected(item, ctor);
    }
}

function getInitialState<T extends object>(itemConstructor: IConstructor<T>, hiddenProps: Array<keyof T>): ItemsState<T> {
    return {
        fetch: {
            isFetching: false,
            items: [],
            fetchError: null,
        },
        insert: {
            isInserting: false,
            item: null,
            insertError: null,
        },
        update: {
            isUpdating: false,
            writtenItem: null,
            updateError: null,
        },
        delete: {
            isDeleting: false,
            itemId: null,
            deleteError: null,
        },
        itemConstructor: itemConstructor,
        fields: new ObjectFields<T>(itemConstructor).getFields(),
        hiddenProps: hiddenProps,
        lastAction: ''
    };
}

export default function makeItemsReducer<T extends object>(itemConstructor: IConstructor<T>, hiddenProps: Array<keyof T> = []) {
    const genericActions = {
        itemInsertStart: makeInsert<T>(),
        itemUpdateStart: makeUpdate<T>(),
        itemsFetched: makeFetch<T>(),
        itemSelected: makeSelect<T>()
    };

    return (state: ItemsState<T> = getInitialState<T>(itemConstructor, hiddenProps), action: ActionTypes<typeof actions | typeof genericActions>): ItemsState<T> => {
        let name = itemConstructor.name;
        switch (action.type) {
            case `${name}_${ItemsConstants.ITEMS_FETCH_START}`:
                return {
                    ...state,
                    fetch: {
                        ...state.fetch,
                        isFetching: true
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEM_INSERT_START}`:
                return {
                    ...state,
                    insert: {
                        ...state.insert,
                        isInserting: true,
                        item: <T>action.payload
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEM_UPDATE_START}`:
                return {
                    ...state,
                    update: {
                        ...state.update,
                        isUpdating: true,
                        writtenItem: <IWrittenItem<T>>action.payload
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEM_DELETE_START}`:
                return {
                    ...state,
                    delete: {
                        ...state.delete,
                        isDeleting: true,
                        itemId: <IdType>action.payload
                    },
                    lastAction: action.type
                }
            case `${name}_${ItemsConstants.ITEMS_FETCH_ERROR}`:
                return {
                    ...state,
                    fetch: {
                        ...state.fetch,
                        isFetching: false,
                        fetchError: <IErrorRecord>action.payload
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEM_INSERT_ERROR}`:
                return {
                    ...state,
                    insert: {
                        isInserting: false,
                        item: null,
                        insertError: <IErrorRecord>action.payload
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEM_UPDATE_ERROR}`:
                return {
                    ...state,
                    update: {
                        isUpdating: false,
                        writtenItem: null,
                        updateError: <IErrorRecord>action.payload
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEM_DELETE_ERROR}`:
                return {
                    ...state,
                    delete: {
                        isDeleting: false,
                        itemId: null,
                        deleteError: <IErrorRecord>action.payload
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEMS_FETCHED}`:
                return {
                    ...state,
                    fetch: {
                        items: <Array<T>>action.payload,
                        isFetching: false,
                        fetchError: null
                    },
                    update: {
                        ...state.update,
                        writtenItem: null
                    },
                    delete: {
                        ...state.delete,
                        itemId: null
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEM_INSERTED}`:
                return {
                    ...state,
                    insert: {
                        item: null,
                        isInserting: false,
                        insertError: null
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEM_UPDATED}`:
                return {
                    ...state,
                    update: {
                        writtenItem: null,
                        isUpdating: false,
                        updateError: null
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEM_DELETED}`:
                return {
                    ...state,
                    delete: {
                        itemId: null,
                        isDeleting: false,
                        deleteError: null
                    },
                    lastAction: action.type
                };
            case `${name}_${ItemsConstants.ITEM_SELECTED}`:
                return {
                    ...state,
                    update: {
                        ...state.update,
                        writtenItem: {
                            old: <T>action.payload,
                            new: null
                        }
                    },
                    delete: {
                        ...state.delete,
                        itemId: (action.payload as IEntity).id
                    },
                    lastAction: action.type
                }
            case `${name}_${ItemsConstants.ITEM_INSERT_FAIL}`:
                return {
                    ...state,
                    insert: {
                        ...state.insert,
                        insertError: null
                    }
                };
            case `${name}_${ItemsConstants.ITEM_UPDATE_FAIL}`:
                return {
                    ...state,
                    update: {
                        ...state.update,
                        updateError: null
                    }
                };
            case `${name}_${ItemsConstants.ITEM_DELETE_FAIL}`:
                return {
                    ...state,
                    delete: {
                        ...state.delete,
                        deleteError: null
                    }
                };
            default:
                return state;
        }
    }
}