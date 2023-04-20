import UnorderedListOutlined from "@ant-design/icons/lib/icons/UnorderedListOutlined";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import { AgGridColumn } from "ag-grid-react/lib/agGridColumn";
import { Button, Card, Spin } from "antd";
import { AgGridTable } from "components/AgGridTable";
import { ActionsColumn } from "pages/PspControl/PlanCardPage/components/Matchings/MatchingsTable/components/ActionsColumn";
import { CommissionsModals } from "pages/PspControl/PlanCardPage/components/Matchings/modals";
import { isOperationButtonDisabled } from "pages/PspControl/PlanCardPage/utils";
import { FC } from "react"
import usePresenter from "./presenter";

export const Matchings: FC = () => {
    const {
        isMatchingsTabLoading,
        commissions,
        handleDelete,
        handleAdd,
        handleSort,
        planStatusId,
        typicalPlanCard,
    } = usePresenter();

    return <>
        {
            isMatchingsTabLoading
                ? <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Spin />
                </div>
                : <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        height: "100%",
                    }}
                >

                    <Card style={{ borderRight: "none" }}>
                        <Button
                            type="link"
                            icon={<PlusCircleFilled />}
                            onClick={handleAdd}
                            disabled={isOperationButtonDisabled(planStatusId)}
                        >
                            Добавить согласующего
                        </Button>

                        <Button
                            className="ais-table-actions__item"
                            icon={<UnorderedListOutlined />}
                            type="link"
                            onClick={handleSort}
                            disabled={isOperationButtonDisabled(planStatusId)}
                        >
                            Изменить порядок
                        </Button>
                    </Card>

                    <AgGridTable
                        rowData={commissions}
                        suppressRowTransform={true}
                        defaultColDef={{ resizable: true }}
                        isAutoSizeColumns={false}
                    >
                        <AgGridColumn
                            headerName="№ пп"
                            field="serial"
                            minWidth={85}
                        />
                        <AgGridColumn
                            headerName="Организация"
                            field="organizationName"
                            minWidth={420}
                            tooltipField="organizationName"
                        />
                        <AgGridColumn
                            headerName="ФИО"
                            field="fullName"
                            minWidth={363}
                            tooltipField="fullName"
                        />
                        <AgGridColumn
                            headerName="Должность"
                            field="jobTitle"
                            minWidth={362}
                            tooltipField="jobTitle"
                        />
                        <AgGridColumn
                            headerName="Согласующий/утверждающий/разработал"
                            field="commisionTypesText"
                            minWidth={168}
                            headerTooltip="Согласующий/утверждающий/разработал"
                        />
                        <AgGridColumn
                            headerName="Действия"
                            pinned="right"
                            cellRendererFramework={ActionsColumn}
                            cellRendererParams={{
                                planStatusId: typicalPlanCard?.planStatusId,
                                onDelete: handleDelete,
                            }}
                            minWidth={130}
                        />
                    </AgGridTable>
                </div>

        }
        <CommissionsModals isTypical={true} />
    </>
}