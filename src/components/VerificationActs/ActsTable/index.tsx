import React, { FC, useCallback, useEffect, useState } from "react";
import { Pagination, Spin, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AgGridColumn } from "ag-grid-react/lib/agGridColumn";
import { GridApi, GridReadyEvent, SortChangedEvent } from "ag-grid-community";
import moment from "moment";
import { Link } from "react-router-dom";

import { RendererProps } from "../../ItemsTable";
import { StateType } from "../../../types";
import { TableCard } from "../../../styles/commonStyledComponents";
import { TableActActions } from "./cellButtons";
import {
  setAppliedFilter,
  VerificationActsStore,
} from "../../../slices/verificationActs/verificationActs";
import {
  deleteVerificationActThunk,
  getVerificationActsPage,
} from "../../../thunks/verificationActs";
import { SortTypes, StatusesIds } from "../../../enums";
import { AgGridTable } from "components/AgGridTable";
import CustomTextTableFilter from "components/CustomTextTableFilter";
import { CustomFilter } from "components/gridFilters/CustomFilter";
import {
  DefaultColDef,
  DefaultIsAsc,
  DefaultSortedFieldValue,
  SortableFields,
} from "containers/VerificationActs/constants";
import update from "immutability-helper";
import { initSortingAndFiltering } from "components/AgGridTable/utils";
import classNames from "classnames/bind";
import styles from "../styles.module.css";
import { VerificationItem } from "../classes";

const cx = classNames.bind(styles);

interface ActsTableProps { }

export const ActsTable: FC<ActsTableProps> = () => {
  const { page, pending, appliedFilter } = useSelector<
    StateType,
    VerificationActsStore
  >((state) => state.verificationActs);
  const dispatch = useDispatch();

  const fetchPage = useCallback(async () => {
    await dispatch(getVerificationActsPage());
  }, [appliedFilter]);

  const handleChangePagination = async (page: number) => {
    const filter = update(appliedFilter, {
      pageIndex: { $set: page },
    });
    dispatch(setAppliedFilter(filter));
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteVerificationActThunk(id));
  };

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const onTableFilterChanged = (filterModel) => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        filterModel: { $set: filterModel },
      },
    });
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

  return (
    <Spin spinning={pending} wrapperClassName={"spinnerStyled"}>
      <TableCard className={"verification-acts__table"}>
        <AgGridTable
          defaultColDef={DefaultColDef}
          rowData={page.entities}
          onGridReady={onGridReady}
          onSortChanged={onTableSortChanged}
          filterChangedCallback={onTableFilterChanged}
          frameworkComponents={{
            customTextTableFilter: CustomTextTableFilter,
            customFilter: CustomFilter,
          }}
          isAutoSizeColumns={false}
          rowHeight={65}
          getRowStyle={(params: any) => {
            let item = params.data as VerificationItem;
            if (item.isSendedToElis) {
              return { "background-color": "#F6FFED" };
            }
          }}
        >
          <AgGridColumn
            headerName="Уровень проверки"
            field="verificationLevel"
            minWidth={152}
            tooltipField="verificationLevel"
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(item) => (
              <div className={cx("action-text")}>{item.value}</div>
            )}
          />
          <AgGridColumn
            headerName="Тип проверки"
            field="verificationType"
            minWidth={253}
            tooltipField="verificationType"
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(item) => (
              <div className={cx("action-text")}>{item.value}</div>
            )}
          />
          <AgGridColumn
            headerName="ОСТ"
            field="ostName"
            minWidth={169}
            tooltipField="ostName"
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(item) => (
              <div className={cx("action-text")}>{item.value}</div>
            )}
          />
          <AgGridColumn
            headerName="Филиал"
            field="filial"
            minWidth={132}
            tooltipField="filial"
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(item) => (
              <div className={cx("action-text")}>{item.value}</div>
            )}
          />
          <AgGridColumn
            headerName="ПСП"
            field="psp"
            minWidth={158}
            tooltipField="psp"
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(item) => (
              <div className={cx("action-text")}>{item.value}</div>
            )}
          />
          <AgGridColumn
            headerName="План мероприятий"
            field="planName"
            filter={false}
            sortable={false}
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(props: RendererProps<any>) =>
              props.data.planId ? (
                <div className={cx("action-text")}>
                  <Link
                    to={`/pspcontrol/action-plans/cards/${props.data.planId}`}
                  >
                    <Typography.Text>{props.value}</Typography.Text> : ''
                  </Link>
                </div>
              ) : (
                ""
              )
            }
            minWidth={200}
            tooltipField="planName"
          />
          <AgGridColumn
            headerName="Объекты проверки"
            field="checkingObjects"
            sortable={false}
            minWidth={210}
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(props) => (
              <div className={cx("action-text")}>{props.value}</div>
            )}
          />
          <AgGridColumn
            headerName="Дата проверки"
            field="verificatedOn"
            filter={false}
            cellRendererFramework={(props: RendererProps<any>) => (
              <Typography.Text>
                {moment(props.value).format("DD.MM.YYYY")}
              </Typography.Text>
            )}
            minWidth={130}
          />
          <AgGridColumn
            headerName="Дата создания"
            field="createdOn"
            filter={false}
            cellRendererFramework={(props: RendererProps<any>) => (
              <Typography.Text>
                {moment(props.value).format("DD.MM.YYYY")}
              </Typography.Text>
            )}
            minWidth={130}
          />
          <AgGridColumn
            headerName="Статус"
            field="verificationStatus"
            minWidth={130}
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(item) => (
              <div className={cx("action-text")}>{item.value}</div>
            )}
          />
          <AgGridColumn
            headerName="Действия"
            pinned="right"
            minWidth={275}
            filter={false}
            sortable={false}
            cellRendererFramework={(props) => (
              <TableActActions
                {...props}
                deletable={
                  props.data.verificationStatusId !== StatusesIds.Signed
                }
                onRemove={handleDelete}
              />
            )}
          />
        </AgGridTable>
        <div className="verification-acts__pagination">
          <Pagination
            showSizeChanger={false}
            current={page.pageInfo.pageNumber}
            pageSize={page.pageInfo.pageSize}
            total={page.pageInfo.totalItems}
            onChange={handleChangePagination}
            size="small"
          />
        </div>
      </TableCard>
    </Spin>
  );
};
