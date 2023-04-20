import { FunctionComponent } from "react";
import { PageHeader, Layout } from "antd";
import { history } from "../history/history";
import { OperativeMonitoringContainer } from "../containers/OperativeMonitoringContainer";
import { PageLayoutStyled } from "../styles/commonStyledComponents";

const { Content } = Layout;

export const OperativeMonitoringSiknPage: FunctionComponent = () => {
  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Оперативный мониторинг СИКН"
        subTitle=""
      />
      <Layout>
        <Content>
          <OperativeMonitoringContainer />
        </Content>
      </Layout>
    </PageLayoutStyled>
  );
};
