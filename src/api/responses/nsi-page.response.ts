import { SchemeDataValuesType, SchemeType } from "../params/nsi-page.params";

export type AllSchemesResponseType = {
    success: boolean;
    message: string;
    result: Array<SchemeType>;
};

export type SchemeDataResponseType = {
    success: boolean;
    message: string;
    result: Array<SchemeDataValuesType>;
};

export type SelectorsResponseType = {
    success: boolean;
    message: string;
    result: Array<FieldSelectorsCrossItemsType>;
};

export type FieldSelectorsCrossItemsType = {
    fieldName: string;
    crossItems: Array<SelectorCrossItemType>;
};

export type SelectorCrossItemType = {
    primary: number;
    foreign: string;
};