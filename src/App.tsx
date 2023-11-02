/// <reference path='./images.d.ts'/>
import { hot } from "react-hot-loader/root";
import { FunctionComponent, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import "./styles/app.scss";
import { Layout } from "antd";
import { Frame } from "./components/Frame";
import { ToKmhPage } from "./pages/ToKmh";
import { FailuresPage } from "./pages/Failures";
import { EventsPage } from "./pages/EventsPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { CoefsPage } from "./pages/Coefs";
import { AdminEventsSettingsPage } from "./pages/AdminEventsSettingsPage";
import { EditorSiPage } from "./pages/EditorSiPage";
import { SiEquipmentLimitsPage } from "./pages/SiEquipmentLimits";
import { DataSiPage } from "./pages/DataSiPage";
import { OrgStructureFrame } from "./components/OrgStructureFrame";
import { OperativeMonitoringSiknPage } from "./pages/OperativeMonitoringSiknPage";
import { RiskSettings } from "./pages/RiskSettings";
import { RiskRatingPage } from "./pages/RiskRatingPage";
import { RiskRatingDetailedInfoPage } from "./pages/RiskRatingDetailedInfoPage";
import { HistoryLimitPage } from "./pages/HistoryLimitPage";
import { EventsCharts } from "./pages/EventsCharts";
import { PspPage } from "./pages/PspControl/PspPage";
import { VerificationSchedulePage } from "./pages/PspControl/VerificationSchedulePage";
import { VerificationActsPage } from "./pages/VerificationActs";
import { ActionPlansPage } from "./pages/PspControl/ActionPlans";
import { AlgorithmStatus } from "./pages/AlgorithmStatus";
import { PlanCardPage } from "./pages/PspControl/PlanCardPage";
import { VerificationScheduleCardPage } from "./pages/PspControl/VerificationScheduleCardPage";
import { FAQPage } from "./pages/FAQ";
import { EventsSettingsPage } from "./pages/EventsSettingsPage";
import { OstRnuInfoModal } from "./components/OstRnuInfoModal";
import { NsiPage } from "./pages/Nsi";
import { Home } from "./pages/Home";
import { CaslDemoPage } from "./pages/CaslDemoPage";
import defineAbilityFor, { AbilityContext, ActionsEnum } from "./casl";
import { SiknOffPage } from "./pages/SiknOff";
import Result from "antd/lib/result";
import { MenuSider } from "./components/MenuSider";
import { Header } from "./components/Header";
import { Preloader } from "./components/Preloader";
import { EliminationOfViolationsPage } from "./pages/PspControl/EliminationOfViolations";
import { SiknOffRoute } from "./pages/SiknOff/constants";
import { ToKmhRoute } from "./pages/ToKmh/constant";
import { CoefsRoute } from "./pages/Coefs/constant";
import { FailuresRoute } from "./pages/Failures/constant";
import { EditorSiRoute } from "./pages/EditorSiPage/constant";
import { AlgorithmStatusRoute } from "./pages/AlgorithmStatus/constant";
import { SiEquipmentLimitsRoute } from "./pages/SiEquipmentLimits/constant";
import { FAQRoute } from "./pages/FAQ/constant";
import { RoleSettingsPage } from "./pages/RoleSettings";
import { KsPpILProgramsPage } from "./pages/PspControl/KsPpILPrograms";
import {
  VerificationActPage,
  AcquaintancePage,
  EliminationOfTypicalViolationsPage,
  CheckingObjectsPage,
} from "./split-pages";
import { authRequestTC } from "thunks/home";
import { useDispatch, useSelector } from "react-redux";
import { HomeStateType, setIsCtrlEvents } from "slices/home";
import { StateType } from "types";
import { EliminationOfTypicalViolations } from "./pages/PspControl/EliminationOfTypicalViolations";
import { CheckingObjectsRoute } from "pages/PspControl/CheckingObjectsPage/constant";
import { VerificationScheduleRoute } from "pages/PspControl/VerificationSchedulePage/constant";
import { VerificationActsRoute } from "pages/VerificationActs/constant";
import { ActionPlansRoute } from "pages/PspControl/ActionPlans/constant";
import { EliminationOfViolationsRoute } from "pages/PspControl/EliminationOfViolations/constants";
import { KsPpILProgramsRoute } from "pages/PspControl/KsPpILPrograms/constants";
import { AcquaintanceRoute } from "pages/PspControl/Acquaintance/constant";
import { CtrlEventsPage } from "pages/PspControl/CtrlEventsPage";
import { ImportAttemptsHistory } from "pages/ImportAttemptsHistory";
import { ImportAttemptsHistoryCard } from "components/ImportAttemptsHistoryCard";
import { IOTSPDPage } from "pages/IOTSPD";
import { tspdNsiPage } from "pages/tspdNsi";
import { CtrlNsiPage } from "pages/CtrlNsi";
import { ReportsPage } from "pages/ReportsPage";

const { Content } = Layout;

export const App: FunctionComponent = () => {
  const dispatch = useDispatch();

  const { isLoading, user, resultStatusType, error, currentSelectedMenuKey } =
    useSelector<StateType, HomeStateType>((state) => state.home);

  useEffect(() => {
    // вызываем метод авторизации на бэке
    dispatch(authRequestTC());
  }, []);

  useEffect(() => {
    if (user.featuresList) {
      const ability = defineAbilityFor(user);
      const isCtrlDefault =
        ability.cannot(ActionsEnum.Go, "/events") &&
        ability.can(ActionsEnum.Go, "/pspcontrol/ctrlevents");
      dispatch(setIsCtrlEvents(isCtrlDefault));
    }
  }, [user]);

  return (
    <>
      {/* если грузится, выводим прелоадер */ }
      { isLoading && <Preloader/> }

      {/* если ничего не грузится и есть ошибка */ }
      { !isLoading && !!error && (
        <>
          {/* выводим Result с ошибкой сервера */ }
          <Result
            status={ resultStatusType }
            title={
              !error?.response?.status ? "Ошибка" : error?.response?.status
            }
            subTitle={
              !error?.response?.data?.message
                ? "Ошибка сервера"
                : error.response.data.message
            }
          />
        </>
      ) }

      { !isLoading && !error && user.featuresList && (
        <AbilityContext.Provider value={ defineAbilityFor(user) }>
          <Layout style={ { minHeight: "100vh", height: "100vh" } }>
            <Header currentUser={ user }/>
            <Content style={ { display: "flex" } }>
              <Layout className="site-layout" style={ { padding: "64px 0 0 0" } }>
                {/* меню слева */ }
                {/* <MenuSider
                  currentUser={ user }
                  currentSelectedMenuKey={ currentSelectedMenuKey }
                /> */}
                <Content
                  style={ {
                    padding: 16,
                    paddingBottom: 0,
                    margin: 0,
                    // marginLeft: 80,
                    display: "flex",
                  } }
                >
                  <Switch>
                    {/* компонент Home на главной странице */ }
                    <Route exact path="/" component={ Home }/>

                    {/* отчеты на своей странице */}
                    <Route path="/reports" component={ ReportsPage }/>

                    {/* события */}
                    <PrivateRoute path="/events" component={ EventsPage }/>

                    <PrivateRoute
                      exact
                      path="/risk-settings"
                      component={ RiskSettings }
                    />
                    <PrivateRoute path="/frame/:frameName" component={ Frame }/>
                    <PrivateRoute
                      path="/orgstructure/:frameName"
                      component={ OrgStructureFrame }
                    />
                    <PrivateRoute path="/catalogues" component={ NsiPage }/>
                    <PrivateRoute path={ SiknOffRoute } component={ SiknOffPage }/>
                    <PrivateRoute path={ ToKmhRoute } component={ ToKmhPage }/>
                    <PrivateRoute path={ CoefsRoute } component={ CoefsPage }/>
                    <PrivateRoute
                      exact
                      path="/import"
                      component={ ImportAttemptsHistory }
                    />
                    <PrivateRoute
                      path="/import/:attemptId"
                      component={ ImportAttemptsHistoryCard }
                    />
                    <PrivateRoute
                      path={ FailuresRoute }
                      component={ FailuresPage }
                    />
                    <PrivateRoute
                      path={ EditorSiRoute }
                      component={ EditorSiPage }
                    />
                    <PrivateRoute
                      path={ SiEquipmentLimitsRoute }
                      component={ SiEquipmentLimitsPage }
                    />
                    <PrivateRoute
                      path="/groupeventssettings"
                      component={ AdminEventsSettingsPage }
                    />
                    <PrivateRoute
                      path="/operativesikn"
                      component={ OperativeMonitoringSiknPage }
                    />
                    <PrivateRoute
                      path="/riskrating"
                      component={ RiskRatingPage }
                    />
                    <PrivateRoute
                      path="/riskratinginfo/:siknId"
                      component={ RiskRatingDetailedInfoPage }
                    />
                    <PrivateRoute exact path="/datasi" component={ DataSiPage }/>
                    <PrivateRoute
                      exact
                      path="/datasi/:siId"
                      component={ EventsCharts }
                    />
                    <PrivateRoute
                      path="/settings/events"
                      component={ EventsSettingsPage }
                    />
                    <PrivateRoute
                      path="/operativesikn"
                      component={ OperativeMonitoringSiknPage }
                    />
                    <Route path="/historylimit" component={ HistoryLimitPage }/>
                    <PrivateRoute
                      path={ CheckingObjectsRoute }
                      exact
                      component={ CheckingObjectsPage }
                    />
                    <PrivateRoute
                      path="/pspcontrol/checkingobjects/:pspId"
                      component={ PspPage }
                    />
                    <PrivateRoute
                      exact
                      path={ VerificationScheduleRoute }
                      component={ VerificationSchedulePage }
                    />
                    <PrivateRoute
                      exact
                      path="/pspcontrol/verification-schedule/:scheduleId"
                      component={ VerificationScheduleCardPage }
                    />
                    <PrivateRoute
                      path={ VerificationActsRoute }
                      exact
                      component={ VerificationActsPage }
                    />
                    <PrivateRoute
                      path="/pspcontrol/verification-acts/:actId"
                      exact
                      component={ VerificationActPage }
                    />
                    <PrivateRoute
                      exact
                      path={ ActionPlansRoute }
                      component={ ActionPlansPage }
                    />
                    <PrivateRoute
                      exact
                      path="/pspcontrol/action-plans/cards/:planId"
                      component={ PlanCardPage }
                    />
                    <PrivateRoute
                      exact
                      path="/pspcontrol/action-plans/typical-violations/"
                      component={ EliminationOfTypicalViolationsPage }
                    />
                    <PrivateRoute
                      path={ AlgorithmStatusRoute }
                      component={ AlgorithmStatus }
                    />
                    <PrivateRoute exact path={ FAQRoute } component={ FAQPage }/>
                    <PrivateRoute path="/casl-demo" component={ CaslDemoPage }/>
                    <PrivateRoute
                      path={ EliminationOfViolationsRoute }
                      component={ EliminationOfViolationsPage }
                    />
                    <PrivateRoute
                      path="/role-settings"
                      component={ RoleSettingsPage }
                    />
                    <PrivateRoute
                      path={ AcquaintanceRoute }
                      exact
                      component={ AcquaintancePage }
                    />
                    <PrivateRoute
                      path={ KsPpILProgramsRoute }
                      component={ KsPpILProgramsPage }
                    />
                    <PrivateRoute
                      path="/pspcontrol/elimination-of-typical-violations/:pspId"
                      component={ EliminationOfTypicalViolations }
                    />
                    <PrivateRoute
                      path="/pspcontrol/ctrlevents"
                      component={ CtrlEventsPage }
                    />
                    <PrivateRoute path="/iotspd" component={ IOTSPDPage }/>
                    <PrivateRoute path="/ctrl-nsi" component={ CtrlNsiPage }/>
                    <PrivateRoute path="/tspd-nsi" component={ tspdNsiPage }/>                    
                  </Switch>
                </Content>
              </Layout>
            </Content>
          </Layout>
          <OstRnuInfoModal/>
        </AbilityContext.Provider>
      ) }
    </>
  );
};

export default hot(App);
