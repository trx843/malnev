import {
  Row,
  Col,
  Select,
  Spin,
  Empty,
  DatePicker,
  Button,
  Skeleton,
  Switch,
  Checkbox,
  Tooltip,
  Modal,
  message,
} from "antd";
import { FunctionComponent } from "react";
import BellFilled from "@ant-design/icons/BellFilled";
import { history } from "../../history/history";
import {
  FilterCollapse,
  FilterContainer,
  FilterTextParagraph,
  LabelStyled,
} from "../../styles/commonStyledComponents";
import { dateToLongDateString } from "../../utils";
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
  EventText,
  TextParagraph,
  NextButtonWrapper,
} from "./styledComponents";
import { GetEventsCardFilterBody } from "../../api/params/get-events-card.params";
import {
  CtrlEventHandleTypeEnum,
  CtrlEventsItem,
} from "pages/PspControl/CtrlEventsPage/types";
import { CtrlEventsCardFilterValues } from "api/responses/get-ctrlevents-card";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import {
  ExclamationCircleOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;
const { RangePicker } = DatePicker;

interface EventsColumnProps {
  isLoading: boolean;
  isConfigured: boolean;
  allEvents: CtrlEventsItem[];
  eventsCardFilterValues: CtrlEventsCardFilterValues;
  nextButtonDisable: boolean;
  nextEventsHandler: () => void;
  nextButtonLoading: boolean;
  onTypeChange: (type: number) => void;
  onOnlyReadChange: (onlyRead: boolean) => void;
  onForExecutionChange: (forExecution: boolean) => void;
  onDateChange: (dates: [Date, Date]) => void;
  filterValues: GetEventsCardFilterBody;
  filtersLoading: boolean;
  onAccHandle: (event: CtrlEventsItem) => void;
  onForExecutionHandle: (event: CtrlEventsItem) => void;
  onSwitch: () => void;
  height: string;
  isCtrl: boolean;
  showSwitch: boolean;
}

export const CtrlEventsColumn: FunctionComponent<EventsColumnProps> = (
  props
) => {
  const disabledDateNow = (current: moment.Moment) => {
    return current > moment();
  };

  return (
    <EventsCard height={props.height}>
      <EventsCardTitle>
        <Row style={{ alignItems: "baseline" }} justify="space-between">
          <Col>
            <MainTitleWrapper
              flag={true}
              onClick={() => {
                history.push("/pspcontrol/ctrlevents");
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
              <Row align={"bottom"} gutter={[24, 18]}>
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
                      label: x.name,
                      value: x.id,
                      key: x.id,
                    }))}
                    onChange={props.onTypeChange}
                  />
                </Col>
                <Col span={12}>
                  <Checkbox
                    onChange={(e: CheckboxChangeEvent) =>
                      props.onForExecutionChange(e.target.checked)
                    }
                  >
                    К исполнению
                  </Checkbox>
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
                  <Checkbox
                    onChange={(e: CheckboxChangeEvent) =>
                      props.onOnlyReadChange(e.target.checked)
                    }
                  >
                    Только непрочитанные
                  </Checkbox>
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
          <EventContainer key={`ctrleventCard${e.id}`} flag={false}>
            <Row justify="space-between">
              <Col>
                <EventTitleWrapper>
                  <EventTitle>{e.eventTypeName}</EventTitle>
                </EventTitleWrapper>
              </Col>
              <Col>
                {e.forExecution && (
                  <Tooltip title={"К исполнению"}>
                    <ExclamationCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#1890FF",
                      }}
                    />
                  </Tooltip>
                )}
              </Col>
            </Row>

            <div>
              <Row>
                <Col>{e.ostName}</Col>
              </Row>
              <Row>
                <Col>{e.pspName}</Col>
              </Row>
              <Row>
                <Col>{e.verificationLevelName}</Col>
              </Row>
              <Row>
                <Col>{e.checkTypeName}</Col>
              </Row>
              <Row>
                <Col>{e.checkYear}</Col>
              </Row>
              <Row justify="space-between" align="bottom">
                <Col>
                  <EventText>
                    {dateToLongDateString(e.createdOn as Date)}
                  </EventText>
                </Col>
                <Col>
                  <Tooltip title={"Ознакомиться"}>
                    <Button
                      icon={
                        <FileSearchOutlined
                          style={{
                            alignContent: "center",
                            fontSize: "20px",
                            color: "#1890FF",
                          }}
                        />
                      }
                      type="text"
                      onClick={() => {
                        props.onAccHandle(e);
                      }}
                    />
                  </Tooltip>
                  {!e.forExecution && (
                    <Tooltip title={"К исполнению"}>
                      <Button
                        icon={
                          <FileDoneOutlined
                            style={{
                              alignContent: "center",
                              fontSize: "20px",
                              color: "#1890FF",
                            }}
                          />
                        }
                        type="text"
                        onClick={() => {
                          confirm({
                            title:
                              "Уверены, что хотите поставить к исполнению?",
                            onOk() {
                              props.onForExecutionHandle(e);
                            },
                            okText: "Да",
                            cancelText: "Отменить",
                            onCancel() {},
                          });
                        }}
                      />
                    </Tooltip>
                  )}
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
