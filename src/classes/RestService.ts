import { IConstructor, IEntity, IErrorRecord, ItemsState, IWrittenItem } from '../interfaces';
import { ActionTypes, IdType, RestThunkDispatch, StateType, ThunkResult, allActions } from "../types";
import axios from 'axios';
import * as actions from '../actions/items/creators';
import * as genericActions from '../actions/items/genericCreators';
import { apiBase } from '../utils';

export class RestService<T extends object>{
    private ctor: IConstructor<T>;
    private endpoint: string;

    constructor(url: string) {
        this.endpoint = `${apiBase}/${url}`;
    }

    private makeError(err: any): IErrorRecord {
        return {
            message: err.message,
            stack: err.stack
        }
    }

    public setConstructor(ctor: IConstructor<T>) {
        this.ctor = ctor;
    }

    public getItems(): ThunkResult<void, ItemsState<T>, ActionTypes<allActions>> {
        return (dispatch: RestThunkDispatch<ItemsState<T>, allActions>) => {
            dispatch(actions.itemsFetchStart(this.ctor));
            axios
                .get<T[]>(`${this.endpoint}`)
                .then(result => dispatch(genericActions.itemsFetched(result.data, this.ctor)))
                .catch(err => dispatch(actions.itemsFetchError(this.makeError(err), this.ctor)));
        }
    }

    public insertItem(item: T): ThunkResult<void, ItemsState<T>, ActionTypes<allActions>> {
        return (dispatch: RestThunkDispatch<ItemsState<T>, allActions>) => {
            dispatch(genericActions.itemInsertStart(item, this.ctor));
            axios
                .post(`${this.endpoint}`, item)
                .then(() => {
                    dispatch(actions.itemInserted(this.ctor))
                    dispatch(this.getItems())
                })
                .catch(err => dispatch(actions.itemInsertError(this.makeError(err), this.ctor)));
        }
    }

    public updateItem(item: IEntity, reducer: keyof StateType): ThunkResult<void, ItemsState<T>, ActionTypes<allActions>> {
        return (dispatch: RestThunkDispatch<ItemsState<T>, allActions>, getState: any) => {
            const itemsState: ItemsState<T> = getState()[reducer] as unknown as ItemsState<T>;
            const writtenItem: IWrittenItem<T> = {
                old: itemsState.fetch.items.find(x => (x as IEntity).id === item.id) as T,
                new: item as T
            };
            dispatch(genericActions.itemUpdateStart(writtenItem, this.ctor));
            axios
                .put(`${this.endpoint}/${item.id}`, item)
                .then(() => {
                    dispatch(actions.itemUpdated(this.ctor))
                    dispatch(this.getItems())
                })
                .catch(err => dispatch(actions.itemUpdateError(this.makeError(err), this.ctor)));
        }
    }

    public deleteItem(id: IdType): ThunkResult<void, ItemsState<T>, ActionTypes<allActions>> {
        return (dispatch: RestThunkDispatch<ItemsState<T>, allActions>) => {
            dispatch(actions.itemDeleteStart(id, this.ctor));
            axios
                .delete(`${this.endpoint}/${id}`)
                .then(() => {
                    dispatch(actions.itemDeleted(this.ctor));
                    dispatch(this.getItems());
                })
                .catch(err => dispatch(actions.itemDeleteError(this.makeError(err), this.ctor)));
        }
    }
}