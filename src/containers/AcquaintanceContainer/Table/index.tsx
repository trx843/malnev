import { FC, useEffect, useState } from "react";
import { AgGridColumn } from "ag-grid-react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, Spin, Typography } from "antd";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import { GridApi, GridReadyEvent, SortChangedEvent } from "ag-grid-community";
import update from "immutability-helper";
import { AgGridTable } from "components/AgGridTable";
import { StateType } from "../../../types";
import { AcquaintanceStore } from "slices/pspControl/acquaintance/types";
import { getAcquaintanceItemsThunk } from "thunks/pspControl/acquaintance";
import { AcquaintanceItem } from "api/requests/pspControl/acquaintance/types";
import { ActionsColumn } from "./cellRenders";
import { RendererProps } from "components/ItemsTable";
import { apiBase } from "../../../utils";
import {
  DefaultIsAsc,
  DefaultSortedFieldValue,
  setAppliedFilter,
} from "slices/pspControl/acquaintance";
import { ListFilterBase } from "interfaces";
import { SortTypes } from "enums";
import CustomTextTableFilter from "components/CustomTextTableFilter";
import { CustomFilter } from "components/gridFilters/CustomFilter";
import { initSortingAndFiltering } from "components/AgGridTable/utils";

enum SortableFields {
  verificationLevel = "VerificationLevels.Name",
  verificationType = "CheckTypes.Name",
  dateAct = "VerificatedOn",
  ostName = "OstRnuPsp.OstName",
  psp = "OstRnuPsp.PspFullName",
}

const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

const DefaultColDef = {
  sortable: true,
  resizable: true,
  comparator: () => 0,
  filter: "customTextTableFilter",
  wrapText: true,
  autoHeight: true,
  cellStyle: staticCellStyle,
};

export const AcquaintanceTable: FC = () => {
  const dispatch = useDispatch();
  const { loading, items, pageInfo, appliedFilter } = useSelector<
    StateType,
    AcquaintanceStore
  >((state) => state.acquaintance);

  useEffect(() => {
    dispatch(getAcquaintanceItemsThunk(appliedFilter));
  }, [appliedFilter]);

  const handleChangePagination = async (page: number) => {
    const filter = update(appliedFilter, {
      pageIndex: { $set: page },
    });
    dispatch(setAppliedFilter(filter));
  };

  const onTableFilterChanged = (filterModel) => {
    const updatedFilter: ListFilterBase = {
      ...appliedFilter,
      filter: {
        ...appliedFilter.filter,
        filterModel,
      },
    };
    dispatch(setAppliedFilter(updatedFilter));
  };

  const onTableSortChanged = (event: SortChangedEvent) => {
    const columnState = event.columnApi.getColumnState();
    const sortableColumn = columnState.find((column) => column.sort);

    if (sortableColumn) {
      const orderField = SortableFields[sortableColumn.colId as string];
      const isAsc = sortableColumn.sort === SortTypes.asc;
      if (orderField) {
        const updatedFilter = update(appliedFilter, {
          sortedField: { $set: `${orderField}` },
          isSortAsc: { $set: isAsc },
        });
        dispatch(setAppliedFilter(updatedFilter));
      }
    } else {
      const updatedFilter = update(appliedFilter, {
        sortedField: { $set: DefaultSortedFieldValue },
        isSortAsc: { $set: DefaultIsAsc },
      });
      dispatch(setAppliedFilter(updatedFilter));
    }
  };

  const onGridReady = (e: GridReadyEvent) => {
    initSortingAndFiltering(e, appliedFilter, SortableFields, {
      isSorting: true,
      isFiltering: true,
    });
  };

  const renderLink = (url: string) => (
    <Typography.Link
      underline
      download
      disabled={url === "00000000-0000-0000-0000-000000000000"}
      href={`${apiBase}/pspcontrol/act/file/${url}`}
    >
      Файл акта
    </Typography.Link>
  );

  const renderPlanLink = (url: string) => (
    <Typography.Link
      underline
      download
      disabled={url === "00000000-0000-0000-0000-000000000000"}
      href={`${apiBase}/pspcontrol/plan/file/${url}`}
    >
      Файл плана
    </Typography.Link>
  );

  return (
    <div className="acquaintance__table">
      <Spin spinning={loading} wrapperClassName={"spinnerStyled"}>
        <AgGridTable
          onGridReady={onGridReady}
          hasLoadingOverlayComponentFramework
          rowData={items}
          suppressRowTransform={true}
          defaultColDef={DefaultColDef}
          filterChangedCallback={onTableFilterChanged}
          onSortChanged={onTableSortChanged}
          frameworkComponents={{
            customTextTableFilter: CustomTextTableFilter,
            customFilter: CustomFilter,
          }}
          isAutoSizeColumns={false}
        >
          <AgGridColumn
            headerName="Уровень проверки"
            field="verificationLevel"
            minWidth={150}
            tooltipField="verificationLevel"
          />
          <AgGridColumn
            headerName="Тип проверки"
            field="verificationType"
            minWidth={205}
            tooltipField="verificationType"
          />
          <AgGridColumn
            headerName="Дата проведения"
            field="dateAct"
            filter={false}
            cellRendererFramework={(props: RendererProps<AcquaintanceItem>) => (
              <Text>{moment(props.data.dateAct).format("DD.MM.yyyy")}</Text>
            )}
            minWidth={160}
          />
          <AgGridColumn
            headerName="ОСТ"
            field="ostName"
            minWidth={250}
            tooltipField="ostName"
          />
          <AgGridColumn
            headerName="Наименование ПСП"
            field="psp"
            minWidth={175}
            tooltipField="psp"
          />
          <AgGridColumn
            headerName="Акт проверки"
            field="actUrl"
            sortable={false}
            filter={"customFilter"}
            cellRendererFramework={(props: RendererProps<AcquaintanceItem>) =>
              renderLink(props.data.actUrl)
            }
            minWidth={140}
          />
          <AgGridColumn
            headerName="План мероприятий"
            field="planUrl"
            sortable={false}
            filter={"customFilter"}
            cellRendererFramework={(props: RendererProps<AcquaintanceItem>) =>
              renderPlanLink(props.data.planUrl)
            }
            minWidth={140}
          />
          <AgGridColumn
            headerName="Отметка об ознакомлении"
            field="acquainted"
            sortable={false}
            filter={false}
            cellRendererFramework={(props: RendererProps<AcquaintanceItem>) => (
              <Text>{props.value}</Text>
            )}
            minWidth={140}
            tooltipField="acquainted"
          />
          <AgGridColumn
            headerName="Действия"
            pinned="right"
            filter={false}
            cellRendererFramework={ActionsColumn}
            minWidth={120}
          />
        </AgGridTable>
      </Spin>
      <div className="acquaintance__pagination">
        <Pagination
          current={pageInfo.pageNumber}
          pageSize={pageInfo.pageSize}
          total={pageInfo.totalItems}
          onChange={handleChangePagination}
          size="small"
        />
      </div>
    </div>
  );
};
