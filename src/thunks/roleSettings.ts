import { createAsyncThunk } from "@reduxjs/toolkit";
import { OstItem } from "classes/OstItem";
import { roleSettingsApi } from "../api/requests/roleSettings";
import { FeatureElementsListResponseType, OstAndOrgStructData, RoleGroupsResponseType, RoleSettingsResponseType, RoleType, UsersResponseType, WebFeaturesTreeResponseType } from "../api/responses/role-settings-page.response";
import { ErrorType } from "../slices/roleSettings";
import { StateType } from "../types";

export const getAllRolesTC = createAsyncThunk<
    RoleSettingsResponseType,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/getAllRoles", async (_, { rejectWithValue}) => {
    try {
        const response = await roleSettingsApi.getAllRoles();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getWebFeaturesTreeTC = createAsyncThunk<
    WebFeaturesTreeResponseType,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/getWebFeaturesTree", async (_, { rejectWithValue}) => {
    try {
        const response = await roleSettingsApi.getWebFeaturesTree();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const getFeatureElementsListTC = createAsyncThunk<
    FeatureElementsListResponseType,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/getFeatureElementsList", async (_, { rejectWithValue}) => {
    try {
        const response = await roleSettingsApi.getFeatureElementsList();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const createRoleTC = createAsyncThunk<
    any,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/createRole", async (_, { rejectWithValue, getState}) => {
    const {selectedRole} = getState().roleSettings;
    try {
        if(selectedRole) {
            const response = await roleSettingsApi.createRole(selectedRole);
            return response.data;
        }
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
}); 

export const updateRoleTC = createAsyncThunk<
    any,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/updateRole", async (_, { rejectWithValue, getState}) => {
    
    const {selectedRole} = getState().roleSettings;
    try {
        if(selectedRole) {
            const response = await roleSettingsApi.updateRole(selectedRole.id, selectedRole);
            return response.data;
        }
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
}); 

export const deleteRoleTC = createAsyncThunk<
    any,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/deleteRole", async (_, { rejectWithValue, getState}) => {
    
    const {selectedRole} = getState().roleSettings;
    try {
        if(selectedRole) {
            const response = await roleSettingsApi.deleteRole(selectedRole.id);
            return response.data;
        }
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
}); 

export const getAllGroupsTC = createAsyncThunk<
    RoleGroupsResponseType,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/getAllGroups", async (_, { rejectWithValue}) => {
    try {
        const response = await roleSettingsApi.getAllGroups();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

// Данные для выбора ОСТ и Орг. Структуры на модальном окне групп
export const getOstAndOrgStructDataTC = createAsyncThunk<
    OstItem[],
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/getOstAndOrgStructData", async (_, { rejectWithValue}) => {
    try {
        const response = await roleSettingsApi.getOsts();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});

export const createGroupTC = createAsyncThunk<
    any,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/createGroup", async (_, { rejectWithValue, getState}) => {
    const {selectedGroup} = getState().roleSettings;
    try {
        if(selectedGroup) {
            const response = await roleSettingsApi.createGroup(selectedGroup);
            return response.data;
        }
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
}); 

export const updateGroupTC = createAsyncThunk<
    any,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/updateGroup", async (_, { rejectWithValue, getState}) => {
    
    const {selectedGroup} = getState().roleSettings;
    try {
        if(selectedGroup) {
            const response = await roleSettingsApi.updateGroup(selectedGroup.id, selectedGroup);
            return response.data;
        }
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
}); 

export const deleteGroupTC = createAsyncThunk<
    any,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/deleteGroup", async (_, { rejectWithValue, getState}) => {
    
    const {selectedGroup} = getState().roleSettings;
    try {
        if(selectedGroup) {
            const response = await roleSettingsApi.deleteGroup(selectedGroup.id);
            return response.data;
        }
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
}); 


export const getAllUsersTC = createAsyncThunk<
    UsersResponseType,
    undefined,
    {rejectValue: string, state: StateType}
>("roleSettings/getAllUsers", async (_, { rejectWithValue}) => {
    try {
        const response = await roleSettingsApi.getAllUsers();
        return response.data;
    } catch (e) {
        const error: ErrorType = e;
        return rejectWithValue(
            error.message ? error.message : "unknown error"
        )
    }
});