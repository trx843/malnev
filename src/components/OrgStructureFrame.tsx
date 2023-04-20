import { Layout, message, PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import axios from "axios";
import React, { Component, createElement } from "react";
import { RouteComponentProps } from "react-router-dom";
import { OrgStructureLink } from "../classes/OrgStructInformation";
import { history } from "../history/history";
import { IFrameParams, IFrameState } from "../interfaces";
import { apiBase, config } from "../utils";

const frameMap = new Map(Object.entries(config.frame));

export class OrgStructureFrame extends Component<
  RouteComponentProps<IFrameParams>,
  IFrameState
> {
  private frameRoating: Map<string, string>;

  constructor(props: RouteComponentProps<IFrameParams>) {
    super(props);
    this.frameRoating = new Map<string, string>();
    this.state = {
      mapping: new Map<string, string>(),
    };
  }

  componentDidMount() {
    axios
      .get<Array<OrgStructureLink>>(`${apiBase}/OrgStructureLinks`)
      .then((result) => {
        for (var i = 0; i < result.data.length; i++) {
          let link = result.data[i];
          let linkPrefix = frameMap.get(link.name as string);
          let url = `${frameMap.get(link.name as string)}${
            link.linkTypeId === 2 ? link.link : link.serviceField
          }`;

          switch (link.name) {
            case "piVision":
              url += "?hidesidebar";
              break;

            default:
              break;
          }

          if (linkPrefix) {
            this.frameRoating.set("/orgstructure/" + link.link, url);
          } else {
            message.error(
              `Ошибка конфигурации приложения. Проверьте конфигурационный файл.`
            );
            history.push("/");
            break;
          }
        }
        this.setState({ mapping: this.frameRoating });
        let src = this.frameRoating.get(
          this.props.location.pathname + this.props.location.search
        );
        if (!src) {
          message.error(
            `Ошибка загрузки формы. Идет перенаправление на главную страницу.`
          );
          history.push("/");
        }
      });
  }

  render(): JSX.Element {
    return (
      <Layout className="layout">
        <Content>
          <iframe
            id="ifr"
            style={{ width: "100%", height: "calc(100vh - 125px)" }}
            src={this.state.mapping.get(
              this.props.location.pathname + this.props.location.search
            )}
          />
        </Content>
      </Layout>
    );
  }
}
