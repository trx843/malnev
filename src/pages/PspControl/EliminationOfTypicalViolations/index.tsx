import React from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Pagination,
  Popconfirm,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import {
  FileDoneOutlined,
  FileExcelOutlined,
  FilterFilled,
} from "@ant-design/icons";
import { ModalFilters } from "./components/ModalFilters";
import { IdType, StateType } from "../../../types";
import { IEliminationOfTypicalViolationsStore } from "../../../slices/pspControl/eliminationOfTypicalViolations/types";
import { TypicalViolationsTable } from "./components/TypicalViolationsTable";
import { AppliedFilterTags } from "./components/AppliedFilterTags";
import { SettingsPsp } from "./components/SettingsPsp";
import { ModalConfirmationOfOperations } from "./components/ModalConfirmationOfOperations";
import {
  IModalConfirmationOfOperationsInfo,
  IModalForEliminateViolationInfoInfo,
} from "./types";
import { ModalConfirmationOfOperationsModes } from "./components/ModalConfirmationOfOperations/constants";
import { getTypicalViolationsThunk } from "thunks/pspControl/eliminationOfTypicalViolations";
import styles from "./eliminationOfTypicalViolations.module.css";
import { ModalForEliminateViolation } from "./components/ModalForEliminateViolation";
import { setSelectedIdentifiedViolationId } from "slices/pspControl/eliminationOfTypicalViolations";

const { Title } = Typography;

const cx = classNames.bind(styles);

export const EliminationOfTypicalViolations = () => {
  const dispatch = useDispatch();

  const {
    selectedIdentifiedTypicalViolations,
    pageInfo,
    listFilter,
    isTypicalViolationsLoading,
    isSettingsPspLoading,
    selectedIdentifiedViolationId
  } = useSelector<StateType, IEliminationOfTypicalViolationsStore>(
    (state) => state.eliminationOfTypicalViolations
  );

  const [isModalFilterVisible, setModalFilterVisibility] =
    React.useState(false);

  const [
    modalConfirmationOfOperationsInfo,
    setModalConfirmationOfOperationsInfo,
  ] = React.useState<IModalConfirmationOfOperationsInfo>({
    visible: false,
    mode: ModalConfirmationOfOperationsModes.none,
  });

  const [modalForEliminateViolationInfo, setModalForEliminateViolationInfo] =
    React.useState<IModalForEliminateViolationInfoInfo>({
      visible: false,
      violationsIds: [],
    });

  const toggleModalFilterVisibility = () =>
    setModalFilterVisibility(!isModalFilterVisible);

  const toggleModalConfirmationOfOperationsVisibility = (
    mode: ModalConfirmationOfOperationsModes = ModalConfirmationOfOperationsModes.none
  ) =>
    setModalConfirmationOfOperationsInfo({
      visible: !modalConfirmationOfOperationsInfo.visible,
      mode,
    });

  const toggleModalForEliminateViolationVisibility = (
    violationsIds: IdType[] = []
  ) =>
    setModalForEliminateViolationInfo({
      visible: !modalForEliminateViolationInfo.visible,
      violationsIds,
    });

  const onCancel = () => dispatch(setSelectedIdentifiedViolationId(null));

  const handleChangePagination = (page: number) => {
    dispatch(
      getTypicalViolationsThunk({
        ...listFilter,
        pageIndex: page,
      })
    );
  };

  return (
    <Spin
      wrapperClassName={cx("spin-wrapper")}
      spinning={isTypicalViolationsLoading || isSettingsPspLoading}
    >
      <Title level={2}>Проверка объектов на наличие типовых нарушений</Title>

      <div className={cx("content")}>
        <SettingsPsp />

        <div className={cx("right-bar")}>
          <div className={cx("header")}>
            <div className={cx("modal-filter")}>
              <Button
                type="link"
                icon={<FilterFilled />}
                onClick={toggleModalFilterVisibility}
              >
                Раскрыть фильтр
              </Button>

              <AppliedFilterTags />
            </div>
            <Popconfirm
              title="Подтверждено отсутствие нарушения"
              onConfirm={() =>
                toggleModalConfirmationOfOperationsVisibility(
                  ModalConfirmationOfOperationsModes.noViolationDetected
                )
              }
              okText="Да"
              cancelText="Отмена"
              placement="left"
              disabled={!selectedIdentifiedTypicalViolations.length}
            >
              <Button
                icon={<FileExcelOutlined />}
                type="link"
                disabled={!selectedIdentifiedTypicalViolations.length}
              >
                Новых нарушений не выявлено
              </Button>
            </Popconfirm>
          </div>
          <TypicalViolationsTable />
        </div>
      </div>

      <ModalConfirmationOfOperations
        isVisible={modalConfirmationOfOperationsInfo.visible}
        onCancel={toggleModalConfirmationOfOperationsVisibility}
        mode={modalConfirmationOfOperationsInfo.mode}
        toggleModalForEliminateViolationVisibility={
          toggleModalForEliminateViolationVisibility
        }
      />
      <ModalForEliminateViolation
        isVisible={!!selectedIdentifiedViolationId}
        onCancel={onCancel}
        violationId={selectedIdentifiedViolationId}
      />
      <ModalFilters
        visible={isModalFilterVisible}
        onClose={toggleModalFilterVisibility}
      />
    </Spin>
  );
};
