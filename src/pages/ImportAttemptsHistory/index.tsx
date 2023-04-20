import { Card, Col, DatePicker, Layout, PageHeader, Pagination, Row, Spin, } from "antd";
import React from "react";
import { FC } from "react";
import { history } from "../../history/history";
import { PageLayoutStyled, TableBlockWrapperStyled } from "../../styles/commonStyledComponents";
import { AgGridTable } from "components/AgGridTable";
import { AgGridColumn } from "ag-grid-react";
import usePresenter from "./presenter";
import { FilterColStyled, FilterItemLabelStyled, FilterItemStyled, FilterSelectStyled, SpinContainerStyled } from "./styled";
import { ImportAttemptsHistoryRenderer } from "components/cellRenderers/ImportAttemptsHistoryRenderer";
import moment from "moment";
import { FilterDocumentType, FilterStatusType } from "api/responses/importAttemptsHistory";

const { Content } = Layout;

export const ImportAttemptsHistory: FC = React.memo(() => {
    const {
        importAttemptsHistoryState,
        setDocumentTypeIdHandler,
        setStatusIdHandler,
        setCurrentPageHandler,
        setStartTimeHandler,
        setFinishTimeHandler,
    } = usePresenter();

    return <PageLayoutStyled>
        <PageHeader
            style={{ paddingTop: 0 }}
            className="site-page-header"
            onBack={() => history.push("/")}
            title="История попыток импорта"
            subTitle=""
        />

        <Layout>
            <Content>
                <TableBlockWrapperStyled className="ag-theme-alpine">
                    <Card>
                        <Row wrap={false} justify={"space-between"}>
                            <FilterColStyled>
                                <FilterItemStyled>
                                    <FilterItemLabelStyled>
                                        Диапазон времени
                                    </FilterItemLabelStyled>

                                    <DatePicker.RangePicker
                                        size={"large"}
                                        value={[
                                            moment(importAttemptsHistoryState.startTime, "YYYY-MM-DD HH:mm:ss"),
                                            moment(importAttemptsHistoryState.finishTime, "YYYY-MM-DD HH:mm:ss")
                                        ]}
                                        onChange={(_, dateString) => {
                                            !!dateString[0].length && setStartTimeHandler(dateString[0])
                                            !!dateString[1].length && setFinishTimeHandler(dateString[1])
                                        }}
                                        showTime
                                    />
                                </FilterItemStyled>

                                <FilterItemStyled style={{ marginLeft: "24px", minWidth: "150px" }}>
                                    <FilterItemLabelStyled>
                                        Тип документа
                                    </FilterItemLabelStyled>

                                    <FilterSelectStyled
                                        value={importAttemptsHistoryState.documentTypeId ? importAttemptsHistoryState.documentTypeId : undefined}
                                        placeholder="Все типы документов"
                                        onChange={value => setDocumentTypeIdHandler(value)}
                                        allowClear
                                        loading={importAttemptsHistoryState.isSelectLoading}
                                    >
                                        {
                                            importAttemptsHistoryState.documentTypes.map((type: FilterDocumentType) => (
                                                <FilterSelectStyled.Option value={type.id} key={type.id}>
                                                    {type.docType}
                                                </FilterSelectStyled.Option>
                                            ))
                                        }
                                    </FilterSelectStyled>
                                </FilterItemStyled>

                                <FilterItemStyled style={{ marginLeft: "24px", minWidth: "150px" }}>
                                    <FilterItemLabelStyled>
                                        Статус
                                    </FilterItemLabelStyled>

                                    <FilterSelectStyled
                                        value={importAttemptsHistoryState.statusId ? importAttemptsHistoryState.statusId : undefined}
                                        placeholder="Все статусы"
                                        onChange={value => setStatusIdHandler(value)}
                                        allowClear
                                        loading={importAttemptsHistoryState.isSelectLoading}
                                    >
                                        {
                                            importAttemptsHistoryState.statuses.map((status: FilterStatusType) => (
                                                <FilterSelectStyled.Option value={status.id} key={status.id}>
                                                    {status.name}
                                                </FilterSelectStyled.Option>
                                            ))
                                        }
                                    </FilterSelectStyled>
                                </FilterItemStyled>
                            </FilterColStyled>
                            <Col>

                            </Col>
                        </Row>
                    </Card>

                    {
                        importAttemptsHistoryState.isLoading
                            ? <SpinContainerStyled>
                                <Spin />
                            </SpinContainerStyled>
                            : <AgGridTable
                                rowData={importAttemptsHistoryState.modifiedRowData}
                                rowSelection="single"
                                defaultColDef={{
                                    sortable: true,
                                    filter: true,
                                    resizable: true,
                                }}
                            >
                                <AgGridColumn
                                    headerName="Тип документа"
                                    field="docType"
                                    minWidth={300}
                                />
                                <AgGridColumn
                                    headerName="Имя файла"
                                    field="fileName"
                                    minWidth={300}
                                />
                                <AgGridColumn
                                    headerName="Метка времени"
                                    field="timeStamp"
                                    minWidth={300}
                                />
                                <AgGridColumn
                                    headerName="Статус"
                                    field="importStatus"
                                    // tooltipField="pagesMap"
                                    minWidth={300}
                                />
                                <AgGridColumn
                                    headerName="Кол-во сообщений"
                                    field="messagesCount"
                                    // tooltipField="elementsMap"
                                    minWidth={300}
                                />
                                <AgGridColumn
                                    headerName="Пользователь"
                                    field="userName"
                                    tooltipField="elementsMap"
                                    minWidth={300}
                                />
                                <AgGridColumn
                                    headerName="Действия"
                                    pinned="right"
                                    cellRendererFramework={ImportAttemptsHistoryRenderer}
                                />
                            </AgGridTable>
                    }

                    <Card>
                        <Row justify="space-between">
                            <Col>
                                <div style={{ textAlign: "center" }}>
                                    <Pagination
                                        disabled={importAttemptsHistoryState.isLoading}
                                        current={importAttemptsHistoryState.currentPage}
                                        total={importAttemptsHistoryState.pagesAmount}
                                        defaultPageSize={1}
                                        onChange={value => setCurrentPageHandler(value)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </TableBlockWrapperStyled>
            </Content>
        </Layout>
    </PageLayoutStyled >
})