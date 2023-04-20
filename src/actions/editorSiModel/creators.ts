import { SiModel } from '../../classes'
import { FilterDates, IAction, IWrittenItem, SelectedNode } from '../../interfaces';
import { PagedModel } from '../../types';
import EditorSiModelConstants from './constants';

export function editorSiModelFetched(items: PagedModel<SiModel>): IAction<EditorSiModelConstants.EDITORSIMODEL_FETCHED, PagedModel<SiModel>> {
    return {
        type: EditorSiModelConstants.EDITORSIMODEL_FETCHED,
        payload: items
    };
}

export function editorSiModelFiltered(items: Array<SiModel>): IAction<EditorSiModelConstants.EDITORSIMODEL_FILTERED, Array<SiModel>> {
    return {
        type: EditorSiModelConstants.EDITORSIMODEL_FILTERED,
        payload: items
    };
}

export function editorSiModelUpdated(item: IWrittenItem<SiModel> | null): IAction<EditorSiModelConstants.EDITORSIMODEL_UPDATED, IWrittenItem<SiModel> | null> {
    return {
        type: EditorSiModelConstants.EDITORSIMODEL_UPDATED,
        payload: item
    };
}

export function editorSiModelInserted(item: SiModel | null): IAction<EditorSiModelConstants.EDITORSIMODEL_INSERTED, SiModel | null> {
    return {
        type: EditorSiModelConstants.EDITORSIMODEL_INSERTED,
        payload: item
    };
}

export function siModelArchiveFiltered(filter: boolean): IAction<EditorSiModelConstants.EDITORSIMODEL_ARCHIVE_FILTER, boolean> {
    return {
        type: EditorSiModelConstants.EDITORSIMODEL_ARCHIVE_FILTER,
        payload: filter
    };
}