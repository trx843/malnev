import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { StateType } from "types";
import { SchemeType } from "../api/params/nsi-page.params";
import { FieldSelectorsCrossItemsType, SchemeDataResponseType } from "../api/responses/nsi-page.response";
import {
    createNewRowInSchemeDataTC,
    deleteRowInSchemeDataTC,
    getAllSchemesTC,
    getDataSelectorsTC,
    getSchemeDataTC,
    updateRowInSchemeDataTC
} from "../thunks/tspdNsiPage";

const initialState = {
    isLoading: false,
    isTableLoading: false,
    isButtonLoading: false,
    dirSchemes: [] as Array<SchemeType>,
    regSchemes: [] as Array<SchemeType>,
    selectedScheme: {} as SchemeType | any,
    selectedSchemeData: {} as SchemeDataResponseType | any,
    dataSelectors: [] as Array<FieldSelectorsCrossItemsType>,
    selectedRowInScheme: {} as any,
    columnDefs: [] as any,
    rowData: [] as any,

    itemsForForm: [] as any,
    itemsForFormFull: [] as any,

    formInitialValues: {} as any,
    formInitialValuesFull: {} as any,

    yupObject: {} as any,
    yupObjectFull: {} as any,

    isCreateModalVisible: false,
    isUpdateModalVisible: false,
    isDeleteModalVisible: false,
};

const tspdNsiSlice = createSlice({
    name: "tspdNsi",
    initialState,
    reducers: {
        setSelectedScheme: (state, action: PayloadAction<SchemeType>) => {
            state.selectedScheme = action.payload;
        },
        setColumnDefs: (state, action: PayloadAction<SchemeType>) => {
            state.columnDefs = action.payload.fields.map(
                (field) => ({ 'headerName': field.description, 'field': field.name, 'headerTooltip': field.description, 'tooltipField': field.name })
            )
        },
        setRowData: (state, action: PayloadAction<any>) => {
            state.rowData = action.payload;
        },
        setSelectedRowInScheme: (state, action: PayloadAction<object>) => {
            state.selectedRowInScheme = action.payload;
        },
        setItemsForForm: (state, action: PayloadAction<Array<FormItemType>>) => {
            state.itemsForForm = action.payload;
        },
        setFormInitialValues: (state, { payload }) => { state.formInitialValues = payload },
        setFormInitialValuesFull: (state, { payload }) => { state.formInitialValuesFull = payload },
        setYupObject: (state, { payload }) => { state.yupObject = payload },
        setIsCreateModalVisible: (state, { payload }) => { state.isCreateModalVisible = payload },
        setIsUpdateModalVisible: (state, { payload }) => { state.isUpdateModalVisible = payload },
        setIsDeleteModalVisible: (state, { payload }) => { state.isDeleteModalVisible = payload },
        clearSelectedRowInScheme: (state) => {
            state.selectedRowInScheme = {};
        },
        clearState: (state) => {
            state.dirSchemes = [];
            state.regSchemes = [];
            state.selectedScheme = {};
            state.selectedSchemeData = {};
            state.selectedRowInScheme = {};
            state.columnDefs = [];
            state.rowData = [];
            state.itemsForForm = [];
            state.itemsForFormFull = [];
            state.formInitialValues = {};
            state.formInitialValuesFull = {};
            state.yupObject = {};
            state.yupObjectFull = {};
        },
        setIsTableLoading: (state, { payload }) => { state.isTableLoading = payload },
        setYupObjectFull: (state, { payload }) => { state.yupObjectFull = payload },
        setItemsForFormFull: (state, { payload }) => { state.itemsForFormFull = payload },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllSchemesTC.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllSchemesTC.fulfilled, (state, action) => {
                action.payload.result.forEach((schemeObj: SchemeType) => {
                    if (schemeObj.canEdit) {
                        state.dirSchemes.push(schemeObj);
                    } else {
                        state.regSchemes.push(schemeObj);
                    }
                });
                state.isLoading = false;
            })
            .addCase(getAllSchemesTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error(action.payload);
                }
                state.isLoading = false;
            })
            .addCase(getSchemeDataTC.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.selectedSchemeData = action.payload;
                }
                if (!action.payload.success) {
                    message.error(action.payload.message);
                }
            })
            .addCase(getSchemeDataTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error(action.payload);
                }
            })
            .addCase(createNewRowInSchemeDataTC.pending, (state) => {
                state.isButtonLoading = true;
            })
            .addCase(createNewRowInSchemeDataTC.fulfilled, (state, action) => {
                if (!action.payload.success) {
                    message.error(action.payload.message);
                }
                if (action.payload.success) {
                    message.success("Запись добавлена успешно!");
                    state.isCreateModalVisible = false;
                    state.selectedRowInScheme = {};
                }
                state.isButtonLoading = false;
            })
            .addCase(createNewRowInSchemeDataTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error(action.payload);
                }
                state.isLoading = false;
                state.selectedRowInScheme = {};
            })
            .addCase(updateRowInSchemeDataTC.pending, (state) => {
                state.isButtonLoading = true;
            })
            .addCase(updateRowInSchemeDataTC.fulfilled, (state, action) => {
                if (!action.payload.success) {
                    message.error(action.payload.message);
                }
                if (action.payload.success) {
                    message.success("Запись изменена успешно!");
                    state.isUpdateModalVisible = false;
                    state.selectedRowInScheme = {};
                }
                state.isButtonLoading = false;
            })
            .addCase(updateRowInSchemeDataTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error(action.payload);
                }
                state.isButtonLoading = false;
                state.selectedRowInScheme = {};
            })
            .addCase(deleteRowInSchemeDataTC.pending, (state) => {
                state.isButtonLoading = true;
            })
            .addCase(deleteRowInSchemeDataTC.fulfilled, (state, action) => {
                if (!action.payload.success) {
                    message.error(action.payload);
                }
                if (action.payload.success) {
                    message.success("Запись удалена успешно!");
                    state.isDeleteModalVisible = false;
                    state.selectedRowInScheme = {};
                }
                state.isButtonLoading = false;
            })
            .addCase(deleteRowInSchemeDataTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error(action.payload);
                }
                state.isButtonLoading = false;
                state.selectedRowInScheme = {};
            })
            .addCase(getDataSelectorsTC.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.dataSelectors = action.payload.result;
                }
                if (!action.payload.success) {
                    message.error(action.payload.message);
                }
            })
            .addCase(getDataSelectorsTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error(action.payload);
                }
            })
    }
});


//exports
export default tspdNsiSlice.reducer;
export const tspdNsiActions = tspdNsiSlice.actions;
export const tspdNsi = (state: StateType): TspdNsiStateType => state.tspdNsi;

//types
export type TspdNsiStateType = typeof initialState;
export type ErrorType = { message: string };
export type ColumnType = {
    headerName: string;
    field: string;
};
export type FormItemType = {
    name: string | number;
    description: string;
    value: string | number;
};