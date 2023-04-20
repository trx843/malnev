import { SiEquipment } from '../../classes'
import { FilterDates, IAction, IWrittenItem, SelectedNode } from '../../interfaces';
import { OwnedType } from '../../types';
import { PagedModel } from '../../types';
import EditorSiEquipmentConstants from './constants';

export function editorSiEqFetched(items: PagedModel<SiEquipment>): IAction<EditorSiEquipmentConstants.EDITORSIEQ_FETCHED, PagedModel<SiEquipment>> {
    return {
        type: EditorSiEquipmentConstants.EDITORSIEQ_FETCHED,
        payload: items
    };
}

export function editorSiEqFiltered(items: Array<SiEquipment>): IAction<EditorSiEquipmentConstants.EDITORSIEQ_FILTERED, Array<SiEquipment>> {
    return {
        type: EditorSiEquipmentConstants.EDITORSIEQ_FILTERED,
        payload: items
    };
}
export function editorSiEqUpdated(item: IWrittenItem<SiEquipment> | null): IAction<EditorSiEquipmentConstants.EDITORSIEQ_UPDATED, IWrittenItem<SiEquipment> | null> {
    return {
        type: EditorSiEquipmentConstants.EDITORSIEQ_UPDATED,
        payload: item
    };
}

export function editorSiEqInserted(item: SiEquipment | null): IAction<EditorSiEquipmentConstants.EDITORSIEQ_INSERTED, SiEquipment | null> {
    return {
        type: EditorSiEquipmentConstants.EDITORSIEQ_INSERTED,
        payload: item
    };
}

export function treeChanged(viewName: string): IAction<EditorSiEquipmentConstants.TREE_CHANGED, string> {
    return {
        type: EditorSiEquipmentConstants.TREE_CHANGED,
        payload: viewName
    };
}

export function siEqNodeChanged(node: SelectedNode | undefined): IAction<EditorSiEquipmentConstants.NODE_CHANGED, SelectedNode| undefined> {
    return {
        type: EditorSiEquipmentConstants.NODE_CHANGED,
        payload: node
    };
}

export function siEqArchiveFiltered(filter: boolean): IAction<EditorSiEquipmentConstants.EDITORSIEQ_ARCHIVE_FILTER, boolean> {
    return {
        type: EditorSiEquipmentConstants.EDITORSIEQ_ARCHIVE_FILTER,
        payload: filter
    };
}


export function siEqOwnedFilter(type: OwnedType): IAction<EditorSiEquipmentConstants.EDITORSIEQ_OWNED_TYPE_FILTER, OwnedType> {
    return {
        type: EditorSiEquipmentConstants.EDITORSIEQ_OWNED_TYPE_FILTER,
        payload: type
    };
}