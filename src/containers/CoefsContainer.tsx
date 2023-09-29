import React, { Component } from "react";
import { ItemsTable } from "../components/ItemsTable";
import {
  ActionTypes,
  FiltersModel,
  ObjectFields,
  PagedModel,
  StateType,
} from "../types";
import { FilterDates, ICoefsState } from "../interfaces";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/coefs/creators";
import axios, { CancelTokenSource } from "axios";
import "../styles/app.scss";
import { CoefChangeEventSigns } from "../classes/CoefChangeEventSigns";
import { Button, Card, Col, message, Pagination, Row, Tooltip } from "antd";
import { apiBase, returnStringDate } from "../utils";
import { ExportTableButton } from "../components/ExportTableButton";
import { GridApi } from "ag-grid-community";
import { GridLoading } from "../components/GridLoading";
import { history } from "../history/history";
import { ActionsEnum, Can } from "../casl";
import { CoefsElements, CoefsRoute, elementId } from "../pages/Coefs/constant";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ReloadOutlined } from "@ant-design/icons";

interface IMappedDispatchesToCoefsProps {
  fetched: (items: PagedModel<CoefChangeEventSigns>) => void;
  dateFilter: (filterDates: FilterDates) => void;
}

interface ICoefsContainerState {
  startTime: Date;
  endTime: Date;
  loading: boolean;
  gridApi: GridApi;
}

let source: CancelTokenSource;

type CoefsContainerProps = ICoefsState &
  IMappedDispatchesToCoefsProps & { coef?: CoefChangeEventSigns[] };

class CoefsContainer extends Component<
  CoefsContainerProps,
  ICoefsContainerState
> {
  private baseObj: string = `CoefChangeEventSigns`;
  private baseUrl: string = `${apiBase}/${this.baseObj}`;

  private url(page: number): string {
    let nodeType = this.props.node.type;
    return `${apiBase}/${
      nodeType !== "all" ? nodeType + "/" + this.props.node.key + "/" : ""
    }${this.baseObj}?page=${page}`;
  }

  constructor(props: CoefsContainerProps) {
    super(props);
    let date = new Date();
    this.state = {
      startTime: this.props.filterDates.startDate,
      endTime: this.props.filterDates.endDate,
      loading: false,
      gridApi: new GridApi(),
    };

    this.setApi = this.setApi.bind(this);
    this.getFetchUrl = this.getFetchUrl.bind(this);
    this.getFilter = this.getFilter.bind(this);
  }

  setApi(api: GridApi) {
    this.setState({ gridApi: api });
  }

  componentDidUpdate(prevProps: Readonly<CoefsContainerProps>) {
    if (
      prevProps.node !== this.props.node ||
      prevProps.filterDates !== this.props.filterDates ||
      prevProps.viewName !== this.props.viewName ||
      prevProps.ownedFilter !== this.props.ownedFilter
    ) {
      if (this.props.coef) {
        history.push("/coefs", undefined);
      }
      this.fetchItems(1);
    }
  }

  getFetchUrl() {
    return this.url(0);
  }

  getFilter(): FiltersModel {
    let filtersModel: FiltersModel = {
      startTime: this.props.filterDates.startDate,
      endTime: this.props.filterDates.endDate,
      owned: this.props.ownedFilter,
    };
    return filtersModel;
  }

  fetchItems(page: number) {
    const { startDate, endDate } = this.props.filterDates;
    const filtersModel: FiltersModel = {
      startTime: returnStringDate(startDate, true),
      endTime: returnStringDate(endDate, true, true),
      owned: this.props.ownedFilter,
    };
    const pageInfo = {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    };
    const e: PagedModel<CoefChangeEventSigns> = {
      entities: [],
      pageInfo: pageInfo,
    };
    if (source) {
      source.cancel("Cancel previous request");
    }
    source = axios.CancelToken.source();
    this.setState({ loading: true });
    axios
      .post<PagedModel<CoefChangeEventSigns>>(this.url(page), filtersModel, {
        cancelToken: source.token,
      })
      .then((result) => {
        this.props.fetched(result.data);
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.props.fetched(e);
        console.log(err);
        if (!axios.isCancel(err)) {
          this.setState({ loading: false });
          message.error("Ошибка загрузки данных");
        }
      });
  }

  render(): JSX.Element {
    const { entities, pageInfo } = this.props.items;
    return (
      <TableBlockWrapperStyled>
        <Card>
          <Row justify="end">
            <Col>
              <Row>
                <Col>
                  <Can
                    I={ActionsEnum.View}
                    a={elementId(CoefsElements[CoefsElements.Export])}
                  >
                    <ExportTableButton<CoefChangeEventSigns>
                      api={this.state.gridApi}
                      baseUrl={this.baseUrl}
                      getFilter={this.getFilter}
                      pageRouteName={CoefsRoute}
                      nodeType={this.props.node.type}
                      nodeId={this.props.node.key}
                    ></ExportTableButton>
                  </Can>
                </Col>

                <Col>
                  <Tooltip title="Обновить таблицу">
                    <Button
                      type="link"
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        this.fetchItems(this.props.items.pageInfo.pageNumber);
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        {this.state.loading && <GridLoading />}
        {!this.state.loading && (
          <ItemsTable<CoefChangeEventSigns>
            items={this.props.coef ?? entities}
            fields={new ObjectFields(CoefChangeEventSigns).getFields()}
            hiddenColumns={[
              "id",
              "siId",
              "techPositionId",
              "changedCoefficients",
              "controlMaintEventId",
              "endTimestamp",
            ]}
            actionColumns={[
              {
                headerName: "Действие",
                pinned: "right",
                cellRenderer: "coefActionsRenderer",
                minWidth: 100,
              },
            ]}
            replaceColumns={[
              {
                field: "controlMaintExits",
                headerName: "Зафиксированы признаки поверки",
                filter: "customFilter",
                sortable: true,
                cellRenderer: "checkboxRenderer",
              },
            ]}
            setApiCallback={this.setApi}
          />
        )}
        <Card>
          <Row justify="space-between">
            <Col>
              <div style={{ textAlign: "center" }}>
                <Pagination
                  disabled={this.state.loading}
                  showSizeChanger={false}
                  size="small"
                  current={pageInfo.pageNumber}
                  defaultCurrent={1}
                  defaultPageSize={1}
                  total={pageInfo.totalPages}
                  onChange={(page) => {
                    this.fetchItems(page);
                  }}
                />
              </div>
            </Col>
          </Row>
        </Card>
      </TableBlockWrapperStyled>
    );
  }

  componentDidMount() {
    this.fetchItems(this.props.items.pageInfo.pageNumber);
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<ActionTypes<typeof actions>>
): IMappedDispatchesToCoefsProps => {
  return {
    fetched: (items) => dispatch(actions.coefFetched(items)),
    dateFilter: (filterDates) => dispatch(actions.dateChanged(filterDates)),
  };
};

const mapStateToProps = (state: StateType): ICoefsState => {
  return {
    ...state.coefs,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CoefsContainer);
