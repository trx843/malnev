import { Modal, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { apiBase, asciiToUint8Array } from "utils";
import {
  FeatureElementType,
  GroupFeaturElementType,
  GroupWebFeatureType,
  RoleGroupType,
  RoleType,
  UserType,
  WebFeatureTreeType,
} from "../../api/responses/role-settings-page.response";
import {
  changeValueIsSuccessMessage,
  clearErrorText,
  FirstTabModalThirdStepFeaturesListType,
  RoleSettingsStateType,
  setChangingFeatureElement,
  setChangingOnFirstStepInModal,
  setFeatureElementsForSelectedRole,
  setFilteredRoles,
  setFirstTabCheckedElements,
  setFirstTabDescriptionInput,
  setFirstTabDomenInput,
  setFirstTabFilterFeatureElements,
  setFirstTabFilterIgnorOrgStructure,
  setFirstTabFilterRoleName,
  setFirstTabIgnorOrgStructureCheckbox,
  setFirstTabModalThirdStepFeaturesList,
  setFirstTabModalThirdStepTreeData,
  setFirstTabNameInput,
  setFirstTabSelectedRoleGroupsWebFeatures,
  setIsDeleteGroupSettingsModalOpen,
  setIsDeleteRoleSettingsModalOpen,
  setIsGroupSettingsModalOpen,
  setIsRoleSettingsModalOpen,
  setModalVariant,
  setRoleIgnoreElementsSettings,
  setRoleSettingsTabRowData,
  setSelectedGroup,
  setSelectedGroupDescription,
  setSelectedGroupDomain,
  setSelectedGroupName,
  setSelectedGroupOST,
  setSelectedRole,
} from "../../slices/roleSettings";
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
} from "../../thunks/roleSettings";
import { StateType } from "../../types";

const usePresenter = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    roles,
    webFeaturesTree,
    allFeatureElements,
    isPageLoading,
    isRoleSettingsModalOpen,
    selectedRole,
    firstTabDomenInput,
    firstTabNameInput,
    firstTabDescriptionInput,
    firstTabIgnorOrgStructureCheckbox,
    filteredRoles,
    firstTabCheckedElements,
    firstTabModalThirdStepTreeData,
    groups,
    users,
    firstTabModalThirdStepFeaturesList,
    changingFeatureElement,
    isButtonLoading,
    errorText,
    isSuccessMessage,
    firstTabFilter,
    roleSettingsTabRowData,
    modalVariant,
    orgStructTree,
    ostsList,
    isGroupSettingsModalOpen,
    selectedGroup,
    isDeleteRoleSettingsModalOpen,
    isDeleteRoleLoading,
    isDeleteGroupSettingsModalOpen,
    isDeleteGroupLoading,
    isDeleteSuccessMessage,
  } = useSelector<StateType, RoleSettingsStateType>(
    (state) => state.roleSettings
  );

  useEffect(() => {
    dispatch(getAllRolesTC());
    dispatch(getWebFeaturesTreeTC());
    dispatch(getFeatureElementsListTC());
    dispatch(getAllGroupsTC());
    dispatch(getAllUsersTC());
    dispatch(getOstAndOrgStructDataTC());
    return () => {
      dispatch(setFirstTabFilterRoleName(""));
      dispatch(setFirstTabFilterIgnorOrgStructure(undefined));
      dispatch(setFirstTabFilterFeatureElements([]));
    };
  }, []);

  //roleSettingsTab
  ///sider
  const [collapsedRoleSettingsTabSider, setCollapsedRoleSettingsTabSider] =
    useState<boolean>(false);
  const onCollapseRoleSettingsTabSider = useCallback(() => {
    setCollapsedRoleSettingsTabSider(!collapsedRoleSettingsTabSider);
  }, [collapsedRoleSettingsTabSider]);

  const filterRoleNameHandler = useCallback(
    (role: RoleType) => {
      if (firstTabFilter.roleName.length < 1) {
        return true;
      } else {
        let result = role.name
          .toLowerCase()
          .indexOf(firstTabFilter.roleName.toLowerCase());
        if (result !== -1) {
          return true;
        }
        if (result === -1) {
          return false;
        }
      }
    },
    [firstTabFilter]
  );
  const filterIgnorOrgStructureHandler = useCallback(
    (role: RoleType) => {
      if (firstTabFilter.ignoreOrgStructure === undefined) {
        return true;
      } else {
        return role.ignoreOrgStruct === firstTabFilter.ignoreOrgStructure;
      }
    },
    [firstTabFilter]
  );
  const filterBindingByPagesHandler = useCallback(
    (role: RoleType) => {
      if (firstTabFilter.featureElements.length < 1) {
        return true;
      } else {
        let result = firstTabFilter.featureElements.filter((el: string) =>
          role.groupsWebFeatures.find(
            (feature: GroupWebFeatureType) => feature.webFeatureId === el
          )
        );
        if (result.length > 0) {
          return true;
        }
        if (result.length < 1) {
          return false;
        }
      }
    },
    [firstTabFilter]
  );

  useEffect(() => {
    if (roles.length > 0) {
      let result = roles.filter(
        (role: RoleType) =>
          filterRoleNameHandler(role) &&
          filterIgnorOrgStructureHandler(role) &&
          filterBindingByPagesHandler(role)
      );
      dispatch(setFilteredRoles(result));
    }
  }, [firstTabFilter]);

  const onChangeRoleNameInputHandler = useCallback((value: string) => {
    dispatch(setFirstTabFilterRoleName(value));
  }, []);

  const onChangeIgnorOrgStructure = useCallback((value: number | undefined) => {
    let resultValue = value === 1 ? true : value === 0 ? false : value;
    dispatch(setFirstTabFilterIgnorOrgStructure(resultValue));
  }, []);

  const onChangeTreeBindingByPages = useCallback((value: Array<string>) => {
    dispatch(setFirstTabFilterFeatureElements(value));
  }, []);

  const treeBindingByPagesProps = {
    treeData: webFeaturesTree,
    value: firstTabFilter.featureElements,
    onChange: onChangeTreeBindingByPages,
    treeCheckable: true,
    placeholder: "Все страницы",
    style: { width: "100%" },
  };
  ///table
  useEffect(() => {
    const roleSettingsTabRowData = filteredRoles.map((role: RoleType) => ({
      itemName: role.name,
      description: role.description,
      ignoreOrgStructText: role.ignoreOrgStructText,
      pagesMap: role.pagesMap,
      elementsMap: role.elementsMap,
    }));
    dispatch(setRoleSettingsTabRowData(roleSettingsTabRowData));
  }, [filteredRoles]);

  useEffect(() => {
    if (selectedRole && selectedRole.groupsWebFeatures.length > 0) {
      let checkedFeatures: Array<React.Key> = selectedRole.groupsWebFeatures
        .filter((webFeature) => webFeature.isLeaf)
        .map((webFeature: GroupWebFeatureType) => webFeature.webFeatureId);
      dispatch(setFirstTabCheckedElements(checkedFeatures));
    }
    if (selectedRole && selectedRole.groupsWebFeatures.length === 0) {
      dispatch(setFirstTabCheckedElements([]));
    }
    if (!selectedRole) {
      const allWebFeatures: Array<WebFeatureTreeType> = [...webFeaturesTree];
      let result = allWebFeatures.map((wf: any) => wf.key);
      dispatch(setFirstTabCheckedElements(result));
    }
  }, [selectedRole]);

  const addRoleWindowOpenHandler = useCallback(() => {
    dispatch(setIsRoleSettingsModalOpen(true));
    dispatch(setModalVariant("create"));
    const role: RoleType = {
      ignoreOrgStructText: "",
      groupsWebFeatures: [],
      groupsFeatureElements: [],
      pagesMap: "",
      elementsMap: "",
      id: "",
      name: "",
      domain: "",
      ignoreOrgStruct: false,
      description: "",
      isAdmin: false,
      fullName: "",
      ignoreElementsSettings: false,
    };
    dispatch(setSelectedRole(role));
  }, []);
  ///modal
  useEffect(() => {
    errorText &&
      message.error(errorText, () => {
        dispatch(clearErrorText());
      });
  }, [errorText]);

  useEffect(() => {
    if (isSuccessMessage) {
      dispatch(setIsGroupSettingsModalOpen(false));
      dispatch(setIsRoleSettingsModalOpen(false));
      dispatch(setSelectedRole(null));
      dispatch(setSelectedGroup(null));
      setRoleSettingsTabModalStep(0);
      dispatch(setFirstTabModalThirdStepTreeData([]));
      dispatch(setFirstTabModalThirdStepFeaturesList([]));
      dispatch(setFirstTabDomenInput(""));
      dispatch(setFirstTabNameInput(""));
      dispatch(setFirstTabDescriptionInput(""));
      dispatch(setFirstTabIgnorOrgStructureCheckbox(true));
      dispatch(setFirstTabCheckedElements(checkedWebFeaturesElementsHandler()));
      isSuccessMessage &&
        modalVariant === "edit" &&
        message.success("Группа изменена успешно!", () => {
          dispatch(changeValueIsSuccessMessage(false));
        });
      isSuccessMessage &&
        modalVariant === "create" &&
        message.success("Группа создана успешно!", () => {
          dispatch(changeValueIsSuccessMessage(false));
        });
      dispatch(setModalVariant(""));
      dispatch(getAllRolesTC());
      dispatch(getAllGroupsTC());
    }
  }, [isSuccessMessage]);

  useEffect(() => {
    if (isDeleteSuccessMessage) {
      dispatch(setIsDeleteRoleSettingsModalOpen(false));
      dispatch(setIsDeleteGroupSettingsModalOpen(false));
      dispatch(setSelectedRole(null));
      dispatch(setSelectedGroup(null));
      isSuccessMessage;
      message.success("Группа удалена успешно!");
      dispatch(getAllRolesTC());
      dispatch(getAllGroupsTC());
    }
  }, [isDeleteSuccessMessage]);

  useEffect(() => {
    if (webFeaturesTree.length > 0) {
      dispatch(setFirstTabCheckedElements(checkedWebFeaturesElementsHandler()));
    }
  }, [webFeaturesTree]);

  const checkedWebFeaturesElementsHandler = useCallback(() => {
    // console.log(webFeaturesTree);
    const allWebFeatures: Array<WebFeatureTreeType> = [...webFeaturesTree];
    let result = allWebFeatures.map(
      (wf: WebFeatureTreeType) => wf.key as React.Key
    );
    return result;
  }, [webFeaturesTree]);
  ////steps
  const [roleSettingsTabModalStep, setRoleSettingsTabModalStep] = useState(0);
  ////buttons
  const roleSettingsModalFirstStepOnAheadHandler = useCallback(() => {
    setRoleSettingsTabModalStep(roleSettingsTabModalStep + 1);
    dispatch(setChangingOnFirstStepInModal());
  }, [roleSettingsTabModalStep]);
  const roleSettingsModalOnButtonBackHandler = useCallback(() => {
    setRoleSettingsTabModalStep(roleSettingsTabModalStep - 1);
  }, [roleSettingsTabModalStep]);
  const roleSettingsModalOnButtonCancelHandler = useCallback(() => {
    dispatch(setIsRoleSettingsModalOpen(false));
    dispatch(setSelectedRole(null));
    setRoleSettingsTabModalStep(0);
    dispatch(setFirstTabModalThirdStepTreeData([]));
    dispatch(setFirstTabModalThirdStepFeaturesList([]));
    dispatch(setFirstTabDomenInput(""));
    dispatch(setFirstTabNameInput(""));
    dispatch(setFirstTabDescriptionInput(""));
    dispatch(setFirstTabIgnorOrgStructureCheckbox(true));
    dispatch(setFirstTabCheckedElements(checkedWebFeaturesElementsHandler()));
  }, []);
  const roleSettingsModalOnButtonOkHandler = useCallback(
    (modalVariant: string) => {
      if (modalVariant === "edit") dispatch(updateRoleTC());
      if (modalVariant === "create") dispatch(createRoleTC());
    },
    []
  );
  const roleSettingsModalSecondStepOnAheadHandler = useCallback(() => {
    setRoleSettingsTabModalStep(roleSettingsTabModalStep + 1);
    const treeDataHandler = (
      modalTreeData: WebFeatureTreeType[],
      checkedFeatures: React.Key[]
    ) => {
      const checkExisting = (treeNode: WebFeatureTreeType) => {
        if (checkedFeatures.includes(treeNode.key)) {
          return treeNode;
        }
        if (!checkedFeatures.includes(treeNode.key)) {
          if (treeNode.children?.length) {
            let treeChildren = treeNode.children
              .map(checkExisting)
              .filter((el) => el);
            if (treeChildren.length) {
              return { ...treeNode, children: treeChildren };
            }
            return false;
          }
          return false;
        }
      };
      return modalTreeData.map(checkExisting).filter((el) => el);
    };
    dispatch(
      setFirstTabModalThirdStepTreeData(
        treeDataHandler(webFeaturesTree, firstTabCheckedElements)
      )
    );
  }, [roleSettingsTabModalStep, webFeaturesTree, firstTabCheckedElements]);
  ////firstStep
  const setFirstTabDomenInputHandler = useCallback((value: string) => {
    dispatch(setFirstTabDomenInput(value));
  }, []);
  const setFirstTabNameInputHandler = useCallback((value: string) => {
    dispatch(setFirstTabNameInput(value));
  }, []);
  const setFirstTabDescriptionInputHandler = useCallback((value: string) => {
    dispatch(setFirstTabDescriptionInput(value));
  }, []);
  const setFirstTabIgnorOrgStructureCheckboxHandler = useCallback(
    (value: boolean) => {
      dispatch(setFirstTabIgnorOrgStructureCheckbox(value));
    },
    []
  );
  ////secondStep
  const checkedElementsInModalHandler = useCallback(
    (
      checkedKeys: React.Key[],
      info: {
        checkedNodes: { children: any[]; key: string }[];
        halfCheckedKeys: string[];
      }
    ) => {
      const checkedNodes = info.checkedNodes.map((checkedEl) => ({
        webFeatureId: checkedEl.key,
        isLeaf: checkedEl.children.length === 0,
      }));
      const halfChecked = info.halfCheckedKeys.map((key: string) => ({
        webFeatureId: key,
        isLeaf: false,
      }));
      const result = checkedNodes.concat(halfChecked);
      dispatch(setFirstTabSelectedRoleGroupsWebFeatures(result));
    },
    []
  );
  ////thirdStep
  const onSelectSecondTabModalThirdStepFeatureItem = useCallback(
    (selectedKeys: React.Key[]) => {
      let filteredItem = allFeatureElements.filter(
        (el: FeatureElementType) => el.webFeatureId === selectedKeys[0]
      );
      let itemsList = filteredItem.map((item: FeatureElementType) => ({
        isAvailableCheck: !selectedRole
          ? false
          : !!selectedRole.groupsFeatureElements.find(
              (el: GroupFeaturElementType) => el.featureElementId === item.id
            ),
        isReadableCheck: !selectedRole
          ? false
          : selectedRole.groupsFeatureElements.find(
              (el: GroupFeaturElementType) => el.featureElementId === item.id
            )?.readOnly,
        isReadableRendered: item.type === 1 || item.type === 2,
        itemTitle: item.description,
        webFeatureId: item.webFeatureId,
        featureElementId: item.id,
      }));
      dispatch(setFirstTabModalThirdStepFeaturesList(itemsList));
    },
    [selectedRole, allFeatureElements]
  );

  useEffect(() => {
    if (changingFeatureElement.length > 0) {
      onSelectSecondTabModalThirdStepFeatureItem(changingFeatureElement);
    }
  }, [changingFeatureElement]);

  const onCheckIsAvailableFeatureElementHandler = useCallback(
    (
      featureElement: FirstTabModalThirdStepFeaturesListType,
      isChecked: boolean
    ) => {
      if (selectedRole) {
        let newGroupFeatureElements = [...selectedRole.groupsFeatureElements];
        if (isChecked) {
          newGroupFeatureElements.push({
            webFeatureId: featureElement.webFeatureId,
            featureElementId: featureElement.featureElementId,
            readOnly:
              featureElement.isReadableCheck === null
                ? null
                : featureElement.isReadableCheck,
          });
        }
        if (!isChecked) {
          let index = newGroupFeatureElements.findIndex(
            (el: GroupFeaturElementType) =>
              el.featureElementId === featureElement.featureElementId
          );
          newGroupFeatureElements.splice(index, 1);
        }
        dispatch(setFeatureElementsForSelectedRole(newGroupFeatureElements));
        dispatch(setChangingFeatureElement([featureElement.webFeatureId]));
      }
    },
    [selectedRole]
  );

  const onCheckIsReadableFeatureElementHandler = useCallback(
    (
      featureElement: FirstTabModalThirdStepFeaturesListType,
      isChecked: boolean
    ) => {
      if (selectedRole) {
        let newGroupFeatureElements = selectedRole.groupsFeatureElements.map(
          (el: GroupFeaturElementType) => {
            if (el.featureElementId === featureElement.featureElementId) {
              return {
                webFeatureId: el.webFeatureId,
                featureElementId: el.featureElementId,
                readOnly: isChecked,
              };
            } else {
              return el;
            }
          }
        );
        dispatch(setFeatureElementsForSelectedRole(newGroupFeatureElements));
        dispatch(setChangingFeatureElement([featureElement.webFeatureId]));
      }
    },
    [selectedRole]
  );

  const onSwitchIgnoreElementsSettingsHandler = useCallback(() => {
    dispatch(
      setRoleIgnoreElementsSettings(!selectedRole?.ignoreElementsSettings)
    );
  }, [selectedRole?.ignoreElementsSettings]);

  const onRoleSettingsDeleteCloseModalHandler = useCallback(() => {
    dispatch(setSelectedRole(null));
    dispatch(setIsDeleteRoleSettingsModalOpen(false));
  }, []);
  const onRoleSettingsDeleteHandler = useCallback(() => {
    dispatch(deleteRoleTC());
  }, []);

  //groupSettingsTab
  ///table
  const groupSettingsTabRowData = groups.map((group: RoleGroupType) => ({
    orgStructure: group.orgStructure,
    fullName: group.fullName,
    description: group.description,
  }));

  ///modal
  const groupSettingsOnCloseModalHandler = useCallback(() => {
    dispatch(setIsGroupSettingsModalOpen(false));
    dispatch(setModalVariant(""));
  }, []);

  const addGroupWindowOpenHandler = useCallback(() => {
    dispatch(setIsGroupSettingsModalOpen(true));
    dispatch(setModalVariant("create"));
    const group: RoleGroupType = {
      id: "",
      name: "",
      domain: "",
      fullName: "",
      orgStructure: "",
      ignoreOrgStruct: false,
      description: "",
      ostIdList: [],
    };
    dispatch(setSelectedGroup(group));
  }, []);

  const onGroupSettingsDomainChangeHandler = useCallback((value: string) => {
    dispatch(setSelectedGroupDomain(value));
  }, []);

  const onGroupSettingsNameChangeHandler = useCallback((value: string) => {
    dispatch(setSelectedGroupName(value));
  }, []);

  const onGroupSettingsDescriptionChangeHandler = useCallback(
    (value: string) => {
      dispatch(setSelectedGroupDescription(value));
    },
    []
  );

  const onGroupSettingsOSTChangeHandler = useCallback((value: any) => {
    dispatch(setSelectedGroupOST(value));
  }, []);

  const onGroupSettingsSubmitHandler = useCallback((modalVariant: string) => {
    if (modalVariant === "edit") dispatch(updateGroupTC());
    if (modalVariant === "create") dispatch(createGroupTC());
  }, []);

  const groupSettingsSubmitButtonStatus =
    !selectedGroup?.domain ||
    !selectedGroup.name ||
    !selectedGroup.description ||
    selectedGroup.ostIdList.length === 0;

  const onGroupSettingsDeleteCloseModalHandler = useCallback(() => {
    dispatch(setSelectedGroup(null));
    dispatch(setIsDeleteGroupSettingsModalOpen(false));
  }, []);
  const onGroupSettingsDeleteHandler = useCallback(() => {
    dispatch(deleteGroupTC());
  }, []);

  const [exportLoading, setExportLoading] = useState(false);
  const onExportRoleHandler = async () => {
    setExportLoading(true);
    const url = `${apiBase}/rolesettings/roles/export`;
    let fileName: string = "download.xls";
    let error: string = "Ошибка серверной части";
    // Запрос
    let response = await fetch(url, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Формирование имени файла
    if (response.ok) {
      let fileNameHeader = response.headers.get("FileName");
      if (fileNameHeader !== null && fileNameHeader !== undefined) {
        let headerSplit = fileNameHeader.split(";");
        if (headerSplit.length > 0) {
          let asciiFile = headerSplit[0];
          let code = asciiToUint8Array(asciiFile);
          fileName = new TextDecoder().decode(code);
        }
      }

      // Выгрузка файла
      let blob = await response.blob();
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      setExportLoading(false);
    } else {
      let errorHeader = response.headers.get("Error");
      if (errorHeader !== null && errorHeader !== undefined) {
        let headerSplit = errorHeader.split(";");
        if (headerSplit.length > 0) {
          let asciiFile = headerSplit[0];
          let code = asciiToUint8Array(asciiFile);
          error = new TextDecoder().decode(code);
        }
      }
      setExportLoading(false);

      return message.error({
        content: error,
        duration: 4,
      });
    }
  };

  //userTab

  const usersTabRowData = users.map((user: UserType) => ({
    fullLogin: user.fullLogin,
    rolesMap: user.rolesMap,
    rolesDescrMap: user.rolesDescrMap,
    orgGroupsMap: user.orgGroupsMap,
    orgGroupsDescrMap: user.orgGroupsDescrMap,
    usePersonalNotificationsText: user.usePersonalNotificationsText,
    eventTypes: user.eventTypes,
    useCtrlPersonalNotificationsText: user.useCtrlPersonalNotificationsText,
    ctrlEventTypes: user.ctrlEventTypes,
  }));

  const [exportUsersLoading, setExportUsersLoading] = useState(false);

  const exportUsersHandler = async () => {
    setExportUsersLoading(true);
    const url = `${apiBase}/rolesettings/users/export`;
    let fileName: string = "download.xls";
    let error: string = "Ошибка серверной части";
    // Запрос
    let response = await fetch(url, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Формирование имени файла
    if (response.ok) {
      let fileNameHeader = response.headers.get("FileName");
      if (fileNameHeader !== null && fileNameHeader !== undefined) {
        let headerSplit = fileNameHeader.split(";");
        if (headerSplit.length > 0) {
          let asciiFile = headerSplit[0];
          let code = asciiToUint8Array(asciiFile);
          fileName = new TextDecoder().decode(code);
        }
      }

      // Выгрузка файла
      let blob = await response.blob();
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      setExportUsersLoading(false);
    } else {
      let errorHeader = response.headers.get("Error");
      if (errorHeader !== null && errorHeader !== undefined) {
        let headerSplit = errorHeader.split(";");
        if (headerSplit.length > 0) {
          let asciiFile = headerSplit[0];
          let code = asciiToUint8Array(asciiFile);
          error = new TextDecoder().decode(code);
        }
      }
      setExportUsersLoading(false);

      return message.error({
        content: error,
        duration: 4,
      });
    }
  };

  return {
    groupSettingsTabRowData,
    onCollapseRoleSettingsTabSider,
    collapsedRoleSettingsTabSider,
    roleSettingsTabRowData,
    treeBindingByPagesProps,
    isRoleSettingsModalOpen,
    selectedRole,
    onChangeIgnorOrgStructure,
    roleSettingsTabModalStep,
    roleSettingsModalFirstStepOnAheadHandler,
    roleSettingsModalOnButtonBackHandler,
    roleSettingsModalOnButtonCancelHandler,
    roleSettingsModalOnButtonOkHandler,
    firstTabModalThirdStepFeaturesList,
    roles,
    webFeaturesTree,
    allFeatureElements,
    isPageLoading,
    onChangeRoleNameInputHandler,
    firstTabDomenInput,
    firstTabNameInput,
    firstTabDescriptionInput,
    firstTabIgnorOrgStructureCheckbox,
    setFirstTabDomenInputHandler,
    setFirstTabNameInputHandler,
    setFirstTabDescriptionInputHandler,
    setFirstTabIgnorOrgStructureCheckboxHandler,
    history,
    addRoleWindowOpenHandler,
    checkedElementsInModalHandler,
    firstTabCheckedElements,
    firstTabModalThirdStepTreeData,
    roleSettingsModalSecondStepOnAheadHandler,
    filteredRoles,
    modalVariant,
    onSelectSecondTabModalThirdStepFeatureItem,
    onCheckIsAvailableFeatureElementHandler,
    onCheckIsReadableFeatureElementHandler,
    isButtonLoading,
    firstTabFilter,
    usersTabRowData,
    addGroupWindowOpenHandler,
    orgStructTree,
    ostsList,
    onSwitchIgnoreElementsSettingsHandler,
    groupSettingsOnCloseModalHandler,
    isGroupSettingsModalOpen,
    selectedGroup,
    onGroupSettingsDomainChangeHandler,
    onGroupSettingsNameChangeHandler,
    onGroupSettingsDescriptionChangeHandler,
    onGroupSettingsOSTChangeHandler,
    onGroupSettingsSubmitHandler,
    groupSettingsSubmitButtonStatus,
    onRoleSettingsDeleteHandler,
    isDeleteRoleSettingsModalOpen,
    onRoleSettingsDeleteCloseModalHandler,
    isDeleteRoleLoading,
    onGroupSettingsDeleteHandler,
    isDeleteGroupSettingsModalOpen,
    onGroupSettingsDeleteCloseModalHandler,
    isDeleteGroupLoading,
    onExportRoleHandler,
    exportLoading,
    exportUsersHandler,
    exportUsersLoading,
  };
};

export default usePresenter;
