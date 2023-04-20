import React, { Component } from "react";
import { IGroupEventSettingsState } from "../interfaces";
import { apiBase } from "../utils";
import axios from "axios";
import { ItemsTable } from "../components/ItemsTable";
import { ActionTypes, ObjectFields, StateType } from "../types";
import { Button, Card, Col, message, Modal, Row, Space } from "antd";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "../actions/groupeventsettings/creators";
import { GroupsEventTypes } from "../classes/GroupsEventTypes";
import { GridApi } from "ag-grid-community";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";

interface IMappedDispatchesToGroupEventSettingsProps {
  fillTable: (items: Array<GroupsEventTypes>) => void;
  disableBtn: (status: boolean) => void;
}

interface IGroupEventSettingsContainerState {
  saveModalVisible: boolean;
  insertItems: Array<GroupsEventTypes>;
  confirmLoading: boolean;
}

type GroupEventSettingsContainerProps = IGroupEventSettingsState &
  IMappedDispatchesToGroupEventSettingsProps;

class GroupEventSettingsContainer extends Component<
  GroupEventSettingsContainerProps,
  IGroupEventSettingsContainerState
> {
  private baseUrl: string = `${apiBase}/GroupsEventTypes`;

  private gridApi: GridApi;

  constructor(props: GroupEventSettingsContainerProps) {
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
    let tableData: GroupsEventTypes[] = [];
    this.gridApi.forEachNode((row, _i) => {
      tableData.push(row.data as GroupsEventTypes);
    });
    console.log(tableData);
    return new Promise<GroupsEventTypes>((resolve, reject) => {
      axios
        .put(`${this.baseUrl}/${this.props.currentGroup}`, tableData)
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

  confirm = () => {
    let self = this;
    Modal.confirm({
      title: "Вы уверены, что хотите сохранить изменения?",
      okText: "Сохранить",
      cancelText: "Отменить",
      onOk() {
        return self.insertHandler().then(() => {
          self.props.disableBtn(true);
        });
      },
    });
  };

  render() {
    return (
      <TableBlockWrapperStyled>
        <Card>
          <Row wrap={false} justify={"end"}>
            <Col>
              <Button
                disabled={this.props.saveBtnDisabled}
                onClick={() => this.confirm()}
                type="primary"
              >
                Сохранить
              </Button>
            </Col>
          </Row>
        </Card>

        <ItemsTable<GroupsEventTypes>
          items={this.props.tableItems}
          fields={new ObjectFields(GroupsEventTypes).getFields()}
          hiddenColumns={[
            "id",
            "groupId",
            "eventTypeId",
            "siknList",
            "webNotificationFlag",
            "mailNotificationFlag",
          ]}
          actionColumns={[
            {
              headerName: "СИКН",
              headerComponent: "groupTreeSelectHeader",
              cellRenderer: "groupArrayRenderer",
              minWidth: 350,
              headerComponentParams: {
                clicked: (siknList: Array<string>) => {
                  this.props.tableItems.forEach((x) => (x.siknList = siknList));
                  this.props.fillTable(this.props.tableItems);
                },
              },
            },
            {
              headerName: "Уведомления на портале",
              headerComponent: "groupWebCheckBoxHeader",
              cellRenderer: "groupWebCheckboxRenderer",
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
              headerComponent: "groupMailCheckBoxHeader",
              cellRenderer: "groupMailCheckboxRenderer",
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
): IMappedDispatchesToGroupEventSettingsProps => {
  return {
    fillTable: (item) => dispatch(actions.groupEventSettingsFillTable(item)),
    disableBtn: (status) =>
      dispatch(actions.groupEventSettingsBtnDisabled(status)),
  };
};

const mapStateToProps = (state: StateType): IGroupEventSettingsState => {
  return {
    ...state.groupEventSettings,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupEventSettingsContainer);
