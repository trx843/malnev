import React, { Component } from "react";
import { Modal as AntModal, Card, Col, Row, Pagination, message } from "antd";
import { ItemsTable } from "../components/ItemsTable";
import {
  ActionTypes,
  FiltersModel,
  ObjectFields,
  PagedModel,
  StateType,
} from "../types";
import { IMeasRangeState, IWrittenItem } from "../interfaces";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/measRange/creators";
import axios, { CancelTokenSource } from "axios";
import { SiEquipmentLimitsForm } from "../components/SiEquipmentLimitsForm";
import "../styles/app.css";
import { apiBase } from "../utils";
import "moment/locale/ru";
import { GridApi } from "ag-grid-community";
import { SiEquipmentLimits } from "../classes/SiEquipmentLimits";
import { GridLoading } from "../components/GridLoading";
import { history } from "../history/history";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";

interface IMappedDispatchesToMeasRangeProps {
  fetched: (items: PagedModel<SiEquipmentLimits>) => void;
  filteredItems: (items: Array<SiEquipmentLimits>) => void;
  updated: (items: IWrittenItem<SiEquipmentLimits> | null) => void;
  inserted: (items: SiEquipmentLimits | null) => void;
}

interface IMeasRangeContainerState {
  addModalVisible: boolean;
  editModalVisible: boolean;
  archiveFilter: boolean;
  loading: boolean;
}
let source: CancelTokenSource;

type MeasRangeContainerProps = IMeasRangeState &
  IMappedDispatchesToMeasRangeProps & {
    measRange?: SiEquipmentLimits[];
    isSikn: boolean;
  };

class SiEquipmentLimitsContainer extends Component<
  MeasRangeContainerProps,
  IMeasRangeContainerState
> {
  private baseObj: string = `SiEquipmentsLimits`;
  private baseUrl: string = `${apiBase}/${this.baseObj}`;

  private url(page: number): string {
    let nodeType = this.props.node.type;
    if (nodeType === "notbind") {
      return `${apiBase}/${this.baseObj}/${nodeType}?page=${page}`;
    }
    return `${apiBase}/${
      nodeType !== "all" ? nodeType + "/" + this.props.node.key + "/" : ""
    }${this.baseObj}?page=${page}`;
  }

  private gridApi: GridApi;

  private hiddenCol: (keyof SiEquipmentLimits)[] = [
    "id",
    "digitsAfterDot",
    "siModelName",
    "manufNumber",
  ];

  constructor(props: MeasRangeContainerProps) {
    super(props);
    this.state = {
      addModalVisible: false,
      editModalVisible: false,
      archiveFilter: false,
      loading: false,
    };
    this.selectionHandler = this.selectionHandler.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.setApi = this.setApi.bind(this);
    if (this.props.isSikn) this.hiddenCol.push("limitValid");
  }

  setApi(api: GridApi) {
    this.gridApi = api;
  }

  getFetchUrl() {
    return this.url(0);
  }

  fetchItems(page: number) {
    const filtersModel: FiltersModel = {
      owned: this.props.ownedFilter,
      measRangeFilter: { isSikn: this.props.isSikn },
    };
    const pageInfo = {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    };
    const e: PagedModel<SiEquipmentLimits> = {
      entities: [],
      pageInfo: pageInfo,
    };
    if (source) {
      source.cancel("Cancel previous request");
    }
    source = axios.CancelToken.source();
    this.setState({ loading: true });
    axios
      .post<PagedModel<SiEquipmentLimits>>(this.url(page), filtersModel, {
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

  selectionHandler(item: SiEquipmentLimits) {
    console.log(item);
    this.props.updated({
      old: item,
      new: null,
    });
  }

  updateHandler(item: SiEquipmentLimits) {
    return new Promise<SiEquipmentLimits>((resolve, reject) => {
      if (this.props.writtenItem !== null) {
        this.props.updated({
          old: this.props.writtenItem.old,
          new: item,
        });
      }
      axios
        .put(`${this.baseUrl}/${item.id}`, item)
        .then((result) => {
          console.log(result);
          if (result.data.success && this.props.writtenItem !== null) {
            const index = this.props.items.entities.indexOf(
              this.props.writtenItem?.old
            );
            if (index != -1) {
              // все элементы до обновлённого
              const data = this.props.items.entities.slice(0, index);
              // обновлённый элемент
              data.push(result.data.result);
              // все элементы после обновлённого элемента
              data.push(
                ...this.props.items.entities.slice(
                  index + 1,
                  this.props.items.entities.length
                )
              );
              this.props.fetched({
                entities: data,
                pageInfo: this.props.items.pageInfo,
              });
            }
            this.props.updated(null);
            this.setState({ editModalVisible: false });
            this.gridApi.refreshCells({ force: true });
            message.success("Данные успешно обновлены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => console.log(err));
    });
  }

  componentDidUpdate(prevProps: Readonly<MeasRangeContainerProps>) {
    if (
      prevProps.node !== this.props.node ||
      prevProps.ownedFilter !== this.props.ownedFilter
    ) {
      if (this.props.measRange) {
        history.push("/measrange", undefined);
      }
      this.fetchItems(1);
    }
  }

  render(): JSX.Element {
    const { entities, pageInfo } = this.props.items;
    return (
      <TableBlockWrapperStyled>
        {this.state.loading && <GridLoading />}
        {!this.state.loading && (
          <ItemsTable<SiEquipmentLimits>
            items={this.props.measRange ?? entities}
            fields={new ObjectFields(SiEquipmentLimits).getFields()}
            hiddenColumns={this.hiddenCol}
            selectionCallback={this.selectionHandler}
            setApiCallback={this.setApi}
            actionColumns={[
              {
                headerName: "Действия",
                pinned: "right",
                cellRenderer: "limitsActionsRenderer",
                minWidth: 100,
                cellRendererParams: {
                  clicked: (data: SiEquipmentLimits) => {
                    this.selectionHandler(data);
                    this.setState({ editModalVisible: true });
                  },
                  isSikn: this.props.isSikn,
                },
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
          maskClosable={false}
          visible={this.state.editModalVisible}
          title={`Редактирование диапазона`}
          destroyOnClose
          width={"550px"}
          footer={null}
          onCancel={() => {
            this.setState({ editModalVisible: false });
          }}
        >
          <SiEquipmentLimitsForm
            initial={this.props.writtenItem?.old ?? new SiEquipmentLimits()}
            submitCallback={this.updateHandler}
            isSikn={this.props.isSikn}
          />
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
): IMappedDispatchesToMeasRangeProps => {
  return {
    fetched: (items) => dispatch(actions.measRangeFetched(items)),
    filteredItems: (items) => dispatch(actions.measRangeFiltered(items)),
    updated: (item) => dispatch(actions.measRangeUpdated(item)),
    inserted: (item) => dispatch(actions.measRangeInserted(item)),
  };
};

const mapStateToProps = (state: StateType): IMeasRangeState => {
  return {
    ...state.measRange,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiEquipmentLimitsContainer);
