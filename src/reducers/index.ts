import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import { createBrowserHistory } from "history";
import { siknOffReducer } from "./siknoffs";
import { importExcelReducer } from "./importExcel";
import { failuresReducer } from "./failures";
import { eventsReducer } from "./events";
import { toKmhReducer } from "./tokmh";
import { coefReducer } from "./coefs";
import { eventSettingsReducer } from "./eventsettings";
import { groupEventSettingsReducer } from "./groupeventsettings";
import { editorSiMapReducer } from "./editorSiMap";
import { editorSiModelReducer } from "./editorSiModel";
import { editorSiEqReducer } from "./siequipment";
import { measRangeReducer } from "./measRange";
import { dataSiReducer } from "./dataSi";
import { operMonitReducer } from "./operativemonotoring";
import riskSettings from "../slices/riskSettings";
import eventsCharts from "../slices/eventsCharts";
import { riskRatingInfoReducer } from "./riskratinginfo";
import historyLimitInfo from "../slices/historylimitinfo";
import { historyLimitInfoReducer } from "./historylimitinfo";
import checkingObjects from "../slices/pspControl/checkingObjects";
import customFilter from "../slices/customFilter";
import { verificationScheduleReducer } from "../slices/pspControl/verificationSchedule";
import verificationActs from "../slices/verificationActs/verificationActs";
import verificationAct from "../slices/verificationActs/verificationAct";
import { actionPlansReducer } from "../slices/pspControl/actionPlans";
import algorithms from "../slices/algorithmStatus/algorithms";
import { planCardReducer } from "../slices/pspControl/planCard";
import { verificationScheduleCardReducer } from "../slices/pspControl/verificationScheduleCard";
import { operandsReducer } from "../slices/algorithmStatus/operands";
import FAQSlice from "../slices/FAQ";
import actionPlanTypicalViolations from "../slices/pspControl/actionPlanTypicalViolations";
import { ostRnuInfoReducer } from "../slices/ostRnuInfo";
import nsiSlice from "../slices/nsi";
import eventsSlice from "../slices/events";
import { settingsReducer } from "../slices/algorithmStatus/settings";
import { eliminationOfViolationsReducer } from "../slices/pspControl/eliminationOfViolations";
import roleSettings from "../slices/roleSettings";
import homeSlice from "../slices/home";
import ctrlEventsSlice from "../slices/pspControl/ctrlEvents";
import siequipment from "../slices/siequipment";
import { acquaintanceReducer } from '../slices/pspControl/acquaintance';
import { ksPpILProgramsReducer } from "../slices/pspControl/ksPpILPrograms";
import { eliminationOfTypicalViolationsReducer } from "../slices/pspControl/eliminationOfTypicalViolations";
import verificationActCommissionModalSlice from "slices/verificationActs/verificationAct/verificationActCommissionModalSlice";
import { ctrleventSettingsReducer } from "./ctrleventsettings";
import { ctrlgroupEventSettingsReducer } from "./crtlgroupeventsettings";
import importAttemptsHistorySlice from "../slices/importAttemptsHistory";
import importAttemptsHistoryCardSlice from "../slices/importAttemptsHistoryCard";
import iotspdSlice from "../slices/iotspd";
import ctrlNsiSlice from "../slices/ctrlNsi";
import tspdNsiSlice from "../slices/tspdNsi";


const createRootReducer = (history: ReturnType<typeof createBrowserHistory>) =>
  combineReducers({
    router: connectRouter(history),
    home: homeSlice,
    siknOffs: siknOffReducer,
    importExcel: importExcelReducer,
    failures: failuresReducer,
    eventsReducer: eventsReducer,
    toKmh: toKmhReducer,
    coefs: coefReducer,
    eventSettings: eventSettingsReducer,
    ctrleventSettings: ctrleventSettingsReducer,
    groupEventSettings: groupEventSettingsReducer,
    ctrlgroupEventSettings: ctrlgroupEventSettingsReducer,
    editorSiMap: editorSiMapReducer,
    editorSiModel: editorSiModelReducer,
    editorSiEq: editorSiEqReducer,
    measRange: measRangeReducer,
    dataSi: dataSiReducer,
    operMonit: operMonitReducer,
    riskSettings: riskSettings,
    riskRatingInfo: riskRatingInfoReducer,
    historyLimitInfo: historyLimitInfoReducer,
    eventsCharts: eventsCharts,
    checkingObjects: checkingObjects,
    customFilter: customFilter,
    verificationSchedule: verificationScheduleReducer,
    historyLimit: historyLimitInfo,
    verificationActs: verificationActs,
    verificationAct,
    actionPlans: actionPlansReducer,
    algorithms: algorithms,
    planCard: planCardReducer,
    verificationScheduleCard: verificationScheduleCardReducer,
    FAQ: FAQSlice,
    ostRnuInfo: ostRnuInfoReducer,
    nsi: nsiSlice,
    actionPlanTypicalViolations,
    operands: operandsReducer,
    settings: settingsReducer,
    events: eventsSlice,
    eliminationOfViolations: eliminationOfViolationsReducer,
    acquaintance: acquaintanceReducer,
    roleSettings: roleSettings,
    siequipment: siequipment,
    ksPpILPrograms: ksPpILProgramsReducer,
    eliminationOfTypicalViolations: eliminationOfTypicalViolationsReducer,
    verificationActCommissionModal: verificationActCommissionModalSlice,
    ctrlEvents: ctrlEventsSlice,
    importAttemptsHistory: importAttemptsHistorySlice,
    importAttemptsHistoryCard: importAttemptsHistoryCardSlice,
    iotspd: iotspdSlice,
    ctrlNsi: ctrlNsiSlice,
    tspdNsi: tspdNsiSlice,
  });

export default createRootReducer;
