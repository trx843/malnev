import { createSlice } from "@reduxjs/toolkit"
import { message } from "antd";
import { ParamType } from "api/requests/iotspd";
import {
    ObjectElementsType,
    ObjectType,
    ResponseItemsType,
    SelectItemsType
} from "api/responses/iotspd";
import {
    addParamTC,
    deleteParamTC,
    getObjectElementsTC,
    getObjectItemsTC,
    getParamItemsTC,
    getParamsTC,
    getShortObjectCodeTC,
    getToNumListTC,
    getTreeDataTC,
    updateObjectTC,
    updateParamTC
} from "thunks/iotspd";
import { StateType } from "types";

const initialState = {
    treeData: [] as Array<ObjectType>, //дерево объектов
    searchValue: "", //строка запроса в поиске по дереву
    selectedTreeObject: "", //айдишник выбранного объекта
    shortObjectCode: "", //код объекта для отображения пользователю
    expandedKeys: [], //ключи раскрытых узлов дерева
    autoExpandParent: true,

    codeElems: {} as ObjectElementsType, //элементы кода объекта
    objectElementCards: [] as Array<ObjectElementCardType>, //карточки с кодами выбранного объекта
    rowData: [] as Array<ParamType>, //данные таблицы(параметры выбранного объекта)

    isObjectModalVisible: false,
    objectModalVariant: "",
    objectItems: {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
        "7": [],
        "8": [],
        "9": [],
        "10": [],
        "11": [],
        "12": [],
        "13": [],
        "14": [],
    } as ResponseItemsType, //словарь списков для модалки объекта
    toNumList: [] as Array<SelectItemsType>, //список значений тоНам для выбранного значения тоТайпа(есть не у всех значений)
    modifingObjectFormInitialValues: {
        "ost": "",
        "rnu": "",
        "po": "",
        "mt": "",
        "uchMt": "",
        "routeType": "",
        "routeNum": 0,
        "toType": "",
        "toNum": "0",
        "saType": "",
        "saTransmitterType": "",
        "saTransmitterNum": 0,
        "tbType": "",
        "tbNum": 0,
        "muType": "",
        "muNum": 0,
        "docType": "",
        "docSubtype": "",
        "tou": "",
        "touNum": 0,
        "paramList": [
            {
                "dataType": "",
                "paramGroup": "",
                "param": "",
                "paramNum": 0,
                "comment": "",
            },
        ],
    }, //инициализационное значение формы модального окна объекта, если форма с предустановленными значениями

    isParametrModalVisible: false,
    parametrModalVariant: "",
    selectedParamId: "", //айди выбранного параметра у конкретного обекта
    paramItems: { "1": [], "2": [], "3": [] } as ResponseItemsType, //словарь списков для модалки параметра
    updateParamFormInitialValues: {
        paramList: [{
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
        },]
    }, //инициализационное значение формы модального окна параметра, если форма с предустановленными значениями

    warnFieldsMessage: [] as Array<string>, //список незаполненных полей в модальном окне
    isWarnMessageVisible: false, //флаг видимости модального окна с предупреждением о незаполненных полях в форме основного модального окна
    isObjectElementsCardsLoading: false,
    isSelectItemsLoading: false,
    isButtonLoading: false,
    isLoading: false,
};

const iotspdSlice = createSlice({
    name: "iotspdSlice",
    initialState,
    reducers: {
        setSelectedTreeObject: (state, { payload }) => { state.selectedTreeObject = payload },
        setSearchValue: (state, { payload }) => { state.searchValue = payload },
        setObjectElementCards: (state, { payload }) => { state.objectElementCards = payload },
        setIsObjectElementsCardsLoading: (state, { payload }) => { state.isObjectElementsCardsLoading = payload },
        setIsParametrModalVisible: (state, { payload }) => { state.isParametrModalVisible = payload },
        setParametrModalVariant: (state, { payload }) => { state.parametrModalVariant = payload },
        setUpdateParamFormInitialValues: (state, { payload }) => {
            state.updateParamFormInitialValues.paramList[0]['dataType'] = payload.dataType;
            state.updateParamFormInitialValues.paramList[0]['paramGroup'] = payload.paramGroup;
            state.updateParamFormInitialValues.paramList[0]['param'] = payload.param;
            state.updateParamFormInitialValues.paramList[0]['paramNum'] = payload.paramNum;
            state.updateParamFormInitialValues.paramList[0]['comment'] = payload.comment;
        },
        setModifingObjectFormInitialValues: (state) => {
            state.modifingObjectFormInitialValues.ost = state.codeElems.ost.toString();
            state.modifingObjectFormInitialValues.rnu = state.codeElems.rnu.toString();
            state.modifingObjectFormInitialValues.po = state.codeElems.po.toString();
            state.modifingObjectFormInitialValues.mt = state.codeElems.mt.toString();
            state.modifingObjectFormInitialValues.uchMt = state.codeElems.uchMt.toString();
            state.modifingObjectFormInitialValues.routeType = state.codeElems.routeType.toString();
            state.modifingObjectFormInitialValues.routeNum = state.codeElems.routenum;
            state.modifingObjectFormInitialValues.toType = state.codeElems.toType.toString();
            state.modifingObjectFormInitialValues.toNum = state.codeElems.toNum.toString();
            state.modifingObjectFormInitialValues.saType = state.codeElems.saType.toString();
            state.modifingObjectFormInitialValues.saTransmitterType = state.codeElems.saTransmitterType.toString();
            state.modifingObjectFormInitialValues.saTransmitterNum = state.codeElems.saTransmitterNum;
            state.modifingObjectFormInitialValues.tbType = state.codeElems.tbType.toString();
            state.modifingObjectFormInitialValues.tbNum = state.codeElems.tbNum;
            state.modifingObjectFormInitialValues.muType = state.codeElems.muType.toString();
            state.modifingObjectFormInitialValues.muNum = state.codeElems.muNum;
            state.modifingObjectFormInitialValues.docType = state.codeElems.docType.toString();
            state.modifingObjectFormInitialValues.docSubtype = state.codeElems.docSubType.toString();
            state.modifingObjectFormInitialValues.tou = state.codeElems.tou.toString();
            state.modifingObjectFormInitialValues.touNum = state.codeElems.touNum;
        },
        setModifingObjectFormInitialValuesForChildEls: (state, { payload }) => {
            let newObj = { ...state.modifingObjectFormInitialValues, ...payload }
            state.modifingObjectFormInitialValues = newObj
        },
        setSelectedParamId: (state, { payload }) => { state.selectedParamId = payload },
        setIsObjectModalVisible: (state, { payload }) => { state.isObjectModalVisible = payload },
        setObjectModalVariant: (state, { payload }) => { state.objectModalVariant = payload },
        setModifiedTreeDataRes0: (state, { payload }) => { state.treeData = [...state.treeData, payload] },
        setModifiedTreeDataRes1: (state, { payload }) => { state.treeData = payload },
        setExpandedKeys: (state, { payload }) => { state.expandedKeys = payload },
        setAutoExpandParent: (state, { payload }) => { state.autoExpandParent = payload },
        setWarnFieldsMessage: (state, { payload }) => { state.warnFieldsMessage = payload },
        setIsWarnMessageVisible: (state, { payload }) => { state.isWarnMessageVisible = payload },
    },
    extraReducers: builder => {
        builder
            .addCase(getTreeDataTC.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTreeDataTC.fulfilled, (state, action) => {
                state.treeData = action.payload;
                state.isLoading = false;
            })
            .addCase(getTreeDataTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
                state.isLoading = false;
            })
            .addCase(getObjectElementsTC.pending, (state) => {
                state.isObjectElementsCardsLoading = true;
            })
            .addCase(getObjectElementsTC.fulfilled, (state, action) => {
                state.codeElems = action.payload;
                state.isObjectElementsCardsLoading = false;
            })
            .addCase(getObjectElementsTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
                state.isObjectElementsCardsLoading = false;
            })
            .addCase(getParamsTC.fulfilled, (state, action) => {
                state.rowData = action.payload;
            })
            .addCase(getParamsTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
            })
            .addCase(getObjectItemsTC.pending, (state) => {
                state.isSelectItemsLoading = true;
            })
            .addCase(getObjectItemsTC.fulfilled, (state, action) => {
                state.objectItems = action.payload;
                state.isSelectItemsLoading = false;
            })
            .addCase(getObjectItemsTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
                state.isSelectItemsLoading = false;
            })
            .addCase(getParamItemsTC.pending, (state) => {
                state.isSelectItemsLoading = true;
            })
            .addCase(getParamItemsTC.fulfilled, (state, action) => {
                state.paramItems = action.payload;
                state.isSelectItemsLoading = false;
            })
            .addCase(getParamItemsTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
                state.isSelectItemsLoading = false;
            })
            .addCase(addParamTC.pending, (state) => {
                state.isButtonLoading = true;
            })
            .addCase(addParamTC.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isParametrModalVisible = false;
                    state.isObjectModalVisible = false;
                    if (state.parametrModalVariant.length) {
                        message.success({ content: 'Параметр сохранен успешно!', duration: 4 });
                    }
                    if (state.objectModalVariant.length) {
                        message.success({ content: 'Объект сохранен успешно!', duration: 4 });
                    }
                    state.parametrModalVariant = "";
                    state.objectModalVariant = "";
                }
                if (!action.payload.success) {
                    message.error({ content: action.payload.message, duration: 4 });
                }
                state.isButtonLoading = false;
            })
            .addCase(addParamTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
                state.isButtonLoading = false;
            })
            .addCase(updateParamTC.pending, (state) => {
                state.isButtonLoading = true;
            })
            .addCase(updateParamTC.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isParametrModalVisible = false;
                    state.parametrModalVariant = "";
                    state.selectedParamId = "";
                    message.success({ content: 'Параметр изменен успешно!', duration: 4 });
                }
                if (!action.payload.success) {
                    message.error({ content: action.payload.message, duration: 4 });
                }
                state.isButtonLoading = false;
            })
            .addCase(updateParamTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
                state.isButtonLoading = false;
            })
            .addCase(deleteParamTC.pending, (state) => {
                state.isButtonLoading = true;
            })
            .addCase(deleteParamTC.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.selectedParamId = "";
                    message.success({ content: 'Параметр успешно удален!', duration: 4 });
                }
                if (!action.payload.success) {
                    message.error({ content: action.payload.message, duration: 4 });
                }
                state.isButtonLoading = false;
            })
            .addCase(deleteParamTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
                state.isButtonLoading = false;
            })
            .addCase(getToNumListTC.pending, (state) => {
                state.isButtonLoading = true;
            })
            .addCase(getToNumListTC.fulfilled, (state, action) => {
                if (action.payload) {
                    state.toNumList = action.payload;
                }
                state.isButtonLoading = false;
            })
            .addCase(getToNumListTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
                state.isButtonLoading = false;
            })
            .addCase(updateObjectTC.pending, (state) => {
                state.isButtonLoading = true;
            })
            .addCase(updateObjectTC.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.selectedTreeObject = "";
                    state.codeElems = {} as ObjectElementsType;
                    state.objectElementCards = [];
                    state.rowData = [];
                    state.isObjectModalVisible = false;
                    state.objectModalVariant = "";
                    message.success({ content: 'Объект успешно изменен!', duration: 4 });
                } else {
                    message.error({ content: action.payload.message, duration: 4 });
                }
                state.isButtonLoading = false;
            })
            .addCase(updateObjectTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
                state.isButtonLoading = false;
            })

            .addCase(getShortObjectCodeTC.fulfilled, (state, action) => {
                if (action.payload) {
                    state.shortObjectCode = action.payload;
                } else {
                    state.shortObjectCode = "";
                }
            })
            .addCase(getShortObjectCodeTC.rejected, (state, action) => {
                if (action.payload) {
                    message.error({ content: action.payload, duration: 4 });
                }
            })
    }
});

export type IOTSPDStateType = typeof initialState;
export default iotspdSlice.reducer;
export const iotspdActions = iotspdSlice.actions;
export const iotspd = (state: StateType): IOTSPDStateType => state.iotspd;

export type ObjectElementCardType = {
    key: string,
    elName: string,
    value: string | number,
    toolTip: string,
};

export enum ObjectModalVariantEnum {
    ADD = "add",
    ADD_CHILD = "addChild",
    ADD_COPY = "addCopy",
    EDIT = "edit",
};

export const objectModalVariantConstant = {
    [ObjectModalVariantEnum.ADD]: "Новый объект",
    [ObjectModalVariantEnum.ADD_CHILD]: "Новый дочерний объект",
    [ObjectModalVariantEnum.ADD_COPY]: "Дублировать объект",
    [ObjectModalVariantEnum.EDIT]: "Редактировать объект",
}