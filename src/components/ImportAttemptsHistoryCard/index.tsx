import { AgGridColumn } from "ag-grid-react";
import { Breadcrumb, Layout, Row, Col, Card, Pagination, Spin } from "antd";
import { AgGridTable } from "components/AgGridTable";
import { ImportAttemptsHistoryCardRenderer } from "components/cellRenderers/ImportAttemptsHistoryCardRenderer";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { PageLayoutStyled, TableBlockWrapperStyled } from "../../styles/commonStyledComponents";
import usePresenter from "./presenter";
import { CardTitleStyled, FilterInputStyled, FilterSelectStyled, SpinContainerStyled } from "./styled";
import {
    SiderFilterStyled,
    FilterRowStyled,
    FilterItemLabelStyled,
    WrapperTreeRowStyled,
} from "../../styles/commonStyledComponents";
import Title from "antd/lib/typography/Title";
import RightOutlined from "@ant-design/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import moment from "moment";

const { Content } = Layout;

export const ImportAttemptsHistoryCard: FC = React.memo(() => {
    const {
        importAttemptsHistoryCardState,
        collapsed,
        onCollapseHandler,
        setRowNumbersIdHandler,
        setMessageTypeIdHandler,
        setCurrentPageHandler,
    } = usePresenter();

    return <PageLayoutStyled>
        <Breadcrumb>
            <Breadcrumb.Item key={"История попыток импорта"}>
                <Link to={"/import"}>История попыток импорта</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item key={"Построчный просмотр"}>Построчный просмотр</Breadcrumb.Item>
        </Breadcrumb>

        <CardTitleStyled>{
            `${importAttemptsHistoryCardState.fileName}.
            ${importAttemptsHistoryCardState.userName}.
            ${moment(importAttemptsHistoryCardState.timeStamp).format("YYYY-MM-DD HH:mm:ss")}`
        }</CardTitleStyled>
        <Layout>
            <SiderFilterStyled
                width={318} //280
                trigger={null}
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapseHandler}
                style={{ border: "1px solid #E5E5E5" }}
            >
                <Row
                    justify={collapsed ? "center" : "space-between"}
                    align="middle"
                >
                    <Col style={{ display: collapsed ? "none" : "block" }}>
                        <Title level={4}>Фильтр</Title>
                    </Col>
                    <Col>
                        <div onClick={onCollapseHandler} style={{ cursor: "pointer" }}>{
                            collapsed ? <RightOutlined /> : <LeftOutlined />}
                        </div>
                    </Col>
                </Row>

                <FilterRowStyled $collapsed={collapsed}>
                    <Col>
                        <FilterItemLabelStyled>Номер строки</FilterItemLabelStyled>
                    </Col>
                </FilterRowStyled>
                <WrapperTreeRowStyled $collapsed={collapsed}>
                    <Col span={24} style={{ height: "100%" }}>
                        <FilterInputStyled
                            value={importAttemptsHistoryCardState.rowNumberId ? importAttemptsHistoryCardState.rowNumberId : undefined}
                            placeholder="Все строки"
                            onChange={values => setRowNumbersIdHandler(values)}
                            min={1}
                        />
                    </Col>
                </WrapperTreeRowStyled>

                <FilterRowStyled $collapsed={collapsed}>
                    <Col>
                        <FilterItemLabelStyled>Тип сообщения</FilterItemLabelStyled>
                    </Col>
                </FilterRowStyled>
                <WrapperTreeRowStyled $collapsed={collapsed}>
                    <Col span={24} style={{ height: "100%" }}>
                        <FilterSelectStyled
                            value={importAttemptsHistoryCardState.checkedMessageTypeId ? importAttemptsHistoryCardState.checkedMessageTypeId : undefined}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={importAttemptsHistoryCardState.messageTypesTreeData}
                            placeholder="Все типы сообщений"
                            treeDefaultExpandAll
                            onChange={values => setMessageTypeIdHandler(values)}
                            treeCheckable
                            showArrow
                            showSearch={false}
                            maxTagCount={1}
                            allowClear
                            loading={importAttemptsHistoryCardState.isSelectLoading}
                        />
                    </Col>
                </WrapperTreeRowStyled>
            </SiderFilterStyled>

            <Content>
                <TableBlockWrapperStyled className="ag-theme-alpine">
                    {
                        importAttemptsHistoryCardState.isLoading
                            ? <SpinContainerStyled>
                                <Spin />
                            </SpinContainerStyled>
                            : <AgGridTable
                                rowData={importAttemptsHistoryCardState.modifiedRowData}
                                rowSelection="single"
                                defaultColDef={{
                                    sortable: true,
                                    filter: true,
                                    resizable: true,
                                }}
                            >
                                <AgGridColumn
                                    headerName="Номер строки"
                                    field="rowNumber"
                                // minWidth={100}
                                />
                                <AgGridColumn
                                    headerName="Метка времени"
                                    field="timeStamp"
                                // minWidth={300}
                                />
                                <AgGridColumn
                                    headerName="Сообщение"
                                    field="message"
                                    tooltipField="message"
                                    maxWidth={1000}
                                />
                                <AgGridColumn
                                    headerName="Статус добавления строки"
                                    cellRendererFramework={ImportAttemptsHistoryCardRenderer}
                                // minWidth={100}
                                />
                            </AgGridTable>
                    }
                    <Card>
                        <Row justify="space-between">
                            <Col>
                                <div style={{ textAlign: "center" }}>
                                    <Pagination
                                        disabled={importAttemptsHistoryCardState.isLoading}
                                        current={importAttemptsHistoryCardState.currentPage}
                                        total={importAttemptsHistoryCardState.pagesAmount}
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
    </PageLayoutStyled>
});