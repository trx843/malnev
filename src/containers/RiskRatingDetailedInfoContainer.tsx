import React, { FunctionComponent, useEffect, useState } from "react";
import { Row, Col, message, Card, Pagination, Spin, Button } from "antd";
import axios from "axios";
import { apiBase, asciiToUint8Array } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  FiltersModel,
  NodeType,
  ObjectFields,
  PagedModel,
  StateType,
} from "../types";
import { GridLoading } from "../components/GridLoading";
import { ItemsTable } from "../components/ItemsTable";
import { Event } from "../classes";
import { riskRatingInfoFetched } from "../actions/riskratinginfo/creators";
import { IRiskRatingInfoState, ListFilterBase } from "../interfaces";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ExportOutlined } from "@ant-design/icons";

export const RiskRatingDetailedInfoContainer: FunctionComponent = () => {
  const dispatch = useDispatch();
  const riskRatingInfoState = useSelector<StateType, IRiskRatingInfoState>(
    (state) => state.riskRatingInfo
  );

  const baseObj: string = `events`;
  const url = (page: number): string => {
    let nodeType: NodeType = "siknrsus";
    return `${apiBase}/${
      nodeType + "/" + riskRatingInfoState.selectedSikn?.id + "/"
    }${baseObj}?page=${page}`;
  };

  const [loading, setLoading] = useState<boolean>(true);

  const getFilter = (): ListFilterBase => {
    let filtersModel: FiltersModel = {
      eventsFilter: {
        isCompensated: false,
      },
    };

    const listFilter: ListFilterBase = {
      pageIndex: 0,
      sortedField: "",
      isSortAsc: true,
      filter: {
        filtersModel,
        treeFilter: {
          nodePath: "",
          isOwn: null,
        },
      },
    };
    return listFilter;
  };

  const fetchItems = (page: number) => {
    const pageInfo = {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    };
    const e: PagedModel<Event> = {
      entities: [],
      pageInfo: pageInfo,
    };

    const filtersModel = getFilter();
    axios
      .post<PagedModel<Event>>(url(page), filtersModel)
      .then((result) => {
        dispatch(riskRatingInfoFetched(result.data));
        setLoading(false);
      })
      .catch((err) => {
        dispatch(riskRatingInfoFetched(e));
        console.log(err);
        if (!axios.isCancel(err)) {
          setLoading(false);
          message.error("Ошибка загрузки данных");
        }
      });
  };

  useEffect(() => {
    if (riskRatingInfoState.selectedSikn) fetchItems(1);
  }, [riskRatingInfoState.selectedSikn]);

  const [exportDisabled, setExportDisabled] = useState<boolean>(false);
  const exportClickHandler = async () => {
    setExportDisabled(true);
    await exportToExcel();
    setExportDisabled(false);
  };

  const exportToExcel = async () => {
    const url = `${apiBase}/events/exportbysikn/${riskRatingInfoState.selectedSikn?.id}`;

    const filtersModel = getFilter();
    let fileName: string = "download.xls";
    let error: string = "Ошибка серверной части";
    // Запрос
    let response = await fetch(url, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filtersModel),
    });

    // Формирование имени файла
    if (response.ok) {
      let fileNameHeader = response.headers.get("FileName");
      if (fileNameHeader !== null && fileNameHeader !== undefined) {
        let headerSplit = fileNameHeader.split(";");
        if (headerSplit.length > 0) {
          let asciiFile = headerSplit[0];
          let code = asciiToUint8Array(asciiFile);
          fileName = new TextDecoder().decode(code);
        }
      }

      // Выгрузка файла
      let blob = await response.blob();
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    } else {
      let errorHeader = response.headers.get("Error");
      if (errorHeader !== null && errorHeader !== undefined) {
        let headerSplit = errorHeader.split(";");
        if (headerSplit.length > 0) {
          let asciiFile = headerSplit[0];
          let code = asciiToUint8Array(asciiFile);
          error = new TextDecoder().decode(code);
        }
      }
      return message.error({
        content: error,
        duration: 4,
      });
    }
  };

  return (
    <TableBlockWrapperStyled>
      <Card>
        <Row wrap={false} justify="end">
          <Col>
            <Row>
              <Col>
                <Button
                  loading={exportDisabled}
                  onClick={exportClickHandler}
                  type={"link"}
                  icon={<ExportOutlined />}
                  disabled={
                    !riskRatingInfoState.selectedSikn ||
                    loading ||
                    exportDisabled
                  }
                >
                  Экспортировать
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <Spin spinning={loading} wrapperClassName={"spinnerStyled"}>
        <ItemsTable<Event>
          isFilterDisabled
          isSortableDisabled
          items={riskRatingInfoState.items.entities}
          fields={new ObjectFields(Event).getFields()}
          hiddenColumns={[
            "id",
            "siknId",
            "siId",
            "techPositionId",
            "mssEventTypeId",
            "mssEventSeverityLevelId",
            "isAcknowledged",
            "resultQualityID",
            "resultQualityShortName",
            "mssEventSeverityLevelName",
            "extendTime",
          ]}
          widths={[
            {
              key: "startDateTime",
              newWidth: 150,
            },
            {
              key: "endDateTime",
              newWidth: 150,
            },
            {
              key: "techPositionName",
              newWidth: 200,
            },
            {
              key: "mssEventTypeName",
              newWidth: 200,
            },
            {
              key: "isAcknowledged",
              newWidth: 150,
            },
            {
              key: "eventName",
              newWidth: 350,
            },
            {
              key: "comment",
              newWidth: 175,
            },
            {
              key: "acknowledgedTimestamp",
              newWidth: 175,
            },
          ]}
          replaceColumns={[
            {
              headerName: "Критичность",
              field: "mssEventSeverityLevels",
              sortable: true,
              cellRenderer: "criticalnessRenderer",
            },
            {
              headerName: "Достоверность",
              field: "resultQualityID",
              filter: "agNumberColumnFilter",
              sortable: true,
              cellRenderer: "qualityRenderer",
            },
          ]}
        />
      </Spin>
      <Card>
        <Row justify="space-between">
          <Col>
            <div style={{ textAlign: "center" }}>
              <Pagination
                disabled={loading}
                showSizeChanger={false}
                size="small"
                current={riskRatingInfoState.items.pageInfo.pageNumber}
                defaultPageSize={1}
                total={riskRatingInfoState.items.pageInfo.totalPages}
                onChange={(page) => {
                  fetchItems(page);
                }}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </TableBlockWrapperStyled>
  );
};
