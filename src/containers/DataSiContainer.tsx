import { GridApi } from "ag-grid-community";
import axios, { CancelTokenSource } from "axios";
import React, { Component } from "react";
import { DataSi } from "../classes";
import { IWrittenItem, IDataSiState } from "../interfaces";
import { apiBase, zeroGuid } from "../utils";
import {
  Modal as AntModal,
  Card,
  Col,
  Row,
  Pagination,
  message,
  Button,
  Tooltip,
} from "antd";
import { ItemsTable } from "../components/ItemsTable";
import {
  ActionTypes,
  FiltersModel,
  IdType,
  ObjectFields,
  PagedModel,
  StateType,
} from "../types";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/dataSi/creators";
import { DataSiForm } from "../components/DataSiForm";
import { GridLoading } from "../components/GridLoading";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ReloadOutlined } from "@ant-design/icons";
import moment from "moment";

interface IMappedDispatchesToDataSiProps {
  fetched: (items: PagedModel<DataSi>) => void;
  filteredItems: (items: Array<DataSi>) => void;
  updated: (items: IWrittenItem<DataSi> | null) => void;
}

interface DataSiContainerState {
  DataSiModalVisible: boolean;
  archiveFilter: boolean;
  siId: IdType;
  siName: string;
  loading: boolean;
}

let source: CancelTokenSource;

type DataSiContainerProps = IDataSiState & IMappedDispatchesToDataSiProps;

class DataSiContainer extends Component<
  DataSiContainerProps,
  DataSiContainerState
> {
  private baseObj: string = `SiEquipments`;

  private url(page: number): string {
    let nodeType = this.props.node?.type;

    return `${apiBase}/${nodeType + "/" + this.props.node?.key + "/"}${
      this.baseObj
    }?page=${page}`;
  }

  private gridApi: GridApi;

  constructor(props: DataSiContainerProps) {
    super(props);
    this.state = {
      DataSiModalVisible: false,
      archiveFilter: false,
      siId: zeroGuid,
      siName: "",
      loading: false,
    };
    this.selectionHandler = this.selectionHandler.bind(this);
    this.setApi = this.setApi.bind(this);
  }

  setApi(api: GridApi) {
    this.gridApi = api;
  }


  fetchItems(page: number) {
    if (!this.props.node) return;

    const filtersModel: FiltersModel = {
      owned: this.props.ownedFilter,
    };
    const pageInfo = {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    };
    const e: PagedModel<DataSi> = {
      entities: [],
      pageInfo: pageInfo,
    };
    if (source) {
      source.cancel("Cancel previous request");
    }
    source = axios.CancelToken.source();
    this.setState({ loading: true });
    axios
      .post<PagedModel<DataSi>>(this.url(page), filtersModel, {
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

  selectionHandler(item: DataSi) {
    console.log(item);
    this.props.updated({
      old: item,
      new: null,
    });

    let siName = `${item.siTypeName} ${item.siModelName} ${item.manufNumber}`;
    this.setState({ siName: siName });
  }

  filterItems(items: Array<DataSi>) {
    const archiveFunc = (x: DataSi) =>
      !this.state.archiveFilter
        ? x.isArchival === null
          ? true
          : x.isArchival === false
        : true;
    const sortByBool = (x: any, y: any) => {
      return x.isArchival - y.isArchival;
    };

    this.props.filteredItems(
      items.sort(sortByBool).filter((x) => archiveFunc(x))
    );
  }

  componentDidUpdate(prevProps: Readonly<DataSiContainerProps>) {
    if (
      prevProps.node !== this.props.node ||
      prevProps.ownedFilter !== this.props.ownedFilter
    ) {
      this.fetchItems(1);
    }
  }

  render(): JSX.Element {
    const { entities, pageInfo } = this.props.items;
    return (
      <TableBlockWrapperStyled>
        <Card>
          <Row justify="end" gutter={24}>
            <Col>
              <Row>
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
          <ItemsTable<DataSi>
            items={entities}
            fields={new ObjectFields(DataSi).getFields()}
            hiddenColumns={["id", "siTypeId", "siModelId", "installDate"]}
            setApiCallback={this.setApi}
            selectionCallback={this.selectionHandler}
            actionColumns={[
              {
                headerName: "Данные",
                pinned: "right",
                cellRenderer: "infoBtnRenderer",
                minWidth: 75,
                cellRendererParams: {
                  clicked: (data: DataSi) => {
                    this.selectionHandler(data);
                    this.setState({ DataSiModalVisible: true, siId: data.id });
                  },
                },
              },
            ]}
            replaceColumns={[
              {
                field: "installDate",
                headerName: "Дата ввода в эксплуатацию",
                valueFormatter: dateFormatter,
              },
            ]}
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
        <AntModal
          width={"1177px"}
          maskClosable={false}
          visible={this.state.DataSiModalVisible}
          title={this.state.siName}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ DataSiModalVisible: false });
          }}
        >
          <DataSiForm siId={this.state.siId} />
        </AntModal>
      </TableBlockWrapperStyled>
    );
  }

  componentDidMount() {
    this.fetchItems(this.props.items.pageInfo.pageNumber);
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<ActionTypes<typeof actions>>
): IMappedDispatchesToDataSiProps => {
  return {
    fetched: (items) => dispatch(actions.dataSiFetched(items)),
    filteredItems: (items) => dispatch(actions.dataSiFiltered(items)),
    updated: (item) => dispatch(actions.dataSiUpdated(item)),
  };
};

const mapStateToProps = (state: StateType): IDataSiState => {
  return {
    ...state.dataSi,
  };
};

function dateFormatter(param) {
  return moment(param.value).format("DD.MM.YYYY");
}

export default connect(mapStateToProps, mapDispatchToProps)(DataSiContainer);
