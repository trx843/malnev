import { FunctionComponent } from "react";
import { Row, Col, Modal, Spin } from "antd";
import { EventsColumn } from "components/EventsColumn";
import { MenuCards } from "components/MenuCards";
import usePresenter from "./presenter";
import "../../styles/home.css";
import { CommentForm } from "components/CommentForm";
import { EventItem } from "../../classes";
import { ActionsEnum, Can } from "../../casl";
import { CtrlEventsColumn } from "components/CtrlEventsColumn";

export const Home: FunctionComponent = () => {
  const {
    urlMapping,
    navs,
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
    onWidgetClick,
    widgetEventLoading,
    isEventsCountLoading,
    isCtrl,
    onSwitch,
    ctrlEventsState,
    showSwitch,
    onCtrlTypeChange,
    onForExecutionChange,
    onOnlyReadChange,
    onCtrlDateChange,
    onAccHandle,
    onForExecutionHandle,
    nextCtrlEventsHandler,
  } = usePresenter(); // хук, в котором описана вся логика

  return (
    <Spin spinning={widgetEventLoading}>
      <Row gutter={24} wrap={false}>
        <Col>
          {/* карточки на главной странице */}
          <MenuCards
            isEventsCountLoading={isEventsCountLoading}
            navs={navs}
            onWidgetClick={onWidgetClick}
            urlMapping={urlMapping}
          />
        </Col>
        {/* использование библиотеки Casl для отображения информации, если она доступна текущему пользователю по его правам */}
        <Can I={ActionsEnum.Go} a={"/events"}>
          {!isCtrl && (
            <Col>
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
                height={"calc(100vh - 98px)"}
                isCtrl={isCtrl}
                onSwitch={onSwitch}
                showSwitch={showSwitch}
              />
            </Col>
          )}
        </Can>
        <Can I={ActionsEnum.Go} a={"/pspcontrol/ctrlevents"}>
          {isCtrl && (
            <Col>
              <CtrlEventsColumn
                onAccHandle={onAccHandle}
                onForExecutionHandle={onForExecutionHandle}
                filtersLoading={ctrlEventsState.ctrlFiltersLoading}
                filterValues={ctrlEventsState.ctrlFilterValues}
                nextEventsHandler={nextCtrlEventsHandler}
                nextButtonDisable={ctrlEventsState.ctrlNextButtonDisable}
                nextButtonLoading={ctrlEventsState.ctrlNextButtonLoading}
                isLoading={ctrlEventsState.ctrlIsLoading}
                isConfigured={ctrlEventsState.ctrlIsConfigured}
                allEvents={ctrlEventsState.ctrlAllEvents}
                eventsCardFilterValues={
                  ctrlEventsState.ctrlEventsCardFilterValues
                }
                onTypeChange={onCtrlTypeChange}
                onForExecutionChange={onForExecutionChange}
                onOnlyReadChange={onOnlyReadChange}
                onDateChange={onCtrlDateChange}
                height={"calc(100vh - 125px)"}
                isCtrl={isCtrl}
                onSwitch={onSwitch}
                showSwitch={showSwitch}
              />
            </Col>
          )}
        </Can>
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
    </Spin>
  );
};
