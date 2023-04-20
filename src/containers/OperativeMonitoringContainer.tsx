import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Row, Col, Spin, message, Empty, Modal } from "antd";
import { EventsColumn } from "../components/EventsColumn";
import { OperativeMonitoringModel } from "../classes/OperativeMonitoringModel";
import axios from "axios";
import { apiBase, config } from "../utils";
import { OperativeMonitoringFilterPanel } from "../components/operativeMonitoring/OperativeMonitoringFilterPanel";
import { Osts } from "../components/operativeMonitoring/Osts";
import {
  CustomCard,
  TableBlockWrapperStyled,
} from "../styles/commonStyledComponents";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../types";
import { IOperMonitState } from "../interfaces";
import { operMonitFetched } from "../actions/operativemonotoring/creators";
import usePresenter from "../pages/Home/presenter";
import { CommentForm } from "../components/CommentForm";
import { EventItem } from "../classes";
import { useLongPolling } from "customHooks/useLongPolling";

export const OperativeMonitoringContainer: FunctionComponent = () => {
  const {
    filtersLoading,
    isLoading,
    eventsCardFilterValues,
    commentHandler,
    nextButtonDisable,
    nextEventsHandler,
    allEvents,
    isConfigured,
    nextButtonLoading,
    onLevelChange,
    onTypeChange,
    onAcknowledgeChange,
    onDateChange,
    filterValues,
    commentModalVisible,
    selectedEvent,
    onCancelCommentHandler,
    onSelectEventHandler,
    isCtrl,
    onSwitch,
  } = usePresenter();

  const dispatch = useDispatch();

  const [startPolling, stopPolling] = useLongPolling();

  const operMonitState = useSelector<StateType, IOperMonitState>(
    (state) => state.operMonit
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);

  const fetchOperativeMonitoring = useCallback(() => {
    setLoading(true);
    setShowError(false);
    axios
      .post<OperativeMonitoringModel>(
        `${apiBase}/OperativeMonitoringSikn/GetInformation`,
        operMonitState.filter
      )
      .then((result) => {
        dispatch(operMonitFetched(result.data));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setShowError(true);
        message.error("Ошибка загрузки данных");
      });
  }, [operMonitState.filter]);

  useEffect(() => {
    // Загрузка данных по фильтрам
    fetchOperativeMonitoring();
    startPolling(
      fetchOperativeMonitoring,
      config.longPollingSeconds.operativeMonitoring * 1000
    );
    return () => stopPolling();
  }, [fetchOperativeMonitoring]);

  return (
    <TableBlockWrapperStyled>
      <Row
        gutter={12}
        justify={"space-between"}
        style={{ height: "100%", width: "100%" }}
        wrap={false}
      >
        <Col flex={"auto"} style={{ height: "100%", overflowY: "auto" }}>
          <Spin spinning={loading}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <CustomCard>
                  <OperativeMonitoringFilterPanel />
                </CustomCard>
              </Col>
            </Row>
            <Row align={"middle"} justify={"center"}>
              <Col span={24}>
                {operMonitState.model.ostList.length > 0 ? (
                  <CustomCard>
                    <Osts ostList={operMonitState.model.ostList} />
                  </CustomCard>
                ) : (
                  <Empty description={" Нет данных"} />
                )}
              </Col>
            </Row>
          </Spin>
        </Col>

        <Col flex="584px" style={{ height: "100%" }}>
          <EventsColumn
            onSelectEventHandler={onSelectEventHandler}
            filtersLoading={filtersLoading}
            filterValues={filterValues}
            onLevelChange={onLevelChange}
            nextEventsHandler={nextEventsHandler}
            nextButtonDisable={nextButtonDisable}
            nextButtonLoading={nextButtonLoading}
            commentHandler={commentHandler}
            isLoading={isLoading}
            isConfigured={isConfigured}
            allEvents={allEvents}
            eventsCardFilterValues={eventsCardFilterValues}
            onTypeChange={onTypeChange}
            onAcknowledgeChange={onAcknowledgeChange}
            onDateChange={onDateChange}
            height={"100%"}
            isCtrl={isCtrl}
            onSwitch={onSwitch}
            showSwitch={false}
          />
        </Col>
      </Row>

      <Modal
        maskClosable={false}
        visible={commentModalVisible}
        title={`Квитирование`}
        destroyOnClose
        footer={null}
        onCancel={onCancelCommentHandler}
      >
        <CommentForm<EventItem>
          initial={selectedEvent}
          submitCallback={commentHandler}
          showUseInReports={false}
        />
      </Modal>
    </TableBlockWrapperStyled>
  );
};
