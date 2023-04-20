import React, { useCallback, useEffect, useMemo, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Modal, Spin } from "antd";

import { TabsFilter } from "./TabsFilter";
import { StateType } from "../../../../../../../types";
import { IViolationListModel } from "../../../../../../../slices/pspControl/actionPlanTypicalViolations/types";
import { AgGridTable } from "../../../../../../AgGridTable";
import {
  IViolationListItemModel,
  ModalConfigTypes,
  VerificationActStore,
} from "../../../../../../../slices/verificationActs/verificationAct/types";
import { getFilterViolationScheduleThunk } from "../../../../../../../thunks/verificationActs/verificationAct";
import { resetListFilter } from "../../../../../../../slices/verificationActs/verificationAct";

import styles from "./AddViolationsModal.module.css";
import { useVerificationModals } from "../../../Provider";
import { ViolationActModals } from "../../../Sections/IdentifiedViolationsOrRecommendations/constants";
import { isEmpty } from "lodash";
import { AgGridColumn } from "ag-grid-react";
import { RendererProps } from "components/ItemsTable";

const cx = classNames.bind(styles);

interface AddTypicalViolationsModalProps {
  visible?: boolean;
  onClose?: () => void;
}

const getRowSpan = (params: any) => {
  return params.data.isRow ? params.data.violations.length : 1;
};

export const AddTypicalViolationFromDirectory: FC<
  AddTypicalViolationsModalProps
> = ({ visible, onClose }) => {
  const modalsState = useVerificationModals();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [pendingAddViolation, setPendingViolation] = useState(false);

  const [selectedViolations, setSelectedViolations] = useState<
    IViolationListModel[]
  >([]);

  const { act, modalConfigs } = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const getViolations = useCallback(async () => {
    try {
      if (visible) {
        dispatch(
          getFilterViolationScheduleThunk({
            modalType: ModalConfigTypes.IdentifiedViolations,
          })
        );
      }
    } finally {
      setLoading(false);
    }
  }, [visible]);

  useEffect(() => {
    getViolations();
  }, [getViolations]);

  const handleSelectionChanged = (selectedRows: IViolationListModel[]) =>
    setSelectedViolations(selectedRows);

  const handleCloseModal = () => {
    dispatch(resetListFilter(ModalConfigTypes.IdentifiedViolations));
    setSelectedViolations([]);
    onClose?.();
  };

  const handleAddViolations = async () => {
    if (act?.id) {
      try {
        setPendingViolation(true);
        const selectedViolation = selectedViolations[0] as any;

        const prepared = {
          isDublicate: isEmpty(selectedViolation.duplicate)
            ? false
            : selectedViolation.duplicate,

          violations: selectedViolation.violations.map((item: any) => ({
            pointNormativeDocuments: item.pointNormativeDocuments,
            violationText: item.violationText,
          })),
          specialOpinion: selectedViolation.specialOpinion,
          typicalViolationId: selectedViolation.typicalViolationId,
          classifficationTypeId: null,
          classifficationTypeName: selectedViolation.classifficationTypeName,
          sourceRemarkId: selectedViolation.sourceRemarkId,
          sourceRemark: selectedViolation.sourceRemark,
          serial: selectedViolation.serial,
        };

        handleCloseModal();
        modalsState.setModal({
          visible: true,
          payload: prepared,
          type: ViolationActModals.NEW_VIOLATION_FROM_DIR_MODAL,
        });
      } finally {
        setPendingViolation(false);
      }
    }
  };

  const violations = useMemo(
    () =>
      modalConfigs[ModalConfigTypes.IdentifiedViolations].violations
        .map((item) =>
          item.violations.reduce(
            (
              acc: IViolationListItemModel & { violationId: string }[],
              violation: IViolationListItemModel & { violationId: string },
              index
            ) => [
              ...acc,
              {
                ...violation,
                ...item,
                id: item.id,
                violationId: item.id,
                isRow:
                  (violation as any).identifiedViolationsId !==
                    acc[index - 1]?.violationId || index === 0,
              },
            ],
            []
          )
        )
        .flat(),
    [modalConfigs[ModalConfigTypes.IdentifiedViolations].violations]
  );

  const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

  return (
    <Modal
      width={1448}
      visible={visible}
      title="Добавить нарушение"
      onOk={handleAddViolations}
      onCancel={handleCloseModal}
      okButtonProps={{
        loading: pendingAddViolation,
        disabled: !selectedViolations.length,
      }}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      okText="Добавить"
      maskClosable={false}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <TabsFilter />
        <AgGridTable
          className={cx("table")}
          rowData={violations}
          rowSelection="single"
          onSelectionChanged={handleSelectionChanged}
          suppressRowClickSelection={true}
          suppressRowTransform={true}
          isBasicMultipleRowSelection
          defaultColDef={{
            wrapText: true,
            resizable: true,
            cellStyle: staticCellStyle,
            filter: true,
            sortable: true,
          }}
          rowHeight={100}
          isAutoSizeColumns={false}
        >
          <AgGridColumn
            headerName="Зона ответственности"
            field="areaOfResponsibility"
            rowSpan={getRowSpan}
            cellClassRules={{
              [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
            }}
            minWidth={100}
          />
          <AgGridColumn
            headerName="Система учета/ИЛ"
            field="osuShortName"
            rowSpan={getRowSpan}
            cellClassRules={{
              [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
            }}
            minWidth={100}
          />
          <AgGridColumn
            headerName="Номер по классификации"
            field="classifficationNumber"
            rowSpan={getRowSpan}
            cellClassRules={{
              [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
            }}
            minWidth={100}
          />
          <AgGridColumn
            headerName="Номер нарушения"
            field="identifiedViolationSerial"
            rowSpan={getRowSpan}
            cellClassRules={{
              [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
            }}
            minWidth={100}
          />
          <AgGridColumn
            headerName="Номер подпункта"
            field="serial"
            cellRendererFramework={(props: RendererProps<any>) =>
              `${props.data.identifiedViolationSerial}.${props.value}`
            }
            minWidth={100}
          />
          <AgGridColumn
            headerName="Нарушение"
            field="violationText"
            minWidth={100}
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(props) => (
              <div className={cx("action-text")}>{props.value}</div>
            )}
          />
          <AgGridColumn
            headerName="Пункт НД и/или ОРД"
            field="pointNormativeDocuments"
            minWidth={100}
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(props) => (
              <div className={cx("action-text")}>{props.value}</div>
            )}
          />
          <AgGridColumn
            headerName="Номер типового нарушения"
            field="typicalViolationNumber"
            rowSpan={getRowSpan}
            cellClassRules={{
              [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
            }}
            minWidth={100}
          />
        </AgGridTable>
      </Spin>
    </Modal>
  );
};
