import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UniType } from "api/requests/verificationActCommissionModal";
import { getFullNames, getJobTitles } from "thunks/verificationActCommissionModal";

const initialState = {
    allFullNames: [] as Array<UniType>,
    allJobTitles: [] as Array<UniType>,
    selectedFullName: "",
    selectedJobTitle: "",
};

const verificationActCommissionModalSlice = createSlice({
    name: "verificationActCommissionModalSlice",
    initialState,
    reducers: {
        setSelectedFullName: (state, action) => state.selectedFullName = action.payload,
        setSelectedJobTitle: (state, action) => state.selectedJobTitle = action.payload,
    },
    extraReducers: builder => {
        builder
            .addCase(getFullNames.fulfilled, (state, action: PayloadAction<Array<UniType>>) => {
                state.allFullNames = action.payload
            })
            .addCase(getJobTitles.fulfilled, (state, action: PayloadAction<Array<UniType>>) => {
                state.allJobTitles = action.payload
            })
    }
})

export default verificationActCommissionModalSlice.reducer;
export const verificationActCommissionModalActions = verificationActCommissionModalSlice.actions;

export type VerificationActCommissionModalStateType = typeof initialState;
