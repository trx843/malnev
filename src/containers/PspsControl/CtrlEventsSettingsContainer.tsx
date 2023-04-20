import { Component } from "react";
import { CtrlEventSettingsState } from "../../interfaces";
import { apiBase } from "../../utils";
import axios from "axios";
import { ItemsTable } from "../../components/ItemsTable";
import { ActionTypes, ObjectFields, StateType } from "../../types";
import { Button, Card, Col, message, Modal, Row, Space } from "antd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../../actions/ctrleventsettings/creators";
import { UsersEventTypes } from "../../classes/UsersEventTypes";
import { GridApi } from "ag-grid-community";
import { User } from "../../classes";
import { TableBlockWrapperStyled } from "../../styles/commonStyledComponents";

interface IMappedDispatchesToEventSettingsProps {
  fillTable: (items: Array<UsersEventTypes>) => void;
  disableBtn: (status: boolean) => void;
  reload: (reset: boolean) => void;
  resetBtnStatus: (status: boolean) => void;
}

interface IEventSettingsContainerState {
  saveModalVisible: boolean;
  insertItems: Array<UsersEventTypes>;
  confirmLoading: boolean;
}

type EventSettingsContainerProps = CtrlEventSettingsState &
  IMappedDispatchesToEventSettingsProps;

class CtrlEventsSettingsContainer extends Component<
  EventSettingsContainerProps,
  IEventSettingsContainerState
> {
  private baseUrl: string = `${apiBase}/UsersCtrlEventTypes`;

  private currentUser = JSON.parse(
    localStorage.getItem("userContext") as string
  ) as User;

  private gridApi: GridApi;

  constructor(props: EventSettingsContainerProps) {
    super(props);
    this.state = {
      saveModalVisible: false,
      insertItems: [],
      confirmLoading: false,
    };

    this.insertHandler = this.insertHandler.bind(this);
    this.setApi = this.setApi.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  setApi(api: GridApi) {
    this.gridApi = api;
  }

  insertHandler = () => {
    let tableData: UsersEventTypes[] = [];
    this.gridApi.forEachNode((row, _i) => {
      tableData.push(row.data as UsersEventTypes);
    });
    return new Promise<UsersEventTypes>((resolve, reject) => {
      axios
        .put(`${this.baseUrl}/${this.currentUser.id}`, tableData)
        .then((result) => {
          if (result.data.success) {
            resolve(result.data);
            message.success("Данные успешно сохранены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => reject(err));
    });
  };

  resetHandler = () => {
    return new Promise<UsersEventTypes>((resolve, reject) => {
      axios
        .post(`${this.baseUrl}/${this.currentUser.id}`)
        .then((result) => {
          if (result.data.success) {
            resolve(result.data);
            message.success("Данные успешно сброшены!");
          } else {
            reject(result.data.message);
          }
        })
        .catch((err) => reject(err));
    });
  };

  confirm = () => {
    let self = this;
    Modal.confirm({
      title: "Вы уверены, что хотите сохранить изменения?",
      okText: "Сохранить",
      cancelText: "Отменить",
      onOk() {
        return self.insertHandler().then(() => {
          self.props.disableBtn(true);
          self.props.resetBtnStatus(false);
        });
      },
    });
  };

  confirmReset = () => {
    let self = this;
    Modal.confirm({
      title: "Вы уверены, что хотите вернуться к настройкам по умолчанию?",
      okText: "Да",
      cancelText: "Отменить",
      onOk() {
        return self.resetHandler().then(() => {
          self.props.disableBtn(true);
          self.props.resetBtnStatus(true);
          self.props.reload(!self.props.resetToAdmin);
        });
      },
    });
  };

  render() {
    return (
      <TableBlockWrapperStyled>
        <Card>
          <Row wrap={false} justify={"space-between"}>
            <Col>
              <Button
                disabled={this.props.saveBtnDisabled}
                onClick={() => this.confirm()}
                type="primary"
              >
                Сохранить
              </Button>
            </Col>

            <Col>
              <Button
                disabled={this.props.resetToAdminBtnStatus}
                onClick={() => this.confirmReset()}
              >
                Сбросить до настроек по умолчанию
              </Button>
            </Col>
          </Row>
        </Card>
        <ItemsTable<UsersEventTypes>
          items={this.props.tableItems}
          fields={new ObjectFields(UsersEventTypes).getFields()}
          hiddenColumns={[
            "id",
            "userId",
            "eventTypeId",
            "siknList",
            "webNotificationFlag",
            "mailNotificationFlag",
          ]}
          actionColumns={[
            {
              headerName: "Уведомления на портале",
              headerComponent: "ctrlwebCheckBoxHeader",
              cellRenderer: "ctrlwebCheckboxRenderer",
              minWidth: 300,
              headerComponentParams: {
                clicked: (checked: boolean) => {
                  this.props.tableItems.forEach(
                    (x) => (x.webNotificationFlag = checked)
                  );
                  this.props.fillTable(this.props.tableItems);
                },
              },
            },
            {
              headerName: "Уведомления по почте",
              headerComponent: "ctrlmailCheckBoxHeader",
              cellRenderer: "ctrlmailCheckboxRenderer",
              minWidth: 300,
              headerComponentParams: {
                clicked: (checked: boolean) => {
                  this.props.tableItems.forEach(
                    (x) => (x.mailNotificationFlag = checked)
                  );
                  this.props.fillTable(this.props.tableItems);
                },
              },
            },
          ]}
          setApiCallback={this.setApi}
        />
      </TableBlockWrapperStyled>
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<ActionTypes<typeof actions>>
): IMappedDispatchesToEventSettingsProps => {
  return {
    fillTable: (item) => dispatch(actions.ctrleventSettingsFillTable(item)),
    disableBtn: (status) => dispatch(actions.ctrleventSettingsBtnDisabled(status)),
    reload: (reset) => dispatch(actions.ctrlresetToAdmin(reset)),
    resetBtnStatus: (status) =>
      dispatch(actions.ctrlresetToAdminBtnDisabled(status)),
  };
};

const mapStateToProps = (state: StateType): CtrlEventSettingsState => {
  return {
    ...state.ctrleventSettings,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CtrlEventsSettingsContainer);
