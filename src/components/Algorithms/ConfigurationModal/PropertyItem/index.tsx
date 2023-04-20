import {
  FileSearchOutlined,
  MenuOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Row } from "antd";
import { isArray } from "lodash";
import React, { FC } from "react";
import { AlgConfigurationProperty } from "../../../../api/responses/get-alg-configuration.response";

interface IProps {
  handleIconClick: (item: AlgConfigurationProperty, type: string) => void;
  property: AlgConfigurationProperty;
}

const returnConvertedValue = (
  property: AlgConfigurationProperty,
  handleIconClick: (item: AlgConfigurationProperty, type: string) => void
) => {
  const { value } = property;

  if (value === null) {
    return "";
  }
  const valueType = typeof value;

  if (valueType === "boolean") {
    return value ? "Да" : "Нет";
  }

  if (isArray(property.value)) {
    return (
      <Button
        type="link"
        icon={<MenuOutlined />}
        onClick={() => handleIconClick(property, "array")}
      />
    );
  }

  if (property.value?.head) {
    return (
      <Button
        type="link"
        icon={<TableOutlined />}
        onClick={() => handleIconClick(property, "table")}
      />
    );
  }

  if (valueType === "object") {
    return (
      <Button
        type="link"
        icon={<FileSearchOutlined />}
        onClick={() => handleIconClick(property, "object")}
      />
    );
  }

  return value;
};

export const PropertyItem: FC<IProps> = ({ handleIconClick, property }) => {
  return (
    <div>
      <Row>
        <Col span={12}>{property.displayName}</Col>
        <Col span={12}>{returnConvertedValue(property, handleIconClick)}</Col>
      </Row>
      <Divider />
    </div>
  );
};
