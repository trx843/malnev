import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, PageHeader, Spin } from "antd";
import { PageLayoutStyled } from "../styles/commonStyledComponents";
import { history } from "../history/history";
import { apiBase, config } from "utils";
import axios from "axios";
import { IndexContext, IndexContextType } from "../hooks/useIndex";

const { Content } = Layout;

interface ReportParams {
  frameName: string;
};

type ReportInfo = {
  id: string;
  sortOrder: number;
  route: string;
  name: string;
  link: string;
};

const reportsEndPoint = "https://ndc01-pebkekp01.dc-prod.tn.corp:59448/";

export const ReportFramePage: FunctionComponent = (props) => {
  // получение функционала из контекста стартовой страницы
  const { currentUser } = useContext(IndexContext) as IndexContextType;

  const { frameName } = useParams<ReportParams>();

  const [reportInfo, setReportInfo] = useState<ReportInfo>();
  const [reportLoading, setReportLoading] = useState<boolean>(true)

  // метод получени информации об отчете из БД
  const getReportInfo = async (route: string) => {
    try {
      const reportInfo = await axios
        .get(`${apiBase}/get-report-info?route=${route}`)
        .then((result) => result.data[0]);
      console.log("reportInfo", reportInfo);

      setReportInfo(reportInfo);
      setReportLoading(false);
    } catch (error) {
      console.log("Error", error);
    }
  }

  useEffect(() => {
    // console.log("props", props);
    // console.log("cur user", currentUser);
    // console.log("fr name", frameName);

    // заголовок отчета из query
    // const urlParams = new URLSearchParams(props["location"].search);
    const urlParams = new URLSearchParams(props["location"].search);
    const frameTitle = urlParams.get('title');
    // console.log("fr title", frameTitle);

    // если это личный отчет
    if (frameName.indexOf("myreport") === 0 && frameTitle) {
      const pathname = props["location"].pathname;
      const pathnamelastIndex = pathname.length - 1;

      const myReportInfo = {
        id: pathname.substr(16, pathnamelastIndex),
        sortOrder: 0,
        route: pathname.substr(7, pathnamelastIndex),
        name: frameTitle,
        link: `Reports/report/TKO/${currentUser.login}/${encodeURIComponent(frameTitle)}`
      };
      // console.log("myReportInfo", myReportInfo);

      setReportInfo(myReportInfo);
      setReportLoading(false);
    } else {
      // иначе если обычный
      getReportInfo(frameName);
    }
  }, []);

  return (
    <>
      {!reportLoading &&
        <PageLayoutStyled>
          <PageHeader
            title={reportInfo?.name}
            className="site-page-header"
            onBack={() => history.push("/reports")}
          />

          <Layout>
            <Content className="content">
              <iframe
                className="frame-report"
                src={reportsEndPoint + reportInfo?.link + "?rs:embed=true"}
              ></iframe>
            </Content>
          </Layout>
        </PageLayoutStyled>
      }
    </>
  );
};