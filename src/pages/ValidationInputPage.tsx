import React, { FunctionComponent, useEffect, useState } from "react";
import { PageHeader, Layout, DatePicker, Row, Col, Form } from "antd";
import { history } from "../history/history";
import { FilterDates, SelectedNode } from "../interfaces";
import { useDispatch } from "react-redux";
import Title from "antd/lib/typography/Title";
import RightOutlined from "@ant-design/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import locale from "antd/es/date-picker/locale/ru_RU";
import moment, { Moment } from "moment";
import { AfTree } from "../components/AfTree";
import axios from "axios";
import { apiBase } from "../utils";

const { Content, Sider } = Layout;

const { RangePicker } = DatePicker;

type InfoType = {
  node: SelectedNode;
};

export const ValidationInputPage: FunctionComponent = () => {
  const dispatch = useDispatch();

  let date = new Date();
  const [startDate, setStartDate] = useState<Date>(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(date.getFullYear(), date.getMonth() + 1, 0)
  );
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    let mInfo = info as InfoType;
    const change = mInfo.node;
    console.log(change);
    //dispatch(nodeChanged(change));
  };

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Достоверизация"
        subTitle=""
      />
      <Content>
        <Layout className="site-layout-background">
          <Sider
            width={500}
            style={{ background: "white" }}
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
          >
            <Row gutter={[16, 48]}>
              <Col span={24}>
                <div style={{ padding: 16 }}>
                  <Row
                    justify={collapsed ? "center" : "space-between"}
                    align="middle"
                  >
                    <Col style={{ display: collapsed ? "none" : "block" }}>
                      <Title level={4}>Фильтр</Title>
                    </Col>
                    <Col>
                      {React.createElement(
                        collapsed ? RightOutlined : LeftOutlined,
                        {
                          onClick: onCollapse
                        }
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form
                        layout={"vertical"}
                        style={{ display: collapsed ? "none" : "block" }}
                      >
                        <label style={{ color: "#667985" }}>Даты</label>
                        <Form.Item>
                          <RangePicker
                            locale={locale}
                            value={[moment(startDate), moment(endDate)]}
                            onChange={(
                              dates: [Moment, Moment],
                              formatString: [string, string]
                            ) => {
                              if (dates != undefined) {
                                let filterDates: FilterDates = {
                                  startDate: dates[0].toDate(),
                                  endDate: dates[1].toDate()
                                };
                                setStartDate(filterDates.startDate);
                                setEndDate(filterDates.endDate);

                                //dispatch(dateChanged(filterDates));
                              }
                            }}
                          />
                        </Form.Item>

                        <Form.Item>
                          <label style={{ color: "#667985" }}>
                            Выберите атрибут
                          </label>
                          <AfTree disableElements onSelectCallback={onSelect} />
                        </Form.Item>
                      </Form>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Sider>
          <Content></Content>
        </Layout>
      </Content>
    </Layout>
  );
};
