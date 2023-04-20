import { ICellRendererParams } from "ag-grid-community";
import { Col, Row } from "antd";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import {
    setIsDeleteRoleSettingsModalOpen,
  setIsRoleSettingsModalOpen,
  setModalVariant,
  setSelectedRole,
} from "../../slices/roleSettings";
import {
  DeleteTableButtonIconStyled,
  EditTableButtonIconStyled,
  TableButtonStyled,
} from "../RoleSettingsTabs/RoleSettingsTab/styled";
import { deleteRoleTC } from "thunks/roleSettings";
const { confirm } = Modal;

export const RoleSettingsRenderer: FC<ICellRendererParams> = (
  props: ICellRendererParams
) => {
  const dispatch = useDispatch();
  return (
    <Row>
      <Col>
        <TableButtonStyled
          onClick={() => {
            dispatch(setIsRoleSettingsModalOpen(true));
            dispatch(setModalVariant("edit"));
            dispatch(setSelectedRole(props.data));
          }}
        >
          <EditTableButtonIconStyled />
        </TableButtonStyled>
      </Col>
      <Col>
        <TableButtonStyled
          onClick={() => {
            dispatch(setIsDeleteRoleSettingsModalOpen(true));
            dispatch(setSelectedRole(props.data));
          }}
        >
          <DeleteTableButtonIconStyled />
        </TableButtonStyled>
      </Col>
    </Row>
  );
};


