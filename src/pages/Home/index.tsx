import { FunctionComponent, useEffect, useState } from "react";
import {
  Col,
  Layout,
  Button,
  Divider,
  PageHeader,
  DatePicker,
  Spin,
  Row
} from "antd";
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
import useGroup from "./group";

const { Content } = Layout;
const { RangePicker } = DatePicker;

export const Home: FunctionComponent = () => {
  // состояние группы пользователя
  const [isUIB, setIsUIB] = useState<boolean>(false);

  const {
    urlMapping,
    isEventsCountLoading,
    userReportsList,
    navs,
    onWidgetClick
  } = usePresenter();

  const dispatch = useDispatch();

  const pageState = useSelector<StateType, IEventsState>((state) => state.eventsReducer);

  const [indexState, setIndexState] = useState<string>("index");

  const [startDate, setStartDate] = useState<Date>(pageState.filterDates.startDate);
  const [endDate, setEndDate] = useState<Date>(pageState.filterDates.endDate);

  const disabledDateNow = (current: moment.Moment) => {
    return current > moment();
  };

  const onHomeTreeSelect = (selectedKeys: React.Key[], info: InfoType) => {
    const change = info.node;
    dispatch(nodeChanged(change));
  }

  const handleShowEvents = () => {
    setIndexState("events");
  }

  const handleShowIndex = () => {
    setIndexState("index");
    // dispatch(nodeChanged({}));
  }

  useEffect(() => {
    setIsUIB(useGroup());
  }, []);

  return (
    <PageLayoutStyled>      
      {/* если пользователь куратор */}
      {isUIB
        ? <>
            {/* выводим карточки отчетов */}
            <MenuCards
              isEventsCountLoading={isEventsCountLoading}
              userReportsList={userReportsList}
              navs={navs}
              onWidgetClick={onWidgetClick}
              urlMapping={urlMapping}
            />
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
                width={260}
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
                  ? <>
                      <Button size="large">Баланс ОСУ и РСУ</Button>
                      <Divider />
                      <Button size="large" type="primary" onClick={handleShowEvents}>События</Button>
                      <Divider />
                      <Button size="large">Баланс с учетом КМХ</Button>
                    </>
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
