import React, { FC } from "react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { SchemeType } from "../../api/params/nsi-page.params";
import { CataloguesTableButtonsBlock } from "./CataloguesTableButtonsBlock";
import { TableBlockWrapperStyled } from "../../styles/commonStyledComponents";
import { AgGridTable } from "components/AgGridTable";
import { updateModalAbilityHandler } from "pages/Nsi/utils";

type PropsType = {
    columnDefs: any;
    rowData: any;
    selectedScheme: SchemeType;
    setIsCreateModalVisible: (value: boolean) => void;
    setIsUpdateModalVisible: (value: boolean) => void;
    setIsDeleteModalVisible: (value: boolean) => void;
    onRowClickHandler: (selectedRow: object) => void;
    selectedRowInScheme: any;
    setModalTitle: (modalTitle: string) => void;
};

export const CataloguesTable: FC<PropsType> = React.memo(({
    columnDefs,
    rowData,
    setIsCreateModalVisible,
    selectedScheme,
    setIsUpdateModalVisible,
    setIsDeleteModalVisible,
    onRowClickHandler,
    selectedRowInScheme,
    setModalTitle,
}) => {
    const rowSelectionHandler = (selectedRows: any) => {
        onRowClickHandler(selectedRows[0]);
    };

    return <>
        {
            selectedScheme && selectedScheme.canEdit
                ? <TableBlockWrapperStyled>
                    <CataloguesTableButtonsBlock
                        setIsCreateModalVisible={setIsCreateModalVisible}
                        setIsUpdateModalVisible={setIsUpdateModalVisible}
                        setIsDeleteModalVisible={setIsDeleteModalVisible}
                        setModalTitle={setModalTitle}
                        isButtonsDisabled={updateModalAbilityHandler(selectedRowInScheme)}
                    />

                    <AgGridTable
                        columnDefs={columnDefs}
                        rowData={rowData}
                        rowSelection={"single"}
                        onSelectionChanged={rowSelectionHandler}
                        isAutoSizeColumns={false}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: true,
                            width: 300,
                        }}
                        suppressRowTransform
                        suppressColumnVirtualisation //отключает дефолтный буфер количества стобцов
                    />
                </TableBlockWrapperStyled>
                : <TableBlockWrapperStyled>
                    <AgGridTable
                        columnDefs={columnDefs}
                        rowData={rowData}
                        isAutoSizeColumns={false}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: true,
                            width: 300,
                        }}
                    />
                </TableBlockWrapperStyled>
        }
    </>
});