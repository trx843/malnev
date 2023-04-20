import axios from "axios";
import { OrgStructInformation } from "classes/OrgStructInformation";
import { OstItem } from "classes/OstItem";
import { apiBase } from "../../../utils";
import { FeatureElementsListResponseType, RoleGroupsResponseType, RoleGroupType, RoleSettingsResponseType, RoleType, UsersResponseType, UserType, WebFeaturesTreeResponseType } from "../../responses/role-settings-page.response";

const BASE_URL = `${apiBase}/rolesettings`;

export const roleSettingsApi = {
    getAllRoles() {
        return axios.get<RoleSettingsResponseType>(`${BASE_URL}/roles`);
    },
    getWebFeaturesTree() {
        return axios.get<WebFeaturesTreeResponseType>(`${BASE_URL}/webFeaturesTree`);
    },
    getFeatureElementsList() {
        return axios.get<FeatureElementsListResponseType>(`${BASE_URL}/featureElements`);
    },
    createRole(role: RoleType) {
        return axios.post(`${BASE_URL}/roles`, role);
    },
    updateRole(roleId: string, role: RoleType) {
        return axios.put(`${BASE_URL}/roles/${roleId}`, role);
    },
    deleteRole(roleId: string) {
        return axios.delete(`${BASE_URL}/roles/${roleId}`);
    },
    getAllGroups() {
        return axios.get<RoleGroupsResponseType>(`${BASE_URL}/groups`);
    },
    getAllUsers() {
        return axios.get<UsersResponseType>(`${BASE_URL}/users`);
    },
    getOsts() {
        return axios.get<OstItem[]>(`${apiBase}/osts`);
    },
    getOrgStructTree() {
        return axios.get<OrgStructInformation>(`${apiBase}/orgStruct`);
    },
    createGroup(group: RoleGroupType) {
        return axios.post(`${BASE_URL}/groups`, group);
    },
    updateGroup(groupId: string, group: RoleGroupType) {
        return axios.put(`${BASE_URL}/groups/${groupId}`, group);
    },
    deleteGroup(groupId: string) {
        return axios.delete(`${BASE_URL}/groups/${groupId}`);
    },
}; 