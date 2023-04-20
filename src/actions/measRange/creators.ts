import { SiEquipmentLimits } from '../../classes/SiEquipmentLimits';
import { FilterDates, IAction, IWrittenItem, SelectedNode } from '../../interfaces';
import { OwnedType } from '../../types';
import { PagedModel } from '../../types';
import { MeasRangeConstants } from './constants';

export function measRangeFetched(items: PagedModel<SiEquipmentLimits>): IAction<MeasRangeConstants.MEASRANGE_FETCHED, PagedModel<SiEquipmentLimits>> {
    return {
        type: MeasRangeConstants.MEASRANGE_FETCHED,
        payload: items
    };
}

export function measRangeFiltered(items: Array<SiEquipmentLimits>): IAction<MeasRangeConstants.MEASRANGE_FILTERED, Array<SiEquipmentLimits>> {
    return {
        type: MeasRangeConstants.MEASRANGE_FILTERED,
        payload: items
    };
}

export function measRangeUpdated(item: IWrittenItem<SiEquipmentLimits> | null): IAction<MeasRangeConstants.MEASRANGE_UPDATED, IWrittenItem<SiEquipmentLimits> | null> {
    return {
        type: MeasRangeConstants.MEASRANGE_UPDATED,
        payload: item
    };
}

export function measRangeInserted(item: SiEquipmentLimits | null): IAction<MeasRangeConstants.MEASRANGE_INSERTED, SiEquipmentLimits | null> {
    return {
        type: MeasRangeConstants.MEASRANGE_INSERTED,
        payload: item
    };
}

export function treeChanged(viewName: string): IAction<MeasRangeConstants.TREE_CHANGED, string> {
    return {
        type: MeasRangeConstants.TREE_CHANGED,
        payload: viewName
    };
}

export function nodeChanged(node: SelectedNode): IAction<MeasRangeConstants.NODE_CHANGED, SelectedNode> {
    return {
        type: MeasRangeConstants.NODE_CHANGED,
        payload: node
    };
}

export function measRangeOwnedFilter(type: OwnedType): IAction<MeasRangeConstants.MEASRANGE_OWNED_TYPE_FILTER, OwnedType> {
    return {
        type: MeasRangeConstants.MEASRANGE_OWNED_TYPE_FILTER,
        payload: type
    };
}
