import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Spin, Modal } from "antd";
import _ from "lodash";
import { GridReadyEvent } from "ag-grid-community";
import { StateType } from "../../../../../types";
import {
  IVerificationScheduleCardStore,
  resetBaseFilter,
} from "../../../../../slices/pspControl/verificationScheduleCard";
import { TableColumns } from "./constants";
import {
  addPspsToVerificationScheduleThunk,
  getCheckingObjectsThunk,
} from "../../../../../thunks/pspControl/verificationScheduleCard";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { TabsFilter } from "./components/TabsFilter";
import { getCheckingObjectsParams } from "./utils";
import { ISiknLabRsuVerificationSchedulesModel } from "slices/pspControl/verificationScheduleCard/types";
import { useInitSelectedRows } from "components/AgGridTable/hooks/useInitSelectedRows";
import styles from "./modalForAddingCheckingObjects.module.css";

const cx = classNames.bind(styles);

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
}

export const ModalForAddingCheckingObjects: React.FC<IProps> = ({
  isVisible,
  onCancel,
}) => {
  const dispatch = useDispatch();

  const {
    baseFilter,
    verificationScheduleCardInfo,
    checkingObjects,
    isCheckingObjectsLoading,
    isAddPspsToVerificationSchedulePending,
  } = useSelector<StateType, IVerificationScheduleCardStore>(
    (state) => state.verificationScheduleCard
  );

  const {
    selectedItems,
    setSelectedItems,
    setSelectedItemsOnCurrentPage,
    onSelectionChanged,
    setGridApi,
  } = useInitSelectedRows(checkingObjects);

  useEffect(() => {
    function init(
      verificationScheduleCardInfo: ISiknLabRsuVerificationSchedulesModel
    ) {
      const params = getCheckingObjectsParams(verificationScheduleCardInfo);
      dispatch(getCheckingObjectsThunk(params));
    }

    if (verificationScheduleCardInfo) init(verificationScheduleCardInfo);
  }, [baseFilter, verificationScheduleCardInfo]);

  const handleCloseModal = () => {
    onCancel();
    setSelectedItems([]);
    setSelectedItemsOnCurrentPage([]);
    dispatch(resetBaseFilter());
  };

  const handleAddPspsToVerificationSchedule = () => {
    const scheduleId = verificationScheduleCardInfo?.id.toString();

    if (scheduleId) {
      const ids = selectedItems.map((obj) => obj.id.toString());
      dispatch(
        addPspsToVerificationScheduleThunk({ id: scheduleId, psps: ids })
      );
      handleCloseModal();
    }
  };

  return (
    <Modal
      width={1700}
      visible={isVisible}
      title="Объекты проверки"
      onOk={handleAddPspsToVerificationSchedule}
      onCancel={handleCloseModal}
      okButtonProps={{
        loading:
          isCheckingObjectsLoading || isAddPspsToVerificationSchedulePending,
        disabled: !!!selectedItems.length,
      }}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      okText="Добавить"
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin
        spinning={
          isCheckingObjectsLoading || isAddPspsToVerificationSchedulePending
        }
      >
        <TabsFilter
          resetSelectedItemsOnCurrentPage={() =>
            setSelectedItemsOnCurrentPage([])
          }
        />
        <AgGridTable
          className={cx("table")}
          onGridReady={(e: GridReadyEvent) => setGridApi(e.api)}
          rowData={checkingObjects}
          columnDefs={TableColumns}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          suppressRowClickSelection={true}
          isBasicMultipleRowSelection
          isAutoSizeColumns={false}
          defaultColDef={{
            resizable: true,
          }}
        />
      </Spin>
    </Modal>
  );
};
