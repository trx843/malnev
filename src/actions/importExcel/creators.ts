import { ImportLogs } from '../../classes';
import { FilterDates, IAction } from '../../interfaces';
import { PagedModel } from '../../types';
import ImportExcelConstants from './constants';

export function importLogsFetched(items: PagedModel<ImportLogs>): IAction<ImportExcelConstants.IMPORT_FETCHED, PagedModel<ImportLogs>> {
    return {
        type: ImportExcelConstants.IMPORT_FETCHED,
        payload: items
    };
}

export function dateChanged(dates: FilterDates): IAction<ImportExcelConstants.DATE_CHANGED, FilterDates> {
    return {
        type: ImportExcelConstants.DATE_CHANGED,
        payload: dates
    };
}

