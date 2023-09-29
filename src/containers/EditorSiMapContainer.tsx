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
  ObjectFields,
  PagedModel,
  StateType,
} from "../types";
import { EditorSiMapItem } from "../classes";
import { IEditorSiMapState, IWrittenItem } from "../interfaces";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/editorSiMap/creators";
import axios, { CancelTokenSource } from "axios";
import { EditorSiMapForm } from "../components/EditorSiMapForm";
import "../styles/app.scss";
import { apiBase } from "../utils";
import "moment/locale/ru";
import { GridApi } from "ag-grid-community";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import { GridLoading } from "../components/GridLoading";
import { ActionsEnum, Can } from "../casl";
import { EditorSiElements, elementId } from "../pages/EditorSiPage/constant";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ReloadOutlined } from "@ant-design/icons";

interface IMappedDispatchesToEditorSiMapProps {
  fetched: (items: PagedModel<EditorSiMapItem>) => void;
  filtered: (items: Array<EditorSiMapItem>) => void;
  updated: (items: IWrittenItem<EditorSiMapItem> | null) => void;
  inserted: (items: EditorSiMapItem | null) => void;
}

interface IEditorSiMapContainerState {
  addModalVisible: boolean;
  editModalVisible: boolean;
  archiveFilter: boolean;
  loading: boolean;
}

let source: CancelTokenSource;

type EditorSiMapContainerProps = IEditorSiMapState &
  IMappedDispatchesToEditorSiMapProps;

class EditorSiMapContainer extends Component<
  EditorSiMapContainerProps,
  IEditorSiMapContainerState
> {
  private baseObj: string = `/SiEquipmentBindings`;
  private baseUrl: string = `${apiBase}/${this.baseObj}`;

  private url(page: number): string {
    let nodeType = this.props.node?.type;
    return `${apiBase}/${nodeType + "/" + this.props.node?.key + "/"}${
      this.baseObj
    }?page=${page}`;
  }
  private gridApi: GridApi;

  constructor(props: EditorSiMapContainerProps) {
    super(props);
    this.state = {
      addModalVisible: false,
      editModalVisible: false,
      archiveFilter: false,
      loading: false,
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
    const e: PagedModel<EditorSiMapItem> = {
      entities: [],
      pageInfo: pageInfo,
    };
    if (source) {
      source.cancel("Cancel previous request");
    }
    source = axios.CancelToken.source();
    this.setState({ loading: true });
    axios
      .post<PagedModel<EditorSiMapItem>>(this.url(page), filtersModel, {
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

  selectionHandler(item: EditorSiMapItem) {
    this.props.updated({
      old: item,
      new: null,
    });
  }

  updateHandler(item: EditorSiMapItem) {
    return new Promise<EditorSiMapItem>((resolve, reject) => {
      if (this.props.writtenItem !== null) {
        this.props.updated({
          old: this.props.writtenItem.old,
          new: item,
        });
      }
      axios
        .put(`${this.baseUrl}/${item.id}`, item)
        .then((result) => {
          if (result.data.success) {
            this.fetchItems(this.props.items.pageInfo.pageNumber);
            this.props.updated(null);
            this.setState({ editModalVisible: false });
            message.success("Данные успешно обновлены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => console.log(err));
    });
  }

  insertHandler(item: EditorSiMapItem) {
    return new Promise<EditorSiMapItem>((resolve, reject) => {
      this.props.inserted(item);
      axios
        .post(this.baseUrl, item)
        .then((result) => {
          this.props.inserted(null);
          if (result.data.success) {
            this.fetchItems(this.props.items.pageInfo.pageNumber);
            this.setState({ addModalVisible: false });
            message.success("Данные успешно сохранены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => reject(err));
    });
  }

  filterItems(items: Array<EditorSiMapItem>) {
    const archiveFunc = (x: EditorSiMapItem) =>
      !this.props.archiveFilter ? !x.isArchival : true;

    const filteredItems = items.filter((x) => archiveFunc(x));
    this.props.filtered(filteredItems);
  }
  componentDidUpdate(prevProps: Readonly<EditorSiMapContainerProps>) {
    if (
      prevProps.node !== this.props.node ||
      prevProps.ownedFilter !== this.props.ownedFilter ||
      prevProps.archiveFilter !== this.props.archiveFilter
    ) {
      this.fetchItems(1);
    }
  }

  render(): JSX.Element {
    const { entities, pageInfo } = this.props.items;
    return (
      <TableBlockWrapperStyled>
        <Card>
          <Row justify="space-between" gutter={24}>
            <Col>
              <Can
                I={ActionsEnum.View}
                a={elementId(EditorSiElements[EditorSiElements.SiBindingAdd])}
              >
                <Tooltip
                  title={
                    "Выберите технологическую позицию в дереве, что бы создать связь"
                  }
                >
                  <Button
                    type={"link"}
                    icon={<PlusCircleFilled />}
                    onClick={() => this.setState({ addModalVisible: true })}
                    disabled={
                      !this.props.node ||
                      (this.props.node.type !== "techpositions" &&
                        !this.props.node.isSiType)
                    }
                    hidden={this.props.viewName === "sp_SiknSiTree"}
                    style={{ width: "100%" }}
                  >
                    Создать новую связь
                  </Button>
                </Tooltip>
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
          <ItemsTable<EditorSiMapItem>
            items={entities}
            fields={new ObjectFields(EditorSiMapItem).getFields()}
            hiddenColumns={[
              "id",
              "siknFullName",
              "siId",
              "techPosId",
              "effectiveFor",
            ]}
            setApiCallback={this.setApi}
            actionColumns={[
              {
                headerName: "",
                pinned: "right",
                cellRenderer: "siBindingEditActionsRenderer",
                minWidth: 75,
                cellRendererParams: {
                  clicked: (data: EditorSiMapItem) => {
                    this.selectionHandler(data);
                    this.setState({ editModalVisible: true });
                  },
                  flagSelector: (data: EditorSiMapItem) =>
                    data.effectiveFor !== null &&
                    data.effectiveFor < new Date(),
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
          visible={this.state.addModalVisible}
          title={`Создание связи`}
          destroyOnClose
          footer={null}
          width={"90%"}
          onCancel={() => {
            this.setState({ addModalVisible: false });
          }}
        >
          {this.props.node && (
            <EditorSiMapForm
              submitCallback={this.insertHandler}
              node={this.props.node}
            />
          )}
        </AntModal>
        <AntModal
          maskClosable={false}
          visible={this.state.editModalVisible}
          title={`Редактирование связи`}
          destroyOnClose
          footer={null}
          width={"90%"}
          onCancel={() => {
            this.setState({ editModalVisible: false });
          }}
        >
          {this.props.node && (
            <EditorSiMapForm
              initial={this.props.writtenItem?.old}
              submitCallback={this.updateHandler}
              node={this.props.node}
            />
          )}
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
): IMappedDispatchesToEditorSiMapProps => {
  return {
    fetched: (items) => dispatch(actions.editorSiMapFetched(items)),
    filtered: (items) => dispatch(actions.editorSiMapFiltered(items)),
    updated: (item) => dispatch(actions.editorSiMapUpdated(item)),
    inserted: (item) => dispatch(actions.editorSiMapInserted(item)),
  };
};

const mapStateToProps = (state: StateType): IEditorSiMapState => {
  return {
    ...state.editorSiMap,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorSiMapContainer);
