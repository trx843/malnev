import { useMemo, FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Spin, Modal } from "antd";
import { AgGridColumn } from "ag-grid-react";

import { AgGridTable } from "components/AgGridTable";
import {
  ActionPlanTypicalViolationsStore,
  IViolationListModel,
} from "slices/pspControl/actionPlanTypicalViolations/types";
import {
  addTypicalViolationThunk,
  getViolationsThunk,
} from "../../../../thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { StateType } from "types";
import {
  resetListFilter,
  toggleAddViolationsModalVisibility,
} from "../../../../slices/pspControl/actionPlanTypicalViolations";
import { TabsFilter } from "./components/TabsFilter";
import styles from "./AddViolationsModal.module.css";
import { RendererProps } from "components/ItemsTable";

const cx = classNames.bind(styles);

const getRowSpan = (params: any) => {
  return params.data.isRow ? params.data.violations.length : 1;
};

interface ModalProps {
  visible?: boolean;
  onClose?: () => void;
}

export const AddViolationsModal: FC<ModalProps> = ({ visible = false, onClose }) => {
  const dispatch = useDispatch();

  const [selectedViolations, setSelectedViolations] = useState<
    IViolationListModel[]
  >([]);

  const {
    typicalPlanCard,
    listFilter,
    violations,
    isViolationsLoading,
    isAddViolationsModalVisible,
    isAddingTypicalViolation,
  } = useSelector<StateType, ActionPlanTypicalViolationsStore>(
    (state) => state.actionPlanTypicalViolations
  );

  const planId = typicalPlanCard?.id;

  useEffect(() => {
    function init() {
      dispatch(getViolationsThunk());
      setSelectedViolations([]);
    }

    if (visible) {
      init();
    }
  }, [listFilter, visible]);

  const handleSelectionChanged = (selectedRows: IViolationListModel[]) =>
    setSelectedViolations(selectedRows);

  const handleCloseModal = () => {
    dispatch(toggleAddViolationsModalVisibility());
    setSelectedViolations([]);
    dispatch(resetListFilter());
    onClose?.();
  };

  const handleAddViolations = async () => {
    if (planId) {
      const ids = selectedViolations.map((v) => v.id);
      await dispatch(addTypicalViolationThunk({ id: planId, violations: ids }));
      handleCloseModal();
    }
  };

  const items = useMemo(() => {
    const updated = (violations as any[])
      .map((item) =>
        item.violations.reduce(
          (acc, violation, index) => [
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
      .flat();

    return updated;
  }, [violations]);

  return (
    <Modal
      width={1448}
      visible={visible}
      title="Добавить нарушение"
      onOk={handleAddViolations}
      onCancel={handleCloseModal}
      okButtonProps={{
        loading: isViolationsLoading || isAddingTypicalViolation,
        disabled: !selectedViolations.length,
      }}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      okText="Добавить"
      maskClosable={false}
      destroyOnClose
    >
      <Spin spinning={isViolationsLoading || isAddingTypicalViolation}>
        <TabsFilter />
        <AgGridTable
          className={cx("table")}
          rowData={items}
          rowSelection="multiple"
          onSelectionChanged={handleSelectionChanged}
          suppressRowClickSelection={true}
          suppressRowTransform={true}
          isBasicMultipleRowSelection
        >
          <AgGridColumn
            headerName="Зона ответственности"
            field="areaOfResponsibility"
            rowSpan={getRowSpan}
            cellClassRules={{
              [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
            }}
          />
          <AgGridColumn
            headerName="Система учета/ИЛ"
            field="osuShortName"
            rowSpan={getRowSpan}
            cellClassRules={{
              [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
            }}
          />
          <AgGridColumn
            headerName="Номер по классификации"
            field="classifficationNumber"
            rowSpan={getRowSpan}
            cellClassRules={{
              [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
            }}
          />
          <AgGridColumn
            headerName="Номер нарушения"
            field="identifiedViolationSerial"
            rowSpan={getRowSpan}
            cellClassRules={{
              [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
            }}
          />
          <AgGridColumn
            headerName="Номер подпункта"
            field="serial"
            cellRendererFramework={(props: RendererProps<any>) =>
              `${props.data.identifiedViolationSerial}.${props.value}`
            }
          />
          <AgGridColumn headerName="Нарушение" field="violationText" />
          <AgGridColumn
            headerName="Пункт НД и/или ОРД"
            field="pointNormativeDocuments"
          />
          <AgGridColumn
            headerName="Номер типового нарушения"
            field="typicalViolationNumber"
            rowSpan={getRowSpan}
            cellClassRules={{
              [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
            }}
          />
        </AgGridTable>
      </Spin>
    </Modal>
  );
};
