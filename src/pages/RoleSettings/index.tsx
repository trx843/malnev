import { PageHeader, Spin } from "antd";
import React, { FC } from "react";
import { GroupSettingsTab } from "../../components/RoleSettingsTabs/GroupSettingsTab";
import { RoleSettingsTab } from "../../components/RoleSettingsTabs/RoleSettingsTab";
import { UsersTab } from "../../components/RoleSettingsTabs/Users";
import {
  PageLayoutStyled,
  StyledTabs,
} from "../../styles/commonStyledComponents";
import usePresenter from "./presenter";
import { SpanWrapperStyled } from "./styled";

export const RoleSettingsPage: FC = React.memo(() => {
  const {
    groupSettingsTabRowData,
    onCollapseRoleSettingsTabSider,
    collapsedRoleSettingsTabSider,
    roleSettingsTabRowData,
    treeBindingByPagesProps,
    isRoleSettingsModalOpen,
    roleSettingsTabModalStep,
    onChangeIgnorOrgStructure,
    roleSettingsModalFirstStepOnAheadHandler,
    roleSettingsModalOnButtonBackHandler,
    roleSettingsModalOnButtonCancelHandler,
    roleSettingsModalOnButtonOkHandler,
    isButtonLoading,
    webFeaturesTree,
    roleSettingsModalSecondStepOnAheadHandler,
    isPageLoading,
    selectedRole,
    onChangeRoleNameInputHandler,
    firstTabModalThirdStepTreeData,
    history,
    firstTabDomenInput,
    firstTabNameInput,
    firstTabDescriptionInput,
    firstTabIgnorOrgStructureCheckbox,
    setFirstTabDomenInputHandler,
    setFirstTabNameInputHandler,
    setFirstTabDescriptionInputHandler,
    setFirstTabIgnorOrgStructureCheckboxHandler,
    checkedElementsInModalHandler,
    firstTabCheckedElements,
    firstTabFilter,
    firstTabModalThirdStepFeaturesList,
    onSelectSecondTabModalThirdStepFeatureItem,
    onCheckIsAvailableFeatureElementHandler,
    onCheckIsReadableFeatureElementHandler,
    addRoleWindowOpenHandler,
    modalVariant,
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
    isDeleteRoleLoading,
    isDeleteRoleSettingsModalOpen,
    onRoleSettingsDeleteCloseModalHandler,
    isDeleteGroupLoading,
    isDeleteGroupSettingsModalOpen,
    onGroupSettingsDeleteCloseModalHandler,
    onGroupSettingsDeleteHandler,
    onExportRoleHandler,
    exportLoading,
    exportUsersHandler,
    exportUsersLoading
  } = usePresenter();

  return (
    <>
      {isPageLoading ? (
        <SpanWrapperStyled>
          <Spin size="large" tip="Загрузка контента..." />
        </SpanWrapperStyled>
      ) : (
        <PageLayoutStyled>
          <PageHeader
            style={{ paddingTop: 0 }}
            className="site-page-header"
            onBack={() => history.push("/")}
            title="Настройка ролей"
          />
          <StyledTabs
            defaultActiveKey="1"
            size={"large"}
            destroyInactiveTabPane={true}
          >
            <StyledTabs.TabPane tab="Настройка ролей" key="1">
              <RoleSettingsTab
                isButtonLoading={isButtonLoading}
                webFeaturesTree={webFeaturesTree}
                selectedRole={selectedRole}
                collapsed={collapsedRoleSettingsTabSider}
                onCollapse={onCollapseRoleSettingsTabSider}
                rowData={roleSettingsTabRowData}
                treeBindingByPagesProps={treeBindingByPagesProps}
                isModalVisible={isRoleSettingsModalOpen}
                currentStep={roleSettingsTabModalStep}
                onAheadHandler={roleSettingsModalFirstStepOnAheadHandler}
                onBackHandler={roleSettingsModalOnButtonBackHandler}
                onCancelHandler={roleSettingsModalOnButtonCancelHandler}
                onOkHandler={roleSettingsModalOnButtonOkHandler}
                thirdStepTreeData={firstTabModalThirdStepTreeData}
                firstTabDomenInput={firstTabDomenInput}
                firstTabNameInput={firstTabNameInput}
                firstTabDescriptionInput={firstTabDescriptionInput}
                firstTabIgnorOrgStructureCheckbox={
                  firstTabIgnorOrgStructureCheckbox
                }
                setFirstTabDomenInputHandler={setFirstTabDomenInputHandler}
                setFirstTabNameInputHandler={setFirstTabNameInputHandler}
                setFirstTabDescriptionInputHandler={
                  setFirstTabDescriptionInputHandler
                }
                setFirstTabIgnorOrgStructureCheckboxHandler={
                  setFirstTabIgnorOrgStructureCheckboxHandler
                }
                onChangeRoleNameInputHandler={onChangeRoleNameInputHandler}
                firstTabFilter={firstTabFilter}
                checkedElementsInModalHandler={checkedElementsInModalHandler}
                firstTabCheckedElements={firstTabCheckedElements}
                roleSettingsModalSecondStepOnAheadHandler={
                  roleSettingsModalSecondStepOnAheadHandler
                }
                firstTabModalThirdStepFeaturesList={
                  firstTabModalThirdStepFeaturesList
                }
                onSelectSecondTabModalThirdStepFeatureItem={
                  onSelectSecondTabModalThirdStepFeatureItem
                }
                onCheckIsAvailableFeatureElementHandler={
                  onCheckIsAvailableFeatureElementHandler
                }
                onCheckIsReadableFeatureElementHandler={
                  onCheckIsReadableFeatureElementHandler
                }
                onChangeIgnorOrgStructure={onChangeIgnorOrgStructure}
                addRoleWindowOpenHandler={addRoleWindowOpenHandler}
                modalVariant={modalVariant}
                onSwitchIgnoreElementsSettingsHandler={
                  onSwitchIgnoreElementsSettingsHandler
                }
                onRoleSettingsDeleteHandler={onRoleSettingsDeleteHandler}
                isDeleteRoleLoading={isDeleteRoleLoading}
                onRoleSettingsDeleteCloseModalHandler={
                  onRoleSettingsDeleteCloseModalHandler
                }
                isDeleteRoleSettingsModalOpen={isDeleteRoleSettingsModalOpen}
                onExportRoleHandler={onExportRoleHandler}
                exportLoading={exportLoading}
              />
            </StyledTabs.TabPane>
            <StyledTabs.TabPane tab="Настройка групп" key="2">
              <GroupSettingsTab
                isButtonLoading={isButtonLoading}
                rowData={groupSettingsTabRowData}
                isModalVisible={isGroupSettingsModalOpen}
                addGroupWindowOpenHandler={addGroupWindowOpenHandler}
                orgStructTree={orgStructTree}
                ostsList={ostsList}
                groupSettingsOnCloseModalHandler={
                  groupSettingsOnCloseModalHandler
                }
                selectedGroup={selectedGroup}
                onGroupSettingsDomainChangeHandler={
                  onGroupSettingsDomainChangeHandler
                }
                modalVariant={modalVariant}
                onGroupSettingsNameChangeHandler={
                  onGroupSettingsNameChangeHandler
                }
                onGroupSettingsDescriptionChangeHandler={
                  onGroupSettingsDescriptionChangeHandler
                }
                onGroupSettingsOSTChangeHandler={
                  onGroupSettingsOSTChangeHandler
                }
                onGroupSettingsSubmitHandler={onGroupSettingsSubmitHandler}
                groupSettingsSubmitButtonStatus={
                  groupSettingsSubmitButtonStatus
                }
                onGroupSettingsDeleteHandler={onGroupSettingsDeleteHandler}
                isDeleteGroupLoading={isDeleteGroupLoading}
                onGroupSettingsDeleteCloseModalHandler={
                  onGroupSettingsDeleteCloseModalHandler
                }
                isDeleteGroupSettingsModalOpen={isDeleteGroupSettingsModalOpen}
              />
            </StyledTabs.TabPane>
            <StyledTabs.TabPane tab="Пользователи" key="3">
              <UsersTab
                rowData={usersTabRowData}
                exportUsersHandler={exportUsersHandler}
                exportUsersLoading={exportUsersLoading}
              />
            </StyledTabs.TabPane>
          </StyledTabs>
        </PageLayoutStyled>
      )}
    </>
  );
});
