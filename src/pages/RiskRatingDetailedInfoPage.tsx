import React, { FunctionComponent, useEffect, useState } from "react";
import { Col, Layout, PageHeader, Row, Skeleton, Spin } from "antd";
import { Link, RouteComponentProps } from "react-router-dom";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { RiskRatingDetailedInfoContainer } from "../containers/RiskRatingDetailedInfoContainer";
import { useDispatch, useSelector } from "react-redux";
import { IRiskRatingInfoState } from "../interfaces";
import { StateType } from "../types";
import { history } from "../history/history";
import axios from "axios";
import { SiknRsuItem } from "../classes/SiknRsuItem";
import { apiBase } from "../utils";
import { siknSelected } from "../actions/riskratinginfo/creators";
import { SiknInfo } from "../components/riskRating/SiknInfo";
import { PageLayoutStyled } from "../styles/commonStyledComponents";

const { Content, Sider } = Layout;

/**
 * Состояние маршрута на страницу с компонентом RiskRatingDetailedInfo
 */
export interface IRiskRatingDetailedInfoParams {
  /**
   * Идентификатор СИКН
   */
  siknId: string;
}

export const RiskRatingDetailedInfoPage: FunctionComponent<RouteComponentProps<
  IRiskRatingDetailedInfoParams
>> = props => {
  const dispatch = useDispatch();
  const riskRatingInfoState = useSelector<StateType, IRiskRatingInfoState>(
    state => state.riskRatingInfo
  );

  const routes = [
    {
      path: "/riskrating",
      breadcrumbName: "Оценка рисков по СИКН"
    },
    {
      path: "",
      breadcrumbName: riskRatingInfoState.selectedSikn
        ? riskRatingInfoState.selectedSikn.fullName
        : "Загрузка..."
    }
  ];
  const getsSiknInfo = () => {
    axios
      .get<SiknRsuItem>(`${apiBase}/siknrsus/${props.match.params.siknId}`)
      .then(result => {
        if (result.data) {
          dispatch(siknSelected(result.data));
        } else {
          history.push("/riskrating");
        }
      })
      .catch(() => history.push("/riskrating"));
  };

  useEffect(() => {
    if (!riskRatingInfoState.selectedSikn) {
      getsSiknInfo();
    }
    return function cleanup() {
      dispatch(siknSelected(null));
    };
  }, []);

  function itemRender(
    route: Route,
    params: any,
    routes: Route[],
    paths: string[]
  ) {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link to={route.path}>{route.breadcrumbName}</Link>
    );
  }

  return (
    <PageLayoutStyled>
      <PageHeader
        className="site-page-header"
        title={
          riskRatingInfoState.selectedSikn ? (
            riskRatingInfoState.selectedSikn.fullName
          ) : (
            <Skeleton.Button active size={"small"} />
          )
        }
        breadcrumb={{ routes, itemRender }}
      />

      <Layout>
        <Sider width={280} style={{ background: "white", height: "100%" }} trigger={null}>
          <Row gutter={[16, 48]}>
            <Col span={24}>
              <div style={{ padding: 12 }}>
                <Row justify={"space-between"} align="middle"  style={{ marginBottom: "5px", fontWeight: "bold" }}>
                  <Col>Общая информация о СИКН</Col>
                </Row>
                {riskRatingInfoState.selectedSikn ? (
                  <SiknInfo
                    sikn={riskRatingInfoState.selectedSikn}
                    fullinfo
                  />
                ) : (
                  <Skeleton active />
                )}
              </div>
            </Col>
          </Row>
        </Sider>
          
        <Content>
          <RiskRatingDetailedInfoContainer />
        </Content>
      </Layout>
    </PageLayoutStyled>
  );
};
