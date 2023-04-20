import React, { Component } from "react";
import {
  Button,
  Modal as AntModal,
  Card,
  Col,
  Row,
  Pagination,
  message,
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
import { SiEquipment } from "../classes";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import axios, { CancelTokenSource } from "axios";
import "../styles/app.css";
import { apiBase, zeroGuid } from "../utils";
import "moment/locale/ru";
import { GridApi } from "ag-grid-community";
import { IWrittenItem, ISiEquipmentState } from "../interfaces";
import * as actions from "../actions/editorSiEquipment/creators";
import { EditorSiEqForm } from "../components/EditorSiEqForm";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import { GridLoading } from "../components/GridLoading";
import { history } from "../history/history";
import { ActionsEnum, Can } from "../casl";
import { EditorSiElements, elementId } from "../pages/EditorSiPage/constant";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ReloadOutlined } from "@ant-design/icons";
import moment from "moment";

interface IMappedDispatchesToSiEquipmentProps {
  fetched: (items: PagedModel<SiEquipment>) => void;
  filtered: (items: Array<SiEquipment>) => void;
  updated: (items: IWrittenItem<SiEquipment> | null) => void;
  inserted: (items: SiEquipment | null) => void;
}

interface SiEquipmentContainerState {
  addModalVisible: boolean;
  editModalVisible: boolean;
  archiveFilter: boolean;
  loading: boolean;
  siId: IdType;
}

let source: CancelTokenSource;
type SiEquipmentContainerProps = ISiEquipmentState &
  IMappedDispatchesToSiEquipmentProps & { siEq?: SiEquipment[] };

class SiEquipmentContainer extends Component<
  SiEquipmentContainerProps,
  SiEquipmentContainerState
> {
  private baseObj: string = `SiEquipments`;
  private baseUrl: string = `${apiBase}/${this.baseObj}`;

  private url(page: number): string {
    let nodeType = this.props.node?.type;
    return `${apiBase}/${nodeType + "/" + this.props.node?.key + "/"}${
      this.baseObj
    }?page=${page}`;
  }

  private gridApi: GridApi;

  constructor(props: SiEquipmentContainerProps) {
    super(props);
    this.state = {
      addModalVisible: false,
      editModalVisible: false,
      archiveFilter: false,
      loading: false,
      siId: zeroGuid,
    };
    this.selectionHandler = this.selectionHandler.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
    this.insertHandler = this.insertHandler.bind(this);
    this.setApi = this.setApi.bind(this);
  }

  setApi(api: GridApi) {
    this.gridApi = api;
  }

  fetchItems(page: number) {
    if (!this.props.node) return;

    const filtersModel: FiltersModel = {
      owned: this.props.ownedFilter,
      editorSiFilter: {
        archiveFilter: this.props.archiveFilter,
      },
    };
    const pageInfo = {
      pageNumber: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
    };
    const e: PagedModel<SiEquipment> = {
      entities: [],
      pageInfo: pageInfo,
    };
    if (source) {
      source.cancel("Cancel previous request");
    }
    source = axios.CancelToken.source();
    this.setState({ loading: true });
    axios
      .post<PagedModel<SiEquipment>>(this.url(page), filtersModel, {
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

  selectionHandler(item: SiEquipment) {
    this.props.updated({
      old: item,
      new: null,
    });
  }

  updateHandler(item: SiEquipment) {
    return new Promise<SiEquipment>((resolve, reject) => {
      if (this.props.writtenItem !== null) {
        this.props.updated({
          old: this.props.writtenItem.old,
          new: item,
        });
      }
      axios
        .put(`${this.baseUrl}/${item.id}`, item)
        .then((result) => {
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

  insertHandler(item: SiEquipment) {
    return new Promise<SiEquipment>((resolve, reject) => {
      this.props.inserted(item);
      axios
        .post(this.baseUrl, item)
        .then((result) => {
          this.props.inserted(null);
          if (result.data.success) {
            this.setState({ addModalVisible: false });
            message.success("Данные успешно сохранены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => reject(err));
    });
  }

  filterItems(items: Array<SiEquipment>) {
    const archiveFunc = (x: SiEquipment) =>
      !this.props.archiveFilter ? !x.isArchival : true;

    const filteredItems = items.filter((x) => archiveFunc(x));
    this.props.filtered(filteredItems);
  }

  componentDidUpdate(prevProps: Readonly<SiEquipmentContainerProps>) {
    if (
      prevProps.node !== this.props.node ||
      prevProps.ownedFilter !== this.props.ownedFilter ||
      prevProps.archiveFilter !== this.props.archiveFilter
    ) {
      if (this.props.siEq) {
        history.push("/editorsi", undefined);
      }
      this.fetchItems(1);
    }
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
                a={elementId(EditorSiElements[EditorSiElements.SiAdd])}
              >
                <Button
                  type={"link"}
                  icon={<PlusCircleFilled />}
                  onClick={() => this.setState({ addModalVisible: true })}
                >
                  Создать новое СИ
                </Button>
              </Can>
            </Col>
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
          <ItemsTable<SiEquipment>
            items={this.props.siEq ?? entities}
            fields={new ObjectFields(SiEquipment).getFields()}
            hiddenColumns={[
              "id",
              "siTypeId",
              "siModelId",
              "techPositionId",
              "techPositionName",
              "siknId",
              "siknFullName",
              "siCompName",
              "factDateKmh",
              "planDateKmh",
              "factDateValid",
              "planDateValid",
              "factDateTo3",
              "planDateTo3",
              "ostId",
              "installYear",
              "installDate",
              "manufYearDate",
            ]}
            setApiCallback={this.setApi}
            selectionCallback={this.selectionHandler}
            actionColumns={[
              {
                headerName: "",
                pinned: "right",
                cellRenderer: "siEditActionsRenderer",
                minWidth: 75,
                cellRendererParams: {
                  clicked: (data: SiEquipment) => {
                    this.selectionHandler(data);
                    this.setState({ editModalVisible: true, siId: data.id });
                  },
                  flagSelector: (item: SiEquipment) => item.isArchival,
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
          width={"1000px"}
          visible={this.state.addModalVisible}
          title={"Создание СИ"}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ addModalVisible: false });
          }}
        >
          <EditorSiEqForm
            submitCallback={this.insertHandler}
            siId={this.state.siId}
          />
        </AntModal>
        <AntModal
          maskClosable={false}
          width={"1000px"}
          visible={this.state.editModalVisible}
          title={"Редактирование CИ"}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ editModalVisible: false });
          }}
        >
          <EditorSiEqForm
            initial={this.props.writtenItem?.old}
            submitCallback={this.updateHandler}
            siId={this.state.siId}
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
): IMappedDispatchesToSiEquipmentProps => {
  return {
    fetched: (items) => dispatch(actions.editorSiEqFetched(items)),
    filtered: (items) => dispatch(actions.editorSiEqFiltered(items)),
    updated: (item) => dispatch(actions.editorSiEqUpdated(item)),
    inserted: (item) => dispatch(actions.editorSiEqInserted(item)),
  };
};

const mapStateToProps = (state: StateType): ISiEquipmentState => {
  return {
    ...state.editorSiEq,
  };
};

function dateFormatter(param) {
  return moment(param.value).format("DD.MM.YYYY");
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiEquipmentContainer);
