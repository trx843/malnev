import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Col,
  Layout,
  Button,
  Divider,
  PageHeader,
  DatePicker,
  Row,
  Typography
} from "antd";
import { DatabaseOutlined, ExportOutlined } from "@ant-design/icons";
import {
  FilterItemLabelStyled,
  FilterRowStyled,
  PageLayoutStyled,
  SiderFilterStyled,
  TkoTreeStyled,
  WrapperTreeRowStyled
} from "../../styles/commonStyledComponents";
import { history } from "../../history/history";
import {
  InfoType,
  IEventsState,
  FilterDates
} from "../../interfaces";
import {
  nodeChanged,
  dateChanged
} from "../../actions/events/creators";
import { useDispatch, useSelector } from "react-redux";
import EventsContainer from "containers/EventsContainer";
import moment, { Moment } from "moment";
import locale from "antd/es/date-picker/locale/ru_RU";
import { StateType } from "types";
import { MenuCards } from "components/MenuCards";
import usePresenter from "./presenter";
import { IndexContext, IndexContextType } from "../../hooks/useIndex";
import { ReportsContainer } from "containers/ReportsContainer";

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Title } = Typography;

export const Home: FunctionComponent = () => {
  const {
    urlMapping,
    isEventsCountLoading,
    userReportsList,
    navs,
    onWidgetClick
  } = usePresenter();

  const dispatch = useDispatch();

  const pageState = useSelector<StateType, IEventsState>((state) => state.eventsReducer);

  // получение функционала из контекста стартовой страницы
  const {
    isUIB, // флаг куратора
    indexState, // состояние стартовой страницы
    goToState // метод изменения состояния
  } = React.useContext(IndexContext) as IndexContextType;

  const [startDate, setStartDate] = useState<Date>(pageState.filterDates.startDate);
  const [endDate, setEndDate] = useState<Date>(pageState.filterDates.endDate);

  const disabledDateNow = (current: moment.Moment) => {
    return current > moment();
  };

  const onHomeTreeSelect = (selectedKeys: React.Key[], info: InfoType) => {
    const change = info.node;
    dispatch(nodeChanged(change));
  }

  // обработка показа событий
  const handleShowEvents = () => {
    goToState("events");
  }

  // обработка показа главной
  const handleShowIndex = () => {
    goToState("index");
  }

  return (
    <PageLayoutStyled>      
      {/* если пользователь куратор */}
      {isUIB
        ? <>
            {/* выводим карточки отчетов */}
            <Layout>
              <Content className="content">
                <ReportsContainer/>
              </Content>
            </Layout>
            {/* <MenuCards
              isEventsCountLoading={isEventsCountLoading}
              userReportsList={userReportsList}
              navs={navs}
              onWidgetClick={onWidgetClick}
              urlMapping={urlMapping}
            /> */}
          </>
        : <> {/* иначе */}
            {/* заголовок с кнопкой "назад" */}
            {indexState !== "index" && indexState === "events" &&
              <PageHeader
                style={{ paddingTop: 0 }}
                className="site-page-header"
                onBack={handleShowIndex}
                title="События"
                subTitle=""
              />
            }

            <Layout>
              {/* колонка слева */}
              <SiderFilterStyled
                width={270}
                collapsed={false}
              >
                {/* фильтр дат */}
                {indexState === "events" &&
                  <FilterRowStyled $collapsed={false}>
                    <Col>
                      <FilterItemLabelStyled>Даты</FilterItemLabelStyled>
                      <RangePicker
                          locale={locale}
                          value={[moment(startDate), moment(endDate)]}
                          disabledDate={disabledDateNow}
                          onCalendarChange={(dates: [Moment, Moment]) => {
                            if (dates != undefined) {
                              let filterDates: FilterDates = {
                                startDate: dates[0].toDate(),
                                endDate: dates[1].toDate()
                              };
                              setStartDate(filterDates.startDate);
                              setEndDate(filterDates.endDate);
                              dispatch(dateChanged(filterDates));
                            }
                          }}
                        />
                    </Col>
                  </FilterRowStyled>
                }

                {/* дерево объектов */}
                <WrapperTreeRowStyled $collapsed={false}>
                  <Col>
                    <FilterItemLabelStyled>Выберите объект в дереве</FilterItemLabelStyled>
                    <TkoTreeStyled onSelectCallback={onHomeTreeSelect}/>
                  </Col>
                </WrapperTreeRowStyled>
              </SiderFilterStyled>

              {/* контентная область */}
              <Content className="content">
                {/* если это стартовая страница */}
                {indexState === "index"
                  ? <Row gutter={16}>
                      <Col span={14}>
                        <Button
                          type="primary"
                          size="large"
                          onClick={handleShowEvents}
                          icon={<DatabaseOutlined/>}
                        >
                          События
                        </Button>

                        <Divider />

                        <Button
                          size="large"
                          href="frame/report_dynamics_masses_volumes"
                          target="_blank"
                          icon={<ExportOutlined/>}
                        >
                          Баланс ОСУ и РСУ
                        </Button>
                        
                        <Divider />
                        
                        <Button
                          disabled
                          size="large"
                        >
                          Баланс с учетом КМХ
                        </Button>
                      </Col>
                      
                      <Col span={10}>
                        <Title level={3}>Сводка МКИ</Title>
                      </Col>
                    </Row>
                  : <>
                      {/* иначе выводим события */}
                      <EventsContainer/>
                    </>
                }
              </Content>
            </Layout>
          </>
      }      
    </PageLayoutStyled>
  );
};
