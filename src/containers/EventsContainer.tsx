import { Component } from "react";
import {
  FilterDates,
  FilterObject,
  IEventsState,
  ListFilterBase,
} from "../interfaces";
import { apiBase, returnStringDate } from "../utils";
import axios, { CancelTokenSource } from "axios";
import { EventItem } from "../classes";
import { ItemsTable } from "../components/ItemsTable";
import {
  ActionTypes,
  FiltersModel,
  ObjectFields,
  PagedModel,
  StateType,
} from "../types";
import {
  Button,
  Card,
  Col,
  message,
  Modal,
  Pagination,
  Row,
  Spin,
  Tooltip,
} from "antd";
import { CommentForm } from "../components/CommentForm";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/events/creators";
import "moment/locale/ru";
import { GridApi, SortChangedEvent } from "ag-grid-community";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import {
  getOperativeMonitoringlist as getOperativeMonitoringList,
  getTransitionlist,
} from "../api/requests/eventsPage";
import { FilterType } from "../api/params/get-events-params";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ReloadOutlined } from "@ant-design/icons";
import "../styles/app";
import { ExportFilterTableButton } from "components/ExportFilterTableButton";

interface EventsContainerState {
  commentModalVisible: boolean;
  levelFilter: number | null;
  loading: boolean;
  gridApi: GridApi;
  filterObject: FilterObject;
  sortedField: [string, string | null | undefined];
}

enum SortableFields {
  startDateTime = "StartDateTime",
  endDateTime = "EndDateTime",
  siknFullName = "SIKNRSU.FullName",
  sikn = "SIKN",
  pspName = "SIKNRSU.PSP.FullName",
  receivingPoint = "ReceivingPoint",
  techPositionName = "TechPositions.FullName",
  techposition = "Techposition",
  comment = "Comment",
  eventName = "EventName",
  isAcknowledged = "IsAcknowledged",
  acknowledgedBy = "AcknowledgedBy",
  resultQualityID = "ResultQuality.ShortName",
  //mssEventTypeName = "MSSEventTypes.ShortName",
  mssEventTypeName = "MssEventTypeName",
  //mssEventSeverityLevelName = "MSSEventSeverityLevels.ShortName",
  mssEventSeverityLevelName = "MssEventSeverityLevelName",
  acknowledgedTimestamp = "AcknowledgedTimestamp",
}

interface MappedDispatchesToEventsProps {
  fetched: (items: PagedModel<EventItem>) => void;
  dateFilter: (filterDates: FilterDates) => void;
  select: (item: EventItem | null) => void;
  filteredEvents: (item: Array<EventItem>) => void;
}

type EventsContainerProps = IEventsState &
  MappedDispatchesToEventsProps & {
    filter?: FilterType;
  };

let source: CancelTokenSource;

class EventsContainer extends Component<
  EventsContainerProps,
  EventsContainerState
> {
  private baseObj: string = `events`;
  private defaultSorting: [string, string | null | undefined] = [
    "StartDateTime",
    "desc",
  ];

  private url(page: number): string {
    let nodeType = this.props.node.type;
    return `${apiBase}/${nodeType !== "all" ? nodeType + "/" + this.props.node.key + "/" : ""
      }${this.baseObj}?page=${page}`;
  }

  private widgetEvents: PagedModel<EventItem> | undefined;

  constructor(props: EventsContainerProps) {
    super(props);
    this.state = {
      levelFilter: null,
      commentModalVisible: false,
      loading: false,
      gridApi: new GridApi(),
      filterObject: {
        treeFilter: {
          nodePath: "",
          isOwn: null,
        },
      },
      sortedField: this.defaultSorting,
    };
    this.commentHandler = this.commentHandler.bind(this);
    this.setApi = this.setApi.bind(this);
    this.getFetchUrl = this.getFetchUrl.bind(this);
    this.selectionHandler = this.selectionHandler.bind(this);
    this.getFilter = this.getFilter.bind(this);
  }

  setApi(api: GridApi) {
    this.setState({ gridApi: api });
  }

  getFetchUrl() {
    return this.url(0);
  }  

  getFilter(): ListFilterBase {
    const {
      filterDates,
      ownedFilter,
      levelFilter,
      eventTypesFilter
    } = this.props;

    let filtersModel: FiltersModel = {
      startTime: returnStringDate(filterDates.startDate, true),
      endTime: returnStringDate(filterDates.endDate, true, true),
      owned: ownedFilter,
      eventsFilter: {
        levelFilter: levelFilter,
        eventTypesFilter: eventTypesFilter,
      },
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

  /*
  // старый метод получения событий
  async fetchItemsOld(page: number, filter: FilterType | undefined) {
    this.props.select(null);

    const listFilter = this.getFilter();

    const pageInfo = {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    };

    const pageModel: PagedModel<EventItem> = {
      entities: [],
      pageInfo: pageInfo,
    };

    if (source) {
      source.cancel("Cancel previous request");
    }

    source = axios.CancelToken.source();

    this.setState({ loading: true });

    if (!filter) {
      this.widgetEvents = undefined;

      axios
        .post<PagedModel<EventItem>>(this.url(page), listFilter, {
          cancelToken: source.token,
        })
        .then((result) => {
          this.props.fetched(result.data);
          this.setState({ loading: false });
        })
        .catch((err) => {
          this.props.fetched(pageModel);
          console.log(err);
          if (!axios.isCancel(err)) {
            this.setState({ loading: false });
            message.error("Ошибка загрузки данных");
          }
        });
    } else {
      if (filter.operativeMonitFilter) {
        const response = await getOperativeMonitoringList(filter, page);
        this.widgetEvents = response;
        this.setState({ loading: false });
      } else {
        const response = await getTransitionlist(filter, page);
        this.widgetEvents = response;
        this.setState({ loading: false });
      }
    }
  }
  */

  async fetchItems(page: number, filter: FilterType | undefined) {
    this.props.select(null);

    const listFilter = this.getFilter();

    const pageInfo = {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    };

    const pageModel: PagedModel<EventItem> = {
      entities: [],
      pageInfo: pageInfo,
    };

    if (source) {
      source.cancel("Cancel previous request");
    }

    source = axios.CancelToken.source();

    this.setState({ loading: true });

    // console.log('listFilter', listFilter);

    const filterColumns = Object.keys(listFilter.filter)
      .filter((key) => key !== "treeFilter" && key !== "filtersModel")
      .map((key) => {
        // фикс для названия столбца в sql запросе where
        const keyName = key === "mssEventTypeName" ? "et.ShortName" : key;
        return { [keyName]: listFilter.filter[key] };
      });

    const filterColumnsString = filterColumns.length > 0 ? JSON.stringify(filterColumns) : '';

    // console.log('filterColumns', filterColumnsString);    

    if (!filter) {
      this.widgetEvents = undefined;

      axios
        .post<PagedModel<EventItem>>(
          `${apiBase}/events-by-path?path=${this.props.node.path}&pageNumber=${page}&sortFieldName=${listFilter.sortedField}&sortDirection=${listFilter.isSortAsc ? "asc" : "desc"}&filterColumns=${filterColumnsString}`,
          listFilter,
          {
            cancelToken: source.token,
          }
        )
        .then((result) => {
          this.props.fetched(result.data);
          this.setState({ loading: false });
        })
        .catch((err) => {
          this.props.fetched(pageModel);
          console.log(err);
          if (!axios.isCancel(err)) {
            this.setState({ loading: false });
            message.error("Ошибка загрузки данных");
          }
        });
    } else {
      if (filter.operativeMonitFilter) {
        const response = await getOperativeMonitoringList(filter, page);
        this.widgetEvents = response;
        this.setState({ loading: false });
      } else {
        const response = await getTransitionlist(filter, page);
        this.widgetEvents = response;
        this.setState({ loading: false });
      }
    }
  }

  selectionHandler(item: EventItem) {
    this.props.select(item);
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

  commentHandler(item: EventItem) {
    return new Promise<void>((resolve, reject) => {
      axios
        .put(`${apiBase}/events/${item.id}`, item)
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
          }
          
          this.setState({ commentModalVisible: false });
          resolve();
        })
        .catch((err) => reject(err));
    });
  }  

  componentDidMount() {
    this.fetchItems(this.props.items.pageInfo.pageNumber, this.props.filter);
  }

  componentWillUnmount() {
    this.props.select(null);
  }

  componentDidUpdate(
    prevProps: Readonly<EventsContainerProps>,
    prevState: Readonly<EventsContainerState>
  ) {
    if (
      prevProps.node !== this.props.node ||
      prevProps.filterDates !== this.props.filterDates ||
      prevProps.viewName !== this.props.viewName ||
      prevProps.levelFilter !== this.props.levelFilter ||
      prevProps.ownedFilter !== this.props.ownedFilter ||
      prevProps.eventTypesFilter !== this.props.eventTypesFilter ||
      prevState.filterObject !== this.state.filterObject ||
      prevState.sortedField !== this.state.sortedField
    ) {
      this.fetchItems(1, undefined);
    }
  }

  render() {
    const { entities, pageInfo } = this.widgetEvents ?? this.props.items;

    return (
      <TableBlockWrapperStyled>
        {/* <Card>
          <Row wrap={false} justify="space-between">
            <Col>
              <Button
                type={"link"}
                icon={<PlusCircleFilled />}
                onClick={() => this.setState({ commentModalVisible: true })}
                disabled={
                  this.props.selected === null ||
                  this.state.loading ||
                  (this.props.selected != null &&
                    this.props.selected.isAcknowledged === 1)
                }
              >
                Квитирование
              </Button>
            </Col>
            <Col>
              <Row>
                <Col>
                  <ExportFilterTableButton
                    init={{
                      credentials: "include",
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        pageName: "/events",
                        nodeTreeId: this.props.node.key,
                        nodeTreeType: this.props.node.type,
                        eventsListFilter: this.getFilter(),
                      }),
                    }}
                  />
                </Col>
                <Col>
                  <Tooltip title="Обновить таблицу">
                    <Button
                      type="link"
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        this.fetchItems(
                          this.props.items.pageInfo.pageNumber,
                          this.props.filter
                        );
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card> */}

        <Spin spinning={this.state.loading} wrapperClassName={"spinnerStyled"}>
          <ItemsTable<EventItem>
            isFilterDisabled
            isSortableDisabled
            items={entities}
            fields={new ObjectFields(EventItem).getFields()}

            // скрытые столбцы
            hiddenColumns={[
              "id",
              "siknId",
              "siId",
              "techPositionId",
              "mssEventTypeId",
              "mssEventSeverityLevelId",
              "resultQualityID",
              "resultQualityShortName",
              "riskRatio",
              "mssEventSeverityLevels",
              "isAcknowledgedStatus",
              "extendTime",
              "acknowledgedBy",
              "isAcknowledged",
              "acknowledgedTimestamp",
              "siknFullName",
              "pspName",
              "techPositionName",
              "comment"
            ]}

            selectionCallback={this.selectionHandler}

            setApiCallback={this.setApi}

            actionColumns={[
              /* {
                headerName: "Действия",
                pinned: "right",
                cellRenderer: "eventsActionsRenderer",
                minWidth: 100,
              }, */
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
              /* {
                key: "siknFullName",
                newWidth: 200,
              }, */
              // СИКН
              {
                key: "sikn",
                newWidth: 200,
              },
              // ПСП
              {
                key: "receivingPoint",
                newWidth: 200,
              },
              /* {
                key: "techPositionName",
                newWidth: 200,
              }, */
              {
                key: "techposition",
                newWidth: 200,
              },
              {
                key: "eventName",
                newWidth: 350,
              },
              {
                key: "mssEventTypeName",
                newWidth: 350,
              },
              {
                key: "mssEventSeverityLevelName",
                newWidth: 150,
              },
              /* {
                key: "isAcknowledged",
                newWidth: 150,
              }, */              
              /* {
                key: "comment",
                newWidth: 175,
              }, */
              /* {
                key: "acknowledgedTimestamp",
                newWidth: 175,
              }, */
            ]}

            // фильтрация
            replaceColumns={[
              {
                headerName: "Начало",
                field: "startDateTime",
                sortable: true,
                comparator: () => 0,
              },
              {
                headerName: "Окончание",
                field: "endDateTime",
                sortable: true,
                comparator: () => 0,
              },
              /* {
                headerName: "СИКН",
                field: "siknFullName",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              }, */
              {
                headerName: "СИКН",
                field: "sikn",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              },
              /* {
                headerName: "ПСП",
                field: "pspName",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              }, */
              {
                headerName: "ПСП",
                field: "receivingPoint",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              },              
              /* {
                headerName: "Технологическая позиция",
                field: "techPositionName",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              }, */
              {
                headerName: "Технологическая позиция",
                field: "techposition",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              },              
              /* {
                headerName: "Комментарий",
                field: "comment",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              }, */
              /* {
                headerName: "Кем было квитировано",
                field: "acknowledgedBy",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              }, */
              {
                headerName: "Тип события МКО ТКО",
                field: "mssEventTypeName",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              },
              {
                headerName: "Критичность",
                field: "mssEventSeverityLevelName",
                sortable: true,
                comparator: () => 0,
              },
              {
                headerName: "Событие",
                field: "eventName",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              },
              /* {
                headerName: "Достоверность",
                field: "resultQualityID",
                filter: "customTextTableFilter",
                cellRenderer: "qualityRenderer",
                sortable: true,
                comparator: () => 0,
              }, */
              /* {
                headerName: "Время квитирования",
                field: "acknowledgedTimestamp",
                sortable: true,
                comparator: () => 0,
              }, */
              /* {
                field: "isAcknowledged",
                headerName: "Признак квитирования",
                filter: "customFilter",
                cellRenderer: "checkboxRenderer",
                sortable: true,
                comparator: () => 0,
              }, */
            ]}
            filterChangedCallback={(filterModel) => {
              this.setState({ filterObject: filterModel });
            }}
            onSortChanged={this.onTableSortChanged}
          />
        </Spin>

        <Card>
          <Row justify="space-between">
            <Col>
              <div style={{
                textAlign: "center",
                position: "relative",
                height: "100%",
                display: "flex",
                alignItems: "center"
              }}>
                <Pagination
                  disabled={this.state.loading}
                  showSizeChanger={false}
                  size="small"
                  current={pageInfo.pageNumber}
                  defaultPageSize={1}
                  total={pageInfo.totalPages}
                  onChange={(page) => {
                    this.fetchItems(page, this.props.filter);
                  }}
                />
              </div>
            </Col>
            {/* <Col>
              <Row>
                <Col>
                  <ExportFilterTableButton
                    init={{
                      credentials: "include",
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        pageName: "/events",
                        nodeTreeId: this.props.node.key,
                        nodeTreeType: this.props.node.type,
                        eventsListFilter: this.getFilter(),
                      }),
                    }}
                  />
                </Col>
                <Col>
                  <Tooltip title="Обновить таблицу">
                    <Button
                      type="link"
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        this.fetchItems(
                          this.props.items.pageInfo.pageNumber,
                          this.props.filter
                        );
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row>
            </Col> */}
          </Row>
        </Card>

        {/* <Modal
          maskClosable={false}
          visible={this.state.commentModalVisible}
          title={`Квитирование`}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ commentModalVisible: false });
          }}
          onOk={() => { }}
        >
          <CommentForm<EventItem>
            initial={this.props.selected ?? new EventItem()}
            submitCallback={this.commentHandler}
            showUseInReports={false}
          />
        </Modal> */}
      </TableBlockWrapperStyled>
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<ActionTypes<typeof actions>>
): MappedDispatchesToEventsProps => {
  return {
    fetched: (items) => dispatch(actions.eventsFetched(items)),
    dateFilter: (filterDates) => dispatch(actions.dateChanged(filterDates)),
    select: (item) => dispatch(actions.eventSelected(item)),
    filteredEvents: (items) => dispatch(actions.eventsFiltered(items)),
  };
};

const mapStateToProps = (state: StateType): IEventsState => {
  return {
    ...state.eventsReducer,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsContainer);
