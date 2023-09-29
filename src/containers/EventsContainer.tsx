import { Component } from "react";
import {
  FilterDates,
  FilterObject,
  IEventsState,
  ListFilterBase,
} from "../interfaces";
import { apiBase, returnStringDate, dateToShortString, dateToDayTime } from "../utils";
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
  List,
} from "antd";
import { CommentForm } from "../components/CommentForm";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/events/creators";
import "moment/locale/ru";
import { GridApi, SortChangedEvent, RowClickedEvent } from "ag-grid-community";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import {
  getOperativeMonitoringlist as getOperativeMonitoringList,
  getTransitionlist,
} from "../api/requests/eventsPage";
import { FilterType } from "../api/params/get-events-params";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ReloadOutlined } from "@ant-design/icons";
import "../styles/app.scss";
import { ExportFilterTableButton } from "components/ExportFilterTableButton";

interface IEventObject {
  key: string;
  title: string;
  value: string;
}

interface EventsContainerState {
  eventModalVisible: boolean;
  eventModalData: IEventObject[];
  eventModalTitle: string;
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
  sikn = "SIKN", // СИКН
  owner = "Owner", // Владелец
  purpose = "Purpose", // Назначение
  techposition = "Techposition", // Технологическая позиция
  eventName = "EventName", // Событие
  siknFullName = "SIKNRSU.FullName",
  pspName = "SIKNRSU.PSP.FullName",
  receivingPoint = "ReceivingPoint",
  techPositionName = "TechPositions.FullName",
  comment = "Comment",
  isAcknowledged = "IsAcknowledged",
  acknowledgedBy = "AcknowledgedBy",
  resultQualityID = "ResultQuality.ShortName",
  mssEventTypeName = "MssEventTypeName",
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
      eventModalVisible: false,
      eventModalTitle: "",
      eventModalData: [],
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

  // получение данных для общей таблицы
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

  // получение данных о событии для модального окна  
  async fetchEventInfo(id: string, typeId: number) {
    axios
      .get<string>(`${apiBase}/event-info`, {
        params: {
          id: id,
          typeId: typeId
        }        
      })
      .then((result) => {
        // console.log("result data", result.data);
        // console.log("parse data", JSON.parse(result.data));

        const resultData = JSON.parse(result.data);

        const eventData:IEventObject[] = [];

        resultData.forEach((item: {
          Name: string;
          Caption: string;
          Value: string;
        }) => {
          eventData.push({
            key: item.Name,
            title: item.Caption,
            value: item.Value
          });
        });

        this.setState({
          eventModalData: eventData
        });
      })
      .catch((err) => {
        console.log(err);        
      });
  }

  // обработка клика по строке события
  onRowClicked = (event: RowClickedEvent) => {
    const { data } = event;

    // console.log(data);

    // console.log("id", data.id);
    // console.log("mssEventTypeId", data.mssEventTypeId);

    this.fetchEventInfo(data.id, data.mssEventTypeId);

    // искомые ключи в нужном порядке
    // const eventKeys = [
    //   // { keyName: "id", keyTitle: "ID"},
    //   { keyName: "eventName", keyTitle: "Событие" },
    //   { keyName: "startDateTime", keyTitle: "Начало" },
    //   { keyName: "endDateTime", keyTitle: "Окончание" },
    //   // { keyName: "mssEventTypeId", keyTitle: "ID типа события" },
    //   // { keyName: "mssEventTypeName", keyTitle: "Тип" },
    //   { keyName: "sikn", keyTitle: "СИКН" },
    //   { keyName: "techposition", keyTitle: "Тех. позиция" },
    //   { keyName: "receivingPoint", keyTitle: "ПСП"},
    //   { keyName: "owner", keyTitle: "Владелец"},
    //   { keyName: "purpose", keyTitle: "Назначение"},
    // ];

    // const eventData:IEventObject[] = [];

    // eventKeys.forEach((item) => {
    //   let curEventValue = data[item.keyName];

    //   // если есть значение по такому ключу
    //   if (curEventValue) {
    //     // если это дата
    //     if (curEventValue instanceof Date) {
    //       curEventValue = `${dateToShortString(curEventValue)} ${dateToDayTime(curEventValue)}`;
    //     }

    //     // приведение к строке
    //     curEventValue = String(curEventValue);

    //     // добавляем элемент в массив
    //     eventData.push({
    //       key: item.keyName,
    //       title: item.keyTitle,
    //       value: curEventValue
    //     });
    //   }
    // });

    // console.log(eventData);

    // меняем состояние, добавляя данные и открываю модалку
    this.setState({
      eventModalTitle: `${data.eventName} (${data.sikn})`,
      // eventModalData: eventData,
      eventModalVisible: true
    });
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

    const handleClose = () => {
      this.setState({ eventModalVisible: false });
    };

    return (
      <TableBlockWrapperStyled>
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
              "comment",
              "receivingPoint", // ПСП
              "mssEventTypeName", // Тип события МКО ТКО
              "mssEventSeverityLevelName", // Критичность
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
                newWidth: 190,
              },
              {
                key: "endDateTime",
                newWidth: 190,
              },
              // СИКН
              {
                key: "sikn",
                newWidth: 200,
              },
              // Тех. позиция
              {
                key: "techposition",
                newWidth: 160,
              },
              // Событие
              {
                key: "eventName",
                newWidth: 430,
              },              
              // Назначение
              {
                key: "purpose",
                newWidth: 250,
              },
              // Владелец
              {
                key: "owner",
                newWidth: 250,
              },
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
              {
                headerName: "СИКН",
                field: "sikn",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              },             
              {
                headerName: "Тех. позиция",
                field: "techposition",
                filter: "customTextTableFilter",
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
              {
                headerName: "Назначение",
                field: "purpose",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              },
              {
                headerName: "Владелец",
                field: "owner",
                filter: "customTextTableFilter",
                sortable: true,
                comparator: () => 0,
              },
            ]}

            filterChangedCallback={(filterModel) => {
              this.setState({ filterObject: filterModel });
            }}

            onSortChanged={this.onTableSortChanged}

            onRowClicked={this.onRowClicked}
          />
        </Spin>

        {/* подвал */}
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
          </Row>
        </Card>

        <Modal
          maskClosable={true}
          visible={this.state.eventModalVisible}
          title={this.state.eventModalTitle}
          destroyOnClose
          footer={<Button onClick={handleClose} type="primary">Ок</Button>}
          onCancel={handleClose}
          onOk={handleClose}
          width={720}
          centered
        >
          {this.state.eventModalData
            ? <List bordered dataSource={this.state.eventModalData} renderItem={(item) => (
                <List.Item><b>{item.title}:</b> {item.value}</List.Item>
              )}/>
            : "Загрузка..."
          }          
        </Modal>
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
