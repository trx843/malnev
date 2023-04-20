import React, { FunctionComponent } from "react";
import { PageHeader, Layout } from "antd";
import { history } from "../history/history";
import { RiskRatingContainer } from "../containers/RiskRatingContainer";
import { PageLayoutStyled } from "../styles/commonStyledComponents";

const { Content } = Layout;

export const RiskRatingPage: FunctionComponent = () => {
  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Оценка рисков"
        subTitle=""
      />

      <Layout>
        <Content>
          <RiskRatingContainer />
        </Content>
      </Layout>
    </PageLayoutStyled>
  );
};
