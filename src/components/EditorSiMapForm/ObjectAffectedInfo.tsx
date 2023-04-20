import { FC } from "react";
import { useSelector } from "react-redux";
import { SiequipmentsStateType } from "slices/siequipment";
import { StateType } from "types";
import { AgGridTable } from "components/AgGridTable";
import {
    TextDarkStyled as DarkStyled,
    TextGrayStyled as GrayStyled,
} from "../../styles/commonStyledComponents";
import { Col, Row, Spin } from "antd";
import { dateValueFormatter } from "utils";

export const ObjectAffectedInfo: FC = () => {
    const {
        oldSi,
        newSi,
        objectAffectedInfo,
        siTableisLoading,
    } = useSelector<StateType, SiequipmentsStateType>(
        (state) => state.siequipment
    );

    return <div>
        <Row>
            <Col span={8}>
                <DarkStyled style={{ fontWeight: "bolder" }}>{oldSi?.siCompName}</DarkStyled>
            </Col>

            <Col span={8} offset={2}>
                <DarkStyled style={{ fontWeight: "bolder" }}>{newSi?.siCompName}</DarkStyled>
            </Col>
        </Row>

        <Row>
            <Col span={6}>
                <GrayStyled>Количество плановых(старое): </GrayStyled>
            </Col>
            <Col span={1} offset={1}>
                <DarkStyled>{objectAffectedInfo?.oldPlannedEvents}</DarkStyled>
            </Col>
            <Col span={6} offset={2}>
                <GrayStyled>Количество плановых(новое): </GrayStyled>
            </Col>
            <Col span={1} offset={1}>
                <DarkStyled>{objectAffectedInfo?.newPlannedEvents}</DarkStyled>
            </Col>
        </Row>

        <Row style={{ marginBottom: "15px" }}>
            <Col span={6}>
                <GrayStyled>Количество проведённых(старое): </GrayStyled>
            </Col>
            <Col span={1} offset={1}>
                <DarkStyled>{objectAffectedInfo?.oldFactEvents}</DarkStyled>
            </Col>
            <Col span={6} offset={2}>
                <GrayStyled>Количество проведённых(новое): </GrayStyled>
            </Col>
            <Col span={1} offset={1}>
                <DarkStyled>{objectAffectedInfo?.newFactEvents}</DarkStyled>
            </Col>
        </Row>

        <Spin spinning={siTableisLoading} style={{ marginTop: "15px" }}>
            <div style={{ height: "410px" }}>
                {
                    objectAffectedInfo?.oldPlannedEvents === 0
                        && objectAffectedInfo?.newPlannedEvents === 0
                        && objectAffectedInfo?.oldFactEvents === 0
                        && objectAffectedInfo?.newFactEvents === 0
                        ? <div
                            style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            Пересечений по затрагиваемым объектам не найдено.
                        </div>
                        : <AgGridTable
                            rowData={objectAffectedInfo?.eventsTableModel}
                            isAutoSizeColumns
                            defaultColDef={{
                                sortable: true,
                                filter: true,
                                resizable: true,
                            }}
                            columnDefs={columnDefs}
                        />
                }
            </div>
        </Spin>
    </div>
};

const columnDefs = [
    {
        headerName: "Дата",
        field: "eventDate",
        minWidth: 580,
        tooltipField: "eventDate",
        valueFormatter: dateValueFormatter()
    },
    {
        headerName: "Тип мероприятия",
        field: "eventType",
        minWidth: 194,
        tooltipField: "eventType",
    },
    {
        headerName: "Факт или план",
        field: "isFactText",
        minWidth: 177,
        tooltipField: "isFactText",
    },
    {
        headerName: "Средство измерения",
        field: "siDescription",
        minWidth: 336,
        tooltipField: "siDescription",
    },
];