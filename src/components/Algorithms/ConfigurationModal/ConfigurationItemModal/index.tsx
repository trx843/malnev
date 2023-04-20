import { Collapse, Divider, Modal, Table } from "antd";
import React, { FC } from "react";
import {
  AlgConfigurationCategory,
  AlgConfigurationProperty,
} from "../../../../api/responses/get-alg-configuration.response";
import { WithLoading } from "../../../shared/WithLoading";
import { PropertyItem } from "../PropertyItem";

const { Panel } = Collapse;

export enum DataTypes {
  List = "array",
  Table = "table",
  Categories = "object",
  Empty = "",
}

interface IProps {
  isOpen: boolean;
  onCancel: () => void;
  type: DataTypes;
  property?: AlgConfigurationProperty;
}

interface ListDataProps {
  list: string[];
}

const ListData: FC<ListDataProps> = ({ list }) => (
  <div>
    {list.map((item) => (
      <div key={item}>
        <span>{item}</span>
        <Divider />
      </div>
    ))}
    <span></span>
  </div>
);

interface TableValue {
  head: string[];
  rows: string[][];
}

interface TableDataProps {
  table: TableValue;
}

const TableData: FC<TableDataProps> = ({ table }) => {
  const columns = table.head.map((item) => ({
    title: item,
    dataIndex: item,
    key: item,
  }));

  const dataSource: any[] = table.rows.map((item, index) => {
    const row: any = {
      index,
    };
    table.head.forEach((header, key) => {
      row[header] = item[key];
    });
    return row;
  });

  return <Table columns={columns} dataSource={dataSource} pagination={false} />;
};

interface ObjectDataProps {
  categories: AlgConfigurationCategory[];
}

const ObjectData: FC<ObjectDataProps> = ({ categories }) => (
  <Collapse
    defaultActiveKey={["1"]}
    style={{ maxHeight: "700px", overflowY: "scroll" }}
  >
    {categories.map((category) => (
      <Panel header={category.name} key={category.name}>
        {category.properties.map((propertyCortege) => (
          <PropertyItem property={propertyCortege} handleIconClick={() => {}} />
        ))}
      </Panel>
    ))}
  </Collapse>
);

const renderModalContent = (type: DataTypes, value: any) => {
  if (type === DataTypes.List) {
    const arr = value as string[];
    return <ListData list={arr} />;
  }

  if (type === DataTypes.Table) {
    const table = value as TableValue;
    return <TableData table={table} />;
  }

  if (type === DataTypes.Categories) {
    const categories = value?.categories as AlgConfigurationCategory[];

    if (categories) return <ObjectData categories={categories} />;
    return <div>Нет данных</div>;
  }

  return <div>Нет данных</div>;
};

export const ConfigurationInnerModal: FC<IProps> = ({
  isOpen,
  onCancel,
  type,
  property,
}) => {
  return (
    <Modal
      title="Конфигурация"
      footer=""
      destroyOnClose
      visible={isOpen}
      onCancel={onCancel}
      width={"700px"}
    >
      <WithLoading isLoading={!property}>
        {property ? renderModalContent(type, property.value) : <div />}
      </WithLoading>
    </Modal>
  );
};
