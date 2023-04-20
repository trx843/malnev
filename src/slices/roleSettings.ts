import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { OrgStructModel } from "classes/OrgStructInformation";
import { OstItem } from "classes/OstItem";
import { boolean } from "yup";
import {
  FeatureElementType,
  GroupFeaturElementType,
  GroupWebFeatureType,
  RoleGroupType,
  RoleType,
  UserType,
  WebFeatureTreeType,
} from "../api/responses/role-settings-page.response";
import {
  createGroupTC,
  createRoleTC,
  deleteGroupTC,
  deleteRoleTC,
  getAllGroupsTC,
  getAllRolesTC,
  getAllUsersTC,
  getFeatureElementsListTC,
  getOstAndOrgStructDataTC,
  getWebFeaturesTreeTC,
  updateGroupTC,
  updateRoleTC,
} from "../thunks/roleSettings";

const initialState = {
  errorText: "",
  isSuccessMessage: false,
  isButtonLoading: false,
  roles: [] as Array<RoleType>,
  filteredRoles: [] as Array<RoleType>,
  webFeaturesTree: [] as Array<WebFeatureTreeType>,
  allFeatureElements: [] as Array<FeatureElementType>,
  roleSettingsTabRowData: [] as Array<object>,
  selectedRole: null as RoleType | null,
  isPageLoading: false,
  isRoleSettingsModalOpen: false,
  isDeleteRoleSettingsModalOpen: false,
  isGroupSettingsModalOpen: false,
  isDeleteGroupSettingsModalOpen: false,
  modalVariant: "" as "" | "edit" | "create",
  firstTabFilter: {
    roleName: "",
    ignoreOrgStructure: undefined as boolean | undefined,
    featureElements: [] as Array<string>,
  },
  firstTabDomenInput: "",
  firstTabNameInput: "",
  firstTabDescriptionInput: "",
  firstTabIgnorOrgStructureCheckbox: true,
  firstTabCheckedElements: [] as Array<React.Key>,
  firstTabModalThirdStepTreeData: [] as Array<WebFeatureTreeType>,
  firstTabModalThirdStepFeaturesList:
    [] as Array<FirstTabModalThirdStepFeaturesListType>,
  changingFeatureElement: [] as Array<string>,
  groups: [] as Array<RoleGroupType>,
  users: [] as Array<UserType>,
  selectedGroup: null as RoleGroupType | null,
  isGroupModalLoading: false,
  ostsList: [] as Array<OstItem>,
  orgStructTree: [] as Array<OrgStructModel>,
  isDeleteRoleLoading: false,
  isDeleteGroupLoading: false,
  isDeleteSuccessMessage: false,
};

const roleSettingsSlice = createSlice({
  name: "roleSettings",
  initialState,
  reducers: {
    setFilteredRoles: (state, action: PayloadAction<Array<RoleType>>) => {
      state.filteredRoles = action.payload;
    },
    setIsRoleSettingsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isRoleSettingsModalOpen = action.payload;
    },
    setSelectedRole: (state, action: PayloadAction<any>) => {
      if (action.payload === null) {
        state.selectedRole = null;
        state.firstTabDomenInput = "";
        state.firstTabNameInput = "";
        state.firstTabDescriptionInput = "";
        state.firstTabIgnorOrgStructureCheckbox = true;
      } else {
        let selectedRole = state.roles.find(
          (role: RoleType) => role.name === action.payload.itemName
        );
        if (selectedRole) {
          state.selectedRole = selectedRole;
          state.firstTabDomenInput = selectedRole.domain;
          state.firstTabNameInput = selectedRole.name;
          state.firstTabDescriptionInput = selectedRole.description;
          state.firstTabIgnorOrgStructureCheckbox =
            selectedRole.ignoreOrgStruct;
        } else {
          state.selectedRole = action.payload;
        }
      }
    },
    setFirstTabDomenInput: (state, action: PayloadAction<string>) => {
      state.firstTabDomenInput = action.payload;
    },
    setFirstTabNameInput: (state, action: PayloadAction<string>) => {
      state.firstTabNameInput = action.payload;
    },
    setFirstTabDescriptionInput: (state, action: PayloadAction<string>) => {
      state.firstTabDescriptionInput = action.payload;
    },
    setFirstTabIgnorOrgStructureCheckbox: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.firstTabIgnorOrgStructureCheckbox = action.payload;
    },
    setFirstTabCheckedElements: (
      state,
      action: PayloadAction<Array<React.Key>>
    ) => {
      state.firstTabCheckedElements = action.payload;
    },
    setFirstTabSelectedRoleGroupsWebFeatures: (
      state,
      action: PayloadAction<Array<GroupWebFeatureType>>
    ) => {
      if (state.selectedRole) {
        state.selectedRole.groupsWebFeatures = action.payload;
      }
    },
    setFirstTabModalThirdStepTreeData: (
      state,
      action: PayloadAction<Array<WebFeatureTreeType>>
    ) => {
      state.firstTabModalThirdStepTreeData = action.payload;
    },
    setFirstTabModalThirdStepFeaturesList: (
      state,
      action: PayloadAction<Array<FirstTabModalThirdStepFeaturesListType>>
    ) => {
      state.firstTabModalThirdStepFeaturesList = action.payload;
    },
    setFeatureElementsForSelectedRole: (
      state,
      action: PayloadAction<Array<GroupFeaturElementType>>
    ) => {
      if (state.selectedRole) {
        state.selectedRole.groupsFeatureElements = action.payload;
      }
    },
    setChangingFeatureElement: (
      state,
      action: PayloadAction<Array<string>>
    ) => {
      state.changingFeatureElement = action.payload;
    },
    setChangingOnFirstStepInModal: (state) => {
      if (state.selectedRole) {
        state.selectedRole.domain = state.firstTabDomenInput;
        state.selectedRole.name = state.firstTabNameInput;
        state.selectedRole.description = state.firstTabDescriptionInput;
        state.selectedRole.ignoreOrgStruct =
          state.firstTabIgnorOrgStructureCheckbox;
        state.selectedRole.ignoreOrgStructText =
          state.firstTabIgnorOrgStructureCheckbox ? "Да" : "Нет";
      }
    },
    clearErrorText: (state) => {
      state.errorText = "";
    },
    changeValueIsSuccessMessage: (state, action: PayloadAction<boolean>) => {
      state.isSuccessMessage = action.payload;
    },
    setFirstTabFilterRoleName: (state, action) => {
      state.firstTabFilter.roleName = action.payload;
    },
    setFirstTabFilterIgnorOrgStructure: (state, action) => {
      state.firstTabFilter.ignoreOrgStructure = action.payload;
    },
    setFirstTabFilterFeatureElements: (state, action) => {
      state.firstTabFilter.featureElements = action.payload;
    },
    setRoleSettingsTabRowData: (state, action) => {
      state.roleSettingsTabRowData = action.payload;
    },
    setModalVariant: (state, action) => {
      state.modalVariant = action.payload;
    },
    setIsGroupSettingsModalOpen: (state, action) => {
      state.isGroupSettingsModalOpen = action.payload;
    },
    setSelectedGroup: (state, action: PayloadAction<any>) => {
      if (action.payload === null) {
        state.selectedGroup = null;
      } else {
        let selectedGroup = state.groups.find(
          (group: RoleGroupType) => group.fullName === action.payload.fullName
        );
        if (selectedGroup) {
          state.selectedGroup = selectedGroup;
        } else {
          state.selectedGroup = action.payload;
        }
      }
    },
    setRoleIgnoreElementsSettings: (state, action) => {
      if (state.selectedRole !== null) {
        state.selectedRole.ignoreElementsSettings = action.payload;
      }
    },
    setSelectedGroupDomain: (state, action) => {
      if (state.selectedGroup !== null) {
        state.selectedGroup.domain = action.payload;
      }
    },
    setSelectedGroupName: (state, action) => {
      if (state.selectedGroup !== null) {
        state.selectedGroup.name = action.payload;
      }
    },
    setSelectedGroupDescription: (state, action) => {
      if (state.selectedGroup !== null) {
        state.selectedGroup.description = action.payload;
      }
    },
    setSelectedGroupOST: (state, action) => {
      if (state.selectedGroup !== null) {
        state.selectedGroup.ostIdList = action.payload;
      }
    },
    setIsDeleteGroupSettingsModalOpen: (state, action) => {
      state.isDeleteGroupSettingsModalOpen = action.payload;
    },
    setIsDeleteRoleSettingsModalOpen: (state, action) => {
      state.isDeleteRoleSettingsModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRolesTC.pending, (state) => {
        state.isPageLoading = true;
      })
      .addCase(getAllRolesTC.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.filteredRoles = action.payload;
        state.isPageLoading = false;
      })
      .addCase(getAllRolesTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isPageLoading = false;
      })
      .addCase(getWebFeaturesTreeTC.pending, (state) => {
        state.isPageLoading = true;
      })
      .addCase(getWebFeaturesTreeTC.fulfilled, (state, action) => {
        state.webFeaturesTree = action.payload;
        state.isPageLoading = false;
      })
      .addCase(getWebFeaturesTreeTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isPageLoading = false;
      })
      .addCase(getFeatureElementsListTC.pending, (state) => {
        state.isPageLoading = true;
      })
      .addCase(getFeatureElementsListTC.fulfilled, (state, action) => {
        state.allFeatureElements = action.payload;
        state.isPageLoading = false;
      })
      .addCase(getFeatureElementsListTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isPageLoading = false;
      })
      .addCase(updateRoleTC.pending, (state) => {
        state.isButtonLoading = true;
      })
      .addCase(updateRoleTC.fulfilled, (state, action) => {
        state.isSuccessMessage = true;
        state.isButtonLoading = false;
      })
      .addCase(updateRoleTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isButtonLoading = false;
      })
      .addCase(createRoleTC.pending, (state) => {
        state.isButtonLoading = true;
      })
      .addCase(createRoleTC.fulfilled, (state, action) => {
        state.isSuccessMessage = true;
        state.isButtonLoading = false;
      })
      .addCase(createRoleTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isButtonLoading = false;
      })
      .addCase(getAllGroupsTC.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(getAllGroupsTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
      })
      .addCase(getAllUsersTC.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getAllUsersTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
      })
      .addCase(getOstAndOrgStructDataTC.pending, (state) => {
        state.isGroupModalLoading = true;
      })
      .addCase(getOstAndOrgStructDataTC.fulfilled, (state, action) => {
        state.ostsList = action.payload;
        state.isGroupModalLoading = false;
      })
      .addCase(getOstAndOrgStructDataTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isGroupModalLoading = false;
      })
      .addCase(updateGroupTC.pending, (state) => {
        state.isButtonLoading = true;
      })
      .addCase(updateGroupTC.fulfilled, (state, action) => {
        state.isSuccessMessage = true;
        state.isButtonLoading = false;
      })
      .addCase(updateGroupTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isButtonLoading = false;
      })
      .addCase(createGroupTC.pending, (state) => {
        state.isButtonLoading = true;
      })
      .addCase(createGroupTC.fulfilled, (state, action) => {
        state.isSuccessMessage = true;
        state.isButtonLoading = false;
      })
      .addCase(createGroupTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isButtonLoading = false;
      })
      .addCase(deleteRoleTC.pending, (state) => {
        state.isDeleteRoleLoading = true;
      })
      .addCase(deleteRoleTC.fulfilled, (state, action) => {
        state.isDeleteRoleLoading = false;
        state.isDeleteSuccessMessage = true;
      })
      .addCase(deleteRoleTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isDeleteRoleLoading = false;
      })
      .addCase(deleteGroupTC.pending, (state) => {
        state.isDeleteGroupLoading = true;
      })
      .addCase(deleteGroupTC.fulfilled, (state, action) => {
        state.isDeleteGroupLoading = false;
        state.isDeleteSuccessMessage = true;
      })
      .addCase(deleteGroupTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isDeleteGroupLoading = false;
      });
  },
});

//exports
export default roleSettingsSlice.reducer;
export const {
  setFilteredRoles,
  setIsRoleSettingsModalOpen,
  setSelectedRole,
  setFirstTabDomenInput,
  setFirstTabNameInput,
  setFirstTabDescriptionInput,
  setFirstTabIgnorOrgStructureCheckbox,
  setFirstTabCheckedElements,
  setFirstTabSelectedRoleGroupsWebFeatures,
  setFirstTabModalThirdStepTreeData,
  setFirstTabModalThirdStepFeaturesList,
  setFeatureElementsForSelectedRole,
  setChangingFeatureElement,
  setChangingOnFirstStepInModal,
  clearErrorText,
  changeValueIsSuccessMessage,
  setFirstTabFilterRoleName,
  setFirstTabFilterIgnorOrgStructure,
  setFirstTabFilterFeatureElements,
  setRoleSettingsTabRowData,
  setModalVariant,
  setIsGroupSettingsModalOpen,
  setSelectedGroup,
  setRoleIgnoreElementsSettings,
  setSelectedGroupDomain,
  setSelectedGroupName,
  setSelectedGroupDescription,
  setSelectedGroupOST,
  setIsDeleteRoleSettingsModalOpen,
  setIsDeleteGroupSettingsModalOpen,
} = roleSettingsSlice.actions;

//types
export type RoleSettingsStateType = typeof initialState;
export type ErrorType = { message: string };
export type FirstTabModalThirdStepFeaturesListType = {
  isAvailableCheck: boolean;
  isReadableCheck: boolean | null | undefined;
  isReadableRendered: boolean;
  itemTitle: string;
  webFeatureId: string;
  featureElementId: number;
};
export type FirstTabFilter = {
  roleName: string;
  ignoreOrgStructure: boolean | undefined;
  featureElements: Array<string>;
};
