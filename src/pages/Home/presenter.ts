import { message } from "antd";
import { Moment } from "moment";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { HomeStateType, setIsCtrlEvents } from "slices/home";
import { FilterType } from "../../api/params/get-events-params";
import { EventItem } from "../../classes";
import { User } from "../../classes/User";
import { IMenuNav } from "../../interfaces";
import {
  EventsStateType,
  setAcknowledgeFilter,
  setAllEvents,
  setCommentModalVisible,
  setCurrentPage,
  setDateFilter,
  setLevelFilter,
  setSelectedEvent,
  setTypeFilter,
} from "../../slices/events";
import {
  getCardEventsFiltersTC,
  getCardEventsTC,
  postEventCommentTC,
} from "../../thunks/events";
import { StateType } from "../../types";
import { config } from "../../utils";
import { useLongPolling } from "../../customHooks/useLongPolling";
import {
  CtrlEventsStateType,
  setCtrlAllEvents,
  setCtrlCurrentPage,
  setCtrlDateFilter,
  setCtrlTypeFilter,
  setForExecutionFilter,
  setOnlyReadFilter,
} from "slices/pspControl/ctrlEvents";
import {
  getCtrlCardEventsFiltersTC,
  getCtrlCardEventsTC,
  сtrlCardsEventHandleTC,
} from "thunks/pspControl/ctrlEvents";
import { AbilityContext, ActionsEnum } from "../../casl";
import {
  CtrlEventHandleTypeEnum,
  CtrlEventsItem,
} from "pages/PspControl/CtrlEventsPage/types";
import { getEventsWidgetTC } from "thunks/home";

const usePresenter = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const ability = useContext(AbilityContext);
  const location = useLocation();

  const [startPolling, stopPolling] = useLongPolling();
  const [startPollingWidgets, stopPollingWidgets] = useLongPolling();
  const showSwitch =
    ability.can(ActionsEnum.Go, "/events") &&
    ability.can(ActionsEnum.Go, "/pspcontrol/ctrlevents");

  // Значения из состояния
  const {
    filtersLoading,
    isLoading,
    eventsCardFilterValues,
    filterValues,
    currentPage,
    nextButtonDisable,
    allEvents,
    isConfigured,
    nextButtonLoading,
    commentModalVisible,
    selectedEvent,
    widgetEventLoading,
  } = useSelector<StateType, EventsStateType>((state) => state.events);

  // Значения из состояния событий надзора
  const ctrlEventsState = useSelector<StateType, CtrlEventsStateType>(
    (state) => state.ctrlEvents
  );

  // Значения из состояния
  const { user, isEventsCountLoading, showWidgets, isCtrlEvents, cards } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isCtrl = isCtrlEvents;

  const urlMapping = new Map(Object.entries(config.urlMapping));
  const currentUser = user;
  // Навигационное меню
  const navs = cards;
  // Идентификатор пользователя
  const userId = currentUser.id;

  /// АИСМСС
  const onWidgetClick = async (nav: IMenuNav, critical: boolean) => {
    if (nav.eventGroup) {
      const filter: FilterType = {
        critical: critical,
        id: nav.eventGroup.eventGroupId,
      };
      history.push("/events", filter);
    } else {
      message.error("Ошибка загрузки событий");
    }
  };

  const commentHandler = (item: EventItem) => {
    // Квитировать событие
    return new Promise<void>(() => {
      dispatch(postEventCommentTC(item));
    });
  };

  const nextEventsHandler = () => {
    // Кнопка загрузить слеующие события на карточке событий
    const newPage = currentPage + 1;
    dispatch(setCurrentPage(newPage));
    dispatch(
      getCardEventsTC({
        params: { userId: userId, page: newPage },
        filter: filterValues,
      })
    );
  };
  const onSwitch = () => {
    dispatch(setIsCtrlEvents(!isCtrl));
  };

  const onTypeChange = (type: number) => {
    // Фильтр по типу
    dispatch(setTypeFilter(type));
  };

  const onLevelChange = (level: number) => {
    // Фильтр по уровню критичности
    dispatch(setLevelFilter(level));
  };

  const onAcknowledgeChange = (acknowledge: number) => {
    // Фильтр по статусу квитирования
    dispatch(setAcknowledgeFilter(acknowledge));
  };

  const onDateChange = (dates: [Date, Date]) => {
    // Фильтр по датам
    dispatch(setDateFilter(dates));
  };

  const onSelectEventHandler = (event: EventItem) => {
    // Выбрать событие
    dispatch(setSelectedEvent(event));
  };

  const onCancelCommentHandler = () => {
    // Закрыть модельное окно квитирования
    dispatch(setCommentModalVisible(false));
  };

  const fetchCardEvents = useCallback(() => {
    dispatch(setAllEvents([]));
    dispatch(setCurrentPage(1));
    dispatch(
      getCardEventsTC({
        params: { userId: userId, page: 1 },
        filter: filterValues,
      })
    );
  }, [filterValues]);

  useEffect(() => {
    if (!isCtrl) {
      // Первая инициализация филтров и данных по карточке
      dispatch(getCardEventsFiltersTC({ userId: userId }));
    }
  }, [isCtrl]);

  useEffect(() => {
    if (!isCtrl) {
      // Загрузка данных по фильтрам
      fetchCardEvents();
      startPolling(fetchCardEvents, config.longPollingSeconds.events * 1000);
      return () => stopPolling();
    }
  }, [fetchCardEvents, isCtrl]);

  const fetchWidgets = useCallback(() => {
    if (location.pathname === "/" && showWidgets) dispatch(getEventsWidgetTC());
  }, []);

  useEffect(() => {
    // Загрузка данных по фильтрам
    fetchWidgets();
    startPollingWidgets(fetchWidgets, config.longPollingSeconds.events * 1000);
    return () => stopPollingWidgets();
  }, [fetchWidgets]);

  /// Надзор
  const fetchCtrlCardEvents = useCallback(() => {
    dispatch(setCtrlAllEvents([]));
    dispatch(setCtrlCurrentPage(1));
    dispatch(
      getCtrlCardEventsTC({
        params: { userId: userId, page: 1 },
        filter: ctrlEventsState.ctrlFilterValues,
      })
    );
  }, [ctrlEventsState.ctrlFilterValues]);
  useEffect(() => {
    if (isCtrl) {
      // Первая инициализация филтров и данных по карточке
      dispatch(getCtrlCardEventsFiltersTC({ userId: userId }));
    }
  }, [isCtrl]);
  useEffect(() => {
    if (isCtrl) {
      // Загрузка данных по фильтрам
      fetchCtrlCardEvents();
      startPolling(
        fetchCtrlCardEvents,
        config.longPollingSeconds.events * 1000
      );
      return () => stopPolling();
    }
  }, [fetchCtrlCardEvents, isCtrl]);

  const nextCtrlEventsHandler = () => {
    // Кнопка загрузить слеующие события на карточке событий
    const newPage = currentPage + 1;
    dispatch(setCurrentPage(newPage));
    dispatch(
      getCtrlCardEventsTC({
        params: { userId: userId, page: newPage },
        filter: ctrlEventsState.ctrlFilterValues,
      })
    );
  };

  const onCtrlTypeChange = (type: number) => {
    // Фильтр по типу
    dispatch(setCtrlTypeFilter(type));
  };

  const onForExecutionChange = (forExecution: boolean) => {
    // Фильтр по уровню критичности
    dispatch(setForExecutionFilter(forExecution));
  };

  const onOnlyReadChange = (onlyRead: boolean) => {
    // Фильтр по статусу квитирования
    dispatch(setOnlyReadFilter(onlyRead));
  };

  const onCtrlDateChange = (dates: [Date, Date]) => {
    // Фильтр по датам
    dispatch(setCtrlDateFilter(dates));
  };

  const onAccHandle = (event: CtrlEventsItem) => {
    if (event.link) history.push(event.link);
    else {
      message.error("Отсутсвует ссылка на объект события");
      return;
    }
    if (!event.isAcquaintance)
      dispatch(
        сtrlCardsEventHandleTC({
          event: event,
          handleType: CtrlEventHandleTypeEnum.IsAcquaintance,
        })
      );
  };

  const onForExecutionHandle = (event: CtrlEventsItem) => {
    return new Promise<void>(async (resolve) => {
      await dispatch(
        сtrlCardsEventHandleTC({
          event: event,
          handleType: CtrlEventHandleTypeEnum.ForExecution,
        })
      );
      resolve();
    });
  };

  return {
    urlMapping,
    navs,
    filtersLoading,
    isLoading,
    eventsCardFilterValues,
    commentHandler,
    filterValues,
    currentPage,
    nextButtonDisable,
    nextEventsHandler,
    allEvents,
    isConfigured,
    nextButtonLoading,
    onLevelChange,
    onTypeChange,
    onAcknowledgeChange,
    onDateChange,
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
  };
};

export default usePresenter;
