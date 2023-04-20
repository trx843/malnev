import React, { useState } from "react";
import classNames from "classnames/bind";
import update from "immutability-helper";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Select,
  Spin,
  Typography,
  Col,
  Row,
  PageHeader,
} from "antd";
import { ExportOutlined, FilterFilled } from "@ant-design/icons";
import { SearchTree } from "../../../components/SearchTree";
import { ModalFilters } from "./components/ModalFilters";
import { OwnedType, StateType } from "../../../types";
import { IEliminationOfViolationsStore } from "../../../slices/pspControl/eliminationOfViolations/types";
import { ViolationsTable } from "./components/ViolationsTable";
import { AppliedFilterTags } from "./components/AppliedFilterTags";
import {
  getViolationsBySelectedNodeThunk,
  getViolationsThunk,
} from "../../../thunks/pspControl/eliminationOfViolations";
import styles from "./eliminationOfViolations.module.css";
import { getEliminationStatusesRequest } from "api/requests/eliminationOfTypicalViolations";
import { setAppliedFilter } from "slices/pspControl/eliminationOfViolations";
import { CtrlBreadcrumb } from "components/CtrlBreadcrumb";
import { EliminationColors } from "thunks/pspControl/eliminationOfViolations/constants";
import { exportToExcel } from "./api";

const { Title } = Typography;

const cx = classNames.bind(styles);

export const EliminationOfViolationsPage = () => {
  const pageName = "Устранение нарушений";

  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const [exportPending, setExportPending] = useState(false);
  const [attemptStatuses, setAttemptStatuses] = useState(false);
  const [statuses, setStatuses] = useState<{ value: string; label: string }[]>(
    []
  );

  const eliminationColorTypes: { value: number; label: string }[] = [
    {
      value: EliminationColors.None,
      label: "Срок устранения не вышел",
    },
    {
      value: EliminationColors.ApproachingColor,
      label: "Срок устранения приближается",
    },
    {
      value: EliminationColors.ExpireColor,
      label: "Срок устранения вышел",
    },
  ];

  const { selectedTreeNode, appliedFilter, isViolationsLoading } = useSelector<
    StateType,
    IEliminationOfViolationsStore
  >((state) => state.eliminationOfViolations);

  const [isModalFilterVisible, setModalFilterVisibility] =
    React.useState(false);

  const toggleModalFilterVisibility = () => {
    setModalFilterVisibility(!isModalFilterVisible);
  };

  const exportHandler = async () => {
    setExportPending(true);
    await exportToExcel(appliedFilter);
    setExportPending(false);
  };

  const onSelectTreeNode = (selectedKeys: React.Key[], info: any) => {
    dispatch(getViolationsBySelectedNodeThunk(info.node));
  };

  const getEliminationStatuses = async (open: boolean) => {
    if (!open || attemptStatuses) {
      return;
    }
    try {
      setPending(true);
      const options = await getEliminationStatusesRequest();
      setStatuses(options.map((opt) => ({ label: opt.label, value: opt.id })));
      setAttemptStatuses(true);
    } finally {
      setPending(false);
    }
  };

  const handleOwnedFilterChangedCallback = (type: OwnedType) => {
    const adjustedFilter = update(appliedFilter, {
      filter: {
        treeFilter: {
          isOwn: { $set: type },
        },
      },
    });

    dispatch(getViolationsThunk(adjustedFilter));
  };

  const handleSelectStatuses = (id) => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        $set: {
          ...appliedFilter.filter,
          eliminationStatus: id,
        },
      },
    });
    dispatch(setAppliedFilter(updatedFilter));
    dispatch(getViolationsThunk(updatedFilter));
  };

  const clearSelectStatuses = () => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        $set: {
          ...appliedFilter.filter,
          eliminationStatus: null,
        },
      },
    });
    dispatch(setAppliedFilter(updatedFilter));
    dispatch(getViolationsThunk(updatedFilter));
  };

  const handleSelectEliminationColorTypes = (id) => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        $set: {
          ...appliedFilter.filter,
          eliminationColorTypes: id,
        },
      },
    });
    dispatch(setAppliedFilter(updatedFilter));
    dispatch(getViolationsThunk(updatedFilter));
  };

  const clearSelectEliminationColorTypes = () => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        $set: {
          ...appliedFilter.filter,
          eliminationColorTypes: null,
        },
      },
    });
    dispatch(setAppliedFilter(updatedFilter));
    dispatch(getViolationsThunk(updatedFilter));
  };

  const handleChangeCheckbox = (e) => {
    const value = e.target.checked;

    const updatedFilter = update(appliedFilter, {
      filter: {
        $set: {
          ...appliedFilter.filter,
          notVisibleEliminated: value,
        },
      },
    });

    dispatch(setAppliedFilter(updatedFilter));
    dispatch(getViolationsThunk(updatedFilter));
  };

  return (
    <Spin wrapperClassName={cx("spin-wrapper")} spinning={isViolationsLoading}>
      <CtrlBreadcrumb pageName={pageName} />
      <PageHeader style={{ padding: "0 0 8px" }} title={pageName} />
      <div className={cx("content")}>
        <div className={cx("filter")}>
          <Title level={4}>Фильтр</Title>
          <SearchTree
            className={cx("search-tree")}
            treeViewName="PspTree"
            onSelectCallback={onSelectTreeNode}
            ownedFilterChangedCallback={handleOwnedFilterChangedCallback}
            ownFilterValue={appliedFilter.filter.treeFilter.isOwn}
            currentNodeKey={selectedTreeNode.key}
            isSiEq={false}
            customFieldsChildren={
              <div>
                <Typography.Text type="secondary">
                  Статус мероприятий
                </Typography.Text>
                <div className={cx("field-search")}>
                  <Select
                    options={statuses}
                    className={cx("select-statuses")}
                    value={appliedFilter.filter.eliminationStatus}
                    onDropdownVisibleChange={getEliminationStatuses}
                    onSelect={handleSelectStatuses}
                    onClear={clearSelectStatuses}
                    notFoundContent={
                      pending ? <Spin size="small" /> : "Нет данных"
                    }
                    placeholder="Все"
                    allowClear
                  />
                </div>
                <Typography.Text type="secondary">Критичность</Typography.Text>
                <div className={cx("field-search")}>
                  <Select
                    options={eliminationColorTypes}
                    className={cx("select-statuses")}
                    value={appliedFilter.filter.eliminationColorTypes}
                    onSelect={handleSelectEliminationColorTypes}
                    onClear={clearSelectEliminationColorTypes}
                    notFoundContent={"Нет данных"}
                    placeholder="Все"
                    allowClear
                  />
                </div>
                <div className={cx("field-search")}>
                  <Checkbox
                    checked={appliedFilter.filter.notVisibleEliminated}
                    onChange={handleChangeCheckbox}
                  >
                    Не отображать устраненные
                  </Checkbox>
                </div>
              </div>
            }
            isPspCtrl={true}
          />
        </div>

        <div className={cx("right-bar")}>
          <div className={cx("modal-filter")}>
            <Row justify="space-between" align="middle">
              <Col>
                <Button
                  className={cx("filter-button")}
                  type="link"
                  icon={<FilterFilled />}
                  onClick={toggleModalFilterVisibility}
                >
                  Раскрыть фильтр
                </Button>
                <AppliedFilterTags />
              </Col>
              <Col>
                <Button
                  type="link"
                  icon={<ExportOutlined />}
                  onClick={exportHandler}
                  disabled={exportPending}
                  loading={exportPending}
                >
                  Экспортировать
                </Button>
              </Col>
            </Row>
          </div>
          <ViolationsTable />
        </div>
      </div>

      <ModalFilters
        visible={isModalFilterVisible}
        onClose={toggleModalFilterVisibility}
      />
    </Spin>
  );
};
