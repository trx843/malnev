import { Col, Form, Input, Modal, Row, Select } from "antd";
import { RoleGroupType } from "api/responses/role-settings-page.response";
import { OrgStructModel } from "classes/OrgStructInformation";
import { OstItem } from "classes/OstItem";
import React, { FC } from "react";
import { UniButton } from "../../UniButton";
import { FormItemsGroupLableStyled } from "./styled";

type PropsType = {
  isModalVisible: boolean;
  groupSettingsOnCloseModalHandler: () => void;
  orgStructTree: OrgStructModel[];
  ostsList: OstItem[];
  isButtonLoading: boolean;
  selectedGroup: RoleGroupType | null;
  onGroupSettingsDomainChangeHandler: (value: string) => void;
  modalVariant: string;
  onGroupSettingsNameChangeHandler: (value: string) => void;
  onGroupSettingsDescriptionChangeHandler: (value: string) => void;
  onGroupSettingsOSTChangeHandler: (value: any) => void;
  onGroupSettingsSubmitHandler: (modalVariant: string) => void;
  groupSettingsSubmitButtonStatus: boolean

};

export const GroupSettingsModal: FC<PropsType> = React.memo(
  ({
    isModalVisible,
    groupSettingsOnCloseModalHandler,
    ostsList,
    isButtonLoading,
    selectedGroup,
    onGroupSettingsDomainChangeHandler,
    modalVariant,
    onGroupSettingsNameChangeHandler,
    onGroupSettingsDescriptionChangeHandler,
    onGroupSettingsOSTChangeHandler,
    onGroupSettingsSubmitHandler,
    groupSettingsSubmitButtonStatus
  }) => {
    return (
      <>
        {isModalVisible && (
          <Modal
            maskClosable={false}
            title={modalVariant === "edit" ? "Редактирование" : "Добавление"}
            visible={isModalVisible}
            onCancel={groupSettingsOnCloseModalHandler}
            footer={[
              <UniButton
                key={"submit"}
                htmlType={"submit"}
                title={modalVariant === "edit" ? "Обновить" : "Добавить"}
                type={"primary"}
                isDisabled={groupSettingsSubmitButtonStatus}
                buttonHandler={() => onGroupSettingsSubmitHandler(modalVariant)}
                isButtonLoading={isButtonLoading}
              />,
            ]}
          >
            <Form
              layout={"vertical"}
              name={"form_in_modal"}
            >
              <FormItemsGroupLableStyled>Имя</FormItemsGroupLableStyled>
              <Form.Item name={"domen"} label={"Домен"}>
                <Input 
                  type="text"
                  defaultValue={selectedGroup?.domain}
                  value={selectedGroup?.domain}
                  onChange={(e) => onGroupSettingsDomainChangeHandler(e.target.value)}
                />
              </Form.Item>
              <Form.Item name={"itemName"} label={"Название"}>
                <Input 
                  type="text"
                  defaultValue={selectedGroup?.name}
                  value={selectedGroup?.name} 
                  onChange={(e) => onGroupSettingsNameChangeHandler(e.target.value)}
                />
              </Form.Item>
              <Form.Item name={"description"} label={"Описание"}>
                <Input 
                  type="text"
                  defaultValue={selectedGroup?.description === null ? "" : selectedGroup?.description}
                  value={selectedGroup?.description === null ? "" : selectedGroup?.description} 
                  onChange={(e) => onGroupSettingsDescriptionChangeHandler(e.target.value)}
                />
              </Form.Item>
              <FormItemsGroupLableStyled>
                Орг. структура
              </FormItemsGroupLableStyled>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item name={"ostId"} label={"ОСТ"}>
                    <Select
                      showSearch
                      showArrow
                      mode="multiple"
                      allowClear
                      maxTagCount={1}
                      optionFilterProp={"label"}
                      options={ostsList.map((x) => ({
                        label: x.fullName,
                        value: x.id,
                        key: x.id,
                      }))}
                      defaultValue={selectedGroup?.ostIdList}
                      onChange={(value: any) => onGroupSettingsOSTChangeHandler(value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        )}
      </>
    );
  }
);
