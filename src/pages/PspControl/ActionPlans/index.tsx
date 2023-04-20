import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, PageHeader, Pagination, Spin } from "antd";
import update from "immutability-helper";
import FilterFilled from "@ant-design/icons/lib/icons/FilterFilled";
import Title from "antd/lib/typography/Title";
import { history } from "../../../history/history";
import { OwnedType, StateType } from "../../../types";
import { SearchTree } from "../../../components/SearchTree";
import {
  setInfoRequest,
  toggleOstRnuInfoModalVisibility,
} from "../../../slices/ostRnuInfo";
import { SqlTree } from "../../../classes/SqlTree";
import {
  IActionPlansStore,
  setAppliedFilter,
} from "../../../slices/pspControl/actionPlans";
import { getActionPlansThunk } from "../../../thunks/pspControl/actionPlans";
import { ModalFilters } from "./components/ModalFilters";
import { AppliedFilterTags } from "./components/AppliedFilterTags";
import "./styles.css";
import { AgGridTable } from "components/AgGridTable";
import {
  DefaultColDef,
  DefaultIsAsc,
  DefaultSortedFieldValue,
  SortableFields,
  TableColumns,
} from "./constant";
import { GridReadyEvent, SortChangedEvent } from "ag-grid-community";
import { SortTypes } from "enums";
import { initSortingAndFiltering } from "components/AgGridTable/utils";
import CustomTextTableFilter from "components/CustomTextTableFilter";
import { partiallyReset } from "components/ModalCustomFilter/helpers";
import { CtrlBreadcrumb } from "components/CtrlBreadcrumb";
import { EventPlanItem } from "./classes";
import { RendererProps } from "components/ItemsTable";

export const ActionPlansPage: React.FC = () => {
  const pageName = "Планы мероприятий";

  const dispatch = useDispatch();

  const {
    actionPlans,
    appliedFilter,
    isActionPlansLoading,
    selectedTreeNode,
    pageInfo,
    isDeletingActionPlan,
    filterConfig,
  } = useSelector<StateType, IActionPlansStore>((state) => state.actionPlans);

  const [isModalFilterVisible, setModalFilterVisibility] =
    React.useState(false);

  React.useEffect(() => {
    dispatch(getActionPlansThunk());
  }, [appliedFilter]);

  const onSelectTreeNode = (selectedKeys: React.Key[], info: any) => {
    const newFilter = partiallyReset(
      filterConfig,
      appliedFilter,
      "isDependsTree"
    );

    const updatedFilter = update(appliedFilter, {
      filter: (values) =>
        update(values, {
          $set: {
            ...newFilter,
            filterModel: appliedFilter.filter.filterModel ?? {},
            treeFilter: {
              nodePath: info.node.key,
              isOwn: values.treeFilter.isOwn,
            },
          },
        }),
      pageIndex: { $set: 1 },
    });
    dispatch(setAppliedFilter(updatedFilter));
  };

  const handleOwnedFilterChangedCallback = (type: OwnedType) => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        treeFilter: {
          isOwn: { $set: type },
        },
      },
      pageIndex: { $set: 1 },
    });
    dispatch(setAppliedFilter(updatedFilter));
  };

  const handleChangePagination = (page: number) => {
    const updatedFilter = update(appliedFilter, {
      pageIndex: { $set: page },
    });
    dispatch(setAppliedFilter(updatedFilter));
  };

  const handleOpenOstRnuInfoModal = (node: SqlTree) => {
    dispatch(toggleOstRnuInfoModalVisibility());
    dispatch(setInfoRequest(node));
  };

  const items = useMemo(() => {
    return actionPlans.filter(
      (plan) => plan.psp !== null && plan.checkingObjects !== null
    );
  }, [actionPlans]);

  const onTableFilterChanged = (filterModel) => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        filterModel: { $set: filterModel },
      },
      pageIndex: { $set: 1 },
    });
    dispatch(setAppliedFilter(updatedFilter));
  };

  const onTableSortChanged = async (event: SortChangedEvent) => {
    const columnState = event.columnApi.getColumnState();
    const sortableColumn = columnState.find((column) => column.sort);

    if (sortableColumn) {
      const orderField = SortableFields[sortableColumn.colId as string];
      const sortingDirection = sortableColumn.sort;
      const adjustedAppliedFilter = {
        ...appliedFilter,
        sortedField: orderField,
        isSortAsc: sortingDirection === SortTypes.asc,
      };
      dispatch(setAppliedFilter(adjustedAppliedFilter));
    } else {
      const adjustedAppliedFilter = {
        ...appliedFilter,
        sortedField: DefaultSortedFieldValue,
        isSortAsc: DefaultIsAsc,
      };
      dispatch(setAppliedFilter(adjustedAppliedFilter));
    }
  };

  const onGridReady = (e: GridReadyEvent) =>
    initSortingAndFiltering(e, appliedFilter, SortableFields, {
      isSorting: true,
      isFiltering: true,
    });

  return (
    <Spin
      wrapperClassName="action-plans-spin"
      spinning={isActionPlansLoading || isDeletingActionPlan}
    >
      <div className="action-plans">
        <CtrlBreadcrumb pageName={pageName} />
        <PageHeader style={{ padding: "0 0 8px" }} title={pageName} />
        <div className="action-plans__content">
          <div className="action-plans__filter">
            <Title level={4}>Фильтр</Title>
            <SearchTree
              className="action-plans__searchTree"
              isSiEq={false}
              treeViewName="PspTree"
              onSelectCallback={onSelectTreeNode}
              ownedFilterChangedCallback={handleOwnedFilterChangedCallback}
              ownFilterValue={appliedFilter.filter.treeFilter.isOwn}
              currentNodeKey={selectedTreeNode.key}
              titleRenderConfig={{
                onClickIcon: handleOpenOstRnuInfoModal,
              }}
              isPspCtrl={true}
            />
          </div>
          <div className="action-plans__right-bar">
            <Button
              className="action-plans__filter-button"
              type="link"
              icon={<FilterFilled />}
              onClick={() => setModalFilterVisibility(true)}
            >
              Раскрыть фильтр
            </Button>
            <Link
              to="/pspcontrol/action-plans/typical-violations/"
              className="ant-btn ant-btn-link action-plans__filter-button action-plans__filter-button"
            >
              Типовые нарушения
            </Link>
            <AppliedFilterTags />
              <AgGridTable
                defaultColDef={DefaultColDef}
                rowData={items}
                columnDefs={TableColumns}
                onGridReady={onGridReady}
                onSortChanged={onTableSortChanged}
                filterChangedCallback={onTableFilterChanged}
                rowHeight={85}
                frameworkComponents={{
                  customTextTableFilter: CustomTextTableFilter,
                  WrapText: (item: RendererProps<EventPlanItem>) => (
                    <div className="action-plans__action-text">
                      {item.value}
                    </div>
                  ),
                }}
                isAutoSizeColumns={false}
                getRowStyle={(params: any) => {
                  let item = params.data as EventPlanItem;
                  if (item.isSendedToElis) {
                    return { "background-color": "#F6FFED" };
                  }
                }}
              />
              <Pagination
                className="action-plans__pagination"
                current={pageInfo.pageNumber}
                pageSize={pageInfo.pageSize}
                showSizeChanger={false}
                total={pageInfo.totalItems}
                onChange={handleChangePagination}
                disabled={isActionPlansLoading}
                size="small"
              />
          </div>
        </div>

        <ModalFilters
          visible={isModalFilterVisible}
          onClose={() => setModalFilterVisibility(false)}
        />
      </div>
    </Spin>
  );
};
