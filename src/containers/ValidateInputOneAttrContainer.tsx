import { GridApi } from "ag-grid-community";
import { Card, Col, message, Pagination, Row } from "antd";
import axios from "axios";
import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { ValidateInputOneAttrModel } from "../classes/ValidateInputOneAttrModel";
import { ValidateInputOneAttrResult } from "../classes/ValidateInputOneAttrResult";
import { ExportTableButton } from "../components/ExportTableButton";
import { GridLoading } from "../components/GridLoading";
import { ItemsTable } from "../components/ItemsTable";
import {
  FiltersModel,
  GenericResponse,
  ObjectFields,
  PagedModel,
} from "../types";
import { apiBase, getParamFromUrl, returnStringDate } from "../utils";

const StyleH2 = styled.h2`
  font-weight: 700;
`;
const StyleH4 = styled.h4`
  font-weight: 700;
  margin-bottom: 20px;
`;

export const ValidateInputOneAttrContainer: FunctionComponent = () => {
  const serverUrl = `${apiBase}/ValidateInputOneAttr`;

  const defaultPagedModel: PagedModel<ValidateInputOneAttrResult> = {
    entities: [],
    pageInfo: {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    },
  };

  const model = getModel();

  const [loading, setLoading] = useState<boolean>(true);
  const [valInputResults, setValInputResults] =
    useState<PagedModel<ValidateInputOneAttrResult>>(defaultPagedModel);
  const [gridApi, setGridApi] = useState<GridApi>(new GridApi());

  function getFetchUrl(): string {
    return getUrl(0);
  }

  function getFilter(): FiltersModel {
    let filtersModel: FiltersModel = {
      startTime: returnStringDate(model.startTime, true),
      endTime: returnStringDate(model.endTime, true, false),
    };
    return filtersModel;
  }

  function getUrl(pageNum: number): string {
    return `${serverUrl}?atrPath=${model.atrPath}&pageNum=${pageNum}`;
  }

  function fetchItems(pageNum: number) {
    setLoading(true);
    axios
      .post<GenericResponse<PagedModel<ValidateInputOneAttrResult>>>(
        getUrl(pageNum),
        getFilter()
      )
      .then((result) => {
        if (result.data.success) {
          setValInputResults(result.data.result);
        } else {
          message.error(result.data.message);
          console.log(result.data.message);
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        console.error("ОШИБКА запроса данных");
      });
  }

  function setApi(api: GridApi) {
    setGridApi(api);
  }

  function getModel(): ValidateInputOneAttrModel {
    return new ValidateInputOneAttrModel(
      getParamFromUrl("atrPath", ""),
      getParamFromUrl("startTime", new Date()),
      getParamFromUrl("endTime", new Date())
    );
  }

  useEffect(() => {
    fetchItems(1);
  }, []);

  return (
    <>
      <StyleH2>{model.atrName}</StyleH2>
      <StyleH4>{model.elemName}</StyleH4>


      {loading && <GridLoading />}
      {!loading && (
        <ItemsTable<ValidateInputOneAttrResult>
          items={valInputResults.entities}
          fields={new ObjectFields(ValidateInputOneAttrResult).getFields()}
          setApiCallback={setApi}
          rowStyle={(params: any) => {
            let item = params.data as ValidateInputOneAttrResult;
            if (item.algorithms !== "") {
              return { "background-color": "yellow" };
            }
            return null;
          }}
        />
      )}

      <Card>
        <Row justify="space-between">
          <Col>
            <div style={{ textAlign: "center" }}>
              <Pagination
                disabled={loading}
                showSizeChanger={false}
                size="small"
                current={valInputResults.pageInfo.pageNumber}
                defaultPageSize={1}
                total={valInputResults.pageInfo.totalPages}
                onChange={(page) => {
                  fetchItems(page);
                }}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};
