import { SiEquipment, TechPositions } from '../../classes';
import { HistoryLimit, SiknLimits } from '../../classes/SiEquipmentLimits';
import { SiknRsu } from '../../classes/SiknRsu';
import { IAction } from '../../interfaces';
import { Nullable } from '../../types';
import HistoryLimitInfoConstants from './constants';

export function fetched(items: HistoryLimit[]): IAction<HistoryLimitInfoConstants.HL_FETCHED, HistoryLimit[]> {
    return {
        type: HistoryLimitInfoConstants.HL_FETCHED,
        payload: items
    };
}

export function siSelected(
    si: Nullable<SiEquipment>
): IAction<HistoryLimitInfoConstants.HL_SI_SELECTED, Nullable<SiEquipment>> {
    return {
        type: HistoryLimitInfoConstants.HL_SI_SELECTED,
        payload: si,
    }
}

export function siknSelected(
    sikn: Nullable<TechPositions>
): IAction<HistoryLimitInfoConstants.HL_SIKN_SELECTED, Nullable<TechPositions>> {
    return {
        type: HistoryLimitInfoConstants.HL_SIKN_SELECTED,
        payload: sikn,
    }
}

