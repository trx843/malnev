import { FunctionComponent } from "react";
import { PageLayoutStyled } from "../styles/commonStyledComponents";
import {
  Layout,
  PageHeader,
} from "antd";
import { history } from "../history/history";
import { ReportsContainer } from "containers/ReportsContainer";

const { Content } = Layout;

export const ReportsPage: FunctionComponent = () => {
  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Отчеты"
        subTitle=""
      />

      <Layout>
        <Content className="content">
          <ReportsContainer/>
        </Content>        
      </Layout>
    </PageLayoutStyled>
  );
};