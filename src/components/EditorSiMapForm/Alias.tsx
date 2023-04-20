import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import { Button, Col, Row, Tooltip } from "antd";
import { EditorSiMapItem } from "classes/EditorSiMapItem";
import { FieldArray } from "formik";
import { FormItem, Input, Switch } from "formik-antd";
import { FC } from "react";

type PropsType = {
  values: EditorSiMapItem;
};

export const Alias: FC<PropsType> = ({ values }) => {
  let color = values.needToSaveSiDescription ? "#1890FF" : "";

  return (
    <div>
      <Row align="middle">
        <Col style={{ height: "32px" }}>
          <FormItem
            name={"needToSaveSiDescription"}
            key={"needToSaveSiDescription"}
          >
            <Switch name={"needToSaveSiDescription"} />
          </FormItem>
        </Col>

        <Col style={{ marginLeft: "15px" }}>
          <span
            style={{
              color: color,
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "20.8px",
            }}
          >
            Привязать псевдоним
          </span>
        </Col>
      </Row>

      <FieldArray
        name="siDecriptionList"
        render={(arrayHelpers) => (
          <div
            style={{
              width: "100%",
              marginTop: "15px",
              maxHeight: "450px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {values.siDecriptionList.map((item, index) => {
              if (values.siDecriptionList.length - 1 === index) {
                return (
                  <Row justify="space-between" key={index}>
                    <Col span={18}>
                      <FormItem name={`siDecriptionList.${index}`}>
                        <Input
                          name={`siDecriptionList.${index}`}
                          style={{ height: "40px" }}
                          disabled={!values.needToSaveSiDescription}
                        />
                      </FormItem>
                    </Col>

                    <Col span={2} offset={1}>
                      <Tooltip title="Удалить псевдоним">
                        <Button
                          type={"link"}
                          icon={<DeleteOutlined />}
                          size="large"
                          danger
                          onClick={() => arrayHelpers.remove(index)}
                          disabled={!values.needToSaveSiDescription}
                        />
                      </Tooltip>
                    </Col>

                    <Col span={2} offset={1}>
                      <Tooltip title="Добавить псевдоним">
                        <Button
                          type={"link"}
                          icon={<PlusCircleFilled />}
                          size="large"
                          onClick={() => arrayHelpers.push("")}
                          disabled={!values.needToSaveSiDescription}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                );
              } else {
                return (
                  <Row key={index}>
                    <Col span={18}>
                      <FormItem name={`siDecriptionList.${index}`}>
                        <Input
                          name={`siDecriptionList.${index}`}
                          style={{ height: "40px" }}
                          disabled={!values.needToSaveSiDescription}
                        />
                      </FormItem>
                    </Col>

                    <Col span={2} offset={1}>
                      <Tooltip title="Удалить псевдоним">
                        <Button
                          type={"link"}
                          icon={<DeleteOutlined />}
                          size="large"
                          danger
                          onClick={() => arrayHelpers.remove(index)}
                          disabled={!values.needToSaveSiDescription}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                );
              }
            })}
          </div>
        )}
      />
    </div>
  );
};
