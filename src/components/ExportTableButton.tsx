import React, { Component } from "react";
import { Button, Dropdown, Menu } from "antd";
import ExportOutlined from "@ant-design/icons/ExportOutlined";
import DownOutlined from "@ant-design/icons/DownOutlined";
import { GridApi } from "ag-grid-community";
import { FiltersModel, NodeType } from "../types";
import { IEntity, ListFilterBase } from "../interfaces";
import { tuple } from "antd/lib/_util/type";
import { apiBase, asciiToUint8Array } from "utils";

interface IExportTableButtonProps {
  baseUrl: string;
  api: GridApi;
  pageRouteName: string;
  nodeId: string;
  nodeType: NodeType;
  getFilter: () => ListFilterBase | FiltersModel;
  isHiddenCaseOne?: boolean;
  isHiddenCaseTwo?: boolean;
}

interface IExportTableButtonState {
  loadings: boolean;
}

export class ExportTableButton<T extends IEntity> extends Component<
  IExportTableButtonProps,
  IExportTableButtonState
> {
  constructor(props: IExportTableButtonProps) {
    super(props);
    this.state = {
      loadings: false,
    };
    this.getItems = this.getItems.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  async getItems(option: string): Promise<T[]> {
    switch (option) {
      case "1":
        let result: T[] = [];
        this.props.api.forEachNodeAfterFilterAndSort((row) =>
          result.push(row.data as T)
        );
        return result;
      case "2":
        return [];
    }
    return [];
  }

  async clickHandler(option: string) {
    if (this.props.api === undefined) return;

    await this.setState({ loadings: true });

    let items: T[] = [];
    if (option == "1") {
      this.props.api.forEachNodeAfterFilterAndSort((row) =>
        items.push(row.data as T)
      );
    }
    var url = option == "1" ? this.props.baseUrl + "/export" : `${apiBase}/export`;
    let fileName: string = "download.xlsx";
    fetch(url, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:
        option == "1"
          ? JSON.stringify(items)
          : JSON.stringify({
              pageName: this.props.pageRouteName,
              nodeTreeId: this.props.nodeId,
              nodeTreeType: this.props.nodeType,
              filtersModel: this.props.getFilter(),
            }),
    })
      .then((response) => {
        if (response.ok) {
          let fileNameHeader = response.headers.get("FileName");
          if (fileNameHeader !== null && fileNameHeader !== undefined) {
            let headerSplit = fileNameHeader.split(";");
            if (headerSplit.length > 0) {
              let asciiFile = headerSplit[0];
              let code = asciiToUint8Array(asciiFile);
              fileName = new TextDecoder().decode(code);
            }
          }
          return response.blob();
        }
        this.setState({ loadings: false });
        return;
      })
      .then((blob: Blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        this.setState({ loadings: false });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loadings: false });
      });
  }

  render() {
    const onMenuClick = async (obj: { key: number | string }) => {
      let option = obj.key as string;
      await this.clickHandler(option);
    };

    const menu = (
      <Menu onClick={onMenuClick}>
        <Menu.Item key="1" hidden={this.props.isHiddenCaseOne}>
          Экспорт текущей страницы с учетом фильтров в шапке таблицы
        </Menu.Item>
        <Menu.Item key="2" hidden={this.props.isHiddenCaseTwo}>
          Экспорт всех страниц без учёта фильтров в шапке таблицы
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          type="link"
          loading={this.state.loadings}
          icon={<ExportOutlined />}
        >
          Экспортировать <DownOutlined />
        </Button>
      </Dropdown>
    );
  }
}
