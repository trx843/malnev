import React, { LegacyRef, forwardRef } from "react";
import classNames from "classnames/bind";
import _ from "lodash";
import {
  AgGridReact,
  ChangeDetectionStrategyType,
  AgGridReactProps,
} from "ag-grid-react";
import {
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  ICellRendererComp,
  ICellRendererFunc,
  IsRowSelectable,
  RowDataChangedEvent,
  RowNode,
  SelectionChangedEvent,
} from "ag-grid-community";
import { AgGridLocalizationRu } from "./constants";
import {
  autoSizeAll,
  initAgGridTableStorage,
  isFirstColumn,
  updateStateStorageKey,
} from "./utils";
import { Spin } from "antd";
import {
  ColumnMovedEvent,
  ColumnPinnedEvent,
  ColumnResizedEvent,
  ColumnVisibleEvent,
  FilterChangedEvent,
  ModelUpdatedEvent,
  SortChangedEvent,
} from "ag-grid-community/dist/lib/events";
import styles from "./agGridTable.module.css";

const cx = classNames.bind(styles);

interface IAgGridTableProps
  extends Omit<AgGridReactProps, "onSelectionChanged"> {
  className?: string;
  // данные таблицы
  rowData?: any[];
  // объект свойств, которые унаследуют все столбцы(width, editable, sortable и т.д.)
  defaultColDef?: ColDef;
  // массив определения столбцов, вместо этого можно напрямую кидать AgGridColumn в children-ы таблицы
  columnDefs?: (ColDef | ColGroupDef)[];
  // набор имен компонентов для рендеринга
  frameworkComponents?:
    | {
        [p: string]: {
          new (): any;
        };
      }
    | any;
  // коллбэк для определения какие строки следует рассматривать как fullWidth
  isFullWidthCell?(rowNode: RowNode): boolean;
  // компонент, использующийся при рендеринге full width строки
  fullWidthCellRenderer?:
    | {
        new (): ICellRendererComp;
      }
    | ICellRendererFunc
    | string;
  fullWidthCellRendererFramework?: any;
  fullWidthCellRendererParams?: any;
  // высота строки для всей таблицы
  rowHeight?: number;
  // true, если необходимое разрешить растягивание строк(rowSpan)
  suppressRowTransform?: boolean;
  // тип выбора строки single | multiple
  rowSelection?: string;
  // коллбэк вызывается, когда одна или несколько строк выбраны или отменены
  onSelectionChanged?(selectedRows: any[], event: SelectionChangedEvent): void;
  // если true, строки будут выбираться только при нажатии на чекбокс(иначе при нажатии на всю область строки)
  suppressRowClickSelection?: boolean;
  // правила класса для строк
  rowClassRules?: {
    [cssClassName: string]: ((params: any) => boolean) | string;
  };
  // включает базовый множественный выбор строк(по желанию можно настроить кастомный)
  isBasicMultipleRowSelection?: boolean;
  // включает автоматическое изменение размера всех столбцов
  isAutoSizeColumns?: boolean;
  // Выбранные строки
  selectedRowIds?: string[];
  // отображение загрузки
  loadingOverlayComponentFramework?: any;
  hasLoadingOverlayComponentFramework?: boolean;
  onGridReady?: (event: GridReadyEvent) => void;
  onColumnResized?: (event: ColumnResizedEvent) => void;
  onColumnVisible?: (event: ColumnVisibleEvent) => void;
  rowClass?: string | string[];
  isRowSelectable?: IsRowSelectable;
  onModelUpdated?(event: ModelUpdatedEvent): void;
  ref?: LegacyRef<AgGridReact> | undefined;
  rowDragManaged?: boolean;
  animateRows?: boolean;
  // уникальный идентификатор таблицы для включения сохранения ширины ячеек в localStorage
  stateStorageKey?: string;
  // массив названий столбцов для которых не будет применен AutoSize
  columnsIgnoringAutoSize?: string[];
  suppressColumnVirtualisation?: boolean;
  isSkipHeaderOnAutoSizeAll?: boolean;
  filterChangedCallback?: (
    filterModel: any,
    event?: FilterChangedEvent
  ) => void;
  onSortChanged?: (event: SortChangedEvent) => void;
  onColumnMoved?: (event: ColumnMovedEvent) => void;
  onColumnPinned?: (event: ColumnPinnedEvent) => void;
}

export const AgGridTable: React.FC<IAgGridTableProps> = forwardRef(
  (
    {
      className,
      rowData,
      defaultColDef,
      columnDefs,
      frameworkComponents,
      isFullWidthCell,
      fullWidthCellRenderer,
      fullWidthCellRendererFramework,
      fullWidthCellRendererParams,
      rowHeight,
      suppressRowTransform,
      rowSelection,
      onSelectionChanged,
      suppressRowClickSelection,
      isBasicMultipleRowSelection,
      isAutoSizeColumns = true,
      rowClassRules,
      children,
      loadingOverlayComponentFramework = () => <Spin size="large" />,
      hasLoadingOverlayComponentFramework = false,
      onGridReady,
      onColumnResized,
      onColumnVisible,
      rowClass,
      isRowSelectable,
      onModelUpdated,
      rowDragManaged,
      animateRows,
      stateStorageKey,
      columnsIgnoringAutoSize,
      suppressColumnVirtualisation,
      isSkipHeaderOnAutoSizeAll,
      filterChangedCallback,
      onSortChanged,
      onColumnMoved,
      onColumnPinned,
      ...props
    },
    ref
  ) => {
    const onFirstDataRendered = (event: FirstDataRenderedEvent) => {
      // хак(по аналогии с ItemsTable), без этого не работает корректно установка ширины ячеек под контент
      setTimeout(() =>
        autoSizeAll(
          event.columnApi,
          columnsIgnoringAutoSize,
          isSkipHeaderOnAutoSizeAll
        )
      );
    };

    const handleFirstDataRendered = (event: GridReadyEvent) => {
      const columnApi = event.columnApi;
      // инициализация ширины колонок из localStorage

      if (isAutoSizeColumns && !stateStorageKey) {
        // устанавливает размер столбцов, чтобы они помещались в область видимости таблицы.
        // нужно для того, чтобы затем у всех ячеек корректно установилась ширина контенту
        //if (!suppressColumnVirtualisation) event.api.sizeColumnsToFit();
        autoSizeAll(
          columnApi,
          columnsIgnoringAutoSize,
          isSkipHeaderOnAutoSizeAll
        );
      }

      if (onGridReady) onGridReady(event);
    };

    const handleGridReady = async (event: GridReadyEvent) => {
      const columnApi = event.columnApi;

      // устанавливает размер столбцов, чтобы они помещались в область видимости таблицы.
      // нужно для того, чтобы затем у всех ячеек корректно установилась ширина контенту
      if (!suppressColumnVirtualisation) event.api.sizeColumnsToFit();

      if (stateStorageKey)
        await initAgGridTableStorage(columnApi, stateStorageKey);
    };

    const handleSelectionChanged = (event: SelectionChangedEvent) => {
      if (onSelectionChanged) {
        const selectedRows = event.api.getSelectedRows();
        onSelectionChanged(selectedRows, event);
      }
    };

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
    const handleColumnResized = (event: ColumnResizedEvent) => {
      if (onColumnResized) onColumnResized(event);

      event.api.resetRowHeights();
      headerHeightSetter(event);
      // обновление ширины колонок из localStorage
      if (stateStorageKey && !event.api?.["destroyCalled"]) {
        const columnState = event.columnApi.getColumnState();
        updateStateStorageKey(columnState, stateStorageKey);
      }
    };

    const handleColumnVisible = (event: ColumnVisibleEvent) => {
      if (onColumnVisible) onColumnVisible(event);
      if (!suppressColumnVirtualisation) event.api.sizeColumnsToFit();

      if (isAutoSizeColumns && !stateStorageKey) {
        // устанавливает размер столбцов, чтобы они помещались в область видимости таблицы.
        // нужно для того, чтобы затем у всех ячеек корректно установилась ширина контенту
        autoSizeAll(
          event.columnApi,
          columnsIgnoringAutoSize,
          isSkipHeaderOnAutoSizeAll
        );
      }
      event.api.resetRowHeights();
      headerHeightSetter(event);
      // обновление из localStorage
      if (stateStorageKey && !event.api?.["destroyCalled"]) {
        const columnState = event.columnApi.getColumnState();
        updateStateStorageKey(columnState, stateStorageKey);
      }
    };

    const handleColumnMoved = (event: ColumnMovedEvent) => {
      if (onColumnMoved) onColumnMoved(event);

      // обновление из localStorage
      if (stateStorageKey && !event.api?.["destroyCalled"]) {
        const columnState = event.columnApi.getColumnState();
        updateStateStorageKey(columnState, stateStorageKey);
      }
    };

    const handleColumnPinned = (event: ColumnPinnedEvent) => {
      if (onColumnPinned) onColumnPinned(event);
      // обновление из localStorage
      if (stateStorageKey && !event.api?.["destroyCalled"]) {
        const columnState = event.columnApi.getColumnState();
        updateStateStorageKey(columnState, stateStorageKey);
      }
    };

    return (
      <div
        id="AgGridTable"
        className={classNames(
          "agGridTable-border",
          cx("ag-theme-material", "agGridTable"),
          fullWidthCellRendererFramework && cx("no-background-color"),
          className
        )}
      >
        <AgGridReact
          {...props}
          ref={ref}
          onGridReady={handleGridReady}
          onFirstDataRendered={
            onGridReady || isAutoSizeColumns
              ? handleFirstDataRendered
              : undefined
          }
          {...(hasLoadingOverlayComponentFramework && {
            loadingOverlayComponentFramework,
          })}
          columnDefs={columnDefs}
          rowDragManaged={rowDragManaged}
          animateRows={animateRows}
          defaultColDef={{
            ...defaultColDef,
            ...(isBasicMultipleRowSelection && {
              headerCheckboxSelection: isFirstColumn,
              checkboxSelection: isFirstColumn,
            }),
          }}
          onColumnResized={_.debounce(handleColumnResized, 500)}
          rowData={rowData}
          frameworkComponents={frameworkComponents}
          isFullWidthCell={isFullWidthCell}
          fullWidthCellRenderer={fullWidthCellRenderer}
          fullWidthCellRendererFramework={fullWidthCellRendererFramework}
          fullWidthCellRendererParams={fullWidthCellRendererParams}
          rowHeight={rowHeight}
          {...(isAutoSizeColumns &&
            !stateStorageKey && {
              onFirstDataRendered,
              onRowDataChanged: (event: RowDataChangedEvent) =>
                autoSizeAll(
                  event.columnApi,
                  columnsIgnoringAutoSize,
                  isSkipHeaderOnAutoSizeAll
                ),
            })}
          localeText={AgGridLocalizationRu}
          suppressRowTransform={suppressRowTransform}
          // для корректной работы таблицы при обновлении данных
          rowDataChangeDetectionStrategy={
            ChangeDetectionStrategyType.IdentityCheck
          }
          rowSelection={rowSelection}
          {...(onSelectionChanged && {
            onSelectionChanged: handleSelectionChanged,
          })}
          suppressRowClickSelection={suppressRowClickSelection}
          rowClassRules={rowClassRules}
          rowClass={rowClass}
          isRowSelectable={isRowSelectable}
          onModelUpdated={onModelUpdated}
          suppressColumnVirtualisation={suppressColumnVirtualisation}
          onFilterChanged={(event: FilterChangedEvent) => {
            const filterModel = event.api.getFilterModel();
            if (filterChangedCallback)
              filterChangedCallback(filterModel, event);
          }}
          onSortChanged={onSortChanged}
          onColumnVisible={handleColumnVisible}
          onColumnMoved={handleColumnMoved}
          onColumnPinned={handleColumnPinned}
        >
          {children}
        </AgGridReact>
      </div>
    );
  }
);
