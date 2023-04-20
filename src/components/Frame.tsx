import axios from "axios";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { IFrameParams, IFrameState, IMenuNav } from "../interfaces";
import { apiBase, config } from "../utils";

const frameMap = new Map(Object.entries(config.frame));
export class Frame extends Component<
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
    axios.get<Array<IMenuNav>>(`${apiBase}/frame`).then((result) => {
      result.data.map((frame) => {
        let url = `${frameMap.get(frame.linkType as string)}${frame.link}`;

        switch (frame.linkType) {
          case "report":
            url += "?rs:embed=true";
            break;

          case "piVision":
            url += "?hidesidebar";
            break;

          default:
            break;
        }

        this.frameRoating.set(
          frame.route,
          url

          // frame.route,
          // frame.linkType == "report"
          //   ? `${frameMap.get(frame.linkType as string)}${
          //       frame.link
          //     }?rs:embed=true`
          //   : `${frameMap.get(frame.linkType as string)}${
          //       frame.link
          //     }?hidetoolbar&hidesidebar`
        );
      });
      this.setState({ mapping: this.frameRoating });
    });
  }

  render(): JSX.Element {
    return (
      <iframe
        id="ifr"
        style={{ width: "100%", height: "calc(100vh - 125px)" }}
        src={this.state.mapping.get(
          `/frame/${this.props.match.params.frameName}`
        )}
      ></iframe>
    );
  }
}
