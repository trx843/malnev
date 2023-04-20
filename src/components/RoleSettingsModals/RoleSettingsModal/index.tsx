import { Checkbox, Input, Steps, Switch, Tree } from "antd";
import "antd/dist/antd.css";
import React, { FC } from "react";
import {
  RoleType,
  WebFeatureTreeType,
} from "../../../api/responses/role-settings-page.response";
import { FirstTabModalThirdStepFeaturesListType } from "../../../slices/roleSettings";
import { UniButton } from "../../UniButton";
import {
  ContentHeaderStyled,
  LeftBlockInnerContentStyled,
  LeftContentBlockStyled,
  ModalBlockStyled,
  ModalFormBlockStyled,
  ModalStyled,
  ModalWrapBlockStyled,
  RightBlockInnerContentStyled,
  RightContentBlockStyled,
  RightContentHeaderItemStyled,
  RightContentHeaderMidItemStyled,
  RightContentHeaderRowStyled,
  RightContentListAsideItemStyled,
  RightContentListCenterItemStyled,
  RightContentListItemRowStyled,
  SecondStepContentBlockStyled,
  StepsStyled,
  SwitchButtonStyled,
  ThirdStepContentBlockStyled,
} from "./styled";

type PropsType = {
  isButtonLoading: boolean;
  webFeaturesTree: Array<WebFeatureTreeType>;
  isModalVisible: boolean;
  onCancelHandler: () => void;
  onOkHandler: (modalVariant: string) => void;
  onAheadHandler: () => void;
  onBackHandler: () => void;
  currentStep: number;
  modalVariant: string;
  thirdStepTreeData: Array<WebFeatureTreeType>;
  selectedRole: RoleType | null;
  firstTabDomenInput: string;
  firstTabNameInput: string;
  firstTabDescriptionInput: string;
  firstTabIgnorOrgStructureCheckbox: boolean;
  setFirstTabDomenInputHandler: (value: string) => void;
  setFirstTabNameInputHandler: (value: string) => void;
  setFirstTabDescriptionInputHandler: (value: string) => void;
  setFirstTabIgnorOrgStructureCheckboxHandler: (value: boolean) => void;
  checkedElementsInModalHandler: (checkedKeys: React.Key[], info: any) => void;
  firstTabCheckedElements: Array<React.Key>;
  roleSettingsModalSecondStepOnAheadHandler: () => void;
  firstTabModalThirdStepFeaturesList: Array<FirstTabModalThirdStepFeaturesListType>;
  onSelectSecondTabModalThirdStepFeatureItem: (
    checkedKeys: React.Key[]
  ) => void;
  onCheckIsAvailableFeatureElementHandler: (
    featureElement: FirstTabModalThirdStepFeaturesListType,
    isChecked: boolean
  ) => void;
  onCheckIsReadableFeatureElementHandler: (
    featureElement: FirstTabModalThirdStepFeaturesListType,
    isChecked: boolean
  ) => void;
  onSwitchIgnoreElementsSettingsHandler: (value) => void;
};

export const RoleSettingsModal: FC<PropsType> = React.memo(
  ({
    isModalVisible,
    onAheadHandler,
    onBackHandler,
    onCancelHandler,
    onOkHandler,
    currentStep,
    thirdStepTreeData,
    setFirstTabDescriptionInputHandler,
    webFeaturesTree,
    firstTabDomenInput,
    firstTabNameInput,
    firstTabDescriptionInput,
    firstTabIgnorOrgStructureCheckbox,
    setFirstTabDomenInputHandler,
    setFirstTabNameInputHandler,
    setFirstTabIgnorOrgStructureCheckboxHandler,
    checkedElementsInModalHandler,
    firstTabCheckedElements,
    roleSettingsModalSecondStepOnAheadHandler,
    firstTabModalThirdStepFeaturesList,
    isButtonLoading,
    onSelectSecondTabModalThirdStepFeatureItem,
    onCheckIsAvailableFeatureElementHandler,
    onCheckIsReadableFeatureElementHandler,
    modalVariant,
    selectedRole,
    onSwitchIgnoreElementsSettingsHandler,
  }) => {
    const { Step } = Steps;

    let modalFooter = new Map();
    modalFooter
      .set(0, [
        <UniButton
          key={"back"}
          title={"Назад"}
          type={"default"}
          isDisabled={true}
        />,
        <UniButton
          key={"submit"}
          title={"Далее"}
          type={"primary"}
          buttonHandler={onAheadHandler}
          isDisabled={
            !firstTabDomenInput ||
            !firstTabNameInput ||
            !firstTabDescriptionInput
          }
        />,
      ])
      .set(1, [
        <UniButton
          key={"back"}
          title={"Назад"}
          type={"default"}
          buttonHandler={onBackHandler}
        />,
        <UniButton
          key={"submit"}
          title={"Далее"}
          type={"primary"}
          buttonHandler={roleSettingsModalSecondStepOnAheadHandler}
          isDisabled={firstTabCheckedElements.length < 1}
        />,
      ])
      .set(2, [
      <SwitchButtonStyled>
          <Switch 
            onChange={onSwitchIgnoreElementsSettingsHandler}
            checked={selectedRole?.ignoreElementsSettings} 
          />
          Игнорировать настройку элементов
        </SwitchButtonStyled>,
        <UniButton
          key={"back"}
          title={"Назад"}
          type={"default"}
          buttonHandler={onBackHandler}
          isDisabled={isButtonLoading}
        />,
        <UniButton
          key={"submit"}
          title={modalVariant === "edit" ? "Обновить" : "Добавить"}
          type={"text"}
          buttonHandler={() => onOkHandler(modalVariant)}
          background={"#219653"}
          color={"white"}
          isButtonLoading={isButtonLoading}
        />,
      ]);

    const style = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50px",
    };

    return (
      <>
        {isModalVisible && firstTabModalThirdStepFeaturesList && (
          <ModalStyled
            maskClosable={false}
            title={modalVariant === "edit" ? "Редактирование" : "Создание"}
            visible={isModalVisible}
            onCancel={onCancelHandler}
            footer={modalFooter.get(currentStep)}
          >
            <ModalBlockStyled>
              <StepsStyled direction="vertical" current={currentStep}>
                <Step key={0} title="Свойства роли" />
                <Step key={1} title="Выбор страниц" />
                <Step key={2} title="Выбор элементов" />
              </StepsStyled>
              {currentStep === 0 ? (
                <ModalFormBlockStyled>
                  <ModalFormBlockStyled.Item name={"domen"}>
                    <label>Домен</label>
                    <Input
                      type="text"
                      value={firstTabDomenInput}
                      onChange={(event) =>
                        setFirstTabDomenInputHandler(event.target.value)
                      }
                      style={{ minWidth: "400px" }}
                    />
                  </ModalFormBlockStyled.Item>

                  <ModalFormBlockStyled.Item name={"name"}>
                    <label>Название</label>
                    <Input
                      type="text"
                      value={firstTabNameInput}
                      onChange={(event) =>
                        setFirstTabNameInputHandler(event.target.value)
                      }
                      style={{ minWidth: "400px" }}
                    />
                  </ModalFormBlockStyled.Item>

                  <ModalFormBlockStyled.Item name={"description"}>
                    <label>Описание</label>
                    <Input
                      type="text"
                      value={firstTabDescriptionInput}
                      onChange={(event) =>
                        setFirstTabDescriptionInputHandler(event.target.value)
                      }
                      style={{ minWidth: "400px" }}
                    />
                  </ModalFormBlockStyled.Item>

                  <ModalFormBlockStyled.Item name={"isIgnoreOrgStructure"}>
                    <Checkbox
                      type="checkbox"
                      onChange={(event) =>
                        setFirstTabIgnorOrgStructureCheckboxHandler(
                          event.target.checked
                        )
                      }
                      checked={firstTabIgnorOrgStructureCheckbox}
                    >
                      Игнорировать орг. структуру
                    </Checkbox>
                  </ModalFormBlockStyled.Item>
                </ModalFormBlockStyled>
              ) : currentStep === 1 ? (
                <ModalWrapBlockStyled>
                  <SecondStepContentBlockStyled>
                    <Tree
                      checkable={true}
                      onCheck={checkedElementsInModalHandler}
                      treeData={webFeaturesTree}
                      checkedKeys={firstTabCheckedElements}
                    />
                  </SecondStepContentBlockStyled>
                </ModalWrapBlockStyled>
              ) : (
                <ModalWrapBlockStyled>
                  <ThirdStepContentBlockStyled>
                    <LeftContentBlockStyled>
                      <ContentHeaderStyled>Страница</ContentHeaderStyled>
                      <LeftBlockInnerContentStyled>
                        <Tree
                          onSelect={onSelectSecondTabModalThirdStepFeatureItem}
                          treeData={thirdStepTreeData}
                          disabled={selectedRole?.ignoreElementsSettings}
                        />
                      </LeftBlockInnerContentStyled>
                    </LeftContentBlockStyled>
                    <RightContentBlockStyled>
                      <RightContentHeaderRowStyled gutter={[0, 24]}>
                        <RightContentHeaderItemStyled
                          className="gutter-row"
                          span={6}
                        >
                          Доступность
                        </RightContentHeaderItemStyled>

                        <RightContentHeaderMidItemStyled
                          className="gutter-row"
                          span={11}
                        >
                          Элемент
                        </RightContentHeaderMidItemStyled>

                        <RightContentHeaderItemStyled
                          className="gutter-row"
                          span={7}
                        >
                          Только для чтения
                        </RightContentHeaderItemStyled>
                      </RightContentHeaderRowStyled>
                      <RightBlockInnerContentStyled>
                        {firstTabModalThirdStepFeaturesList &&
                          firstTabModalThirdStepFeaturesList.map(
                            (
                              schemeItem: FirstTabModalThirdStepFeaturesListType
                            ) => (
                              <RightContentListItemRowStyled
                                gutter={[0, 24]}
                                key={schemeItem.featureElementId}
                              >
                                <RightContentListAsideItemStyled
                                  className="gutter-row"
                                  span={6}
                                >
                                  <Checkbox
                                    checked={schemeItem.isAvailableCheck}
                                    onChange={(event) =>
                                      onCheckIsAvailableFeatureElementHandler(
                                        schemeItem,
                                        event.target.checked
                                      )
                                    }
                                  />
                                </RightContentListAsideItemStyled>

                                <RightContentListCenterItemStyled
                                  className="gutter-row"
                                  span={11}
                                >
                                  {schemeItem.itemTitle}
                                </RightContentListCenterItemStyled>

                                <RightContentListAsideItemStyled
                                  className="gutter-row"
                                  span={7}
                                >
                                  {!schemeItem.isReadableRendered ? (
                                    <></>
                                  ) : (
                                    <Checkbox
                                      checked={
                                        schemeItem.isReadableCheck === null
                                          ? false
                                          : schemeItem.isReadableCheck
                                      }
                                      disabled={!schemeItem.isAvailableCheck}
                                      onChange={(event) =>
                                        onCheckIsReadableFeatureElementHandler(
                                          schemeItem,
                                          event.target.checked
                                        )
                                      }
                                    />
                                  )}
                                </RightContentListAsideItemStyled>
                              </RightContentListItemRowStyled>
                            )
                          )}
                      </RightBlockInnerContentStyled>
                    </RightContentBlockStyled>
                  </ThirdStepContentBlockStyled>
                </ModalWrapBlockStyled>
              )}
            </ModalBlockStyled>
          </ModalStyled>
        )}
      </>
    );
  }
);
