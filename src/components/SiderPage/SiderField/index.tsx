import React, { FC, isValidElement } from "react";
import { Skeleton, Typography } from "antd";
import isString from "lodash/isString";

import { useSidePage } from "../SidePageProvider";
import "./styles.css";

export interface SiderFieldProps {
  name: string;
  field?: string | null | React.ReactNode;
  loading?: boolean;
  component?: React.ReactNode;
}

export const SiderField: FC<SiderFieldProps> = ({
  name,
  field = "",
  loading = false,
  component
}) => {
  const siderProps = useSidePage();

  const renderWithSkeleton = (value: string | null | React.ReactNode) =>
    loading || siderProps.loading ? (
      <Skeleton.Input active size="small" />
    ) : (
      value
    );

  const renderContent = () => {
    if (isValidElement(component)) {
      return component;
    }
    return isValidElement(field) ? (
      <div className="side-info-field__container">
        {renderWithSkeleton(field)}
      </div>
    ) : (
      renderWithSkeleton(
        <Typography.Text title={isString(field) ? field : name}>
          {field || "Н/Д"}
        </Typography.Text>
      )
    );
  };

  return (
    <div className="side-info-field">
      <Typography.Text type="secondary">{name}</Typography.Text>
      {renderContent()}
    </div>
  );
};

SiderField.displayName = "SiderField";
