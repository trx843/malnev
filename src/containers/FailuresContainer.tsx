import React, { Component } from "react";
import { ItemsTable } from "../components/ItemsTable";
import {
  ActionTypes,
  FiltersModel,
  ObjectFields,
  PagedModel,
  StateType,
} from "../types";
import { FilterDates, IFailuresState, IWrittenItem } from "../interfaces";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/failures/creators";
import axios, { CancelTokenSource } from "axios";
import "../styles/app.scss";
import { Failures } from "../classes/";
import {
  Button,
  Col,
  Row,
  Card,
  Modal,
  Pagination,
  Tooltip,
  message,
} from "antd";
import { apiBase, returnStringDate } from "../utils";
import { CommentForm } from "../components/CommentForm";
import { ExportTableButton } from "../components/ExportTableButton";
import { GridApi } from "ag-grid-community";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import { GridLoading } from "../components/GridLoading";
import { FailuresForm } from "../components/FailuresForm";
import { history } from "../history/history";
import { ActionsEnum, Can } from "../casl";
import {
  elementId,
  FailuresElements,
  FailuresRoute,
} from "../pages/Failures/constant";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ReloadOutlined } from "@ant-design/icons";

interface IMappedDispatchesToFailuresProps {
  fetched: (items: PagedModel<Failures>) => void;
  dateFilter: (filterDates: FilterDates) => void;
  select: (item: Failures | null) => void;
  updated: (items: IWrittenItem<Failures> | null) => void;
  filtered: (items: Array<Failures>) => void;
}

interface IFailuresContainerState {
  startTime: Date;
  endTime: Date;
  commentModalVisible: boolean;
  failuresModalVisible: boolean;
  editFailuresModalVisible: boolean;
  loading: boolean;
  gridApi: GridApi;
}

let source: CancelTokenSource;

type FailuresContainerProps = IFailuresState &
  IMappedDispatchesToFailuresProps & {
    failures?: Failures[];
    isSiTypeTree: boolean;
  };

class FailuresContainer extends Component<
  FailuresContainerProps,
  IFailuresContainerState
> {
  private baseObj: string = `failures`;
  private baseUrl: string = `${apiBase}/${this.baseObj}`;

  private url(page: number): string {
    let nodeType = this.props.node.type;
    return `${apiBase}/${
      nodeType !== "all" ? nodeType + "/" + this.props.node.key + "/" : ""
    }${this.baseObj}?page=${page}`;
  }

  constructor(props: FailuresContainerProps) {
    super(props);
    this.state = {
      startTime: this.props.filterDates.startDate,
      endTime: this.props.filterDates.endDate,
      commentModalVisible: false,
      loading: false,
      failuresModalVisible: false,
      editFailuresModalVisible: false,
      gridApi: new GridApi(),
    };
    this.selectionHandler = this.selectionHandler.bind(this);
    this.selectUpdateHandler = this.selectUpdateHandler.bind(this);
    this.commentHandler = this.commentHandler.bind(this);
    this.insertHandler = this.insertHandler.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.setApi = this.setApi.bind(this);
    this.getFetchUrl = this.getFetchUrl.bind(this);
    this.getFilter = this.getFilter.bind(this);
  }

  setApi(api: GridApi) {
    this.setState({ gridApi: api });
  }

  componentDidUpdate(prevProps: Readonly<FailuresContainerProps>) {
    if (
      prevProps.node !== this.props.node ||
      prevProps.filterDates !== this.props.filterDates ||
      prevProps.viewName !== this.props.viewName ||
      prevProps.ownedFilter !== this.props.ownedFilter ||
      prevProps.failureConsequenceFilter !==
        this.props.failureConsequenceFilter ||
      prevProps.failureTypeFilter !== this.props.failureTypeFilter
    ) {
      if (this.props.failures) {
        history.push("/failures", undefined);
      }
      this.fetchItems(1);
    }
  }

  getFetchUrl() {
    return this.url(0);
  }

  getFilter(): FiltersModel {
    const { startDate, endDate } = this.props.filterDates;
    const { failureConsequenceFilter, failureTypeFilter, ownedFilter } =
      this.props;
    let filtersModel: FiltersModel = {
      startTime: returnStringDate(startDate, true),
      endTime: returnStringDate(endDate, true, true),
      owned: ownedFilter,
      failuresFilter: {
        failureConsequenceFilter: failureConsequenceFilter,
        failureTypeFilter: failureTypeFilter,
      },
    };
    return filtersModel;
  }

  fetchItems(page: number) {
    this.props.select(null);

    const filtersModel = this.getFilter();
    const pageInfo = {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    };
    const e: PagedModel<Failures> = {
      entities: [],
      pageInfo: pageInfo,
    };
    if (source) {
      source.cancel("Cancel previous request");
    }
    source = axios.CancelToken.source();
    this.setState({ loading: true });
    axios
      .post<PagedModel<Failures>>(this.url(page), filtersModel, {
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

  selectionHandler(item: Failures) {
    this.props.select(item);
  }

  selectUpdateHandler(item: Failures) {
    console.log(item);
    this.props.updated({
      old: item,
      new: null,
    });
  }

  commentHandler(item: Failures) {
    return new Promise<void>((resolve, reject) => {
      if (this.props.writtenItem !== null) {
        this.props.updated({
          old: this.props.writtenItem.old,
          new: item,
        });
      }
      axios
        .put(`${this.baseUrl}/acknowledge/${item.id}`, item)
        .then((result) => {
          console.log(result);
          if (result.data.success && this.props.selected !== null) {
            const index = this.props.items.entities.findIndex(
              (x) => x.id === item.id
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
            this.props.select(null);
            this.props.updated(null);
          }
          this.setState({ commentModalVisible: false });
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  insertHandler(item: Failures) {
    return new Promise<Failures>((resolve, reject) => {
      axios
        .post(this.baseUrl, item)
        .then((result) => {
          console.log(result);
          if (result.data.success) {
            const data = this.props.items.entities.slice();
            // добавляем новый элемент в начало списка
            data.unshift(result.data.result);
            this.props.fetched({
              entities: data,
              pageInfo: this.props.items.pageInfo,
            });
            this.setState({ failuresModalVisible: false });
            message.success("Данные успешно сохранены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => reject(err));
    });
  }

  updateHandler(item: Failures) {
    return new Promise<Failures>((resolve, reject) => {
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
              this.props.writtenItem.old
            );
            if (index != -1) {
              // все элементы до обновлённого
              const data = this.props.items.entities.slice(0, index);
              // обновлённый элемент
              data.push(result.data.result);
              // все элементы после обновлённого элемента.
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
            this.setState({ editFailuresModalVisible: false });
            this.state.gridApi.refreshCells({ force: true });
            message.success("Данные успешно обновлены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => console.log(err));
    });
  }

  render(): JSX.Element {
    const { entities, pageInfo } = this.props.items;
    return (
      <TableBlockWrapperStyled>
        <Card>
          <Row justify="space-between">
            <Col>
              <Can
                I={ActionsEnum.View}
                a={elementId(FailuresElements[FailuresElements.FailureCommit])}
              >
                <Button
                  type={"link"}
                  icon={<PlusCircleFilled />}
                  onClick={() => this.setState({ commentModalVisible: true })}
                  disabled={
                    this.props.selected === null ||
                    (this.props.selected != null &&
                      this.props.selected.isAcknowledged == true)
                  }
                >
                  Квитирование
                </Button>
              </Can>

              <Tooltip
                arrowPointAtCenter
                title={
                  <span style={{ color: "black" }}>
                    Выберите технологическую позицию в дереве, чтобы ввести
                    отказ
                  </span>
                }
                color="#ffffff"
                placement="bottomLeft"
              >
                <Can
                  I={ActionsEnum.View}
                  a={elementId(FailuresElements[FailuresElements.FailureAdd])}
                >
                  <Button
                    type={"link"}
                    icon={<PlusCircleFilled />}
                    onClick={() =>
                      this.setState({ failuresModalVisible: true })
                    }
                    disabled={this.props.node.isSiType === false || this.props.node.type === "sitypes"}
                  >
                    Добавить отказ
                  </Button>
                </Can>
              </Tooltip>
            </Col>
            <Col>
              <Row>
                <Col>
                  <Can
                    I={ActionsEnum.View}
                    a={elementId(FailuresElements[FailuresElements.Export])}
                  >
                    <ExportTableButton<Failures>
                      api={this.state.gridApi}
                      baseUrl={this.baseUrl}
                      getFilter={this.getFilter}
                      pageRouteName={FailuresRoute}
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
          <ItemsTable<Failures>
            items={this.props.failures ?? entities}
            fields={new ObjectFields(Failures).getFields()}
            hiddenColumns={[
              "id",
              "siknId",
              "siId",
              "techPositionId",
              "eventFrameId",
              "mssFailureTypeId",
              "failureReportCodeId",
              "failureConsequencesIdList",
              "sequenceId",
              "resultQualityID",
              "responsibilityAreaId",
              "resultQualityShortName",
              "dontUseInReportsComment",
              "extendTime",
            ]}
            selectionCallback={this.selectionHandler}
            setApiCallback={this.setApi}
            replaceColumns={[
              {
                field: "eventFrameExist",
                headerName: "МСС",
                sortable: true,
                cellRenderer: "checkboxRenderer",
              },
              {
                field: "useInReports",
                headerName: "Учитывать в отчётах",
                sortable: true,
                cellRenderer: "checkboxRenderer",
              },
              {
                field: "isAcknowledged",
                headerName: "Признак квитирования",
                sortable: true,
                cellRenderer: "checkboxRenderer",
              },
              {
                headerName: "Достоверность",
                field: "resultQualityID",
                filter: "agNumberColumnFilter",
                sortable: true,
                cellRenderer: "qualityRenderer",
              },
            ]}
            actionColumns={[
              {
                headerName: "Действия",
                pinned: "right",
                cellRenderer: "failuresActionsRenderer",
                minWidth: 100,
                cellRendererParams: {
                  clicked: (data: Failures) => {
                    this.selectUpdateHandler(data);
                    this.setState({ editFailuresModalVisible: true });
                  },
                  flagSelector: (item: Failures) => item.eventFrameExist,
                },
              },
            ]}
            widths={[{ key: "failureReportCodeName", newWidth: 850 }]}
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
        <Modal
          maskClosable={false}
          visible={this.state.commentModalVisible}
          title={`Квитирование`}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ commentModalVisible: false });
          }}
        >
          <CommentForm<Failures>
            initial={this.props.selected ?? new Failures()}
            submitCallback={this.commentHandler}
            showUseInReports={false}
          />
        </Modal>
        <Modal
          maskClosable={false}
          width={"1177px"}
          visible={this.state.failuresModalVisible}
          title={`Ввод отказов`}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ failuresModalVisible: false });
          }}
        >
          <FailuresForm
            submitCallback={this.insertHandler}
            node={this.props.node}
            isSiTypeTree={this.props.isSiTypeTree}
          />
        </Modal>
        <Modal
          maskClosable={false}
          width={"1177px"}
          visible={this.state.editFailuresModalVisible}
          title={`Редактирование отказа`}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ editFailuresModalVisible: false });
          }}
        >
          <FailuresForm
            initial={this.props.writtenItem?.old}
            submitCallback={this.updateHandler}
            node={this.props.node}
            isSiTypeTree={this.props.isSiTypeTree}
          />
        </Modal>
      </TableBlockWrapperStyled>
    );
  }

  componentDidMount() {
    this.fetchItems(this.props.items.pageInfo.pageNumber);
  }

  componentWillUnmount() {
    this.props.select(null);
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<ActionTypes<typeof actions>>
): IMappedDispatchesToFailuresProps => {
  return {
    fetched: (items) => dispatch(actions.failuresFetched(items)),
    dateFilter: (filterDates) => dispatch(actions.dateChanged(filterDates)),
    select: (item) => dispatch(actions.failuresSelected(item)),
    updated: (item) => dispatch(actions.failuresUpdated(item)),
    filtered: (items) => dispatch(actions.failuresFiltered(items)),
  };
};

const mapStateToProps = (state: StateType): IFailuresState => {
  return {
    ...state.failures,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FailuresContainer);
