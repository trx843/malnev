import { ICellRendererParams } from "ag-grid-community";
import { Col, Row } from "antd";
import { FC } from "react";
import { useDispatch } from "react-redux";
import {
    setIsDeleteGroupSettingsModalOpen,
  setIsGroupSettingsModalOpen,
  setModalVariant,
  setSelectedGroup,
} from "../../slices/roleSettings";
import {
    DeleteTableButtonIconStyled,
  EditTableButtonIconStyled,
  TableButtonStyled,
} from "../RoleSettingsTabs/RoleSettingsTab/styled";

export const GroupSettingsRenderer: FC<ICellRendererParams> = (
  props: ICellRendererParams
) => {
  const dispatch = useDispatch();
  return (
    <Row>
      <Col>
        <TableButtonStyled
          onClick={() => {
            dispatch(setIsGroupSettingsModalOpen(true));
            dispatch(setModalVariant("edit"));
            dispatch(setSelectedGroup(props.data));
          }}
        >
          <EditTableButtonIconStyled />
        </TableButtonStyled>
      </Col>
      <Col>
        <TableButtonStyled
          onClick={() => {
            dispatch(setIsDeleteGroupSettingsModalOpen(true));
            dispatch(setSelectedGroup(props.data));
          }}
        >
          <DeleteTableButtonIconStyled />
        </TableButtonStyled>
      </Col>
    </Row>
  );
};
