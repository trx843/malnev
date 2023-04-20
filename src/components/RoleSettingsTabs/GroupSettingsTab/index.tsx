import React, { FC } from "react";
import {
  LayoutStyled,
  TableBlockStyled,
} from "./styled";
import { AgGridTable } from "components/AgGridTable";
import { AgGridColumn } from "ag-grid-react";
import { PlusCircleFilled } from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import { GroupSettingsModal } from "components/RoleSettingsModals/GroupSettingsModal";
import { OrgStructModel } from "classes/OrgStructInformation";
import { OstItem } from "classes/OstItem";
import { GroupSettingsRenderer } from "components/cellRenderers/GroupSettingsRenderer";
import { RoleGroupType } from "api/responses/role-settings-page.response";
import { DeleteRoleSettingsModal } from "components/RoleSettingsModals/DeleteRoleSettingsModal";

type PropsType = {
  rowData: Array<object>;
  isModalVisible: boolean;
  addGroupWindowOpenHandler: () => void;
  orgStructTree: OrgStructModel[];
  ostsList: OstItem[];
  isButtonLoading: boolean;
  groupSettingsOnCloseModalHandler: () => void;
  selectedGroup: RoleGroupType | null;
  onGroupSettingsDomainChangeHandler: (value: string) => void;
  modalVariant: string;
  onGroupSettingsNameChangeHandler: (value: string) => void;
  onGroupSettingsDescriptionChangeHandler: (value: string) => void;
  onGroupSettingsOSTChangeHandler: (value: any) => void;
  onGroupSettingsSubmitHandler: (modalVariant: string) => void;
  groupSettingsSubmitButtonStatus: boolean,
  onGroupSettingsDeleteHandler: () => void;
  onGroupSettingsDeleteCloseModalHandler: () => void;
  isDeleteGroupLoading: boolean;
  isDeleteGroupSettingsModalOpen: boolean;
};

export const GroupSettingsTab: FC<PropsType> = React.memo(
  ({
    isModalVisible,
    rowData,
    addGroupWindowOpenHandler,
    orgStructTree,
    ostsList,
    isButtonLoading,
    groupSettingsOnCloseModalHandler,
    selectedGroup,
    onGroupSettingsDomainChangeHandler,
    modalVariant,
    onGroupSettingsNameChangeHandler,
    onGroupSettingsDescriptionChangeHandler,
    onGroupSettingsOSTChangeHandler,
    onGroupSettingsSubmitHandler,
    groupSettingsSubmitButtonStatus,
    onGroupSettingsDeleteHandler,
    onGroupSettingsDeleteCloseModalHandler,
    isDeleteGroupLoading,
    isDeleteGroupSettingsModalOpen
  }) => {
    return (
      <LayoutStyled>
        <Card>
          <Row wrap={false} justify={"start"}>
            <Col>
              <Button
                type={"link"}
                icon={<PlusCircleFilled />}
                onClick={addGroupWindowOpenHandler}
              >
                Добавить группу
              </Button>
            </Col>
          </Row>
        </Card>

        <TableBlockStyled className="ag-theme-alpine">
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
              headerName="Группа"
              field="fullName"
            // minWidth={300}
            />
            <AgGridColumn
              headerName="Орг. структура"
              field="orgStructure"
            // minWidth={300}
            />
            <AgGridColumn
              headerName="Описание"
              field="description"
            // minWidth={400}
            />
            <AgGridColumn
              headerName="Действия"
              pinned="right"
              field="group"
              cellRendererFramework={GroupSettingsRenderer}
            />
          </AgGridTable>
        </TableBlockStyled>
        <GroupSettingsModal
          isButtonLoading={isButtonLoading}
          isModalVisible={isModalVisible}
          groupSettingsOnCloseModalHandler={groupSettingsOnCloseModalHandler}
          orgStructTree={orgStructTree}
          ostsList={ostsList}
          selectedGroup={selectedGroup}
          onGroupSettingsDomainChangeHandler={onGroupSettingsDomainChangeHandler}
          modalVariant={modalVariant}
          onGroupSettingsNameChangeHandler={onGroupSettingsNameChangeHandler}
          onGroupSettingsDescriptionChangeHandler={onGroupSettingsDescriptionChangeHandler}
          onGroupSettingsOSTChangeHandler={onGroupSettingsOSTChangeHandler}
          onGroupSettingsSubmitHandler={onGroupSettingsSubmitHandler}
          groupSettingsSubmitButtonStatus={groupSettingsSubmitButtonStatus}
        />
        <DeleteRoleSettingsModal
          modalText="Вы уверены, что хотите удалить группу?"
          isButtonLoading={isDeleteGroupLoading}
          isModalVisible={isDeleteGroupSettingsModalOpen}
          onCancelHandler={onGroupSettingsDeleteCloseModalHandler}
          onOkHandler={onGroupSettingsDeleteHandler}
        />
      </LayoutStyled>
    );
  }
);
