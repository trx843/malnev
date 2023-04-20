import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HistoryLimit } from "../classes/SiEquipmentLimits";

interface IHistoryLimitState {
    items: Array<HistoryLimit>;
    selectedName: string;
    selectedId: string;
}

const initialState: IHistoryLimitState = {
    items: [],
    selectedName: "",
    selectedId: "",
};

const historyLimitInfo = createSlice({
    name: "historyLimit",
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<Array<HistoryLimit>>) {
            state.items = action.payload;
        },
        setSelectedName(state, action: PayloadAction<string>) {
            state.selectedName = action.payload;
        },
        setSelectedId(state, action: PayloadAction<string>) {
            state.selectedId = action.payload;
        },
    },
});

export const { setItems, setSelectedName, setSelectedId } =
    historyLimitInfo.actions;

export default historyLimitInfo.reducer;
