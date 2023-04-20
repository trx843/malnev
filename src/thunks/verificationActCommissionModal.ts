import { createAsyncThunk } from "@reduxjs/toolkit";
import { commissionModalApi, UniType } from "api/requests/verificationActCommissionModal";

export const getFullNames = createAsyncThunk<
    Array<UniType>,
    undefined,
    { }
>("verificationActCommissionModal/getFullNames", async (_, {}) => {
    const response = await commissionModalApi.getFullNames();
    return response.data;
}); 

export const getJobTitles = createAsyncThunk<
    Array<UniType>,
    undefined,
    { }
>("verificationActCommissionModal/getJobTitles", async (_, {}) => {
    const response = await commissionModalApi.getJobTitles();
    return response.data;
});

export const addFullName = createAsyncThunk<
    any,
    string,
    { }
>("verificationActCommissionModal/addFullName", async (fullName, {dispatch}) => {
    const response = await commissionModalApi.addFullName(fullName);
    if (response.status === 200) {
        dispatch(getFullNames());
    }
    return response.data;
})

export const addJobTitle = createAsyncThunk<
    any,
    string,
    { }
>("verificationActCommissionModal/addJobTitle", async (jobTitle, {dispatch}) => {
    const response = await commissionModalApi.addJobTitle(jobTitle);
    if (response.status === 200) {
        dispatch(getJobTitles());
    }
    return response.data;
})

export const deleteFullName = createAsyncThunk<
    any,
    string,
    { }
>("verificationActCommissionModal/deleteFullName", async (id, {dispatch}) => {
    const response = await commissionModalApi.deleteFullName(id);
    if (response.status === 200) {
        dispatch(getFullNames())
    }
    return response.data;
})

export const deleteJobTitle = createAsyncThunk<
    any,
    string,
    { }
>("verificationActCommissionModal/deleteJobTitle", async (id, {dispatch}) => {
    const response = await commissionModalApi.deleteJobTitle(id);
    if (response.status === 200) {
        dispatch(getJobTitles())
    }
    return response.data;
})