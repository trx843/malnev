import React, { Component } from "react";
import {
  Button,
  Checkbox,
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
import { SiModel } from "../classes";
import { IEditorSiModelState, IWrittenItem } from "../interfaces";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/editorSiModel/creators";
import axios, { CancelTokenSource } from "axios";
import { EditorSiModelForm } from "../components/EditorSiModelForm";
import "../styles/app.css";
import { apiBase } from "../utils";
import "moment/locale/ru";
import { GridApi } from "ag-grid-community";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import { GridLoading } from "../components/GridLoading";
import { ActionsEnum, Can } from "../casl";
import { EditorSiElements, elementId } from "../pages/EditorSiPage/constant";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";
import { ReloadOutlined } from "@ant-design/icons";

interface IMappedDispatchesToEditorSiModelProps {
  fetched: (items: PagedModel<SiModel>) => void;
  filteredItems: (items: Array<SiModel>) => void;
  updated: (items: IWrittenItem<SiModel> | null) => void;
  inserted: (items: SiModel | null) => void;
}

interface IEditorSiModelContainerState {
  addModalVisible: boolean;
  editModalVisible: boolean;
  archiveFilter: boolean;
  loading: boolean;
}

let source: CancelTokenSource;

type EditorSiModelContainerProps = IEditorSiModelState &
  IMappedDispatchesToEditorSiModelProps;

class EditorSiModelContainer extends Component<
  EditorSiModelContainerProps,
  IEditorSiModelContainerState
> {
  private baseObj: string = `/SiModels`;
  private baseUrl: string = `${apiBase}/${this.baseObj}`;

  private url(page: number): string {
    return `${apiBase}${this.baseObj}?page=${page}&isArchival=${this.props.archiveFilter}`;
  }

  private gridApi: GridApi;

  constructor(props: EditorSiModelContainerProps) {
    super(props);
    let date = new Date();
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
    const filtersModel: FiltersModel = {
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
    const e: PagedModel<SiModel> = {
      entities: [],
      pageInfo: pageInfo,
    };
    if (source) {
      source.cancel("Cancel previous request");
    }
    source = axios.CancelToken.source();
    this.setState({ loading: true });
    axios
      .post<PagedModel<SiModel>>(this.url(page), filtersModel, {
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

  selectionHandler(item: SiModel) {
    console.log(item);
    this.props.updated({
      old: item,
      new: null,
    });
  }

  updateHandler(item: SiModel) {
    return new Promise<SiModel>((resolve, reject) => {
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
              this.filterItems(data);
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

  insertHandler(item: SiModel) {
    return new Promise<SiModel>((resolve, reject) => {
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
            message.success("Данные успешно сохранены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => reject(err));
    });
  }

  filterItems(items: Array<SiModel>) {
    const archiveFunc = (x: SiModel) =>
      !this.props.archiveFilter ? !x.isArchival : true;

    const filteredItems = items.filter((x) => archiveFunc(x));
    this.props.filteredItems(filteredItems);

    // const sortByBool = (x: any, y: any) => {
    //   return x.isArchival - y.isArchival;
    // };

    // this.props.filteredItems(
    //   items.sort(sortByBool).filter((x) => archiveFunc(x))
    // );
  }

  componentDidUpdate(prevProps: Readonly<EditorSiModelContainerProps>) {
    if (prevProps.archiveFilter !== this.props.archiveFilter) {
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
                a={elementId(EditorSiElements[EditorSiElements.SiModelAdd])}
              >
                <Button
                  type={"link"}
                  icon={<PlusCircleFilled />}
                  onClick={() => this.setState({ addModalVisible: true })}
                >
                  Создать новую модель СИ
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
          <ItemsTable<SiModel>
            items={entities}
            fields={new ObjectFields(SiModel).getFields()}
            hiddenColumns={["id", "siknFullName", "siTypeId"]}
            setApiCallback={this.setApi}
            actionColumns={[
              {
                headerName: "",
                pinned: "right",
                cellRenderer: "siModelEditActionsRenderer",
                minWidth: 75,
                cellRendererParams: {
                  clicked: (data: SiModel) => {
                    this.selectionHandler(data);
                    this.setState({ editModalVisible: true });
                  },
                  flagSelector: (item: SiModel) => item.isArchival,
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
          title={`Создание новой модели СИ`}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ addModalVisible: false });
          }}
        >
          <EditorSiModelForm submitCallback={this.insertHandler} />
        </AntModal>
        <AntModal
          maskClosable={false}
          visible={this.state.editModalVisible}
          title={`Редактирование модели СИ`}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.setState({ editModalVisible: false });
          }}
        >
          <EditorSiModelForm
            initial={this.props.writtenItem?.old}
            submitCallback={this.updateHandler}
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
): IMappedDispatchesToEditorSiModelProps => {
  return {
    fetched: (items) => dispatch(actions.editorSiModelFetched(items)),
    filteredItems: (items) => dispatch(actions.editorSiModelFiltered(items)),
    updated: (item) => dispatch(actions.editorSiModelUpdated(item)),
    inserted: (item) => dispatch(actions.editorSiModelInserted(item)),
  };
};

const mapStateToProps = (state: StateType): IEditorSiModelState => {
  return {
    ...state.editorSiModel,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorSiModelContainer);
