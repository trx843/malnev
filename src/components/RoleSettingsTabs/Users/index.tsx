import React, { FC } from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { LayoutStyled, TableBlockStyled } from "./styled";
import { AgGridTable } from "components/AgGridTable";
import { AgGridColumn } from "ag-grid-react";
import styles from "./users.module.css";
import classNames from "classnames/bind";
import { Button, Card, Col, Row } from "antd";
import { ExportOutlined } from "@ant-design/icons";

const cx = classNames.bind(styles);

type PropsType = {
  rowData: Array<object>;
  exportUsersHandler: () => void;
  exportUsersLoading: boolean;
};

export const UsersTab: FC<PropsType> = React.memo(
  ({ rowData, exportUsersHandler, exportUsersLoading }) => {
    return (
      <LayoutStyled>
        <Card>
          <Row wrap={false} justify={"end"}>
            <Col>
              <Button
                type={"link"}
                icon={<ExportOutlined />}
                onClick={exportUsersHandler}
                disabled={exportUsersLoading}
                loading={exportUsersLoading}
              >
                Экспортировать
              </Button>
            </Col>
          </Row>
        </Card>
        <TableBlockStyled className="ag-theme-alpine">
          <AgGridTable
            rowData={rowData}
            rowHeight={100}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              wrapText: true,
            }}
            isAutoSizeColumns={false}
          >
            <AgGridColumn
              headerName="Пользователь"
              field="fullLogin"
              minWidth={150}
            />
            <AgGridColumn
              headerName="Роли"
              field="rolesMap"
              cellClass={cx("action-text-wrapper")}
              cellRendererFramework={(props) => (
                <div className={cx("action-text")}>{props.value}</div>
              )}
              minWidth={150}
            />
            <AgGridColumn
              headerName="Описание ролей"
              field="rolesDescrMap"
              cellClass={cx("action-text-wrapper")}
              cellRendererFramework={(props) => (
                <div className={cx("action-text")}>{props.value}</div>
              )}
              minWidth={150}
            />
            <AgGridColumn
              headerName="Группы орг. структур"
              field="orgGroupsMap"
              cellClass={cx("action-text-wrapper")}
              cellRendererFramework={(props) => (
                <div className={cx("action-text")}>{props.value}</div>
              )}
              minWidth={150}
            />
             <AgGridColumn
              headerName="Описание орг.структур"
              field="orgGroupsDescrMap"
              cellClass={cx("action-text-wrapper")}
              cellRendererFramework={(props) => (
                <div className={cx("action-text")}>{props.value}</div>
              )}
              minWidth={150}
            />
            <AgGridColumn
              headerName="Персональные настройки"
              field="useCtrlPersonalNotificationsText"
              minWidth={150}
            />
            <AgGridColumn
              headerName="Типы событий"
              field="eventTypes"
              cellClass={cx("action-text-wrapper")}
              cellRendererFramework={(props) => (
                <div className={cx("action-text")}>{props.value}</div>
              )}
              minWidth={150}
            />
            <AgGridColumn
              headerName="Персональные настройки надзора"
              field="useCtrlPersonalNotificationsText"
              minWidth={150}
            />
            <AgGridColumn
              headerName="Типы событий надзора"
              field="ctrlEventTypes"
              cellClass={cx("action-text-wrapper")}
              cellRendererFramework={(props) => (
                <div className={cx("action-text")}>{props.value}</div>
              )}
              minWidth={150}
            />
          </AgGridTable>
        </TableBlockStyled>
      </LayoutStyled>
    );
  }
);
