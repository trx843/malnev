import { Alert, Checkbox, Col, Row, Spin } from "antd";
import React from "react";
import { FC } from "react";
import { SiEquipment, SiEquipmentBinding } from "../../classes";
import { AgGridTable } from "../AgGridTable";
import "./selectSi.css";
import {
  TextDarkStyled as DarkStyled,
  TextGrayStyled as GrayStyled,
} from "../../styles/commonStyledComponents";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsInstallSi,
  setNewSi,
  SiequipmentsStateType,
} from "../../slices/siequipment";
import { StateType } from "../../types";
import { boolean } from "yup";

interface SelectSiProps {
  isEditForm: boolean;
}
export const SelectSi: FC<SelectSiProps> = ({ isEditForm }) => {
  const dispatch = useDispatch();
  const {
    isInstallSi,
    siTableisLoading,
    siequipmentsForTable,
    oldSi,
    newSi,
    techPosition,
  } = useSelector<StateType, SiequipmentsStateType>(
    (state) => state.siequipment
  );

  const handleSelectionChanged = (selectedRows: SiEquipment[]) => {
    if (selectedRows.length > 0) dispatch(setNewSi(selectedRows[0]));
  };

  const TableColumns = [
    {
      headerName: "Тип СИ",
      field: "siTypeName",
    },
    {
      headerName: "Модель СИ",
      field: "siModelName",
    },
    {
      headerName: "Заводской номер",
      field: "manufNumber",
    },
    {
      headerName: "Производитель",
      field: "manufacturer",
    },
    {
      headerName: "Текущая ТП",
      field: "techPositionName",
    },
    {
      headerName: "СИКН",
      field: "siknFullName",
    },
  ];
  return (
    <>
      <Row justify={"start"} align={"middle"} gutter={[36, 16]}>
        <Col>
          <GrayStyled>Технологическая позиция</GrayStyled>
          <DarkStyled>{techPosition.shortName}</DarkStyled>
        </Col>
        {!isEditForm && (
          <Col>
            <Checkbox
              checked={!isInstallSi}
              onClick={() => {
                dispatch(setIsInstallSi(!isInstallSi));
                dispatch(setNewSi(undefined));
              }}
            >
              Не устанавливать СИ
            </Checkbox>
          </Col>
        )}
      </Row>
      <Row gutter={[16, 16]}>
        {/* Отображаеть, если это не прочее оборудование */}
        {techPosition.siTypeId !== 27 && techPosition.siTypeId !== 23 && (
          <Col span={24}>
            <GrayStyled>Сейчас установлено</GrayStyled>
            <DarkStyled>
              {oldSi
                ? `${oldSi.siName} ${oldSi.siknFullName ?? ""}`
                : "Не установлено"}
            </DarkStyled>
          </Col>
        )}
      </Row>
      <Row gutter={[16, 16]}>
        {(isInstallSi || isEditForm) && (
          <Col span={24}>
            <GrayStyled>Будет установлено</GrayStyled>
            <DarkStyled>
              {newSi
                ? `${newSi.siName} ${newSi.siknFullName ?? ""}`
                : "Выберите СИ в таблице"}
            </DarkStyled>
          </Col>
        )}
      </Row>

      {(isInstallSi || isEditForm) && (
        <>
          <Row gutter={[32, 32]}>
            <Col span={24}>
              <Spin spinning={siTableisLoading}>
                <AgGridTable
                  className={"EditorSiMapForm-table"}
                  rowData={siequipmentsForTable}
                  columnDefs={TableColumns}
                  rowSelection="single"
                  onSelectionChanged={handleSelectionChanged}
                  isAutoSizeColumns
                  defaultColDef={{
                    sortable: true,
                    filter: true,
                    resizable: true,
                  }}
                />
              </Spin>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
