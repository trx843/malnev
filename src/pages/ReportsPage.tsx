import { FunctionComponent } from "react";
import usePresenter from "./Home/presenter";
import { PageLayoutStyled } from "../styles/commonStyledComponents";
import {
  Layout,
  PageHeader,
} from "antd";
import { history } from "../history/history";
// import { MenuCards } from "components/MenuCards";
import { ReportsContainer } from "containers/ReportsContainer";

const { Content } = Layout;

export const ReportsPage: FunctionComponent = () => {
  /* const {
    urlMapping,
    isEventsCountLoading,
    userReportsList,
    navs,
    onWidgetClick
  } = usePresenter(); */

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
          {/* <MenuCards
            isEventsCountLoading={isEventsCountLoading}
            userReportsList={userReportsList}
            navs={navs}
            onWidgetClick={onWidgetClick}
            urlMapping={urlMapping}
          /> */}
        </Content>        
      </Layout>
    </PageLayoutStyled>
  );
};