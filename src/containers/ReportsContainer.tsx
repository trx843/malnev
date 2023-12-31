import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiBase } from "utils";
import { IndexContext, IndexContextType } from "../hooks/useIndex";
import { Col, Row, Typography, List, Spin, Tag, Tooltip } from "antd";
import { CheckSquareOutlined, CloseSquareOutlined } from "@ant-design/icons";
import _ from "lodash";

const { Title } = Typography;
const { CheckableTag } = Tag;

interface Report {
  id: number;
  sortOrder: number;
  route: string;
  name: string;
  link: string;
  groups?: ReportGroup[];
}

interface ReportGroup {
  id: number;
  sortOrder: number;
  name: string;
  color: string;
}

interface ReportToGroup {
  id: number;
  reportId: number;
  groupId: number;
}

interface ReportsData {
  reports: Report[];
  groups: ReportGroup[];
  reportsToGroups: ReportToGroup[];
}

interface UserReport {
  id: string;
  name: string;
  route: string;
};

const frameReportEndPoint = "frame_report";

export const ReportsContainer: FunctionComponent = () => {
  // получение функционала из контекста стартовой страницы
  const { isUIB, currentUser } = useContext(IndexContext) as IndexContextType;

  // выбранные группы отчетов по умолчанию
  // если куратор, то группа 5
  const defaultSelectedGroupsIds = isUIB ? [5] : undefined;

  // личные отчеты
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [userReportsLoading, setUserReportsLoading] = useState<boolean>(true);

  // основные отчеты
  const [reportsData, setReportsData] = useState<ReportsData>();
  const [reportsLoading, setReportsLoading] = useState<boolean>(true);

  // отчеты с группами
  const [reportsWithGroups, setReportsWithGroups] = useState<Report[]>([]);

  // выбранные группы
  const [selectedGroupsIds, setSelectedGroupsIds] = useState<number[]>([]);

  /* -------------------------- */

  // метод возвращения отчетов вместе с группами
  const getReportsWithGroups = (data: ReportsData, selectedGroupsIds: number[] = []) => {
    const { reports, groups, reportsToGroups } = data;

    console.log("selectedGroupsIds", selectedGroupsIds);

    const reportsWithGroups = reports.map((report: Report) => {
      const currentGroups = groups.reduce((acc: ReportGroup[], group: ReportGroup) => {
        if (reportsToGroups.some(({ reportId, groupId }) => (reportId === report.id && groupId === group.id))) {
          acc.push(group);
        }

        return acc;
      }, []);

      return {
        ...report,
        groups: currentGroups
      };
    });

    // если есть список выбранных групп
    if (selectedGroupsIds.length) {
      const filteredReportsWithGroups = reportsWithGroups.filter((report) => {
        // получаем группы из итерируемого отчета
        const { groups } = report;

        // считаем количество вхождений ID отчетов в список выбранных
        const k = groups.reduce((acc, group) => {
          // если нашелся такой, то увеличиваем счетчик
          if (selectedGroupsIds.indexOf(group.id) > - 1) {
            acc++;
          }

          return acc;
        }, 0);

        // возвращаем сравнение счетчика с нулем для фильтра
        return k > 0;
      });

      // возвращаем отфильтрованные отчеты
      return filteredReportsWithGroups;
    }

    // в ином случае возвращаем все
    return reportsWithGroups;

    /*
    // проходимся по всем отчетам
    return reports.map((report) => {
      // фильтруем для отчета список групп
      const currentGroups = groups.filter((group) => {
        // ищем в reportGroup те, в которых есть наш отчет
        return reportsToGroups
          .filter(({ reportId }) => {
            return reportId === report.id;
          })
          // получаем только groupId
          .map(({ groupId }) => groupId)
          // и проверяем, есть ли id текущей group в списке
          .includes(group.id);
      });
    
      // возвращаем результат
      return {
        ...report,
        groups: currentGroups
      };
    });
    */
  };

  /* -------------------------- */

  // первичный useEffect
  useEffect(() => {
    // асинхронный метод получения основных отчетов
    const getReports = async () => {
      try {
        const reports = await axios.get<ReportsData>(`${apiBase}/get-reports`).then((result) => {
          // забираем данные из процедуры
          let reports = result.data["item1"];
          let groups = result.data["item2"];
          const reportsToGroups = result.data["item3"];

          reports = reports.map((report) => ({
            ...report,
            route: `/${frameReportEndPoint}/${report.route}`
          }));

          // сортируем отчеты и группы по полю sortOrder
          reports = _.sortBy(reports, ["sortOrder"]);
          groups = _.sortBy(groups, ["sortOrder"]);

          // создаем объект из отчетов, групп и связок
          const reportsData = { reports, groups, reportsToGroups };
          // обновляем состояние полных данных по отчетам          
          setReportsData(reportsData);

          // обновляем состояние выбранных групп
          setSelectedGroupsIds(groups.map((group) => group.id));

          // получаем отчеты вместе с группами, в которых они состоят
          const reportsWithGroups = getReportsWithGroups(reportsData, defaultSelectedGroupsIds);
          // обновляем состояние отчетов с группами
          setReportsWithGroups(reportsWithGroups);

          // выключаем анимацию загрузки
          setReportsLoading(false);
        });
      } catch (error) {
        console.log("Error", error);
      }
    };

    // вызов метода основных отчетов
    getReports();

    // асинхронный метод получения личных отчетов
    const getUserReports = async (login: string) => {
      try {
        const userReports = await axios.get<UserReport[]>(`${apiBase}/get-user-reports?login=${login}`).then((result) => {
          return result.data.map((report) => ({
            ...report,
            route: `${frameReportEndPoint}/myreport_${report.id}?title=${encodeURIComponent(report.name)}`
          }));
        });
        setUserReports(userReports);
        setUserReportsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    };

    // вызов метода личных отчетов
    getUserReports(currentUser.login);
  }, []);

  /* -------------------------- */

  // метод обработки выбора группы
  const handleChange = (groupId: number, checked: boolean) => {
    const nextSelectedGroupsIds = (checked)
      ?
      [...selectedGroupsIds, groupId]
      :
      selectedGroupsIds.filter((g) => g !== groupId);

    // console.log('You are interested in: ', nextSelectedGroupsIds);

    // получаем из основных данных список ID групп
    const groupsIds = reportsData?.groups.map((group) => group.id) as number[];

    // если новый список выбранных тегов пуст
    if (nextSelectedGroupsIds.length === 0) {
      // помещаем в состояние выбранных групп все возможные группы
      setSelectedGroupsIds(groupsIds);
    } else { // иначе
      // обновляем состояние на выбранные
      setSelectedGroupsIds(nextSelectedGroupsIds);
    }

    // получаем отфльтрованные отчеты по группам
    const filteredReportsWithGroups = getReportsWithGroups(reportsData as ReportsData, nextSelectedGroupsIds);

    // обновляем состояние выводимых отчетов
    setReportsWithGroups(filteredReportsWithGroups);
  };

  /* -------------------------- */

  return (
    <Row gutter={16}>
      <Col span={18}>
        <Title level={3}>Основные отчеты</Title>

        <Spin spinning={reportsLoading}>
          <List
            size="small"
            bordered
            header={!isUIB && // если не куратор, то выводим группы              
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{
                  marginRight: 8,
                  fontSize: "14px",
                  lineHeight: "20px"
                }}>Группы:</div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {reportsData?.groups.map((group) => {
                    const checkedTag = selectedGroupsIds.indexOf(group.id) > -1;

                    return (
                      <CheckableTag
                        key={group.id}
                        checked={checkedTag}
                        onChange={(checked) => handleChange(group.id, checked)}
                        style={{
                          backgroundColor: `#${group.color}`,
                          display: "flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        {checkedTag ? <CheckSquareOutlined /> : <CloseSquareOutlined />}
                        {group.name}
                      </CheckableTag>
                    );
                  })}
                </div>
              </div>
            }
            dataSource={reportsWithGroups}
            renderItem={(report) => (
              <List.Item key={report.id}>
                <Link to={report.route}>{report.name}</Link>

                {/* вывод групп отчета */}
                {!isUIB && report.groups && (
                  <div style={{ display: "flex", gap: 6 }}>
                    {report.groups.map((group) => (
                      <Tooltip
                        title={group.name}
                        color={`#${group.color}`}
                        key={`${report.id}-${group.id}`}
                      >
                        <Tag
                          color={`#${group.color}`}
                          style={{
                            borderRadius: "50%",
                            height: 16,
                            width: 16,
                            display: "block"
                          }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                )}
              </List.Item>
            )}
          />
        </Spin>
      </Col>

      <Col span={6}>
        {userReports.length !== 0 &&
          <Spin spinning={userReportsLoading}>
            <Title level={3}>Мои отчеты</Title>

            <List
              size="small"
              bordered
              dataSource={userReports}
              renderItem={(report) => (
                <List.Item key={report.id}>
                  <Link to={report.route}>{report.name}</Link>
                </List.Item>
              )}
            />
          </Spin>
        }
      </Col>
    </Row>
  );
};