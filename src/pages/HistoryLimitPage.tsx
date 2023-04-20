import React, { FunctionComponent } from "react";
import { PageHeader, Layout } from "antd";
import { getParamFromUrl } from "../utils";
import { Link } from "react-router-dom";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { HistoryLimitContainer } from "../containers/HistoryLimitContainer";
import { PageLayoutStyled } from "../styles/commonStyledComponents";

const { Content, Sider } = Layout;

export const HistoryLimitPage: FunctionComponent = () => {
  var name = getParamFromUrl("name", "");
  name = name.replace(/["']/g, "");

  const routes = [
    {
      path: "/measrange",
      breadcrumbName: "Диапазоны измерений",
    },
    {
      path: "",
      breadcrumbName: name,
    },
  ];

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
        style={{ paddingTop: 0 }}
        className="site-page-header"
        title={name}
        breadcrumb={{ routes, itemRender }}
      />
      <Layout>
          {/* <Sider
            width={280}
            style={{ height: "845px", background: "white" }}
            trigger={null}
          >
            {historyLimitInfoState.selectedSi ? (
              <>
                <Row gutter={[16, 48]}>
                  <Col span={24}>
                    <div style={{ padding: 12 }}>
                      <Row gutter={[0, 16]}>
                        <Col>
                          <TextGrayStyled>Тип СИ</TextGrayStyled>
                          <TextDarkStyled>
                            {historyLimitInfoState.selectedSi.siTypeName}
                          </TextDarkStyled>
                        </Col>
                      </Row>
                      <Row gutter={[0, 16]}>
                        <Col>
                          <TextGrayStyled>Модель СИ</TextGrayStyled>
                          <TextDarkStyled>
                            {historyLimitInfoState.selectedSi.siModelName}
                          </TextDarkStyled>
                        </Col>
                      </Row>
                      <Row gutter={[0, 16]}>
                        <Col>
                          <TextGrayStyled>Заводской номер</TextGrayStyled>
                          <TextDarkStyled>
                            {historyLimitInfoState.selectedSi.manufNumber}
                          </TextDarkStyled>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <Skeleton active />
            )}
          </Sider> */}
          <Content>
            <HistoryLimitContainer />
          </Content>
      </Layout>
    </PageLayoutStyled>
  );
};