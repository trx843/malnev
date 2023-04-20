import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import "antd/dist/antd.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store";
import { history } from "./history/history";
import App from "./App";
import axios from "axios";
import { TimeSpan, User } from "./classes";
import { apiBase } from "./utils";
import { Col, Result, Row, Skeleton, Spin } from "antd";
import qs from "qs";
import dayjs from "dayjs";
import { join } from "lodash";
import { ResultStatusType } from "antd/lib/result";
import { BrowserRouter } from "react-router-dom";
// https://mariusschulz.com/blog/deserializing-json-strings-as-javascript-date-objects
// https://github.com/axios/axios#interceptors
// настройка десериализации дат вида "2020-05-10T00:00:00" в объект Date
axios.interceptors.response.use((response) => {
  if (response.config['isDeserializingDisabled']) return response

  const dataStr = JSON.stringify(response.data);

  const dateFormat1 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z?)$/;
  const dateFormat2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}(Z?)$/;

  const reviver = (_key: string, value: any) => {
    if (
      typeof value === "string" &&
      (dateFormat1.test(value) || dateFormat2.test(value))
    ) {
      return new Date(value);
    }
    if (value !== null) {
      if (typeof value === "object" && TimeSpan.intanceOf(value, TimeSpan)) {
        return TimeSpan.fromObject(value, TimeSpan);
      }
    }
    return value;
  };
  response.data = JSON.parse(dataStr, reviver);
  return response;
});

axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  config.paramsSerializer = (params) =>
    qs.stringify(params, {
      serializeDate: (date: Date) => dayjs(date).format("YYYY-MM-DDTHH:mm:ssZ"),
    });
  return config;
});

const root = document.querySelector("#root");

function render(): void {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    root
  );
}

if (module.hot) {
  module.hot.accept("./App");
}

render();
