import { Component } from "react";
import { ItemsTable } from "../components/ItemsTable";
import {
  ActionTypes,
  FiltersModel,
  ObjectFields,
  PagedModel,
  StateType,
} from "../types";
import {
  FilterDates,
  FilterObject,
  IToKmhState,
  IWrittenItem,
  ListFilterBase,
} from "../interfaces";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/toKmh/creators";
import axios, { CancelTokenSource } from "axios";
import "../styles/app.scss";
import { ControlMaintEvents } from "../classes/ControlMaintEvents";
import {
  Button,
  Card,
  Col,
  message,
  Modal,
  notification,
  Pagination,
  Row,
  Spin,
  Tooltip,
  Upload,
} from "antd";
import { apiBase, returnStringDate } from "../utils";
import "moment/locale/ru";
import { GridApi, SortChangedEvent } from "ag-grid-community";
import UploadOutlined from "@ant-design/icons/UploadOutlined";
import PlusCircleFilled from "@ant-design/icons/lib/icons/PlusCircleFilled";
import { InsertResultToKmhForm } from "../components/InsertResultToKmhForm";
import { history } from "../history/history";
import { ActionsEnum, Can } from "../casl";
import { elementId, ToKmhElements, ToKmhRoute } from "../pages/ToKmh/constant";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ReloadOutlined } from "@ant-design/icons";
import { ExportFilterTableButton } from "components/ExportFilterTableButton";
import { ActImportStatuses } from "enums";

interface MappedDispatchesToToKmhProps {
  fetched: (items: PagedModel<ControlMaintEvents>) => void;
  dateFilter: (filterDates: FilterDates) => void;
  filtered: (items: Array<ControlMaintEvents>) => void;
  updated: (items: IWrittenItem<ControlMaintEvents> | null) => void;
}

enum SortableFields {
  planDate = "PlanDate",
  factDate = "FactDate",
  controlMaintEventType = "ControlMaintEventTypes.ShortName",
  siknFullName = "TechPositions.SIKNRSU.FullName",
  techPositionText = "TechPositions.FullName",
  positionInBlock = "TechPositions.TechPositions2.ShortName",
  siTypeText = "SiEquipment.SITypes.ShortName",
  manufNumber = "SiEquipment.ManufNumber",
  protocolFileExistsText = "ProtocolFileExist",
  graphOkText = "GraphOK",
  periodOkText = "PeriodOK",
}

interface ToKmhContainerState {
  addModalVisible: boolean;
  editModalVisible: boolean;
  startTime: Date;
  endTime: Date;
  loading: boolean;
  gridApi: GridApi;
  filterObject: FilterObject;
  sortedField: [string, string | null | undefined];
  isFileLoading: boolean;
  importVariant: string;
}

let source: CancelTokenSource;

type ImportType = {
  status: number;
  attemptId: string;
};

type ToKmhContainerProps = IToKmhState &
  MappedDispatchesToToKmhProps & { tokmh?: ControlMaintEvents[] };

class ToKmhContainer extends Component<
  ToKmhContainerProps,
  ToKmhContainerState
> {
  private baseObj: string = `ControlMaintEvents`;
  private url(page: number): string {
    let nodeType = this.props.node.type;
    return `${apiBase}/${
      nodeType !== "all" ? nodeType + "/" + this.props.node.key + "/" : ""
    }${this.baseObj}?page=${page}`;
  }

  private defaultSorting: [string, string | null | undefined] = [
    "PlanDate",
    "desc",
  ];

  constructor(props: ToKmhContainerProps) {
    super(props);
    this.state = {
      addModalVisible: false,
      editModalVisible: false,
      startTime: this.props.filterDates.startDate,
      endTime: this.props.filterDates.endDate,
      loading: false,
      gridApi: new GridApi(),
      filterObject: {
        treeFilter: {
          nodePath: "",
          isOwn: null,
        },
      },
      sortedField: this.defaultSorting,
      isFileLoading: false,
      importVariant: "",
    };

    this.setApi = this.setApi.bind(this);
    this.insertHandler = this.insertHandler.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.selectionHandler = this.selectionHandler.bind(this);
    this.getFetchUrl = this.getFetchUrl.bind(this);
    this.getFilter = this.getFilter.bind(this);
  }

  setApi(api: GridApi) {
    this.setState({ gridApi: api });
  }

  getFetchUrl() {
    return this.url(0);
  }

  componentDidUpdate(
    prevProps: Readonly<ToKmhContainerProps>,
    prevState: Readonly<ToKmhContainerState>
  ) {
    if (
      prevProps.node !== this.props.node ||
      prevProps.filterDates !== this.props.filterDates ||
      prevProps.viewName !== this.props.viewName ||
      prevProps.ownedFilter !== this.props.ownedFilter ||
      prevState.filterObject !== this.state.filterObject ||
      prevState.sortedField !== this.state.sortedField
    ) {
      if (this.props.tokmh) {
        history.push("/tokmh", undefined);
      }
      this.fetchItems(1);
    }
  }

  getFilter(): ListFilterBase {
    const { filterDates, ownedFilter } = this.props;

    let filtersModel: FiltersModel = {
      startTime: returnStringDate(filterDates.startDate, true),
      endTime: returnStringDate(filterDates.endDate, true, true),
      owned: ownedFilter,
    };

    const listFilter: ListFilterBase = {
      pageIndex: 0,
      sortedField: this.state.sortedField[0],
      isSortAsc: this.state.sortedField[1] === "asc",
      filter: {
        ...this.state.filterObject,
        filtersModel,
        treeFilter: {
          nodePath: "",
          isOwn: null,
        },
      },
    };
    return listFilter;
  }

  fetchItems(page: number) {
    const listFilter = this.getFilter();
    const pageInfo = {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    };
    const e: PagedModel<ControlMaintEvents> = {
      entities: [],
      pageInfo: pageInfo,
    };
    if (source) {
      source.cancel("Cancel previous request");
    }
    source = axios.CancelToken.source();
    this.setState({ loading: true });
    axios
      .post<PagedModel<ControlMaintEvents>>(this.url(page), listFilter, {
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

  insertHandler(item: ControlMaintEvents) {
    return new Promise<ControlMaintEvents>((resolve, reject) => {
      if (item.inPlan) {
        if (this.props.writtenItem !== null) {
          this.props.updated({
            old: this.props.writtenItem.old,
            new: item,
          });
        }
      }
      if (item)
        axios
          .post(`${apiBase}/${this.baseObj}`, item)
          .then((result) => {
            console.log(result);
            if (result.data.success) {
              if (!result.data.result.inPlan) {
                const data = this.props.items.entities.slice();
                // добавляем новый элемент в начало списка
                data.unshift(result.data.result);
                this.props.fetched({
                  entities: data,
                  pageInfo: this.props.items.pageInfo,
                });
              } else {
                if (this.props.writtenItem !== null) {
                  const index = this.props.items.entities
                    .map((x) => x.id)
                    .indexOf(this.props.writtenItem?.old.id);
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
                }
                this.props.updated(null);
                this.state.gridApi.refreshCells({ force: true });
              }
              this.setState({ addModalVisible: false });
              message.success("Данные успешно сохранены!");
            } else {
              reject(result.data.message);
            }
          })
          .catch((err) => reject(err));
    });
  }

  updateHandler(item: ControlMaintEvents) {
    return new Promise<ControlMaintEvents>((resolve, reject) => {
      if (this.props.writtenItem !== null) {
        this.props.updated({
          old: this.props.writtenItem.old,
          new: item,
        });
      }
      axios
        .put(`${apiBase}/${this.baseObj}/${item.id}`, item)
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
            this.state.gridApi.refreshCells({ force: true });
            message.success("Данные успешно обновлены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => console.log(err));
    });
  }

  selectionHandler(item: ControlMaintEvents) {
    this.props.updated({
      old: item,
      new: null,
    });
  }

  onTableSortChanged = (event: SortChangedEvent) => {
    const columnState = event.columnApi.getColumnState();
    const sortableColumn = columnState.find((column) => column.sort);
    if (sortableColumn) {
      const orderField = SortableFields[sortableColumn.colId as string];
      this.setState({ sortedField: [orderField, sortableColumn.sort] });
    } else {
      this.setState({ sortedField: this.defaultSorting });
    }
  };

  customRequest = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    let isValidType = false;
    let isValidSize = true;

    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      isValidType = true;
    } else {
      notification.warn({
        message: "Разрешение файла недопустимо",
        description:
          "Для загрузки допускаются файлы только в расширениях .xls и .xlsx!",
        duration: 0,
      });
      this.setState({ importVariant: "" });
    }

    if (file.size > 20971520) {
      isValidSize = false;
      notification.warn({
        message: "Файл слишком тяжелый",
        description: "Максимально допустимый размер файла 20мб!",
        duration: 0,
      });
      this.setState({ importVariant: "" });
    }

    if (isValidSize && isValidType) {
      const fmData = new FormData();
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      const key = `open${Date.now()}`;

      this.setState({ isFileLoading: true });

      fmData.append("file", file);
      try {
        const res = await axios.post<ImportType>(
          `${apiBase}/importfiles/${this.state.importVariant}`,
          fmData,
          config
        );
        if (res.data.status === ActImportStatuses.success) {
          notification.success({
            message: "Файл загружен успешно.",
            // description: "",
            duration: 0,
            placement: "topRight",
            btn: (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  notification.close(key);
                  history.push(`/import/${res.data.attemptId}`);
                }}
              >
                Перейти на страницу попытки
              </Button>
            ),
            key,
          });
        }
        if (res.data.status === ActImportStatuses.warn) {
          notification.warn({
            message: "Импорт завершен с предупреждением.",
            // description: res.data.lastMessage,
            duration: 0,
            placement: "topRight",
            btn: (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  notification.close(key);
                  history.push(`/import/${res.data.attemptId}`);
                }}
              >
                Перейти на страницу попытки
              </Button>
            ),
            key,
          });
        }
        if (res.data.status === ActImportStatuses.error) {
          notification.error({
            message: "Импорт не выполнен.",
            // description: res.data.lastMessage,
            duration: 0,
            placement: "topRight",
            btn: (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  notification.close(key);
                  history.push(`/import/${res.data.attemptId}`);
                }}
              >
                Перейти на страницу попытки
              </Button>
            ),
          });
        }
        this.setState({ isFileLoading: false });
        onSuccess("Ok");
        this.setState({ importVariant: "" });
      } catch (err) {
        this.setState({ isFileLoading: false });
        this.setState({ importVariant: "" });
        notification.error({
          message: "Ошибка процесса импорта!",
          description: err,
          duration: 0,
          placement: "topRight",
        });
        onError({ err });
      }
    }
  };

  render(): JSX.Element {
    const { entities, pageInfo } = this.props.items;

    return (
      <TableBlockWrapperStyled>
        <Card>
          <Row justify={"space-between"}>
            <Col>
              <Row>
                <Col style={{ marginRight: "15px" }}>
                  <Can
                    I={ActionsEnum.View}
                    a={elementId(
                      ToKmhElements[ToKmhElements.ControlResultsAdd]
                    )}
                  >
                    <Button
                      type={"link"}
                      icon={<PlusCircleFilled />}
                      onClick={() => this.setState({ addModalVisible: true })}
                      disabled={this.props.node.isSiType === false}
                    >
                      Ввести результаты КМХ/поверки
                    </Button>
                  </Can>
                </Col>

                <Col style={{ marginRight: "15px" }}>
                  <Can
                    I={ActionsEnum.View}
                    a={elementId(
                      ToKmhElements[ToKmhElements.ControlResultsLoad]
                    )}
                  >
                    <Upload
                      customRequest={this.customRequest}
                      showUploadList={false}
                    >
                      <Button
                        type={"link"}
                        icon={<UploadOutlined />}
                        onClick={() =>
                          this.setState({ importVariant: "resultTokmh" })
                        }
                        loading={this.state.isFileLoading}
                      >
                        Загрузить результаты КМХ и Поверок
                      </Button>
                    </Upload>
                  </Can>
                </Col>

                <Col style={{ marginRight: "15px" }}>
                  <Can
                    I={ActionsEnum.View}
                    a={elementId(ToKmhElements[ToKmhElements.ControlSchedLoad])}
                  >
                    <Upload
                      customRequest={this.customRequest}
                      showUploadList={false}
                    >
                      <Button
                        type={"link"}
                        icon={<UploadOutlined />}
                        onClick={() =>
                          this.setState({ importVariant: "tokmh" })
                        }
                        loading={this.state.isFileLoading}
                      >
                        Загрузить графики ТО и КМХ
                      </Button>
                    </Upload>
                  </Can>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col>
                  <Can
                    I={ActionsEnum.View}
                    a={elementId(ToKmhElements[ToKmhElements.Export])}
                  >
                    <ExportFilterTableButton
                      init={{
                        credentials: "include",
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          pageName: ToKmhRoute,
                          nodeTreeId: this.props.node.key,
                          nodeTreeType: this.props.node.type,
                          controlMaintEventsListFilter: this.getFilter(),
                        }),
                      }}
                    />
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

        <Spin spinning={this.state.loading} wrapperClassName={"spinnerStyled"}>
          <ItemsTable<ControlMaintEvents>
            notShowTimeInDate
            isCustomFilterAndSorting
            items={this.props.tokmh ?? entities}
            fields={new ObjectFields(ControlMaintEvents).getFields()}
            hiddenColumns={[
              "id",
              "coefChangeEventFrameId",
              "eventFrameId",
              "eventTypeId",
              "graphOk",
              "periodOk",
              "protocolFileName",
              "protocolFileExist",
              "resultsExist",
              "siId",
              "techPositionId",
              "controlResultsModel",
              "standartModel",
              "standartNumber",
              "standartType",
              "siTypeId",
            ]}
            actionColumns={[
              {
                headerName: "Действие",
                pinned: "right",
                cellRenderer: "toKmhActionsRenderer",
                minWidth: 100,
              },
            ]}
            widths={[
              {
                key: "controlMaintEventType",
                newWidth: 130,
              },
              {
                key: "siknFullName",
                newWidth: 125,
              },
              {
                key: "techPositionText",
                newWidth: 133,
              },
              {
                key: "positionInBlock",
                newWidth: 133,
              },
              {
                key: "siTypeText",
                newWidth: 100,
              },
              {
                key: "manufNumber",
                newWidth: 145,
              },
              {
                key: "planDate",
                newWidth: 150,
              },
              {
                key: "factDate",
                newWidth: 150,
              },
              {
                key: "eventFrameExist",
                newWidth: 100,
              },
            ]}
            replaceColumns={[
              {
                field: "note",
                sortable: false,
              },
              {
                field: "protocolFileExistsText",
                filter: "customFilter",
              },
              {
                field: "coefChangeEventFrameText",
                filter: "customFilter",
                sortable: false,
              },
              {
                field: "graphOkText",
                filter: "customFilter",
              },
              {
                field: "periodOkText",
                filter: "customFilter",
                filterParams: {
                  customOptions: ["Нарушена", "Не нарушена"],
                },
              },
              {
                field: "resultsExistText",
                filter: false,
                headerName: "Результат",
                minWidth: 170,
                width: 170,
                sortable: false,
                cellRenderer: "insertResultToKmhRenderer",
                cellRendererParams: {
                  clicked: (data: ControlMaintEvents) => {
                    this.selectionHandler(data);
                    this.setState({ editModalVisible: true });
                  },
                  flagSelector: (item: ControlMaintEvents) =>
                    item.controlResultsModel.length > 0,
                },
                tooltipField: "",
              },
              {
                field: "eventFrameExist",
                headerName: "МСС",
                filter: "customFilter",
                sortable: false,
                cellRenderer: "checkboxRenderer",
              },
            ]}
            setApiCallback={this.setApi}
            filterChangedCallback={(filterModel) => {
              this.setState({ filterObject: filterModel });
            }}
            onSortChanged={this.onTableSortChanged}
          />
        </Spin>
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
          visible={this.state.addModalVisible}
          title={"Ввод результатов КМХ/поверки"}
          width={"1177px"}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ addModalVisible: false });
          }}
        >
          <InsertResultToKmhForm
            submitCallback={this.insertHandler}
            node={this.props.node}
            selectionHandler={this.selectionHandler}
          />
        </Modal>
        <Modal
          maskClosable={false}
          visible={this.state.editModalVisible}
          title={"Ввод результатов КМХ/поверки по событию"}
          width={"1177px"}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ editModalVisible: false });
          }}
        >
          <InsertResultToKmhForm
            initial={this.props.writtenItem?.old}
            submitCallback={this.updateHandler}
            node={this.props.node}
          />
        </Modal>
      </TableBlockWrapperStyled>
    );
  }

  componentDidMount() {
    this.fetchItems(this.props.items.pageInfo.pageNumber);
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<ActionTypes<typeof actions>>
): MappedDispatchesToToKmhProps => {
  return {
    fetched: (items) => dispatch(actions.tokmhFetched(items)),
    dateFilter: (filterDates) => dispatch(actions.dateChanged(filterDates)),
    filtered: (items) => dispatch(actions.tokmhFiltered(items)),
    updated: (item) => dispatch(actions.tokmhUpdated(item)),
  };
};

const mapStateToProps = (state: StateType): IToKmhState => {
  return {
    ...state.toKmh,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToKmhContainer);
