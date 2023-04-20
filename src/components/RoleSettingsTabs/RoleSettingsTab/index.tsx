import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Select,
  TreeSelect,
} from "antd";
import Title from "antd/lib/typography/Title";
import React, { FC } from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgGridColumn } from "ag-grid-react";
import { FormItemLabelStyled, FormStyled, SiderStyled } from "./styled";
import { RoleSettingsModal } from "../../RoleSettingsModals/RoleSettingsModal";
import { Content } from "antd/lib/layout/layout";
import { AgGridTable } from "../../AgGridTable";
import { RoleSettingsRenderer } from "../../cellRenderers/RoleSettingsRenderer";
import {
  RoleType,
  WebFeatureTreeType,
} from "../../../api/responses/role-settings-page.response";
import RightOutlined from "@ant-design/icons/lib/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import {
  FirstTabFilter,
  FirstTabModalThirdStepFeaturesListType,
} from "../../../slices/roleSettings";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import { TableBlockWrapperStyled } from "../../../styles/commonStyledComponents";
import { DeleteRoleSettingsModal } from "components/RoleSettingsModals/DeleteRoleSettingsModal";
import { ExportTableButton } from "components/ExportTableButton";
import { ExportOutlined } from "@ant-design/icons";

type PropsType = {
  isButtonLoading: boolean;
  webFeaturesTree: Array<WebFeatureTreeType>;
  collapsed: boolean;
  onCollapse: () => void;
  rowData: Array<object>;
  treeBindingByPagesProps: any;
  isModalVisible: boolean;
  onCancelHandler: () => void;
  onOkHandler: (modalVariant: string) => void;
  onAheadHandler: () => void;
  onBackHandler: () => void;
  selectedRole: RoleType | null;
  currentStep: number;
  thirdStepTreeData: Array<WebFeatureTreeType>;
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
  onChangeIgnorOrgStructure: (value: any) => void;
  onChangeRoleNameInputHandler: (value: string) => void;
  firstTabFilter: FirstTabFilter;
  addRoleWindowOpenHandler: () => void;
  modalVariant: string;
  onSwitchIgnoreElementsSettingsHandler: () => void;
  onRoleSettingsDeleteHandler: () => void;
  onRoleSettingsDeleteCloseModalHandler: () => void;
  isDeleteRoleLoading: boolean;
  isDeleteRoleSettingsModalOpen: boolean;
  onExportRoleHandler: () => void;
  exportLoading: boolean;
};

export const RoleSettingsTab: FC<PropsType> = React.memo(
  ({
    collapsed,
    onCollapse,
    rowData,
    treeBindingByPagesProps,
    isModalVisible,
    onChangeIgnorOrgStructure,
    currentStep,
    onCancelHandler,
    onOkHandler,
    onAheadHandler,
    onBackHandler,
    thirdStepTreeData,
    isButtonLoading,
    selectedRole,
    webFeaturesTree,
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
    roleSettingsModalSecondStepOnAheadHandler,
    firstTabModalThirdStepFeaturesList,
    onSelectSecondTabModalThirdStepFeatureItem,
    onCheckIsAvailableFeatureElementHandler,
    onCheckIsReadableFeatureElementHandler,
    onChangeRoleNameInputHandler,
    firstTabFilter,
    addRoleWindowOpenHandler,
    modalVariant,
    onSwitchIgnoreElementsSettingsHandler,
    onRoleSettingsDeleteHandler,
    onRoleSettingsDeleteCloseModalHandler,
    isDeleteRoleLoading,
    isDeleteRoleSettingsModalOpen,
    onExportRoleHandler,
    exportLoading,
  }) => {
    const { Option } = Select;


    return (
      <>
        <Layout>
          <SiderStyled
            width={280}
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
          >
            <Row gutter={[16, 48]}>
              <Col span={24}>
                <div style={{ padding: 16 }}>
                  <Row
                    justify={collapsed ? "center" : "space-between"}
                    align="middle"
                  >
                    <Col style={{ display: collapsed ? "none" : "block" }}>
                      <Title level={4}>Фильтр</Title>
                    </Col>
                    <Col>
                      {React.createElement(
                        collapsed ? RightOutlined : LeftOutlined,
                        {
                          onClick: onCollapse,
                        }
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ display: collapsed ? "none" : "block" }}>
                      <FormStyled layout={"vertical"} collapsed={collapsed}>
                        <Form.Item name={"role"}>
                          <FormItemLabelStyled>Роль</FormItemLabelStyled>
                          <Input
                            value={firstTabFilter.roleName}
                            onChange={(event) => {
                              onChangeRoleNameInputHandler(event.target.value);
                            }}
                            placeholder="Введите имя роли"
                          />
                        </Form.Item>
                        <Form.Item>
                          <FormItemLabelStyled>
                            Игнорировать орг.структуру
                          </FormItemLabelStyled>
                          <Select
                            placeholder={"Все"}
                            allowClear
                            onChange={(value) =>
                              onChangeIgnorOrgStructure(value)
                            }
                          >
                            <Option value={1}>Да</Option>
                            <Option value={0}>Нет</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item>
                          <FormItemLabelStyled>
                            Привязка к страницам
                          </FormItemLabelStyled>
                          <TreeSelect {...treeBindingByPagesProps} />
                        </Form.Item>
                      </FormStyled>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </SiderStyled>
          <Content>
            <TableBlockWrapperStyled className="ag-theme-alpine">
              <Card>
                <Row wrap={false} justify={"space-between"}>
                  <Col>
                    <Button
                      type={"link"}
                      icon={<PlusCircleFilled />}
                      onClick={addRoleWindowOpenHandler}
                    >
                      Добавить роль
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="link"
                      disabled={exportLoading}
                      loading={exportLoading}
                      icon={<ExportOutlined />}
                      onClick={onExportRoleHandler}
                    >
                      Экспортировать
                    </Button>
                  </Col>
                </Row>
              </Card>

              <AgGridTable
                rowData={rowData}
                rowSelection="single"
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
              >
                <AgGridColumn
                  headerName="Название"
                  field="itemName"
                  // minWidth={300}
                />
                <AgGridColumn
                  headerName="Описание"
                  field="description"
                  // minWidth={300}
                />
                <AgGridColumn
                  headerName="Игнорировать орг.структуру"
                  field="ignoreOrgStructText"
                  // minWidth={300}
                />
                <AgGridColumn
                  headerName="Привязка к страницам"
                  field="pagesMap"
                  tooltipField="pagesMap"
                  maxWidth={500}
                />
                <AgGridColumn
                  headerName="Привязка к элементам"
                  field="elementsMap"
                  tooltipField="elementsMap"
                  maxWidth={500}
                />
                <AgGridColumn
                  headerName="Действия"
                  pinned="right"
                  cellRendererFramework={RoleSettingsRenderer}
                />
              </AgGridTable>
            </TableBlockWrapperStyled>
          </Content>
          <RoleSettingsModal
            isButtonLoading={isButtonLoading}
            webFeaturesTree={webFeaturesTree}
            selectedRole={selectedRole}
            isModalVisible={isModalVisible}
            onCancelHandler={onCancelHandler}
            onOkHandler={onOkHandler}
            onAheadHandler={onAheadHandler}
            onBackHandler={onBackHandler}
            currentStep={currentStep}
            modalVariant={modalVariant}
            thirdStepTreeData={thirdStepTreeData}
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
            onSwitchIgnoreElementsSettingsHandler={
              onSwitchIgnoreElementsSettingsHandler
            }
          />
          <DeleteRoleSettingsModal
            modalText="Вы уверены, что хотите удалить роль?"
            isButtonLoading={isDeleteRoleLoading}
            isModalVisible={isDeleteRoleSettingsModalOpen}
            onCancelHandler={onRoleSettingsDeleteCloseModalHandler}
            onOkHandler={onRoleSettingsDeleteHandler}
          />
        </Layout>
      </>
    );
  }
);
