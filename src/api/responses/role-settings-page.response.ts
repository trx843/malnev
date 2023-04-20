import { OrgStructModel } from "classes/OrgStructInformation";
import { OstItem } from "classes/OstItem";

export type RoleSettingsResponseType = Array<RoleType>;

export type RoleType = {
   ignoreOrgStructText: string;
   groupsWebFeatures: Array<GroupWebFeatureType>;
   groupsFeatureElements: Array<GroupFeaturElementType>;
   pagesMap: string;
   elementsMap: string;
   id: string;
   name: string;
   domain: string;
   fullName: string;
   ignoreOrgStruct: boolean;
   description: string;
   isAdmin: boolean;
   ignoreElementsSettings: boolean;
};


export type GroupWebFeatureType = {
   webFeatureId: string;
   isLeaf: boolean;
};

export type GroupFeaturElementType = {
   webFeatureId: string;
   featureElementId: number;
   readOnly: boolean | null | undefined;
};

export type WebFeaturesTreeResponseType = Array<WebFeatureTreeType>;

export type WebFeatureTreeType = {
   key: string;
   title: string;
   children?: Array<WebFeatureTreeType>;
};

export type FeatureElementsListResponseType = Array<FeatureElementType>;

export type FeatureElementType = {
   id: number;
   name: string;
   webFeatureId: string;
   webFeatureName: string;
   route: string;
   description: string;
   type: number;
   readOnly: boolean | null;
};

export type RoleGroupsResponseType = Array<RoleGroupType>;

export type RoleGroupType = {
   id: string
   name: string;
   domain: string;
   fullName: string;
   orgStructure: string;
   ignoreOrgStruct: boolean;
   description: string | null;
   ostIdList: number[];
};

export type UsersResponseType = Array<UserType>;

export type UserType = {
   domain: string;
   login: string;
   fullLogin: string;
   groupsList: Array<RoleGroupType>;
   rolesMap: string;
   rolesDescrMap: string;
   orgGroupsMap: string;
   orgGroupsDescrMap: string;
   usePersonalNotificationsText: string;
   eventTypes: string;
   useCtrlPersonalNotificationsText: string;
   ctrlEventTypes: string;
};

export type OstAndOrgStructData = {
   ostsList: Array<OstItem>;
   orgStructTree: Array<OrgStructModel>;
};