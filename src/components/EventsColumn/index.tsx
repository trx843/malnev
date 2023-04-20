import {
  Row,
  Col,
  Select,
  message,
  Spin,
  Empty,
  DatePicker,
  Button,
  Modal,
  Tooltip,
  Skeleton,
  Switch,
} from "antd";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import BellFilled from "@ant-design/icons/BellFilled";
import EditFilled from "@ant-design/icons/EditFilled";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import ExclamationCircleFilled from "@ant-design/icons/ExclamationCircleFilled";
import { history } from "../../history/history";
import {
  FilterCollapse,
  FilterContainer,
  FilterTextParagraph,
  LabelStyled,
} from "../../styles/commonStyledComponents";
import { EventItem } from "../../classes";
import { config, dateToLongDateString } from "../../utils";
import moment, { Moment } from "moment";
import locale from "antd/es/date-picker/locale/ru_RU";
import { Link } from "react-router-dom";
import {
  EventsCard,
  EventsCardTitle,
  MainTitleWrapper,
  BoxIcon,
  Title,
  EventsCardBody,
  EventContainer,
  EventTitleWrapper,
  EventTitle,
  CriticIconWrapper,
  OrgStructLink,
  EventText,
  TextParagraph,
  NextButtonWrapper,
} from "./styledComponents";
import { EventsCardFilterValues } from "../../api/responses/get-events-card";
import { GetEventsCardFilterBody } from "../../api/params/get-events-card.params";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface EventsColumnProps {
  commentHandler: (item: EventItem) => Promise<void>;
  isLoading: boolean;
  isConfigured: boolean;
  allEvents: EventItem[];
  eventsCardFilterValues: EventsCardFilterValues;
  nextButtonDisable: boolean;
  nextEventsHandler: () => void;
  nextButtonLoading: boolean;
  onTypeChange: (type: number) => void;
  onLevelChange: (level: number) => void;
  onAcknowledgeChange: (acknowledge: number) => void;
  onDateChange: (dates: [Date, Date]) => void;
  filterValues: GetEventsCardFilterBody;
  filtersLoading: boolean;
  onSelectEventHandler: (event: EventItem) => void;
  onSwitch: () => void;
  height: string;
  isCtrl: boolean;
  showSwitch: boolean;
}

export const EventsColumn: FunctionComponent<EventsColumnProps> = (props) => {
  const disabledDateNow = (current: moment.Moment) => {
    return current > moment();
  };

  return (
    <EventsCard height={props.height}>
      <EventsCardTitle>
        <Row style={{ alignItems: "baseline" }}  justify="space-between">
          <Col>
            <MainTitleWrapper
              flag={true}
              onClick={() => {
                history.push("/events");
              }}
            >
              <BoxIcon>
                <BellFilled />
              </BoxIcon>
              <Title>События</Title>
            </MainTitleWrapper>
          </Col>
          {props.showSwitch && (
            <Col>
              <Row gutter={8}>
                <Col>
                  <LabelStyled isActive={!props.isCtrl}>АИСМСС</LabelStyled>
                </Col>
                <Col>
                  <Switch
                    style={{ marginBottom: 8 }}
                    checked={props.isCtrl}
                    onChange={props.onSwitch}
                  />
                </Col>
                <Col>
                  <LabelStyled isActive={props.isCtrl}>Надзор</LabelStyled>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </EventsCardTitle>

      <FilterCollapse defaultActiveKey={["pan1"]} ghost>
        <FilterCollapse.Panel header="Фильтр" key="pan1">
          {props.filtersLoading ? (
            <Row>
              <Col span={24}>
                <Skeleton active />
              </Col>
            </Row>
          ) : (
            <FilterContainer>
              <Row gutter={[24, 18]}>
                <Col span={12}>
                  <FilterTextParagraph>Тип события</FilterTextParagraph>
                  <Select
                    allowClear
                    style={{ marginTop: 4, width: "100%" }}
                    placeholder="Все"
                    notFoundContent="Нет данных"
                    showSearch
                    dropdownStyle={{ width: "500px" }}
                    optionFilterProp={"label"}
                    options={props.eventsCardFilterValues.types.map((x) => ({
                      label: x.shortName,
                      value: x.id,
                      key: x.id,
                    }))}
                    onChange={props.onTypeChange}
                  />
                </Col>
                <Col span={12}>
                  <FilterTextParagraph>Критичность</FilterTextParagraph>
                  <Select
                    allowClear
                    style={{ marginTop: 4, width: "100%" }}
                    placeholder="Все"
                    notFoundContent="Нет данных"
                    showSearch
                    optionFilterProp={"label"}
                    options={props.eventsCardFilterValues.levels.map((x) => ({
                      label: x.shortName,
                      value: x.id,
                      key: x.id,
                    }))}
                    onChange={props.onLevelChange}
                  />
                </Col>
                <Col span={12}>
                  <FilterTextParagraph>Период</FilterTextParagraph>
                  <RangePicker
                    style={{ marginTop: 4, width: "100%" }}
                    locale={locale}
                    disabledDate={disabledDateNow}
                    value={[
                      moment(props.filterValues.startTime),
                      moment(props.filterValues.endTime),
                    ]}
                    onChange={(dates: [Moment, Moment]) => {
                      if (dates != undefined) {
                        {
                          props.onDateChange([
                            dates[0].toDate(),
                            dates[1].toDate(),
                          ]);
                        }
                      }
                    }}
                  />
                </Col>
                <Col span={12}>
                  <FilterTextParagraph>Квитирован</FilterTextParagraph>
                  <Select
                    allowClear
                    style={{ marginTop: 4, width: "100%" }}
                    placeholder="Все"
                    notFoundContent="Нет данных"
                    showSearch
                    optionFilterProp={"label"}
                    options={props.eventsCardFilterValues.acknowledges.map(
                      (x) => ({
                        label: x.shortName,
                        value: x.id,
                        key: x.id,
                      })
                    )}
                    onChange={props.onAcknowledgeChange}
                  />
                </Col>
              </Row>
            </FilterContainer>
          )}
        </FilterCollapse.Panel>
      </FilterCollapse>
      {props.isLoading && (
        <div className="mx-auto my-auto">
          <Spin />
        </div>
      )}
      {props.allEvents.length === 0 && !props.isLoading && (
        <div style={{ alignItems: "center" }} className="mx-auto my-auto">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              props.isConfigured
                ? "Нет уведомлений"
                : "Уведомления не настроены"
            }
          />
          <div style={{ textAlign: "center" }}>
            {!props.isConfigured ? (
              <Link to="settings/events">Настроить уведомления</Link>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
      <EventsCardBody>
        {props.allEvents.map((e) => (
          <EventContainer
            key={`eventCard${e.id}`}
            flag={e.mssEventSeverityLevelId === 5}
          >
            <EventTitleWrapper>
              <EventTitle>{e.mssEventTypeName}</EventTitle>
              {e.mssEventSeverityLevelId === 5 ? (
                <CriticIconWrapper>
                  <ExclamationCircleFilled style={{ color: "#FF4D4F" }} />
                </CriticIconWrapper>
              ) : (
                <></>
              )}
            </EventTitleWrapper>

            <div>
              <Row>
                <Col>
                  <OrgStructLink
                    flag={e.orgStructTrendName !== null}
                    onClick={() => {
                      if (e.orgStructTrendName !== null) {
                        let url: string = `${config.urlMapping.piVision}Displays/${e.orgStructTrendName}?hidesidebar`;
                        window.open(url, "_blank");
                      }
                    }}
                  >
                    {e.siknFullName}
                    {e.pspName != null ? " (" + e.pspName + ")" : ""}
                  </OrgStructLink>
                  <EventText style={{ marginBottom: 16 }}>
                    {e.techPositionName === e.siknFullName
                      ? ""
                      : e.techPositionName}
                  </EventText>
                  <p>{e.eventName}</p>
                </Col>
              </Row>
              <Row justify="space-between" align="bottom" wrap={false} gutter={24}>
                <Col span={8}>
                  <TextParagraph>С</TextParagraph>
                  <EventText>
                    {dateToLongDateString(e.startDateTime as Date)}
                  </EventText>
                </Col>
                <Col span={8}>
                  {e.endDateTime ? (
                    <>
                      <TextParagraph>По</TextParagraph>
                      <EventText>
                        {dateToLongDateString(e.endDateTime as Date)}
                      </EventText>
                    </>
                  ) : (
                    <></>
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    icon={
                      e.isAcknowledged ? <EditFilled /> : <PlusCircleFilled />
                    }
                    onClick={() => {
                      props.onSelectEventHandler(e);
                    }}
                    type="link"
                  >
                    Квитировать
                  </Button>
                </Col>
              </Row>
            </div>
          </EventContainer>
        ))}
        <NextButtonWrapper>
          <Button
            style={{
              display:
                props.allEvents.length === 0 || props.isLoading
                  ? "none"
                  : "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            type={"text"}
            disabled={props.nextButtonDisable}
            loading={props.nextButtonLoading}
            onClick={props.nextEventsHandler}
          >
            Загрузить следующие
          </Button>
        </NextButtonWrapper>
      </EventsCardBody>
    </EventsCard>
  );
};
