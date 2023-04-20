import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  SelectionChangedEvent
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  dateComparator,
  dateFilterParams,
  gridOptions,
  mapTypeToFilter,
  twoDigits
} from "../utils";
import { IConstructor, IObjectField, ItemsState } from "../interfaces";
import { IdType, Nullable, StateType } from "../types";
import { itemSelected } from "../actions/items/genericCreators";
import { CheckBoxCell } from "./cellRenderers/CheckBoxCell";

interface InFormTable<T extends object> {
  reducer?: keyof StateType;
  items: Array<T>;
  fields?: Array<IObjectField<T>>;
  hiddenColumns?: Array<keyof T>;
  itemConstructor?: IConstructor<T>;
  selectionCallback?: (item: T) => void;
  selectedRow?: Nullable<IdType>;
  floatColumns?: Array<keyof T>;
  actionColumns?: Array<ColDef>;
  setApiCallback?: (api: GridApi) => void;
  widths?: Array<{
    key: string;
    newWidth: number;
  }>;
  replaceColumns?: Array<ColDef>;
}

export function InFormTable<T extends object>(
  props: InFormTable<T>
): JSX.Element {
  if (props.reducer !== undefined) {
    const key = props.reducer;
    const sliced = (state: StateType): ItemsState<T> =>
      (state[key] as unknown) as ItemsState<T>;
    if (props.fields === undefined) {
      props.fields = useSelector<StateType, Array<IObjectField<T>>>(
        state => sliced(state).fields
      );
    }
    if (props.hiddenColumns === undefined) {
      props.hiddenColumns = useSelector<StateType, Array<keyof T>>(
        state => sliced(state).hiddenProps
      );
    }
    if (props.itemConstructor === undefined) {
      props.itemConstructor = useSelector<StateType, IConstructor<T>>(
        state => sliced(state).itemConstructor
      );
    }
  }
  const staticCellStyle = { wordBreak: "break-word" };
  let colDefs = props.fields?.map(x => {
    const notBool = x.type !== "boolean";

    const obj: ColDef = {
      field: x.field as string,
      headerName:
        x.description === undefined ? (x.field as string) : x.description,
      filter: mapTypeToFilter(x.type),
      sortable: notBool,
      hide: props.hiddenColumns?.includes(x.field),
      tooltipField: x.field as string,
      cellStyle: staticCellStyle
    };

    if (props.floatColumns !== undefined) {
      if (x.type === "number" && props.floatColumns.includes(x.field)) {
        obj.valueFormatter = params => {
          if (params.value !== null) {
            return Number(params.value).toFixed(2);
          }
          return "";
        };
      }
    }

    if (obj.filter === "agDateColumnFilter") {
      obj.comparator = dateComparator;
      obj.filterParams = dateFilterParams;
      obj.valueFormatter = params => {
        if (params.value !== null) {
          const mDate = params.value as Date;
          let mTime = `${twoDigits(mDate.getHours())}:${twoDigits(
            mDate.getMinutes()
          )}:${twoDigits(mDate.getSeconds())}`;
          if (
            mDate.getHours() === 0 &&
            mDate.getMinutes() === 0 &&
            mDate.getSeconds() === 0
          ) {
            mTime = "";
          }
          return `${twoDigits(mDate.getDate())}.${twoDigits(
            mDate.getMonth() + 1
          )}.${twoDigits(mDate.getFullYear())} ${mTime}`;
        }
        return "";
      };
    }

    if (!notBool) {
      obj.cellRenderer = "checkboxRenderer";
    }

    return obj;
  });

  const frameworkComponents = {
    checkboxRenderer: CheckBoxCell
  };

  if (props.actionColumns !== undefined) {
    colDefs?.push(...props.actionColumns);
  }

  if (colDefs !== undefined && props.replaceColumns !== undefined) {
    const replaceCols = props.replaceColumns;
    colDefs = colDefs.map(x => replaceCols.find(y => y.field === x.field) || x);
  }

  let dispatch: ReturnType<typeof useDispatch> | null = null;
  if (props.reducer !== undefined) {
    dispatch = useDispatch();
  }

  const headerHeightGetter = () => {
    const columnHeaderTexts = [
      ...(document.querySelectorAll(".ag-header-cell-text") as any)
    ];
    const clientHeights = columnHeaderTexts.map(
      headerText => headerText.clientHeight
    );
    const tallestHeaderTextHeight = Math.max(...clientHeights);

    return tallestHeaderTextHeight;
  };

  const headerHeightSetter = (ev: { api: GridApi }) => {
    const padding = 20;
    const height = headerHeightGetter() + padding;
    ev.api.setHeaderHeight(height);
  };

  return (
    <div style={{ height: "250px", width: "100%" }}>
      <div
        style={{
          height: "100%",
          width: "100%",
          border: "1px solid #DDE8F0",
          borderRadius: "4px"
        }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          columnDefs={colDefs}
          rowData={props.items}
          immutableData={true}
          getRowNodeId={data => data.id}
          groupDefaultExpanded={-1}
          localeText={gridOptions.ruGrid}
          defaultColDef={gridOptions.defaultColDef}
          suppressScrollOnNewData={gridOptions.suppressScrollOnNewData}
          rowSelection={gridOptions.rowSelection}
          frameworkComponents={frameworkComponents}
          onModelUpdated={ev => ev.api.deselectAll()}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Пожалуйста, подождите, пока данные загружаются</span>'
          }
          onSelectionChanged={(ev: SelectionChangedEvent) => {
            const item = ev.api.getSelectedRows()[0];
            if (item !== undefined) {
              if (dispatch !== null && props.itemConstructor !== undefined) {
                dispatch(itemSelected(item as T, props.itemConstructor));
              }
              if (props.selectionCallback !== undefined) {
                props.selectionCallback(item as T);
              }
            }
          }}
          onGridReady={(ev: GridReadyEvent) => {
            if (props.setApiCallback !== undefined) {
              props.setApiCallback(ev.api);
            }

            ev.api.sizeColumnsToFit();

            /*   let allColumnIds: any[] = [];
                                      const columns = ev.columnApi.getAllColumns();
                                      if (columns !== undefined) {
                                        columns.forEach((column) => allColumnIds.push(column["colId"]));
                                        ev.columnApi.autoSizeColumns(allColumnIds, false);
                                        if (props.widths !== undefined) {
                                          ev.columnApi.setColumnWidths(props.widths);
                                        }
                                      }
                                      if (props.widths !== undefined) {
                                        ev.columnApi.setColumnWidths(props.widths);
                                      }
                                      ev.api.resetRowHeights();
                                      headerHeightSetter(ev); */
          }}
          onFirstDataRendered={(ev: FirstDataRenderedEvent) => {
            /*  const listener = function () {
                                       setTimeout(function () {
                                         resize();
                                       });
                                     }; */
            /* const resize = () => {
                                      let allColumnIds: any[] = [];
                                      const columns = ev.columnApi.getAllColumns();
                                      if (columns !== undefined) {
                                        columns.forEach((column) => allColumnIds.push(column["colId"]));
                                        ev.columnApi.autoSizeColumns(allColumnIds, false);
                                        if (props.widths !== undefined) {
                                          ev.columnApi.setColumnWidths(props.widths);
                                        }
                                      } else {
                                        window.removeEventListener("resize", listener);
                                      }
                                      ev.api.resetRowHeights();
                                      headerHeightSetter(ev);
                                    };
                                    listener();
                                    window.addEventListener("resize", listener); */
            if (props.selectedRow) {
              let node = ev.api.getRowNode(props.selectedRow.toString());
              node.setSelected(true);
            }
          }}
          // https://www.ag-grid.com/javascript-grid/row-height/#example-auto-row-height
          onColumnResized={ev => {
            ev.api.resetRowHeights();
            headerHeightSetter(ev);
          }}
          onColumnVisible={ev => {
            ev.api.resetRowHeights();
            headerHeightSetter(ev);
          }}
        ></AgGridReact>
      </div>
    </div>
  );
}
