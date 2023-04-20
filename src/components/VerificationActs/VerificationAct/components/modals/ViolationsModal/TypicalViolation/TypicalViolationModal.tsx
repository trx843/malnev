import React, { FC, useCallback, useMemo, useEffect, useState } from "react";
import { Button, Modal } from "antd";
import isEmpty from "lodash/isEmpty";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { AgGridColumn } from "ag-grid-react";

import {
  IViolationListModel,
  ModalConfigTypes,
  VerificationActStore,
} from "../../../../../../../slices/verificationActs/verificationAct/types";
import { StateType } from "../../../../../../../types";
import { AgGridTable } from "../../../../../../AgGridTable";
import styles from "./TypicalViolationsModal.module.css";
import {
  getFilterDescriptionViolationThunk,
  getFilterViolationScheduleThunk,
} from "../../../../../../../thunks/verificationActs/verificationAct";
import {
  getListFilterBaseParams,
  mapOptions,
} from "../AddTypicalViolationFromDirectory/TabsFilter/utils";
import { getFilterValues } from "../../../../../../../actions/customfilter";
import { useVerificationModals } from "../../../Provider";
import { resetListFilter } from "../../../../../../../slices/verificationActs/verificationAct";
import { ViolationActModals } from "../../../Sections/IdentifiedViolationsOrRecommendations/constants";
import { isFirstColumn } from "components/AgGridTable/utils";
import { TypicalViolationTabsFilter } from "./TypicalViolationTabsFilter";
import { FullWidthCell } from "pages/PspControl/PlanCardPage/components/FullWidthCell";
import { groupedTypicalViolationsRowsByCell } from "components/VerificationActs/VerificationAct/helpers";

const cx = classNames.bind(styles);

export const TableColumns = [
  {
    headerName: "№ типового нарушения",
    field: "identifiedViolationSerial",
  },
  { headerName: "Номер подпункта", field: "violationSerial" },
  { headerName: "Содержание нарушения", field: "violationText" },
  { headerName: "Требование НД", field: "pointNormativeDocuments" },
];
interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

const getRowSpan = (params: any) => {
  return params.data.isRow ? params.data.typicalViolations.length : 1;
};

export const TypicalViolationModal: FC<ModalProps> = ({ visible, onClose }) => {
  const modalsState = useVerificationModals();
  const [pendingAddViolation, setPendingViolation] = useState(false);
  const dispatch = useDispatch();
  const { act, modalConfigs } = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const [selectedViolations, setSelectedViolations] = React.useState<
    IViolationListModel[]
  >([]);

  const getFilter = useCallback(async () => {
    if (visible) {
      dispatch(
        getFilterDescriptionViolationThunk(ModalConfigTypes.TypicalViolation)
      );
    }
  }, [visible]);

  useEffect(() => {
    getFilter();
  }, [getFilter]);

  const getViolations = useCallback(async () => {
    if (visible) {
      dispatch(
        getFilterViolationScheduleThunk({
          modalType: ModalConfigTypes.TypicalViolation,
        })
      );
    }
  }, [visible]);

  useEffect(() => {
    getViolations();
  }, [getViolations, modalConfigs.TypicalViolation.listFilter]);

  const handleOnClose = () => {
    onClose?.();
  };

  const handleFetchSelectOptions = async (
    name: string,
    values: any,
    controller: string
  ) => {
    const params = getListFilterBaseParams(name, values);
    const response: string[] = await getFilterValues(name, controller, params);

    return mapOptions(response);
  };

  const handleSelectionChanged = (selectedRows: IViolationListModel[]) =>
    setSelectedViolations(selectedRows);

  const handleChangeField = async (values: any) => {
    const filter = {
      ...modalConfigs[ModalConfigTypes.IdentifiedViolations].listFilter,
      filter: {
        ...modalConfigs[ModalConfigTypes.IdentifiedViolations].listFilter
          .filter,
        ...values,
      },
    };

    dispatch(
      getFilterViolationScheduleThunk({
        listFilter: filter,
        modalType: ModalConfigTypes.TypicalViolation,
      })
    );
  };

  const handleCloseModal = () => {
    dispatch(resetListFilter(ModalConfigTypes.TypicalViolation));
    setSelectedViolations([]);
    onClose?.();
  };

  const handleAddViolations = async () => {
    if (act?.id && !isEmpty(selectedViolations)) {
      try {
        setPendingViolation(true);
        handleCloseModal();

        const selectedViolation = selectedViolations[0] as any;

        const prepared = {
          typicalViolationNumber: selectedViolation.identifiedViolationSerial,
          serial: selectedViolation.identifiedViolationSerial,
          classificationTypeId: selectedViolation.classifficationTypeId,
          classificationTypeName: selectedViolation.classifficationTypeName,
          sourceRemark: selectedViolation.sourceRemark,
          sourceRemarkId: selectedViolation.sourceRemarkId,
          specialOpinion: selectedViolation.specialOpinion,
          identifiedTypicalViolationId: selectedViolation.id,
          isDublicate: isEmpty(selectedViolation.duplicate)
            ? false
            : selectedViolation.duplicate,
          violations: selectedViolation.typicalViolations.map((violation) => ({
            pointNormativeDocuments: violation.pointNormativeDocuments,
            violationText: violation.typicalViolationText,
          })),
        };
        modalsState.setModal({
          visible: true,
          payload: prepared,
          type: ViolationActModals.NEW_TYPICAL_VIOLATION_MODAL,
        });
      } finally {
        setPendingViolation(false);
      }
    }
  };
  const items = useMemo(() => {
    const violations =
      modalConfigs[ModalConfigTypes.TypicalViolation].violations;
    const updated = violations
      .map((item) =>
        item.typicalViolations.reduce(
          (acc: any[], violation, index) => [
            ...acc,
            {
              ...violation,
              ...item,
              id: item.id,
              violationId: item.id,
              isRow:
                (item as any).id !== acc[index - 1]?.violationId || index === 0,
            },
          ],
          []
        )
      )
      .flat();
    const updatedResult = groupedTypicalViolationsRowsByCell(updated);
    return updatedResult;
  }, [modalConfigs]);

  const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

  return (
    <Modal
      title="Типовые нарушения"
      visible={visible}
      maskClosable={false}
      onCancel={handleOnClose}
      destroyOnClose
      width={850}
      footer={
        <Button
          loading={pendingAddViolation}
          disabled={pendingAddViolation || isEmpty(selectedViolations)}
          type="primary"
          onClick={handleAddViolations}
        >
          Сохранить
        </Button>
      }
    >
      <TypicalViolationTabsFilter />

      <AgGridTable
        className={cx("table")}
        rowData={items}
        suppressRowClickSelection={true}
        suppressRowTransform={true}
        rowSelection={"single"}
        fullWidthCellRendererFramework={FullWidthCell}
        isFullWidthCell={(rowNode) => rowNode.data?._isFullWidthRow}
        onSelectionChanged={handleSelectionChanged}
        defaultColDef={{
          checkboxSelection: isFirstColumn,
          wrapText: true,
          resizable: true,
          cellStyle: staticCellStyle,
          filter: true,
          sortable: true,
        }}
        isAutoSizeColumns={false}
      >
        <AgGridColumn
          headerName={"№ типового нарушения"}
          field={"identifiedViolationSerial"}
          rowSpan={getRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
          minWidth={100}
          width={146}
        />
        <AgGridColumn
          headerName={"№ подпункта"}
          field={"typicalViolationSerial"}
          minWidth={100}
          width={143}
        />
        <AgGridColumn
          headerName={"Содержание нарушения"}
          field={"typicalViolationText"}
          minWidth={220}
          width={240}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
          tooltipField={"typicalViolationText"}
        />
        <AgGridColumn
          headerName={"Требование НД"}
          field={"pointNormativeDocuments"}
          minWidth={170}
          width={243}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
          tooltipField={"pointNormativeDocuments"}
        />
      </AgGridTable>
    </Modal>
  );
};
