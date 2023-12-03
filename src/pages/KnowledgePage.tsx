import { Layout, PageHeader } from "antd";
import { FunctionComponent } from "react";
import { PageLayoutStyled } from "../styles/commonStyledComponents";
import { history } from "../history/history";

const { Content } = Layout;

export const KnowledgePage: FunctionComponent = () => {
  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="База знаний"
        subTitle=""
      />

      <Layout>
        <Content className="content">
          <iframe
            id="ifr"
            style={{
              width: "100%",
              height: "calc(100vh - 125px)"
            }}
            src="https://confluence.dc-prod.tn.corp/pages/viewpage.action?pageId=28120106?rs:embed=true"
          ></iframe>
        </Content>
      </Layout>
    </PageLayoutStyled>
  );
};