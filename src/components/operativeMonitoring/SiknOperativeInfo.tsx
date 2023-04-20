import { Col, message, Row, Tooltip } from "antd";
import { FunctionComponent } from "react";
import { SknInformation } from "../../classes/OperativeMonitoringModel";
import { TextLink } from "../../styles/commonStyledComponents";
import { StateType } from "../../types";
import { config } from "../../utils";
import { OperativeMonitoringFilter } from "./OperativeMonitoringFilterPanel";
import { useSelector } from "react-redux";
import { IOperMonitState } from "../../interfaces";
import {
  FilterType,
  OperativeMonitoringFilterLight,
} from "api/params/get-events-params";
import { useHistory } from "react-router";

interface ISiknOperativeInfoProps {
  sikn: SknInformation;
  fullInfo: boolean;
}

export const SiknOperativeInfo: FunctionComponent<ISiknOperativeInfoProps> = (
  props
) => {
  const operMonitState = useSelector<StateType, IOperMonitState>(
    (state) => state.operMonit
  );

  const history = useHistory();
  const getEvents = (
    siknId: number,
    critical: boolean,
    filter: OperativeMonitoringFilter
  ) => {
    if (filter) {
      const filterLight: OperativeMonitoringFilterLight = {
        status: filter.status,
        startTime: filter.startTime,
        endTime: filter.endTime,
        acknowledgedStatus: filter.acknowledgedStatus,
      };
      const eventsFilter: FilterType = {
        critical: critical,
        id: siknId,
        operativeMonitFilter: filterLight,
      };
      history.push("/events", eventsFilter);
    } else {
      message.error("Ошибка загрузки событий");
    }
  };

  return (
    <>
      <Row justify="space-between" wrap={false}>
        <Col>
          <Tooltip title={"Переход на менемосхему PiVision"}>
            <TextLink
              onClick={(e) => {
                e.stopPropagation();
                const item = props.sikn;
                if (item.orgStructTrendName !== null) {
                  let url: string = `${config.urlMapping.piVision}Displays/${item.orgStructTrendName}?hidetoolbar&hidesidebar`;
                  window.open(url, "_blank");
                }
              }}
            >
              {props.sikn.siknName}
            </TextLink>
          </Tooltip>
        </Col>
        <Col>{props.sikn.statusText}</Col>
      </Row>
      <Row justify="space-between" wrap={false}>
        <Col>Критические</Col>
        <Col>
          <Tooltip title={"Переход на события"}>
            <TextLink
              onClick={(e) => {
                e.stopPropagation();
                getEvents(props.sikn.id, true, operMonitState.filter);
              }}
            >
              {props.sikn.criticalEventsCount}
            </TextLink>
          </Tooltip>
        </Col>
      </Row>
      {props.fullInfo === true ? (
        <>
          <Row justify="space-between" wrap={false}>
            <Col>Прочие</Col>
            <Col>
              <Tooltip title={"Переход на события"}>
                <TextLink
                  onClick={(e) => {
                    e.stopPropagation();
                    getEvents(props.sikn.id, false, operMonitState.filter);
                  }}
                >
                  {props.sikn.otherEventsCount}
                </TextLink>
              </Tooltip>
            </Col>
          </Row>
          <Row justify="space-between" wrap={false}>
            <Col>Массовый расход</Col>
            <Col>
              <strong>{props.sikn.massFlow}</strong>
            </Col>
          </Row>
          <Row justify="space-between" wrap={false}>
            <Col>Объемный расход</Col>
            <Col>
              <strong>{props.sikn.volFlow}</strong>
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
