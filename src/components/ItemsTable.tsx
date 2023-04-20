import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ColDef,
  FilterChangedEvent,
  FilterModifiedEvent,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  ICellRendererComp,
  ICellRendererFunc,
  ModelUpdatedEvent,
  RowNode,
  SelectionChangedEvent,
  SortChangedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  customTextFilterParams,
  dateComparator,
  dateFilterParams,
  gridOptions,
  mapTypeToFilter,
  threeDigits,
  twoDigits,
} from "../utils";
import { CheckBoxCell } from "./cellRenderers/CheckBoxCell";
import { ReportButton } from "./cellRenderers/ReportButton";
import { FileButton } from "./cellRenderers/FileButton";
import { InvestigationActButton } from "./cellRenderers/InvestigationActButton";
import {
  IConstructor,
  IObjectField,
  ItemsState,
  RowClassRules,
} from "../interfaces";
import { StateType } from "../types";
import { itemSelected } from "../actions/items/genericCreators";
import { CoefReportButton } from "./cellRenderers/CoefReportButton";
import { MailCheckBoxCell } from "./cellRenderers/EventTypeSettings/MailCheckBoxCell";
import { ProtocolReportButton } from "./cellRenderers/ProtocolReportButton";
import { MailCheckBoxHeader } from "./headerRenderers/EventTypeSettings/MailCheckBoxHeader";
import { TreeSelectHeader } from "./headerRenderers/EventTypeSettings/TreeSelectHeader";
import { SiknTreeSelect } from "./cellRenderers/EventTypeSettings/SiknTreeSelect";
import { WebCheckBoxCell } from "./cellRenderers/EventTypeSettings/WebCheckBoxCell";
import { EditButton } from "./cellRenderers/EditButton";
import { DeleteButton } from "./cellRenderers/DeleteButton";
import { SiknOffActCell } from "./cellRenderers/SiknOffActCell";
import { InvestigateActCell } from "./cellRenderers/InvestigateActCell";
import { GroupSiknTreeSelect } from "./cellRenderers/GroupEventTypeSettings/GroupSiknTreeSelect";
import { GroupWebCheckBoxCell } from "./cellRenderers/GroupEventTypeSettings/GroupWebCheckBoxCell";
import { GroupMailCheckBoxCell } from "./cellRenderers/GroupEventTypeSettings/GroupMailCheckBoxCell";
import { MenuRenderer } from "./cellRenderers/MenuRenderer";
import { AttachButton } from "./cellRenderers/SiknOffAttachButton";
import { ActionsRenderer } from "./cellRenderers/SikmOffActionsRenderer";
import { EventsActionsRenderer } from "./cellRenderers/EventsActionsRenderer";
import { ToKmhActionsRenderer } from "./cellRenderers/ToKmhActionsRenderer";
import { CoefActionsRenderer } from "./cellRenderers/CoefActionsRenderer";
import { CustomFilter } from "./gridFilters/CustomFilter";
import { FailuresActionsRenderer } from "./cellRenderers/FailuresActionsRenderer";
import { QualityRenderer } from "./cellRenderers/QualityRenderer";
import { AskidRenderer } from "./cellRenderers/AskidRenderer";
import { ElisRenderer } from "./cellRenderers/ElisRenderer";
import { DataSiInfoButton } from "./cellRenderers/DataSiInfoButton";
import { InsertResultToKmhCell } from "./cellRenderers/InsertResultToKmhCell";
import { LimitsActionsRenderer } from "./cellRenderers/LimitsActionsRenderer";
import { EventRiskEditRenderer } from "./cellRenderers/EventRiskEditRenderer";
import { RiskEditRenderer } from "./cellRenderers/RiskEditRenderer";
import { ConstantRiskBindRenderer } from "./cellRenderers/ConstantRiskBindRenderer";
import { CriticalnessRenderer } from "./cellRenderers/CriticalnessRenderer";
import { PspControlInfoButton } from "./cellRenderers/PspControlButtons/PspControlInfoButton";
import { IsColumnFuncParams } from "ag-grid-community/dist/lib/entities/colDef";
import { VerificationSchedulePageActionsRenderer } from "./cellRenderers/VerificationSchedulePageActionsRenderer";
import { SiEditActionsRenderer } from "./cellRenderers/SiEditEditorButtons/SiEditActionsRenderer";
import { SiBindingEditActionsRenderer } from "./cellRenderers/SiEditEditorButtons/SiBindingEditActionsRenderer";
import { SiModelEditActionsRenderer } from "./cellRenderers/SiEditEditorButtons/SiModelEditActionsRenderer";
import CustomTextTableFilter from "./CustomTextTableFilter";
import { CtrlWebCheckBoxCell } from "./cellRenderers/CtrlEventTypeSettings/CtrlWebCheckBoxCell";
import { CtrlMailCheckBoxCell } from "./cellRenderers/CtrlEventTypeSettings/CtrlMailCheckBoxCell";
import { GroupTreeSelectHeader } from "./headerRenderers/GroupEventTypeSettings/GroupTreeSelectHeader";
import { WebCheckBoxHeader } from "./headerRenderers/EventTypeSettings/WebCheckBoxHeader";
import { GroupWebCheckBoxHeader } from "./headerRenderers/GroupEventTypeSettings/GroupWebCheckBoxHeader";
import { GroupMailCheckBoxHeader } from "./headerRenderers/GroupEventTypeSettings/GroupMailCheckBoxHeader";
import { CtrlGroupMailCheckBoxCell } from "./cellRenderers/CtrlGroupEventTypeSettings/CtrlGroupMailCheckBoxCell";
import { CtrlGroupWebCheckBoxCell } from "./cellRenderers/CtrlGroupEventTypeSettings/CtrlGroupWebCheckBoxCell";
import { CtrlMailCheckBoxHeader } from "./headerRenderers/CtrlEventTypeSettings/CtrlMailCheckBoxHeader";
import { CtrlWebCheckBoxHeader } from "./headerRenderers/CtrlEventTypeSettings/CtrlWebCheckBoxHeader";
import { CtrlGroupWebCheckBoxHeader } from "./headerRenderers/CtrlGroupEventTypeSettings/CtrlGroupWebCheckBoxHeader";
import { CtrlGroupMailCheckBoxHeader } from "./headerRenderers/CtrlGroupEventTypeSettings/CtrlGroupMailCheckBoxHeader";

export type CellProps = ColDef & { value: any } & Omit<
    IsColumnFuncParams,
    "data"
  >;

export interface RendererProps<T = unknown> extends CellProps {
  data: T;
}

interface ItemsTableProps<T extends object> {
  reducer?: keyof StateType;
  items: Array<T>;
  fields?: Array<IObjectField<T>>;
  hiddenColumns?: Array<keyof T>;
  itemConstructor?: IConstructor<T>;
  selectionCallback?: (item: T | Array<T>) => void;
  floatColumns?: Array<keyof T>;
  actionColumns?: Array<ColDef>;
  setApiCallback?: (api: GridApi) => void;
  widths?: Array<{
    key: string;
    newWidth: number;
  }>;
  replaceColumns?: Array<ColDef>;
  rowStyle?: Function;
  rowIsMultiple?: boolean;
  isFilterDisabled?: boolean;
  isSortableDisabled?: boolean;
  frameworkComponents?: Record<
    string,
    (field: RendererProps<T>) => React.ReactNode
  >;
  height: number | string;
  className?: string;

  isFullWidthCell?(rowNode: RowNode): boolean;

  fullWidthCellRenderer?:
    | {
        new (): ICellRendererComp;
      }
    | ICellRendererFunc
    | string;
  notShowTimeInDate?: boolean;
  rowHeight?: number;
  rowClassRules?: RowClassRules;
  onModelUpdated?(event: ModelUpdatedEvent): void;
  isSecondsNotShow?: boolean;
  filterChangedCallback?: (filterModel: any) => void;
  onSortChanged?: (event: SortChangedEvent) => void;
  isCustomFilterAndSorting?: boolean;
}

export function ItemsTable<T extends object>(
  props: ItemsTableProps<T>
): JSX.Element {
  if (props.reducer !== undefined) {
    const key = props.reducer;
    const sliced = (state: StateType): ItemsState<T> =>
      state[key] as unknown as ItemsState<T>;
    if (props.fields === undefined) {
      props.fields = useSelector<StateType, Array<IObjectField<T>>>(
        (state) => sliced(state).fields
      );
    }
    if (props.hiddenColumns === undefined) {
      props.hiddenColumns = useSelector<StateType, Array<keyof T>>(
        (state) => sliced(state).hiddenProps
      );
    }
    if (props.itemConstructor === undefined) {
      props.itemConstructor = useSelector<StateType, IConstructor<T>>(
        (state) => sliced(state).itemConstructor
      );
    }
  }
  const staticCellStyle = { wordBreak: "break-word" };

  const firstNotHidden = props.fields?.filter(
    (x) => !props.hiddenColumns?.includes(x.field)
  )[0];
  let colDefs = props.fields?.map((x) => {
    const notBool = x.type !== "boolean";
    const hide = props.hiddenColumns?.includes(x.field);
    const obj: ColDef = {
      field: x.field as string,
      headerName:
        x.description === undefined ? (x.field as string) : x.description,
      filter: props.isFilterDisabled
        ? false
        : mapTypeToFilter(x.type, props.isCustomFilterAndSorting),
      sortable: props.isSortableDisabled
        ? false
        : props.isCustomFilterAndSorting ?? notBool,
      hide: hide,
      tooltipField: x.field as string,
      cellStyle: staticCellStyle,
      rowSpan: x.rowSpan,
      cellClassRules: x.cellClassRules,
    };

    if (props.isCustomFilterAndSorting) {
      obj.comparator = () => 0;
    }

    if (props.floatColumns !== undefined) {
      if (x.type === "number" && props.floatColumns.includes(x.field)) {
        obj.valueFormatter = (params) => {
          if (params.value !== null) {
            return Number(params.value).toFixed(2);
          }
          return "";
        };
      }
    }
    if (
      props.rowIsMultiple &&
      firstNotHidden !== undefined &&
      firstNotHidden === x
    ) {
      obj.headerCheckboxSelection = true;
      obj.headerCheckboxSelectionFilteredOnly = true;
      obj.checkboxSelection = true;
    }

    if (obj.filter === "agDateColumnFilter") {
      obj.comparator = dateComparator;
      obj.filterParams = dateFilterParams;
    }

    if (x.type === "Date") {
      obj.valueFormatter = (params) => {
        if (params.value !== null) {
          const mDate = params.value as Date;
          let ms = mDate.getMilliseconds();
          let mTime = `${twoDigits(mDate.getHours())}:${twoDigits(
            mDate.getMinutes()
          )}${
            !props.isSecondsNotShow ? `:${twoDigits(mDate.getSeconds())}` : ""
          }${!props.isSecondsNotShow && ms !== 0 ? `.${threeDigits(ms)}` : ""}`;
          if (
            props.notShowTimeInDate &&
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
      obj.tooltipField = '';
      obj.cellRenderer = "checkboxRenderer";
    }

    if (x.cellRenderer) {
      obj.cellRenderer = x.cellRenderer;
    }

    return obj;
  });
  const frameworkComponents = {
    checkboxRenderer: CheckBoxCell,
    reportBtnRenderer: ReportButton,
    coefReportBtnRenderer: CoefReportButton,
    protocolReportBtnRenderer: ProtocolReportButton,
    fileBtnRenderer: FileButton,
    investigationActBtnRenderer: InvestigationActButton,
    groupArrayRenderer: GroupSiknTreeSelect,
    groupTreeSelectHeader: GroupTreeSelectHeader,
    groupMailCheckboxRenderer: GroupMailCheckBoxCell,
    groupWebCheckboxRenderer: GroupWebCheckBoxCell,
    groupMailCheckBoxHeader: GroupMailCheckBoxHeader,
    groupWebCheckBoxHeader: GroupWebCheckBoxHeader,
    arrayRenderer: SiknTreeSelect,
    treeSelectHeader: TreeSelectHeader,
    mailCheckboxRenderer: MailCheckBoxCell,
    webCheckboxRenderer: WebCheckBoxCell,
    mailCheckBoxHeader: MailCheckBoxHeader,
    webCheckBoxHeader: WebCheckBoxHeader,
    editBtnRenderer: EditButton,
    deleteBtnRenderer: DeleteButton,
    siknOffActRenderer: SiknOffActCell,
    investigateActRenderer: InvestigateActCell,
    menuRenderer: MenuRenderer,
    attachBtnRenderer: AttachButton,
    eventsActionsRenderer: EventsActionsRenderer,
    failuresActionsRenderer: FailuresActionsRenderer,
    actionsRenderer: ActionsRenderer,
    toKmhActionsRenderer: ToKmhActionsRenderer,
    coefActionsRenderer: CoefActionsRenderer,
    customFilter: CustomFilter,
    qualityRenderer: QualityRenderer,
    askidRenderer: AskidRenderer,
    elisRenderer: ElisRenderer,
    infoBtnRenderer: DataSiInfoButton,
    insertResultToKmhRenderer: InsertResultToKmhCell,
    criticalnessRenderer: CriticalnessRenderer,
    constantRiskBindRenderer: ConstantRiskBindRenderer,
    riskEditRenderer: RiskEditRenderer,
    eventRiskEditRenderer: EventRiskEditRenderer,
    limitsActionsRenderer: LimitsActionsRenderer,
    pspControlInfoButton: PspControlInfoButton,
    verificationSchedulePageActionsRenderer:
      VerificationSchedulePageActionsRenderer,
    siEditActionsRenderer: SiEditActionsRenderer,
    siBindingEditActionsRenderer: SiBindingEditActionsRenderer,
    siModelEditActionsRenderer: SiModelEditActionsRenderer,
    customTextTableFilter: CustomTextTableFilter,
    ctrlmailCheckboxRenderer: CtrlMailCheckBoxCell,
    ctrlwebCheckboxRenderer: CtrlWebCheckBoxCell,
    ctrlmailCheckBoxHeader: CtrlMailCheckBoxHeader,
    ctrlwebCheckBoxHeader: CtrlWebCheckBoxHeader,
    ctrlgroupMailCheckboxRenderer: CtrlGroupMailCheckBoxCell,
    ctrlgroupWebCheckboxRenderer: CtrlGroupWebCheckBoxCell,
    ctrlgroupMailCheckBoxHeader: CtrlGroupMailCheckBoxHeader,
    ctrlgroupWebCheckBoxHeader: CtrlGroupWebCheckBoxHeader,
    ...props.frameworkComponents,
  };

  if (props.actionColumns !== undefined) {
    colDefs?.push(...props.actionColumns);
  }

  if (colDefs !== undefined && props.replaceColumns !== undefined) {
    const replaceCols = props.replaceColumns;
    colDefs = colDefs.map((x) => {
      const replaced = replaceCols.find((y) => y.field === x.field);
      if (replaced) {
        const newCol: ColDef = {
          ...x,
          ...replaced,
        };
        return newCol;
      }
      return x;
    });
  }

  let dispatch: ReturnType<typeof useDispatch> | null = null;
  if (props.reducer !== undefined) {
    dispatch = useDispatch();
  }

  const headerHeightGetter = () => {
    const columnHeaderTexts = [
      ...(document.querySelectorAll(".ag-header-cell-text") as any),
    ];
    const clientHeights = columnHeaderTexts.map(
      (headerText) => headerText.clientHeight
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
    <div
      style={{ height: props.height, width: "100%" }}
      className={props.className}
    >
      <div
        id="ItemsGrid"
        style={{ height: "100%", width: "100%" }}
        className="ag-theme-material"
      >
        <AgGridReact
          columnDefs={colDefs}
          getRowStyle={props.rowStyle}
          rowData={props.items}
          immutableData={true}
          getRowNodeId={(data) => data.id}
          groupDefaultExpanded={-1}
          localeText={gridOptions.ruGrid}
          defaultColDef={gridOptions.defaultColDef}
          suppressRowTransform={true}
          suppressScrollOnNewData={gridOptions.suppressScrollOnNewData}
          rowSelection={gridOptions.rowSelection}
          frameworkComponents={frameworkComponents}
          onModelUpdated={props.onModelUpdated}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Пожалуйста, подождите, пока данные загружаются</span>'
          }
          onSelectionChanged={(ev: SelectionChangedEvent) => {
            if (props.rowIsMultiple && props.selectionCallback !== undefined) {
              props.selectionCallback(ev.api.getSelectedRows() as T[]);
              return;
            }
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
            let allColumnIds: any[] = [];
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
            headerHeightSetter(ev);
          }}
          onFirstDataRendered={(ev: FirstDataRenderedEvent) => {
            const listener = function () {
              setTimeout(function () {
                resize();
              });
            };

            const resize = () => {
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
            window.addEventListener("resize", listener);
          }}
          // https://www.ag-grid.com/javascript-grid/row-height/#example-auto-row-height
          onColumnResized={(ev) => {
            ev.api.resetRowHeights();
            headerHeightSetter(ev);
          }}
          onColumnVisible={(ev) => {
            ev.api.resetRowHeights();
            headerHeightSetter(ev);
          }}
          isFullWidthCell={props.isFullWidthCell}
          fullWidthCellRenderer={props.fullWidthCellRenderer}
          rowHeight={props.rowHeight}
          rowClassRules={props.rowClassRules}
          onFilterChanged={(event: FilterChangedEvent) => {
            const filterModel = event.api.getFilterModel();
            if (props.filterChangedCallback)
              props.filterChangedCallback(filterModel);
          }}
          onSortChanged={(event: SortChangedEvent) =>
            props.onSortChanged && props.onSortChanged(event)
          }
        />
      </div>
    </div>
  );
}

ItemsTable.defaultProps = {
  height: "100%",
  onModelUpdated: (ev) => ev.api.deselectAll(),
};
