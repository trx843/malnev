import { FunctionComponent } from "react";
import { Layout, PageHeader } from "antd";
import { PageLayoutStyled } from "../styles/commonStyledComponents";
import { history } from "../history/history";

const { Content } = Layout;

const gisEndPoint = "https://gis.tn.corp/portal/apps/webappviewer/index.html?id=0324b79e8d4d415bb7e99c08702ae972";

export const GisPage: FunctionComponent = () => {
  return (
    <PageLayoutStyled>
      <PageHeader
        title="ГИС"
        className="site-page-header"
        onBack={() => history.push("/")}
      />

      <Layout>
        <Content className="content">
          <iframe
            className="frame"
            src={gisEndPoint}
          ></iframe>
        </Content>
      </Layout>
    </PageLayoutStyled>
  );
};