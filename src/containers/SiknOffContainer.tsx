import { Component } from "react";
import {
  Button,
  Modal as AntModal,
  Card,
  Col,
  Row,
  Pagination,
  Upload,
  Tooltip,
  message,
  notification,
  Spin,
} from "antd";
import { ItemsTable } from "../components/ItemsTable";
import {
  ActionTypes,
  FiltersModel,
  ObjectFields,
  PagedModel,
  StateType,
} from "../types";
import { SiknOffItem } from "../classes";
import {
  FilterDates,
  FilterObject,
  ISiknOffState,
  IWrittenItem,
  ListFilterBase,
} from "../interfaces";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/siknoffs/creators";
import axios, { CancelTokenSource } from "axios";
import UploadOutlined from "@ant-design/icons/UploadOutlined";
import { SiknOffForm } from "../components/SiknOffForm";
import "../styles/app.scss";
import { apiBase, dateToShortString, returnStringDate } from "../utils";
import { GridApi, SortChangedEvent } from "ag-grid-community";
import { InvestigationActForm } from "../components/InvestigationActForm";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import { ActionsEnum, Can } from "../casl";
import {
  elementId,
  SiknOffElements,
  SiknOffRoute,
} from "../pages/SiknOff/constants";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ReloadOutlined } from "@ant-design/icons";
import { ActImportStatuses } from "enums";
import { history } from "../history/history";
import { ExportFilterTableButton } from "components/ExportFilterTableButton";

interface IMappedDispatchesToSiknOffProps {
  fetched: (items: PagedModel<SiknOffItem>) => void;
  updated: (items: IWrittenItem<SiknOffItem> | null) => void;
  inserted: (items: SiknOffItem | null) => void;
  filterOffs: (items: Array<SiknOffItem>) => void;
  dateFilter: (filterDates: FilterDates) => void;
}

enum SortableFields {
  siknFullName = "ControlDir.SIKNRSU.FullName",
  startDateTime = "StartDateTime",
  durationText = "Duration",
  endDateTime = "EndDateTime",
  rsuName = "SIKNRSU.ShortName",
  eventFrameExist = "SiknOffToEvents.Any()",
  inPlanSiknOff = "InPlanSiknOff",
  useInReports = "UseInReports",
  isAcknowledged = "IsAcknowledged",
  askidConfirmedText = "askidConfirmed",
  elisConfirmedText = "elisConfirmed",
}

interface ISiknOffContainerState {
  addModalVisible: boolean;
  editModalVisible: boolean;
  investigateModalVisible: boolean;
  useInReportsFilter: boolean;
  rsuFilter: boolean;
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

type SiknOffContainerProps = ISiknOffState & IMappedDispatchesToSiknOffProps;

class SiknOffContainer extends Component<
  SiknOffContainerProps,
  ISiknOffContainerState
> {
  private baseObj: string = `siknoff`;
  private baseUrl: string = `${apiBase}/${this.baseObj}`;

  private url(page: number): string {
    let nodeType = this.props.node.type;
    return `${apiBase}/${
      nodeType !== "all" ? nodeType + "/" + this.props.node.key + "/" : ""
    }${this.baseObj}?page=${page}`;
  }

  private defaultSorting: [string, string | null | undefined] = [
    "StartDateTime",
    "desc",
  ];

  constructor(props: SiknOffContainerProps) {
    super(props);
    this.state = {
      addModalVisible: false,
      editModalVisible: false,
      investigateModalVisible: false,
      useInReportsFilter: false,
      rsuFilter: true,
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
    this.selectionHandler = this.selectionHandler.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.insertSiknOffActFileDownload =
      this.insertSiknOffActFileDownload.bind(this);
    this.updateSiknOffActFileDownload =
      this.updateSiknOffActFileDownload.bind(this);
    this.insertHandler = this.insertHandler.bind(this);
    this.investigationActHandler = this.investigationActHandler.bind(this);
    this.investigationActFileDownload =
      this.investigationActFileDownload.bind(this);
    this.setApi = this.setApi.bind(this);
    this.getFetchUrl = this.getFetchUrl.bind(this);
    this.getFilter = this.getFilter.bind(this);
  }

  setApi(api: GridApi) {
    this.setState({ gridApi: api });
  }

  getFetchUrl() {
    return this.url(0);
  }

  getFilter(): ListFilterBase {
    const { startDate, endDate } = this.props.filterDates;
    let filtersModel: FiltersModel = {
      startTime: returnStringDate(startDate, true),
      endTime: returnStringDate(endDate, true, true),
      owned: this.props.ownedFilter,
      siknOffFilter: {
        reportFilter: this.props.reportFilter,
        rsuFilter: this.props.rsuFilter,
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

  fetchItems(page: number) {
    const listFilter = this.getFilter();

    const pageInfo = {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    };
    const e: PagedModel<SiknOffItem> = {
      entities: [],
      pageInfo: pageInfo,
    };
    if (source) {
      source.cancel("Cancel previous request");
    }
    source = axios.CancelToken.source();
    this.setState({ loading: true });
    axios
      .post<PagedModel<SiknOffItem>>(this.url(page), listFilter, {
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

  selectionHandler(item: SiknOffItem) {
    console.log(item);
    this.props.updated({
      old: item,
      new: null,
    });
  }

  updateHandler(item: SiknOffItem) {
    return new Promise<SiknOffItem>((resolve, reject) => {
      if (this.props.writtenItem !== null) {
        this.props.updated({
          old: this.props.writtenItem.old,
          new: item,
        });
      }
      axios
        .put(`${apiBase}/${this.baseObj}/${item.id}`, item) //${this.baseUrl}
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
              this.filterItems(data);
            }
            this.props.updated(null);
            this.setState({ editModalVisible: false });
            this.state.gridApi.refreshCells({ force: true });
            resolve(result.data.result);
            message.success("Данные успешно обновлены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => console.log(err));
    });
  }

  updateSiknOffActFileDownload(item: SiknOffItem) {
    return new Promise<SiknOffItem>((resolve, reject) => {
      if (this.props.writtenItem !== null) {
        this.props.updated({
          old: this.props.writtenItem.old,
          new: item,
        });
      }
      var url = `${this.baseUrl}/siknOffActFileDownload/${item.id}`;
      let fileName: string = `Акт отключения ${
        item.siknFullName
      } от ${dateToShortString(new Date())}.docx`;

      fetch(url, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      })
        .then((response) => {
          if (response.ok) {
            return response.blob();
          } else {
            reject("Невозможно скачать акт");
            return;
          }
        })
        .then((blob: Blob) => {
          const href = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          this.setState({ editModalVisible: false });
          this.state.gridApi.refreshCells({ force: true });
          resolve(item);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  investigationActHandler(item: SiknOffItem) {
    return new Promise<SiknOffItem>((resolve, reject) => {
      if (this.props.writtenItem !== null) {
        this.props.updated({
          old: this.props.writtenItem.old,
          new: item,
        });
      }
      axios
        .put(`${this.baseUrl}/investigationAct/${item.id}`, item)
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
              this.filterItems(data);
              this.state.gridApi.refreshCells({ force: true });
            }
            this.props.updated(null);
            this.setState({ investigateModalVisible: false });
            resolve(result.data.result);
            message.success("Данные успешно сохранены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => reject(err));
    });
  }

  investigationActFileDownload(item: SiknOffItem) {
    return new Promise<SiknOffItem>((resolve, reject) => {
      if (this.props.writtenItem !== null) {
        this.props.updated({
          old: this.props.writtenItem.old,
          new: item,
        });
      }

      var url = `${this.baseUrl}/investigationActFileDownload/${item.id}`;
      let fileName: string = `Акт расследования ${
        item.siknFullName
      } от ${dateToShortString(new Date())}.docx`;
      fetch(url, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      })
        .then((response) => {
          if (response.ok) {
            return response.blob();
          } else {
            reject("Невозможно скачать акт");
            return;
          }
        })
        .then((blob: Blob) => {
          const href = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          this.setState({ investigateModalVisible: false });
          this.state.gridApi.refreshCells({ force: true });
          resolve(item);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  insertHandler(item: SiknOffItem) {
    return new Promise<SiknOffItem>((resolve, reject) => {
      this.props.inserted(item);
      axios
        .post(this.baseUrl, item)
        .then((result) => {
          console.log(result);
          this.props.inserted(null);
          if (result.data.success) {
            const data = this.props.items.entities.slice();
            // добавляем новый элемент в начало списка
            data.unshift(result.data.result);
            this.props.fetched({
              entities: data,
              pageInfo: this.props.items.pageInfo,
            });
            this.filterItems(data);
            this.setState({ addModalVisible: false });
            resolve(result.data.result);
            message.success("Данные успешно сохранены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => reject(err));
    });
  }

  insertSiknOffActFileDownload(item: SiknOffItem) {
    return new Promise<SiknOffItem>((resolve, reject) => {
      var url = `${this.baseUrl}/siknOffActFileDownload/`;
      let fileName: string = `Акт отключения ${
        item.siknFullName
      } от ${dateToShortString(new Date())}.docx`;
      fetch(url, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      })
        .then((response) => {
          if (response.ok) {
            return response.blob();
          } else {
            reject("Невозможно скачать акт");
            return;
          }
        })
        .then((blob: Blob) => {
          const href = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          this.setState({ addModalVisible: false });
          resolve(item);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  filterItems(items: Array<SiknOffItem>) {
    const useInReportsFunc = (x: SiknOffItem) =>
      !this.props.reportFilter ? x.useInReports != false : true;
    const rsuFunc = (x: SiknOffItem) =>
      !this.props.rsuFilter ? x.rsuId !== null : true;

    this.props.filterOffs(
      items.filter((x) => useInReportsFunc(x) && rsuFunc(x))
    );
  }

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

  componentDidUpdate(
    prevProps: Readonly<SiknOffContainerProps>,
    prevState: Readonly<ISiknOffContainerState>
  ) {
    if (
      prevProps.node !== this.props.node ||
      prevProps.filterDates !== this.props.filterDates ||
      prevProps.rsuFilter !== this.props.rsuFilter ||
      prevProps.reportFilter !== this.props.reportFilter ||
      prevProps.ownedFilter !== this.props.ownedFilter ||
      prevState.filterObject !== this.state.filterObject ||
      prevState.sortedField !== this.state.sortedField
    ) {
      this.fetchItems(1);
    }
  }

  render(): JSX.Element {
    const self = this;
    const { entities, pageInfo } = this.props.items;

    return (
      <TableBlockWrapperStyled>
        <Card>
          <Row justify="space-between">
            <Col>
              <Row>
                <Col style={{ marginRight: "15px" }}>
                  <Tooltip
                    arrowPointAtCenter
                    title={
                      <span style={{ color: "black" }}>
                        Выберите СИКН в дереве, чтобы добавить акт
                      </span>
                    }
                    color="#ffffff"
                    placement="bottomLeft"
                  >
                    <Can
                      I={ActionsEnum.View}
                      a={elementId(SiknOffElements[SiknOffElements.SiknOffAdd])}
                    >
                      <Button
                        type={"link"}
                        icon={<PlusCircleFilled />}
                        onClick={() => this.setState({ addModalVisible: true })}
                        disabled={this.props.node.type !== "controldirs"}
                      >
                        Добавить акт отключения
                      </Button>
                    </Can>
                  </Tooltip>
                </Col>

                <Col style={{ marginRight: "15px" }}>
                  <Can
                    I={ActionsEnum.View}
                    a={elementId(
                      SiknOffElements[SiknOffElements.SIKNOffSchedLoad]
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
                          this.setState({ importVariant: "SiknOff" })
                        }
                        loading={this.state.isFileLoading}
                      >
                        Загрузить график отключений
                      </Button>
                    </Upload>
                  </Can>
                </Col>

                <Col style={{ marginRight: "15px" }}>
                  <Can
                    I={ActionsEnum.View}
                    a={elementId(
                      SiknOffElements[SiknOffElements.SIKNOffSchedCorrLoad]
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
                          this.setState({ importVariant: "Adjust" })
                        }
                        loading={this.state.isFileLoading}
                      >
                        Загрузить корректировку графика отключений
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
                    a={elementId(SiknOffElements[SiknOffElements.Export])}
                  >
                    <ExportFilterTableButton
                      init={{
                        credentials: "include",
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          pageName: SiknOffRoute,
                          nodeTreeId: this.props.node.key,
                          nodeTreeType: this.props.node.type,
                          siknOffListFilter: this.getFilter(),
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
          <ItemsTable<SiknOffItem>
            isCustomFilterAndSorting
            items={entities}
            fields={new ObjectFields(SiknOffItem).getFields()}
            isSecondsNotShow
            hiddenColumns={[
              "id",
              "duration",
              "durationHour",
              "durationMinute",
              "controlDirId",
              "eventFrameID",
              "rsuId",
              "calcMethodId",
              "stopReasonId",
              "stopReasonText",
              "actNum",
              "actReference",
              "actInfoDate",
              "actInfoSource",
              "hiddenBy",
              "hiddenTimestamp",
              "massStart",
              "volumeStart",
              "mass",
              "volume",
              "investigateActReference",
              "planSiknOffId",
              "afServerName",
              "normalOperation",
              "siknNumber",
              "controlDirFullName",
              "withFile",
              "rsuDuration",
              "remark",
              "recommendations",
              "rsuDurationText",
              "rsuDurationHours",
              "rsuDurationMinutes",
              "extendTime",
              "comment",
              "isInvestigateActExist",
              "isAcknowledged",
              "differenceReason",
            ]}
            floatColumns={["duration"]}
            actionColumns={[
              {
                headerName: "Действия",
                pinned: "right",
                cellRenderer: "actionsRenderer",
                minWidth: 100,
              },
            ]}
            setApiCallback={this.setApi}
            widths={[
              {
                key: "startDateTime",
                newWidth: 200,
              },
            ]}
            replaceColumns={[
              {
                field: "durationText",
                filter: false,
              },
              {
                field: "actExist",
                headerName: "Акт отключения",
                minWidth: 250,
                filter: false,
                sortable: false,
                cellRenderer: "siknOffActRenderer",
                cellRendererParams: {
                  clicked: (data: SiknOffItem) => {
                    this.selectionHandler(data);
                    this.setState({ editModalVisible: true });
                  },
                  flagSelector: (item: SiknOffItem) => item.actExist,
                },
                tooltipField: "",
              },
              {
                field: "investigateActExist",
                headerName: "Акт расследования",
                minWidth: 250,
                filter: false,
                sortable: false,
                cellRenderer: "investigateActRenderer",
                cellRendererParams: {
                  clicked: (data: SiknOffItem) => {
                    this.selectionHandler(data);
                    this.setState({ investigateModalVisible: true });
                  },
                  flagSelector: (item: SiknOffItem) =>
                    item.isInvestigateActExist,
                },
                tooltipField: "",
              },
              {
                field: "eventFrameExist",
                headerName: "МСС",
                filter: "customFilter",
                sortable: true,
                cellRenderer: "checkboxRenderer",
              },
              {
                field: "inPlanSiknOff",
                headerName: "График",
                filter: "customFilter",
                sortable: true,
                cellRenderer: "checkboxRenderer",
              },
              {
                field: "useInReports",
                headerName: "В отчёте",
                filter: "customFilter",
                sortable: true,
                cellRenderer: "checkboxRenderer",
              },
              {
                field: "askidConfirmedText",
                filter: "customFilter",
              },
              {
                field: "elisConfirmedText",
                filter: "customFilter",
              },
            ]}
            rowStyle={(params: any) => {
              let item = params.data as SiknOffItem;
              if (item.askidConfirmed !== null) {
                switch (item.askidConfirmed) {
                  case 0:
                    return { "background-color": "#FFF1F0" };
                  case 1:
                    return { "background-color": "#FFFBE6" };
                  case 2:
                    return { "background-color": "#F6FFED" };
                }
              }
              return null;
            }}
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

        <AntModal
          maskClosable={false}
          visible={this.state.addModalVisible}
          title={`Акт отключения без события`}
          width={"1185px"} //{"90%"}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ addModalVisible: false });
          }}
        >
          <SiknOffForm
            isEditForm={false}
            submitCallback={this.insertHandler}
            downloadFileCallback={this.insertSiknOffActFileDownload}
            node={this.props.node}
          />
        </AntModal>

        <AntModal
          maskClosable={false}
          visible={this.state.editModalVisible}
          title={`Ввод акта отключения`}
          width={"1185px"} //{"90%"}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ editModalVisible: false });
          }}
        >
          <SiknOffForm
            isEditForm={true}
            initial={this.props.writtenItem?.old}
            submitCallback={this.updateHandler}
            downloadFileCallback={this.updateSiknOffActFileDownload}
            node={this.props.node}
          />
        </AntModal>

        <AntModal
          maskClosable={false}
          visible={this.state.investigateModalVisible}
          title={`Акт расследования причин внепланового отключения`}
          okText="Create"
          cancelText="Cancel"
          width={"1177px"} //{"90%"}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ investigateModalVisible: false });
          }}
          onOk={() => {}}
        >
          <InvestigationActForm
            initial={this.props.writtenItem?.old}
            submitCallback={this.investigationActHandler}
            downloadFileCallback={this.investigationActFileDownload}
            node={this.props.node}
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
): IMappedDispatchesToSiknOffProps => {
  return {
    fetched: (items) => dispatch(actions.offsFetched(items)),
    updated: (item) => dispatch(actions.offUpdated(item)),
    inserted: (item) => dispatch(actions.offInserted(item)),
    filterOffs: (items) => dispatch(actions.offsFiltered(items)),
    dateFilter: (filterDates) => dispatch(actions.dateChanged(filterDates)),
  };
};

const mapStateToProps = (state: StateType): ISiknOffState => {
  return {
    ...state.siknOffs,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SiknOffContainer);
