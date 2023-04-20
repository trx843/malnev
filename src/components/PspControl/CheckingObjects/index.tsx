import React, { FC, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Layout,
  Menu,
  Pagination,
  Row,
  Spin,
  Tooltip,
} from "antd";
import {
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  ColumnApi,
  ColumnMovedEvent,
  ColumnPinnedEvent,
  ColumnState,
  ColumnVisibleEvent,
  GridApi,
  GridReadyEvent,
  SortChangedEvent,
} from "ag-grid-community";
import UploadOutlined from "@ant-design/icons/lib/icons/UploadOutlined";
import _ from "lodash";
import Title from "antd/lib/typography/Title";
import FilterFilled from "@ant-design/icons/lib/icons/FilterFilled";
import { SelectedNode } from "../../../interfaces";
import {
  ICheckingObjectsStore,
  setAppliedFilter,
  setSelectedPsps,
  toggleSiderCollapse,
} from "../../../slices/pspControl/checkingObjects";
import { TableCard } from "../../../styles/commonStyledComponents";
import { IdType, Nullable, OwnedType, StateType } from "../../../types";
import { SearchTree } from "../../SearchTree";
import { ModalForAddingOrCreatingChart } from "./ModalForAddingOrCreatingChart";
import { CheckingObjectsItem } from "./classes";
import { ModalCheckingObjectFilters } from "./ModalCheckingObjectFilters";
import {
  getCheckingObjectsBySelectedTreeThunk,
  getCheckingObjectsThunk,
} from "../../../thunks/pspControl/checkingObjects";
import { SqlTree } from "../../../classes/SqlTree";
import update from "immutability-helper";
import ExportOutlined from "@ant-design/icons/ExportOutlined";
import { CheckingObjectActions } from "./TableActions";
import { CreateVerificationActModal } from "./CreateActModal";
import {
  exportToExcel,
  exportWithFiltersToExcel,
} from "../../../api/requests/pspControl/CheckingObjects";
import { ModalForCreatingActionPlan } from "./ModalForCreatingActionPlan";
import { ModalForAddingResponsiblePerson } from "./ModalForAddingResponsiblePerson";
import { AppliedFiltersList } from "./AppliedFiltersList";
import {
  setInfoRequest,
  toggleOstRnuInfoModalVisibility,
} from "../../../slices/ostRnuInfo";
import { OwnStatuses } from "../../../slices/pspControl/verificationSchedule/constants";
import { useInitSelectedRows } from "./hooks";
import { getSelectedData, getTableInfo } from "./utils";
import {
  IModalForAddingResponsiblePerson,
  IModalInformationOnOsuInfo,
} from "./types";
import { ModalInformationOnOsu } from "./ModalInformationOnOsu";
import { ActionsEnum, Can } from "../../../casl";
import {
  CheckingObjectsElements,
  elementId,
} from "pages/PspControl/CheckingObjectsPage/constant";
import { AgGridTable } from "components/AgGridTable";
import {
  DefaultColDef,
  DefaultIsAsc,
  DefaultSortedFieldValue,
  SortableFields,
  TableColumns,
} from "./constants";
import { ExpiredCheckFilter } from "./ExpiredCheckFilter";
import "./style.css";
import CustomTextTableFilter from "components/CustomTextTableFilter";
import { initSortingAndFiltering } from "components/AgGridTable/utils";
import { SortTypes } from "enums";
import { CustomFilter } from "components/gridFilters/CustomFilter";
import { TableColumnSettingsModal } from "components/TableColumnSettingsModal";
import { TableColumnInfo } from "components/TableColumnSettingsModal/types";
import { RendererProps } from "components/ItemsTable";
const { Content, Sider } = Layout;

type InfoType = {
  node: SelectedNode;
};

export const CheckingObjects: FC = () => {
  const [visibleModalFilter, setVisibleModalFilter] = useState(false);
  const [visibleTableColSettingsModal, setVisibleTableColSettingsModal] =
    useState(false);
  const [visibleCreateActModal, setVisibleCreateActModal] = useState<{
    pspId: null | IdType;
    ownType: number;
    visible: boolean;
  }>({
    pspId: null,
    ownType: OwnStatuses.mix,
    visible: false,
  });
  const dispatch = useDispatch();
  const { isSiderCollapsed, appliedFilter, page, selectedTreeNode, pending } =
    useSelector<StateType, ICheckingObjectsStore>(
      (state) => state.checkingObjects
    );

  const [
    isModalForAddingOrCreatingChartVisible,
    setModalForAddingOrCreatingChartVisibility,
  ] = useState(false);

  const [
    isModalForCreatingActionPlanVisible,
    setModalForCreatingActionPlanVisible,
  ] = useState(false);

  const [
    modalForAddingResponsiblePersonConfig,
    setModalForAddingResponsiblePersonConfig,
  ] = useState<IModalForAddingResponsiblePerson>({
    pspId: null,
    visible: false,
  });

  const [modalInformationOnOsuInfo, setModalInformationOnOsuInfo] =
    useState<IModalInformationOnOsuInfo>({ pspId: null, visible: false });

  const [pspId, setPspId] = useState("");

  const [selectedTableDataCurrentPage, setSelectedTableDataCurrentPage] =
    useState<CheckingObjectsItem[]>([]);

  const [gridApi, setGridApi] = useState<Nullable<GridApi>>(null);
  const [columnApi, seColumnApi] = useState<Nullable<ColumnApi>>(null);
  const [colDefAndState, seDefAndState] = useState<TableColumnInfo[]>([]);
  const [selectedCheckingObjectsItems, setSelectedCheckingObjectsItems] =
    useInitSelectedRows(page.entities, gridApi);

  const resetSelectedTableData = () => {
    setSelectedTableDataCurrentPage([]);
    setSelectedCheckingObjectsItems([]);
  };

  const [exportDisabled, setExportDisabled] = useState<boolean>(false);

  const toggleModalForAddingOrCreatingChartVisibility = () => {
    setModalForAddingOrCreatingChartVisibility(
      !isModalForAddingOrCreatingChartVisible
    );
  };

  const toggleModalForAddingResponsiblePersonVisibility = (
    pspId: Nullable<string> = null
  ) => {
    setModalForAddingResponsiblePersonConfig({
      pspId: pspId,
      visible: !modalForAddingResponsiblePersonConfig.visible,
    });
  };

  const exportClickHandler = async () => {
    setExportDisabled(true);
    await exportToExcel();
    setExportDisabled(false);
  };

  const exportWithFiltersClickHandler = async () => {
    setExportDisabled(true);
    await exportWithFiltersToExcel(appliedFilter, colDefAndState);
    setExportDisabled(false);
  };

  const toggleModalForCreatingActionPlanVisibility = () => {
    setModalForCreatingActionPlanVisible(!isModalForCreatingActionPlanVisible);
  };

  const handleChangeModalInformationOnOsuInfo = (
    pspId: Nullable<string> = null
  ) => {
    setModalInformationOnOsuInfo({
      pspId,
      visible: !modalInformationOnOsuInfo.visible,
    });
  };

  const fetchData = useCallback(async () => {
    await dispatch(getCheckingObjectsThunk());
  }, [appliedFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRowSelect = (items: Array<CheckingObjectsItem>) => {
    dispatch(setSelectedPsps(items));
  };

  const onSelectTreeNode = async (
    selectedKeys: React.Key[],
    info: InfoType
  ) => {
    const change = info.node;
    await dispatch(getCheckingObjectsBySelectedTreeThunk(change));
  };

  const onSelectCheckingObjectsItems = (
    selectedItems: CheckingObjectsItem[]
  ) => {
    const selectedData = getSelectedData<CheckingObjectsItem>(
      selectedItems,
      selectedTableDataCurrentPage,
      selectedCheckingObjectsItems
    );

    if (selectedData) {
      setSelectedCheckingObjectsItems(selectedData.selectedTableItems);
      setSelectedTableDataCurrentPage(
        selectedData.selectedTableItemsCurrentPage
      );
    }
  };

  const handleChangePagination = async (page: number) => {
    try {
      const updatedFilter = update(appliedFilter, {
        pageIndex: { $set: page },
      });

      await dispatch(setAppliedFilter(updatedFilter));
      setSelectedTableDataCurrentPage([]);
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleOpenOstRnuInfoModal = (node: SqlTree) => {
    dispatch(toggleOstRnuInfoModalVisibility());
    dispatch(setInfoRequest(node));
  };

  const handleCreateActionPlan = (pspId: string) => {
    if (pspId) {
      setPspId(pspId);
      toggleModalForCreatingActionPlanVisibility();

      return;
    }

    setPspId("");
    toggleModalForCreatingActionPlanVisibility();
  };

  const handleOwnedFilterChangedCallback = async (type: OwnedType) => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        treeFilter: {
          isOwn: { $set: type },
        },
      },
    });

    await dispatch(setAppliedFilter(updatedFilter));
  };

  const onTableSortChanged = (event: SortChangedEvent) => {
    const columnState = event.columnApi.getColumnState();
    const sortableColumn = columnState.find((column) => column.sort);

    if (sortableColumn) {
      const orderField = SortableFields[sortableColumn.colId as string];
      const updatedFilter = update(appliedFilter, {
        sortedField: { $set: `${orderField}, ${DefaultSortedFieldValue}` },
        isSortAsc: { $set: sortableColumn.sort === SortTypes.asc },
      });
      dispatch(setAppliedFilter(updatedFilter));
    } else {
      const updatedFilter = update(appliedFilter, {
        sortedField: { $set: DefaultSortedFieldValue },
        isSortAsc: { $set: DefaultIsAsc },
      });
      dispatch(setAppliedFilter(updatedFilter));
    }
  };

  const onTableFilterChanged = (filterModel) => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        filterModel: { $set: filterModel },
      },
      pageIndex: { $set: 1 },
    });
    dispatch(setAppliedFilter(updatedFilter));
  };

  const onGridReady = (e: GridReadyEvent) => {
    setGridApi(e.api);
    seColumnApi(e.columnApi);
    const tableState = getTableInfo(e.columnApi);
    seDefAndState(tableState);
    initSortingAndFiltering(e, appliedFilter, SortableFields, {
      isSorting: true,
      isFiltering: true,
    });
  };

  const onColumnVisible = (e: ColumnVisibleEvent) => {
    seColumnApi(e.columnApi);
    const tableState = getTableInfo(e.columnApi);
    seDefAndState(tableState);
  };

  const onColumnMoved = (e: ColumnMovedEvent) => {
    seColumnApi(e.columnApi);
    const tableState = getTableInfo(e.columnApi);
    seDefAndState(tableState);
  };

  const onColumnPinned = (e: ColumnPinnedEvent) => {
    seColumnApi(e.columnApi);
  };

  const onColumnChange = (colName: string | undefined, hide: boolean) => {
    if (columnApi && colName) columnApi.setColumnsVisible([colName], hide);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={exportClickHandler}>
        Экспорт всех Объектов проверки
      </Menu.Item>
      <Menu.Item key="2" onClick={exportWithFiltersClickHandler}>
        Экспорт по фильтру
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout>
        <Sider
          className="psp-checking-objects__sider"
          width={280}
          style={{
            background: "white",
            display: "flex",
            flexDirection: "column",
            flex: "1",
            height: "100%",
          }}
          collapsed={isSiderCollapsed}
        >
          <div
            className={classNames("psp-checking-objects__title-wrapper", {
              "psp-checking-objects__title-wrapper_is-sider-collapsed":
                isSiderCollapsed,
            })}
          >
            {!isSiderCollapsed && (
              <Title className="psp-checking-objects__filter-title" level={2}>
                Фильтр
              </Title>
            )}
            <Button
              className="psp-checking-objects__sider-collapse-button"
              onClick={() => dispatch(toggleSiderCollapse())}
              icon={isSiderCollapsed ? <RightOutlined /> : <LeftOutlined />}
              type="link"
            />
          </div>
          <Row
            align={"middle"}
            style={{ width: "90%", marginLeft: "5%", overflow: "hidden" }}
          >
            <Col
              className={classNames({
                "psp-checking-objects__search-tree-wrapper-hidden":
                  isSiderCollapsed,
              })}
              span={24}
              style={{ height: "100%" }}
            >
              <Spin spinning={pending} wrapperClassName={"spinnerStyled"}>
                <ExpiredCheckFilter />
                <SearchTree
                  isSiEq={false}
                  className={classNames("psp-checking-objects__search-tree")}
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
              </Spin>
            </Col>
          </Row>
        </Sider>
        <Content
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TableCard bordered={false}>
            <Row justify="space-between">
              <Col>
                <div className="psp-checking-o__filters">
                  <Button
                    type="link"
                    icon={<FilterFilled />}
                    onClick={() => setVisibleModalFilter(true)}
                    disabled={pending}
                  >
                    Раскрыть фильтр
                  </Button>
                  <AppliedFiltersList />
                </div>
              </Col>
              <Col>
                <Button
                  type="link"
                  icon={<SettingOutlined />}
                  onClick={() => setVisibleTableColSettingsModal(true)}
                  disabled={!colDefAndState || pending}
                >
                  Настройка колонок
                </Button>
              </Col>
            </Row>
          </TableCard>
          <Divider className="psp-checking-objects__divider" />
          <TableCard bordered={false}>
            <Row justify={"space-between"} wrap={false}>
              <Col></Col>
              <Col>
                <Can
                  I={ActionsEnum.View}
                  a={elementId(
                    CheckingObjectsElements[CheckingObjectsElements.Export]
                  )}
                >
                  <Dropdown
                    disabled={pending || exportDisabled}
                    overlay={menu}
                    trigger={["click"]}
                  >
                    <Button
                      loading={exportDisabled}
                      type={"link"}
                      icon={<ExportOutlined />}
                      disabled={pending || exportDisabled}
                    >
                      Экспортировать <DownOutlined />
                    </Button>
                  </Dropdown>
                </Can>

                <Can
                  I={ActionsEnum.View}
                  a={elementId(
                    CheckingObjectsElements[
                      CheckingObjectsElements.AddToSchedule
                    ]
                  )}
                >
                  <Tooltip title="Выбрать объект проверки">
                    <Button
                      onClick={toggleModalForAddingOrCreatingChartVisibility}
                      type={"link"}
                      icon={<UploadOutlined />}
                      disabled={pending || !selectedCheckingObjectsItems.length}
                    >
                      Создать график
                    </Button>
                  </Tooltip>
                </Can>
              </Col>
            </Row>
          </TableCard>
          <Spin spinning={pending} wrapperClassName={"spinnerStyled"}>
            <div className="psp-checking-objects__tableWrapper">
              <AgGridTable
                stateStorageKey="psp-checking-objects-table"
                className="psp-checking-objects__table"
                defaultColDef={DefaultColDef}
                rowData={page.entities}
                columnDefs={TableColumns}
                onSelectionChanged={onSelectCheckingObjectsItems}
                onGridReady={onGridReady}
                onSortChanged={onTableSortChanged}
                filterChangedCallback={onTableFilterChanged}
                rowHeight={65}
                frameworkComponents={{
                  customFilter: CustomFilter,
                  customTextTableFilter: CustomTextTableFilter,
                  CheckingObjectActions: (item) => (
                    <CheckingObjectActions
                      {...item}
                      onClickCreateModal={() =>
                        setVisibleCreateActModal({
                          visible: true,
                          pspId: item.data.pspId,
                          ownType: item.data.pspIsOwned
                            ? OwnStatuses.own
                            : OwnStatuses.out,
                        })
                      }
                      handleCreateActionPlan={handleCreateActionPlan}
                      openModalForAddingResponsiblePerson={
                        toggleModalForAddingResponsiblePersonVisibility
                      }
                      openModalInformationOnOsuModal={
                        handleChangeModalInformationOnOsuInfo
                      }
                    />
                  ),
                  RedText: (item: RendererProps<CheckingObjectsItem>) =>
                    item.data.isDeleted ? (
                      <Tooltip title="Объект удален из БДМИ">
                        <div
                          className="psp-checking-objects__action-text"
                          style={{ color: "red" }}
                        >
                          {item.data.osus}
                        </div>
                      </Tooltip>
                    ) : (
                      <div className="psp-checking-objects__action-text">
                        {item.data.osus}
                      </div>
                    ),
                  WrapText: (item: RendererProps<CheckingObjectsItem>) => (
                    <div className="psp-checking-objects__action-text">
                      {item.value}
                    </div>
                  ),
                }}
                suppressRowClickSelection={true}
                onModelUpdated={() => {}}
                rowSelection="multiple"
                isBasicMultipleRowSelection
                isAutoSizeColumns={false}
                onColumnVisible={onColumnVisible}
                onColumnMoved={onColumnMoved}
                onColumnPinned={onColumnPinned}
                suppressRowTransform
              />
              <Pagination
                className="psp-checking-objects__pagination"
                current={page.pageInfo.pageNumber}
                pageSize={page.pageInfo.pageSize}
                total={page.pageInfo.totalItems}
                onChange={handleChangePagination}
                size="small"
                showSizeChanger={false}
              />
            </div>
          </Spin>
        </Content>
      </Layout>
      <ModalForAddingOrCreatingChart
        isVisible={isModalForAddingOrCreatingChartVisible}
        onCancel={toggleModalForAddingOrCreatingChartVisibility}
        checkingObjectsItem={selectedCheckingObjectsItems}
      />
      <ModalCheckingObjectFilters
        visible={visibleModalFilter}
        onClose={() => setVisibleModalFilter(false)}
        resetSelectedTableData={resetSelectedTableData}
      />
      <CreateVerificationActModal
        visible={visibleCreateActModal.visible}
        pspId={visibleCreateActModal.pspId || ""}
        ownType={visibleCreateActModal.ownType}
        onClose={() =>
          setVisibleCreateActModal({
            pspId: null,
            ownType: OwnStatuses.mix,
            visible: false,
          })
        }
      />
      <ModalForCreatingActionPlan
        pspId={pspId}
        isVisible={isModalForCreatingActionPlanVisible}
        onCancel={toggleModalForCreatingActionPlanVisibility}
      />
      <ModalForAddingResponsiblePerson
        isVisible={modalForAddingResponsiblePersonConfig.visible}
        pspId={modalForAddingResponsiblePersonConfig.pspId}
        onCancel={toggleModalForAddingResponsiblePersonVisibility}
      />
      <ModalInformationOnOsu
        pspId={modalInformationOnOsuInfo.pspId}
        isVisible={modalInformationOnOsuInfo.visible}
        onCancel={handleChangeModalInformationOnOsuInfo}
      />
      <TableColumnSettingsModal
        isVisible={visibleTableColSettingsModal}
        columnState={colDefAndState}
        onCheckboxChange={onColumnChange}
        onCloseHandler={() => setVisibleTableColSettingsModal(false)}
        onSumbitHandler={() => setVisibleTableColSettingsModal(false)}
      />
    </>
  );
};
