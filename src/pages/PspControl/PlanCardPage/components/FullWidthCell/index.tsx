import { Tooltip } from "antd";
import React from "react";
import { IPlanCardActionPlanFullWidthRowViewModel } from "../../../../../slices/pspControl/planCard/types";
import "./styles.css";

interface IProps {
  data: IPlanCardActionPlanFullWidthRowViewModel;
}

export class FullWidthCell extends React.Component<IProps> {
  getReactContainerStyle() {
    return {
      display: "block",
      height: "100%",
    };
  }

  render() {
    const { _fullWidthRowName } = this.props.data;

    return (
      <div className="plan-card-page-full-width-cell">
        <Tooltip title={_fullWidthRowName}>
          <p className="plan-card-page-full-width-cell__title">
            {_fullWidthRowName}
          </p>
        </Tooltip>

      </div>
    );
  }
}
