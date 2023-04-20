import { Component } from "react";
import {
  Button,
  Skeleton,
  Steps,
  Row,
  Col,
  Space,
  message,
  Tooltip,
} from "antd";
import styled from "styled-components";
import {
  ControlMaintEvents,
  ControlResultsModel,
} from "../classes/ControlMaintEvents";
import { ListFilterBase, SelectedNode } from "../interfaces";
import { FieldArray, Formik, FormikHelpers } from "formik";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import {
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  SubmitButton,
  DatePicker,
  Radio,
} from "formik-antd";
import {
  apiBase,
  dateToShortString,
  returnStringDate,
  zeroGuid,
} from "../utils";
import axios from "axios";
import locale from "antd/es/date-picker/locale/ru_RU";
import {
  TextDarkStyled as DarkStyled,
  TextGrayStyled as GrayStyled,
  TextRedStyled as RedStyled,
} from "../styles/commonStyledComponents";
import { ControlMaintEventTypes } from "../classes/ControlMaintEventTypes";
import PlusCircleFilled from "@ant-design/icons/lib/icons/PlusCircleFilled";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import Sider from "antd/lib/layout/Sider";
import { PspItem } from "../classes/PspItem";
import * as Yup from "yup";
import { FiltersModel, Nullable, ObjectFields, PagedModel } from "../types";
import { InFormTable } from "./InFormTable";
import { TechPositions } from "../classes";
import { GridApi } from "ag-grid-community";
import moment from "moment";
import { ControlResultsSiTypeRules } from "../classes/ControlResultsSiTypeRules";
import { ControlResultsSiTypeRanges } from "../classes/ControlResultsSiTypeRanges";
import { ActionsEnum, Can } from "../casl";
import { elementId, ToKmhElements } from "../pages/ToKmh/constant";

interface IInsertResultToKmhProps {
  initial?: ControlMaintEvents;
  submitCallback: (item: ControlMaintEvents) => Promise<ControlMaintEvents>;
  node: SelectedNode;
  selectionHandler?: (item: ControlMaintEvents) => void;
}

interface IInsertResultToKmhState {
  loading: boolean;
  step: number;
  psps: Array<PspItem>;
  controlMaintEventsTypes: Array<ControlMaintEventTypes>;
  nearestEvents: Array<ControlMaintEvents>;
  eventTypeId: Nullable<number>;
  gridApi: GridApi;
  nearestEventsLoaded: boolean;
  nearestEventsLoading: boolean;
  selectedEvent: Nullable<ControlMaintEvents>;
  factDate: Nullable<Date>;
  controlResultsSiTypeRules: Array<ControlResultsSiTypeRules>;
  controlResultsSiTypeRanges: Array<ControlResultsSiTypeRanges>;
  siTypeId: Nullable<number>;
  qjRule: number;
  kjRule: number;
  kjCalcRule: number;
  deltaRule: number;
  tjRule: number;
  pjprRule: number;
  vjRule: number;
  pjRule: number;
  valControlSiRule: number;
  valStanSiRule: number;
  eventType: Nullable<number>;
  siType: Nullable<number>;
  qjMin: Nullable<number>;
  qjMax: Nullable<number>;
  kjMin: Nullable<number>;
  kjMax: Nullable<number>;
  kjCalcMin: Nullable<number>;
  kjCalcMax: Nullable<number>;
  deltaMin: Nullable<number>;
  deltaMax: Nullable<number>;
  tjMin: Nullable<number>;
  tjMax: Nullable<number>;
  pjprMin: Nullable<number>;
  pjprMax: Nullable<number>;
  vjMin: Nullable<number>;
  vjMax: Nullable<number>;
  pjMin: Nullable<number>;
  pjMax: Nullable<number>;
  qjType: Nullable<number>;
  kjType: Nullable<number>;
  kjCalcType: Nullable<number>;
  deltaType: Nullable<number>;
  tjType: Nullable<number>;
  pjprType: Nullable<number>;
  vjType: Nullable<number>;
  pjType: Nullable<number>;
  isQjHidden: boolean;
  isKjHidden: boolean;
  isKjCalcHidden: boolean;
  isDeltaHidden: boolean;
  isTjHidden: boolean;
  isPjprHidden: boolean;
  isVjHidden: boolean;
  isPjHidden: boolean;
  isValControlSi: boolean;
  isValStanSi: boolean;
  isButtonDisabled: boolean;
}

const { Step } = Steps;

type Step = {
  title: string;
  content: JSX.Element | string;
};

const TitleStyled = styled.div`
  width: 100%;
  background: #e8f4ff;
  font-family: "IBM Plex Sans";
  font-weight: 500;
  font-size: 16px;
  color: #667985;
  padding: 8px 0 8px 12px;
  margin-bottom: 24px;
  border: none;
`;

const WarnTitleStyled = styled.div`
  width: 100%;
  background: #fffbe6;
  font-family: "IBM Plex Sans";
  font-weight: 500;
  font-size: 16px;
  color: #667985;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid #ffe58f;
  box-sizing: border-box;
  border-radius: 2px;
`;

const SelectedTitleStyled = styled.div`
  width: 100%;
  background: #f6ffed;
  font-family: "IBM Plex Sans";
  font-weight: 500;
  font-size: 16px;
  color: #667985;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid #b7eb8f;
  box-sizing: border-box;
  border-radius: 2px;
`;

const minV = Number.NEGATIVE_INFINITY;
const maxV = Number.POSITIVE_INFINITY;

const defaultValidationConf = {
  eventTypeId: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  protocolNum: Yup.string()
    .nullable()
    .trim()
    .required("Поле обязательно к заполнению!"),
  factDate: Yup.date().nullable().required("Поле обязательно к заполнению!"),
  toirName: Yup.string()
    .nullable()
    .trim()
    .required("Поле обязательно к заполнению"),
  standartType: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  standartModel: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  standartNumber: Yup.string()
    .nullable()
    .required("Поле обязательно к заполнению!"),
  note: Yup.string()
    .nullable()
    .when("planDate", {
      is: null,
      then: Yup.string().nullable().required("Поле обязательно к заполнению!"),
    }),
};

//1
const qjValidationConf = {
  qj: Yup.number()
    .nullable()
    .required("Поле обязательно к заполнению!")
    .typeError("Поле обязательно к заполнению!"),
};
//2
const kjValidationConf = {
  kj: Yup.number()
    .nullable()
    .required("Поле обязательно к заполнению!")
    .typeError("Поле обязательно к заполнению!"),
};
//3
const kjCalcValidationConf = {
  kjCalc: Yup.number()
    .nullable()
    .required("Поле обязательно к заполнению!")
    .typeError("Поле обязательно к заполнению!"),
};
//4
const deltaValidationConf = {
  delta: Yup.number()
    .nullable()
    .required("Поле обязательно к заполнению!")
    .typeError("Поле обязательно к заполнению!"),
};
//5
const tjValidationConf = {
  tj: Yup.number()
    .nullable()
    .required("Поле обязательно к заполнению!")
    .typeError("Поле обязательно к заполнению!"),
};
//6
const pjprValidationConf = {
  pjpr: Yup.number()
    .nullable()
    .required("Поле обязательно к заполнению!")
    .typeError("Поле обязательно к заполнению!"),
};
//7
const vjValidationConf = {
  vj: Yup.number()
    .nullable()
    .required("Поле обязательно к заполнению!")
    .typeError("Поле обязательно к заполнению!"),
};
//8
const pjValidationConf = {
  pj: Yup.number()
    .nullable()
    .required("Поле обязательно к заполнению!")
    .typeError("Поле обязательно к заполнению!"),
};

const returnValidationSchema = (
  qjRule: number,
  kjRule: number,
  kjCalcRule: number,
  deltaRule: number,
  tjRule: number,
  pjprRule: number,
  vjRule: number,
  pjRule: number
) => {
  let validationSchema: any = defaultValidationConf;

  let qjValidationSchema;
  let kjValidationSchema;
  let kjCalcValidationSchema;
  let deltaValidationSchema;
  let tjValidationSchema;
  let pjprValidationSchema;
  let vjValidationSchema;
  let pjValidationSchema;

  //1
  if (qjRule === 2)
    qjValidationSchema = {
      ...qjValidationConf,
    };

  //2
  if (kjRule === 2)
    kjValidationSchema = {
      ...kjValidationConf,
    };

  //3
  if (kjCalcRule === 2)
    kjCalcValidationSchema = {
      ...kjCalcValidationConf,
    };

  //4
  if (deltaRule === 2)
    deltaValidationSchema = {
      ...deltaValidationConf,
    };

  //5
  if (tjRule === 2)
    tjValidationSchema = {
      ...tjValidationConf,
    };

  //6
  if (pjprRule === 2)
    pjprValidationSchema = {
      ...pjprValidationConf,
    };

  //7
  if (vjRule === 2)
    vjValidationSchema = {
      ...vjValidationConf,
    };

  //8
  if (pjRule === 2)
    pjValidationSchema = {
      ...pjValidationConf,
    };

  let controlResultsValidationConf = {
    controlResultsModel: Yup.array()
      .of(
        Yup.object().shape({
          ...qjValidationSchema,
          ...kjValidationSchema,
          ...kjCalcValidationSchema,
          ...deltaValidationSchema,
          ...tjValidationSchema,
          ...pjprValidationSchema,
          ...vjValidationSchema,
          ...pjValidationSchema,
        })
      )
      .required("")
      .default({} as any),
  };

  return Yup.object({ ...validationSchema, ...controlResultsValidationConf });
};

export class InsertResultToKmhForm extends Component<
  IInsertResultToKmhProps,
  IInsertResultToKmhState
> {
  constructor(props: IInsertResultToKmhProps) {
    super(props);
    this.state = {
      loading: true,
      step: 0,
      psps: [],
      controlMaintEventsTypes: [],
      nearestEvents: [],
      eventTypeId: this.props.initial ? this.props.initial.eventTypeId : null,
      gridApi: new GridApi(),
      nearestEventsLoaded: false,
      nearestEventsLoading: true,
      selectedEvent: null,
      factDate: this.props.initial ? this.props.initial.factDate : null,
      controlResultsSiTypeRules: [],
      controlResultsSiTypeRanges: [],
      siTypeId: this.props.initial ? this.props.initial.siTypeId : 0,
      qjRule: 1,
      kjRule: 1,
      kjCalcRule: 1,
      deltaRule: 1,
      tjRule: 1,
      pjprRule: 1,
      vjRule: 1,
      pjRule: 1,
      valControlSiRule: 1,
      valStanSiRule: 1,
      eventType: 0,
      siType: 0,
      qjMin: null,
      qjMax: null,
      kjMin: null,
      kjMax: null,
      kjCalcMin: null,
      kjCalcMax: null,
      deltaMin: null,
      deltaMax: null,
      tjMin: null,
      tjMax: null,
      pjprMin: null,
      pjprMax: null,
      vjMin: null,
      vjMax: null,
      pjMin: null,
      pjMax: null,
      qjType: null,
      kjType: null,
      kjCalcType: null,
      deltaType: null,
      tjType: null,
      pjprType: null,
      vjType: null,
      pjType: null,
      isQjHidden: true,
      isKjHidden: true,
      isKjCalcHidden: true,
      isDeltaHidden: true,
      isTjHidden: true,
      isPjprHidden: true,
      isVjHidden: true,
      isPjHidden: true,
      isValControlSi: true,
      isValStanSi: true,
      isButtonDisabled: false,
    };
    this.setApi = this.setApi.bind(this);
  }

  setApi(api: GridApi) {
    this.setState({ gridApi: api });
  }

  disabledtDate = (current: moment.Moment) => {
    return current > moment(Date.now());
  };

  private steps = (setFieldValue: any, values: ControlMaintEvents): Step[] => {
    let stepArray = [
      {
        title: "Идентификация",
        content: (
          <>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  required
                  name="eventTypeId"
                  label={<GrayStyled>Событие</GrayStyled>}
                >
                  <Select
                    showSearch
                    placeholder={"Выберите тип события"}
                    optionFilterProp={"label"}
                    options={this.state.controlMaintEventsTypes.map((x) => ({
                      label: x.shortName,
                      value: x.id,
                      key: x.id,
                    }))}
                    name="eventTypeId"
                    disabled={!!this.props.initial}
                    onChange={(value: number) => {
                      let controlMaintEventType =
                        this.state.controlMaintEventsTypes.length > 0
                          ? this.state.controlMaintEventsTypes
                              .filter((y) => y.id == value)
                              .map((x) => x.shortName)[0]
                          : "";

                      setFieldValue(
                        "controlMaintEventType",
                        controlMaintEventType
                      );

                      let filteredRules =
                        this.state.controlResultsSiTypeRules.filter(
                          (x) =>
                            x.eventType == value &&
                            x.siType == this.initialValues.siTypeId
                        );
                      let qjRule =
                        filteredRules.length > 0
                          ? filteredRules.map((x) => x.qjRule)[0]
                          : 1;
                      let kjRule =
                        filteredRules.length > 0
                          ? filteredRules.map((x) => x.kjRule)[0]
                          : 1;
                      let kjCalcRule =
                        filteredRules.length > 0
                          ? filteredRules.map((x) => x.kjCalcRule)[0]
                          : 1;
                      let deltaRule =
                        filteredRules.length > 0
                          ? filteredRules.map((x) => x.deltaRule)[0]
                          : 1;
                      let tjRule =
                        filteredRules.length > 0
                          ? filteredRules.map((x) => x.tjRule)[0]
                          : 1;
                      let pjprRule =
                        filteredRules.length > 0
                          ? filteredRules.map((x) => x.pjprRule)[0]
                          : 1;
                      let vjRule =
                        filteredRules.length > 0
                          ? filteredRules.map((x) => x.vjRule)[0]
                          : 1;
                      let pjRule =
                        filteredRules.length > 0
                          ? filteredRules.map((x) => x.pjRule)[0]
                          : 1;
                      let valControlSiRule =
                        filteredRules.length > 0
                          ? filteredRules.map((x) => x.valControlSiRule)[0]
                          : 1;
                      let valStanSiRule =
                        filteredRules.length > 0
                          ? filteredRules.map((x) => x.valStanSiRule)[0]
                          : 1;

                      let filteredRanges =
                        this.state.controlResultsSiTypeRanges.filter(
                          (x) =>
                            x.eventType == value &&
                            x.siType == this.initialValues.siTypeId
                        );
                      let qjMinRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.qjMin)[0]
                          : null;
                      let qjMaxRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.qjMax)[0]
                          : null;
                      let kjMinRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.kjMin)[0]
                          : null;
                      let kjMaxRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.kjMax)[0]
                          : null;
                      let kjCalcMinRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.kjCalcMin)[0]
                          : null;
                      let kjCalcMaxRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.kjCalcMax)[0]
                          : null;
                      let deltaMinRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.deltaMin)[0]
                          : null;
                      let deltaMaxRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.deltaMax)[0]
                          : null;
                      let tjMinRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.tjMin)[0]
                          : null;
                      let tjMaxRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.tjMax)[0]
                          : null;
                      let pjprMinRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.pjprMin)[0]
                          : null;
                      let pjprMaxRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.pjprMax)[0]
                          : null;
                      let vjMinRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.vjMin)[0]
                          : null;
                      let vjMaxRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.vjMax)[0]
                          : null;
                      let pjMinRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.pjMin)[0]
                          : null;
                      let pjMaxRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.pjMax)[0]
                          : null;
                      let qjTypeRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.qjType)[0]
                          : null;
                      let kjTypeRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.kjType)[0]
                          : null;
                      let kjCalcTypeRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.kjCalcType)[0]
                          : null;
                      let deltaTypeRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.deltaType)[0]
                          : null;
                      let tjTypeRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.tjType)[0]
                          : null;
                      let pjprTypeRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.pjprType)[0]
                          : null;
                      let vjTypeRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.vjType)[0]
                          : null;
                      let pjTypeRange =
                        filteredRanges.length > 0
                          ? filteredRanges.map((x) => x.pjType)[0]
                          : null;

                      this.setState({
                        eventTypeId: value,
                        nearestEvents: [],
                        factDate: null,
                        nearestEventsLoaded: false,
                        qjRule: qjRule,
                        kjRule: kjRule,
                        kjCalcRule: kjCalcRule,
                        deltaRule: deltaRule,
                        tjRule: tjRule,
                        pjprRule: pjprRule,
                        vjRule: vjRule,
                        pjRule: pjRule,
                        valControlSiRule: valControlSiRule,
                        valStanSiRule: valStanSiRule,
                        qjMin: qjMinRange,
                        qjMax: qjMaxRange,
                        kjMin: kjMinRange,
                        kjMax: kjMaxRange,
                        kjCalcMin: kjCalcMinRange,
                        kjCalcMax: kjCalcMaxRange,
                        deltaMin: deltaMinRange,
                        deltaMax: deltaMaxRange,
                        tjMin: tjMinRange,
                        tjMax: tjMaxRange,
                        pjprMin: pjprMinRange,
                        pjprMax: pjprMaxRange,
                        vjMin: vjMinRange,
                        vjMax: vjMaxRange,
                        pjMin: pjMinRange,
                        pjMax: pjMaxRange,
                        qjType: qjTypeRange,
                        kjType: kjTypeRange,
                        kjCalcType: kjCalcTypeRange,
                        deltaType: deltaTypeRange,
                        tjType: tjTypeRange,
                        pjprType: pjprTypeRange,
                        vjType: vjTypeRange,
                        pjType: pjTypeRange,
                      });
                    }}
                  />
                </FormItem>
                <FormItem hidden name="controlMaintEventType">
                  <Input name="controlMaintEventType"></Input>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  required
                  name="protocolNum"
                  label={<GrayStyled>Номер протокола</GrayStyled>}
                >
                  <Input name="protocolNum"></Input>
                </FormItem>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  required
                  name="factDate"
                  label={<GrayStyled>Фактическая</GrayStyled>}
                >
                  <DatePicker
                    locale={locale}
                    disabledDate={this.disabledtDate}
                    style={{ width: "100%" }}
                    name="factDate"
                    format="DD.MM.YYYY"
                    value={
                      this.state.factDate ? moment(this.state.factDate) : null
                    }
                    allowClear={false}
                    onChange={(value) => {
                      setFieldValue("factDate", value);
                      if (!values.eventTypeId) {
                        message.warn(
                          "Выберите тип события на шаге идентификации для продолжения."
                        );
                        this.setState({
                          factDate: null,
                        });
                        return;
                      }
                      if (value) {
                        this.setState({
                          factDate: value.toDate(),
                        });
                      }
                      if (!this.props.initial && value) {
                        let startDate = new Date(
                          value
                            .toDate()
                            .setDate(new Date(value.toDate()).getDate() - 3)
                        );
                        let endDate = new Date(
                          value
                            .toDate()
                            .setDate(new Date(value.toDate()).getDate() + 3)
                        );

                        const filtersModel: FiltersModel = {
                          startTime: returnStringDate(
                            new Date(
                              startDate.getFullYear(),
                              startDate.getMonth(),
                              startDate.getDate()
                            ),
                            true
                          ),
                          endTime: returnStringDate(
                            new Date(
                              endDate.getFullYear(),
                              endDate.getMonth(),
                              endDate.getDate()
                            ),
                            true,
                            true
                          ),
                          controlMaintEventsFilter: {
                            eventTypeFilter: values.eventTypeId,
                            techPosId: values.techPositionId,
                          },
                        };

                        const listFilter: ListFilterBase = {
                          pageIndex: 0,
                          sortedField: "",
                          isSortAsc: false,
                          filter: {
                            filtersModel,
                            treeFilter: {
                              nodePath: "",
                              isOwn: null,
                            },
                          },
                        };
                        axios
                          .post<PagedModel<ControlMaintEvents>>(
                            `${apiBase}/ControlMaintEvents?page=0`,
                            listFilter
                          )
                          .then((result) => {
                            this.setState({
                              nearestEvents: result.data.entities
                                ? result.data.entities.filter(
                                    (x) =>
                                      x.planDate !== null && x.factDate === null
                                  )
                                : [],
                              nearestEventsLoaded: true,
                              selectedEvent: null,
                            });
                            setFieldValue("inPlan", false);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }
                    }}
                  />
                </FormItem>
              </Col>
              {this.props.initial ? (
                <Col span={8}>
                  <FormItem
                    name="planDate"
                    label={<GrayStyled>Плановая</GrayStyled>}
                  >
                    <DarkStyled>
                      <span>{dateToShortString(values.planDate)}</span>
                    </DarkStyled>
                  </FormItem>
                </Col>
              ) : (
                <></>
              )}
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem name="ostName" label={<GrayStyled>ОСТ</GrayStyled>}>
                  <DarkStyled>
                    <span>{values.ostName}</span>
                  </DarkStyled>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem name="pspName" label={<GrayStyled>ПСП</GrayStyled>}>
                  <DarkStyled>
                    <span>{values.pspName}</span>
                  </DarkStyled>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  name="siknFullName"
                  label={<GrayStyled>СИКН</GrayStyled>}
                >
                  <DarkStyled>
                    <span>{values.siknFullName}</span>
                  </DarkStyled>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  name="techPositionText"
                  label={<GrayStyled>ТП</GrayStyled>}
                >
                  <DarkStyled>
                    <span>{values.techPositionText}</span>
                  </DarkStyled>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  name="siTypeText"
                  label={<GrayStyled>Тип СИ</GrayStyled>}
                >
                  <DarkStyled>
                    <span>{values.siTypeText}</span>
                  </DarkStyled>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  name="siModelName"
                  label={<GrayStyled>Модель СИ</GrayStyled>}
                >
                  <DarkStyled>
                    <span>{values.siModelName}</span>
                  </DarkStyled>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  name="siId"
                  label={<GrayStyled>Заводской номер СИ</GrayStyled>}
                >
                  <DarkStyled>
                    <span>{values.manufNumber}</span>
                  </DarkStyled>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  required
                  name="toirName"
                  label={<GrayStyled>Участок ТОиР</GrayStyled>}
                >
                  <Input style={{ width: "100%" }} name={`toirName`} />
                </FormItem>
              </Col>
            </Row>
            <TitleStyled>
              Поля отмеченные <span style={{ color: "#ff4d4f" }}>*</span>{" "}
              обязательны для заполнения
            </TitleStyled>
          </>
        ),
      },

      {
        title: "Ввод значений",
        content: (
          <>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  required
                  name={`standartModel`}
                  label={<GrayStyled>Модель эталона</GrayStyled>}
                >
                  <Input name={`standartModel`} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  required
                  name={`standartNumber`}
                  label={<GrayStyled>Зав.№ эталона</GrayStyled>}
                >
                  <Input name={`standartNumber`}></Input>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  required
                  name={`standartType`}
                  label={<GrayStyled>Тип Эталона</GrayStyled>}
                >
                  <Input style={{ width: "100%" }} name={`standartType`} />
                </FormItem>
              </Col>
            </Row>
            <FieldArray
              name="controlResultsModel"
              render={(arrayHelpers) => (
                <div>
                  {values.controlResultsModel &&
                  values.controlResultsModel.length > 0 ? (
                    values.controlResultsModel.map((result, index) => (
                      <>
                        <Row gutter={[24, 16]} justify={"space-between"}>
                          <Col>
                            <DarkStyled>Измерение {index + 1}</DarkStyled>
                          </Col>
                          <Col>
                            {values.controlResultsModel &&
                            values.controlResultsModel.length > 1 ? (
                              <DeleteOutlined
                                style={{ color: "red" }}
                                onClick={() => arrayHelpers.remove(index)}
                              />
                            ) : (
                              <div></div>
                            )}
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Tooltip title={"Значение по контролируемому СИ"}>
                            <Col span={8}>
                              <FormItem
                                name={`controlResultsModel.${index}.valControlSi`}
                                label={<GrayStyled>Значение</GrayStyled>}
                                hidden={this.state.valControlSiRule === 0}
                              >
                                <InputNumber
                                  style={{ width: "100%" }}
                                  name={`controlResultsModel.${index}.valControlSi`}
                                />
                              </FormItem>
                            </Col>
                          </Tooltip>
                          <Tooltip title={"Значение по эталонному СИ"}>
                            <Col span={8}>
                              <FormItem
                                name={`controlResultsModel.${index}.valStanSi`}
                                label={<GrayStyled>Эталон</GrayStyled>}
                                hidden={this.state.valStanSiRule === 0}
                              >
                                <InputNumber
                                  style={{ width: "100%" }}
                                  name={`controlResultsModel.${index}.valStanSi`}
                                />
                              </FormItem>
                            </Col>
                          </Tooltip>
                        </Row>
                        <Row gutter={24}>
                          <Tooltip title={"Значение расхода в точке расхода j"}>
                            <Col span={4} hidden={this.state.qjRule === 0}>
                              <FormItem
                                required={this.state.qjRule === 2}
                                name={`controlResultsModel.${index}.qj`}
                                label={<GrayStyled>Qj</GrayStyled>}
                              >
                                <InputNumber
                                  min={this.state.qjMin ?? minV}
                                  max={this.state.qjMax ?? maxV}
                                  style={{ width: "100%" }}
                                  name={`controlResultsModel.${index}.qj`}
                                  type={"number"}
                                  onChange={(value: number) => {
                                    if (
                                      (value &&
                                        this.state.qjRule != 0 &&
                                        this.state.qjMin &&
                                        value < this.state.qjMin) ||
                                      (this.state.qjMax &&
                                        value > this.state.qjMax)
                                    ) {
                                      this.setState({
                                        isQjHidden: false,
                                        isButtonDisabled: true,
                                      });
                                    } else
                                      this.setState({
                                        isQjHidden: true,
                                        isButtonDisabled: false,
                                      });
                                  }}
                                />
                              </FormItem>
                              <RedStyled hidden={this.state.isQjHidden}>
                                Введенное значение выходит за установленные для
                                данного типа СИ и события границы от{" "}
                                {this.state.qjMin} до {this.state.qjMax}
                              </RedStyled>
                            </Col>
                          </Tooltip>
                          <Tooltip
                            title={
                              "Значение коэффициента преобразования в точке расхода j"
                            }
                          >
                            <Col span={4} hidden={this.state.kjRule === 0}>
                              <FormItem
                                required={this.state.kjRule === 2}
                                name={`controlResultsModel.${index}.kj`}
                                label={<GrayStyled>Kj</GrayStyled>}
                              >
                                <InputNumber
                                  min={this.state.kjMin ?? minV}
                                  max={this.state.kjMax ?? maxV}
                                  style={{ width: "100%" }}
                                  name={`controlResultsModel.${index}.kj`}
                                  type={"number"}
                                  onChange={(value: number) => {
                                    if (
                                      (value &&
                                        value &&
                                        this.state.kjRule != 0 &&
                                        this.state.kjMin &&
                                        value < this.state.kjMin) ||
                                      (this.state.kjMax &&
                                        value > this.state.kjMax)
                                    ) {
                                      this.setState({
                                        isKjHidden: false,
                                        isButtonDisabled: true,
                                      });
                                    } else
                                      this.setState({
                                        isKjHidden: true,
                                        isButtonDisabled: false,
                                      });
                                  }}
                                />
                              </FormItem>
                              <RedStyled hidden={this.state.isKjHidden}>
                                Введенное значение выходит за установленные для
                                данного типа СИ и события границы от{" "}
                                {this.state.kjMin} до {this.state.kjMax}
                              </RedStyled>
                            </Col>
                          </Tooltip>
                          <Tooltip
                            title={
                              "Расчетное значение коэффициента преобразования в точке расхода j"
                            }
                          >
                            <Col span={4} hidden={this.state.kjCalcRule === 0}>
                              <FormItem
                                required={this.state.kjCalcRule === 2}
                                name={`controlResultsModel.${index}.kjCalc`}
                                label={<GrayStyled>Kj расч.</GrayStyled>}
                              >
                                <InputNumber
                                  min={this.state.kjCalcMin ?? minV}
                                  max={this.state.kjCalcMax ?? maxV}
                                  style={{ width: "100%" }}
                                  name={`controlResultsModel.${index}.kjCalc`}
                                  type={"number"}
                                  onChange={(value: number) => {
                                    if (
                                      (value &&
                                        this.state.kjCalcRule != 0 &&
                                        this.state.kjCalcMin &&
                                        value < this.state.kjCalcMin) ||
                                      (this.state.kjCalcMax &&
                                        value > this.state.kjCalcMax)
                                    ) {
                                      this.setState({
                                        isKjCalcHidden: false,
                                        isButtonDisabled: true,
                                      });
                                    } else
                                      this.setState({
                                        isKjCalcHidden: true,
                                        isButtonDisabled: false,
                                      });
                                  }}
                                />
                              </FormItem>
                              <RedStyled hidden={this.state.isKjCalcHidden}>
                                Введенное значение выходит за установленные для
                                данного типа СИ и события границы от{" "}
                                {this.state.kjCalcMin} до {this.state.kjCalcMax}
                              </RedStyled>
                            </Col>
                          </Tooltip>
                          <Tooltip
                            title={
                              "Значение " +
                              `${
                                values.siTypeId === 6 ||
                                values.siTypeId === 7 ||
                                values.siTypeId === 8
                                  ? "абсолютного отклонения"
                                  : "относительного отклонения"
                              }`
                            }
                          >
                            <Col span={4} hidden={this.state.deltaRule === 0}>
                              <FormItem
                                required={this.state.deltaRule === 2}
                                name={`controlResultsModel.${index}.delta`}
                                label={
                                  values.siTypeId === 6 ||
                                  values.siTypeId === 7 ||
                                  values.siTypeId === 8 ? (
                                    <GrayStyled>δ</GrayStyled>
                                  ) : (
                                    <GrayStyled>Δ</GrayStyled>
                                  )
                                }
                              >
                                <InputNumber
                                  min={this.state.deltaMin ?? minV}
                                  max={this.state.deltaMax ?? maxV}
                                  style={{ width: "100%" }}
                                  name={`controlResultsModel.${index}.delta`}
                                  type={"number"}
                                  onChange={(value: number | string) => {
                                    if (
                                      (value &&
                                        this.state.deltaRule != 0 &&
                                        this.state.deltaMin &&
                                        value < this.state.deltaMin) ||
                                      (this.state.deltaMax &&
                                        value > this.state.deltaMax)
                                    ) {
                                      this.setState({
                                        isDeltaHidden: false,
                                        isButtonDisabled: true,
                                      });
                                    } else
                                      this.setState({
                                        isDeltaHidden: true,
                                        isButtonDisabled: false,
                                      });
                                  }}
                                />
                              </FormItem>
                              <RedStyled hidden={this.state.isDeltaHidden}>
                                Введенное значение выходит за установленные для
                                данного типа СИ и события границы от{" "}
                                {this.state.deltaMin} до {this.state.deltaMax}
                              </RedStyled>
                            </Col>
                          </Tooltip>
                        </Row>

                        <Row gutter={24}>
                          <Tooltip
                            title={
                              "Значение температуры в контролируемом СИ в точке расхода j"
                            }
                          >
                            <Col span={4} hidden={this.state.tjRule === 0}>
                              <FormItem
                                required={this.state.tjRule === 2}
                                name={`controlResultsModel.${index}.tj`}
                                label={<GrayStyled>Tj</GrayStyled>}
                              >
                                <InputNumber
                                  min={this.state.tjMin ?? minV}
                                  max={this.state.tjMax ?? maxV}
                                  style={{ width: "100%" }}
                                  name={`controlResultsModel.${index}.tj`}
                                  type={"number"}
                                  onChange={(value: number) => {
                                    if (
                                      (value &&
                                        value &&
                                        this.state.tjRule != 0 &&
                                        this.state.tjMin &&
                                        value < this.state.tjMin) ||
                                      (this.state.tjMax &&
                                        value > this.state.tjMax)
                                    ) {
                                      this.setState({
                                        isTjHidden: false,
                                        isButtonDisabled: true,
                                      });
                                    } else
                                      this.setState({
                                        isTjHidden: true,
                                        isButtonDisabled: false,
                                      });
                                  }}
                                />
                              </FormItem>
                              <RedStyled hidden={this.state.isTjHidden}>
                                Введенное значение выходит за установленные для
                                данного типа СИ и события границы от{" "}
                                {this.state.tjMin} до {this.state.tjMax}
                              </RedStyled>
                            </Col>
                          </Tooltip>
                          <Tooltip
                            title={
                              "Значение давления в контролируемом СИ в точке расхода j"
                            }
                          >
                            <Col span={4} hidden={this.state.pjprRule === 0}>
                              <FormItem
                                required={this.state.pjprRule === 2}
                                name={`controlResultsModel.${index}.pjpr`}
                                label={<GrayStyled>Pj пр.</GrayStyled>}
                              >
                                <InputNumber
                                  min={this.state.pjprMin ?? minV}
                                  max={this.state.pjprMax ?? maxV}
                                  style={{ width: "100%" }}
                                  name={`controlResultsModel.${index}.pjpr`}
                                  type={"number"}
                                  onChange={(value: number) => {
                                    if (
                                      (value &&
                                        this.state.pjprRule != 0 &&
                                        this.state.pjprMin &&
                                        value < this.state.pjprMin) ||
                                      (this.state.pjprMax &&
                                        value > this.state.pjprMax)
                                    ) {
                                      this.setState({
                                        isPjprHidden: false,
                                        isButtonDisabled: true,
                                      });
                                    } else
                                      this.setState({
                                        isPjprHidden: true,
                                        isButtonDisabled: false,
                                      });
                                  }}
                                ></InputNumber>
                              </FormItem>
                              <RedStyled hidden={this.state.isPjprHidden}>
                                Введенное значение выходит за установленные для
                                данного типа СИ и события границы от{" "}
                                {this.state.pjprMin} до {this.state.pjprMax}
                              </RedStyled>
                            </Col>
                          </Tooltip>
                          <Tooltip
                            title={"Значение вязкости в точке расхода j"}
                          >
                            <Col span={4} hidden={this.state.vjRule === 0}>
                              <FormItem
                                required={this.state.vjRule === 2}
                                name={`controlResultsModel.${index}.vj`}
                                label={<GrayStyled>vj</GrayStyled>}
                              >
                                <InputNumber
                                  min={this.state.vjMin ?? minV}
                                  max={this.state.vjMax ?? maxV}
                                  style={{ width: "100%" }}
                                  name={`controlResultsModel.${index}.vj`}
                                  type={"number"}
                                  onChange={(value: number) => {
                                    if (
                                      (value &&
                                        this.state.vjRule != 0 &&
                                        this.state.vjMin &&
                                        value < this.state.vjMin) ||
                                      (this.state.vjMax &&
                                        value > this.state.vjMax)
                                    ) {
                                      this.setState({
                                        isVjHidden: false,
                                        isButtonDisabled: true,
                                      });
                                    } else
                                      this.setState({
                                        isVjHidden: true,
                                        isButtonDisabled: false,
                                      });
                                  }}
                                ></InputNumber>
                              </FormItem>
                              <RedStyled hidden={this.state.isVjHidden}>
                                Введенное значение выходит за установленные для
                                данного типа СИ и события границы от{" "}
                                {this.state.vjMin} до {this.state.vjMax}
                              </RedStyled>
                            </Col>
                          </Tooltip>
                          <Tooltip
                            title={"Значение плотности в точке расхода j"}
                          >
                            <Col span={4} hidden={this.state.pjRule === 0}>
                              <FormItem
                                required={this.state.pjRule === 2}
                                name={`controlResultsModel.${index}.pj`}
                                label={<GrayStyled>pj</GrayStyled>}
                              >
                                <InputNumber
                                  min={this.state.pjMin ?? minV}
                                  max={this.state.pjMax ?? maxV}
                                  style={{ width: "100%" }}
                                  name={`controlResultsModel.${index}.pj`}
                                  type={"number"}
                                  onChange={(value: number) => {
                                    if (
                                      (value &&
                                        this.state.pjRule != 0 &&
                                        this.state.pjMin &&
                                        value < this.state.pjMin) ||
                                      (this.state.pjMax &&
                                        value > this.state.pjMax)
                                    ) {
                                      this.setState({
                                        isPjHidden: false,
                                        isButtonDisabled: true,
                                      });
                                    } else
                                      this.setState({
                                        isPjHidden: true,
                                        isButtonDisabled: false,
                                      });
                                  }}
                                ></InputNumber>
                              </FormItem>
                              <RedStyled hidden={this.state.isPjHidden}>
                                Введенное значение выходит за установленные для
                                данного типа СИ и события границы от{" "}
                                {this.state.pjMin} до {this.state.pjMax}
                              </RedStyled>
                            </Col>
                          </Tooltip>
                        </Row>
                      </>
                    ))
                  ) : (
                    <div></div>
                  )}
                  <Button
                    type={"link"}
                    icon={<PlusCircleFilled />}
                    size="large"
                    onClick={() => arrayHelpers.push(new ControlResultsModel())}
                  >
                    Добавить
                  </Button>
                </div>
              )}
            />
            <TitleStyled>
              Поля отмеченные <span style={{ color: "#ff4d4f" }}>*</span>{" "}
              обязательны для заполнения
            </TitleStyled>
          </>
        ),
      },
      {
        title: "Примечание",
        content: (
          <>
            <Row>
              <Col span={16}>
                <FormItem
                  required={values.planDate === null}
                  name="note"
                  label="Примечание"
                >
                  <Input.TextArea name="note" rows={4} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <TitleStyled>
                  Поля отмеченные <span style={{ color: "#ff4d4f" }}>*</span>{" "}
                  обязательны для заполнения
                </TitleStyled>
                <TitleStyled>
                  (При не проведении или внеплановом проведении работ
                  ОБЯЗАТЕЛЬНО указывать причину отклонения)
                </TitleStyled>
              </Col>
            </Row>
          </>
        ),
      },
    ];

    if (!this.props.initial) {
      console.log("this.props.initial", this.props.initial);
      let eventStep = {
        title: "События",
        content: (
          <>
            {!this.props.initial && this.state.nearestEventsLoading ? (
              <>
                {this.state.nearestEvents.length > 0 ? (
                  <Row>
                    <Col span={24}>
                      {this.state.selectedEvent ? (
                        <SelectedTitleStyled>
                          Выбрано событие:{" "}
                          {this.state.selectedEvent.controlMaintEventType}, c
                          плановой датой{" "}
                          {dateToShortString(this.state.selectedEvent.planDate)}
                        </SelectedTitleStyled>
                      ) : (
                        <WarnTitleStyled>
                          Для указанных параметров существуют следующие плановые
                          события:
                        </WarnTitleStyled>
                      )}
                    </Col>
                  </Row>
                ) : (
                  <>
                    {this.state.nearestEventsLoaded ? (
                      <WarnTitleStyled>
                        Для указанных параметров плановых событий не найдено.
                        Будет создано внеплановое событие.
                      </WarnTitleStyled>
                    ) : (
                      <></>
                    )}
                  </>
                )}

                {this.state.nearestEvents.length > 0 ? (
                  <>
                    <Row gutter={[16, 24]}>
                      <Col span={24}>
                        <InFormTable<ControlMaintEvents>
                          items={this.state.nearestEvents}
                          fields={new ObjectFields(
                            ControlMaintEvents
                          ).getFields()}
                          hiddenColumns={[
                            "id",
                            "coefChangeEventFrameId",
                            "eventFrameId",
                            "eventTypeId",
                            "graphOk",
                            "periodOk",
                            "protocolFileName",
                            "protocolFileExist",
                            "protocolNum",
                            "resultsExist",
                            "siId",
                            "techPositionId",
                            "controlResultsModel",
                            "standartModel",
                            "standartNumber",
                            "standartType",
                            "graphOkText",
                            "periodOkText",
                            "coefChangeEventFrameText",
                            "protocolFileExistsText",
                            "resultsExistText",
                            "factDate",
                            "eventFrameExist",
                            "siknFullName",
                            "techPositionText",
                            "siTypeText",
                            "manufNumber",
                            "siTypeId",
                            "positionInBlock",
                          ]}
                          widths={[
                            {
                              key: "controlMaintEventType",
                              newWidth: 110,
                            },
                            {
                              key: "planDate",
                              newWidth: 150,
                            },
                          ]}
                          setApiCallback={this.setApi}
                          selectionCallback={(item: ControlMaintEvents) => {
                            values.id = item.id;
                            values.planDate = item.planDate;
                            this.setState({ selectedEvent: item });
                            setFieldValue("inPlan", true);
                            if (this.props.selectionHandler)
                              this.props.selectionHandler(item);
                          }}
                          selectedRow={
                            this.state.selectedEvent
                              ? this.state.selectedEvent.id
                              : null
                          }
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <FormItem
                          colon
                          style={{ display: "-webkit-box" }}
                          name="inPlan"
                        >
                          <Radio.Group
                            name="inPlan"
                            defaultValue={false}
                            onChange={(ev) => {
                              this.state.gridApi.deselectAll();
                              this.setState({ selectedEvent: null });
                            }}
                          >
                            <Space direction="vertical">
                              <Tooltip title={"Выберите событие в таблице"}>
                                <Radio
                                  disabled={!this.state.selectedEvent}
                                  name="inPlan"
                                  value={true}
                                >
                                  Привязать к плановому событию
                                </Radio>
                              </Tooltip>

                              <Radio name="inPlan" value={false}>
                                Создать внеплановое событие
                              </Radio>
                            </Space>
                          </Radio.Group>
                        </FormItem>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        ),
      };
      stepArray.splice(1, 0, eventStep);
    }
    return stepArray;
  };

  initialValues: ControlMaintEvents =
    this.props.initial ??
    ControlMaintEvents.InitTechPos(this.props.node.nodeId);

  next() {
    this.setState({ step: this.state.step + 1 });
  }

  prev() {
    this.setState({ step: this.state.step - 1 });
  }

  render(): JSX.Element {
    if (this.props.initial) {
      this.steps;
    }
    if (
      this.props.initial &&
      this.props.initial.controlResultsModel.length === 0
    )
      this.initialValues.controlResultsModel = [new ControlResultsModel()];
    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <Formik
          initialValues={this.initialValues}
          onSubmit={(
            data: ControlMaintEvents,
            helpers: FormikHelpers<ControlMaintEvents>
          ) => {
            this.props
              .submitCallback(data)
              .then(() => helpers.setSubmitting(false))
              .catch((err) => {
                helpers.setSubmitting(false);
              });
          }}
          validationSchema={returnValidationSchema(
            this.state.qjRule,
            this.state.kjRule,
            this.state.kjCalcRule,
            this.state.deltaRule,
            this.state.tjRule,
            this.state.pjprRule,
            this.state.vjRule,
            this.state.pjRule
          )}
        >
          {({ setFieldValue, values }) => {
            return (
              <>
                {this.state.loading ? (
                  <div className="mx-auto my-auto">
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                  </div>
                ) : (
                  <Layout>
                    <Sider theme="light" width={240}>
                      <Steps
                        current={this.state.step}
                        direction="vertical"
                        size="small"
                      >
                        {this.steps(setFieldValue, values).map((s) => (
                          <Step key={s.title} title={s.title} />
                        ))}
                      </Steps>
                    </Sider>
                    <Layout>
                      <Content
                        style={{
                          background: "#FFFFFF",
                          padding: "0px",
                          paddingLeft: "24px",
                        }}
                      >
                        <Form layout="vertical">
                          {
                            this.steps(setFieldValue, values)[this.state.step]
                              .content
                          }

                          <Footer style={{ background: "#FFFFFF" }}>
                            <Row justify="end" align="bottom">
                              {this.state.step ===
                                this.steps(setFieldValue, values).length -
                                  1 && <></>}
                              {this.state.step > 0 && (
                                <Button type="link" onClick={() => this.prev()}>
                                  Назад
                                </Button>
                              )}
                              {this.state.step <
                                this.steps(setFieldValue, values).length -
                                  1 && (
                                <Button
                                  disabled={this.state.isButtonDisabled}
                                  type="primary"
                                  style={{
                                    background: "#1890FF",
                                    color: "#FFFFFF",
                                  }}
                                  onClick={() => this.next()}
                                >
                                  Далее
                                </Button>
                              )}
                              {this.state.step ===
                                this.steps(setFieldValue, values).length -
                                  1 && (
                                <>
                                  <Can
                                    I={ActionsEnum.Edit}
                                    a={elementId(
                                      ToKmhElements[
                                        ToKmhElements.ControlResultsAdd
                                      ]
                                    )}
                                  >
                                    <SubmitButton
                                      style={{
                                        background: "#219653",
                                        color: "#FFFFFF",
                                      }}
                                    >
                                      Добавить
                                    </SubmitButton>
                                  </Can>
                                </>
                              )}
                            </Row>
                          </Footer>
                        </Form>
                      </Content>
                    </Layout>
                  </Layout>
                )}
              </>
            );
          }}
        </Formik>
      </div>
    );
  }

  async componentDidMount() {
    let resultControlMaintEventTypes = () =>
      axios
        .get<Array<ControlMaintEventTypes>>(`${apiBase}/ControlMaintEventTypes`)
        .then((result) =>
          this.setState({
            controlMaintEventsTypes: result.data.filter((x) => x.results),
          })
        );

    let resultControlResultsSiTypeRules = () =>
      axios
        .get<Array<ControlResultsSiTypeRules>>(
          `${apiBase}/ControlResultsSiTypeRules`
        )
        .then((result) => {
          if (this.props.initial) {
            let filteredRules = result.data.filter(
              (x) =>
                x.eventType == this.initialValues.eventTypeId &&
                x.siType == this.initialValues.siTypeId
            );

            let qjRule =
              filteredRules.length > 0
                ? filteredRules.map((x) => x.qjRule)[0]
                : 1;
            this.setState({ qjRule: qjRule });

            let kjRule =
              filteredRules.length > 0
                ? filteredRules.map((x) => x.kjRule)[0]
                : 1;
            this.setState({ kjRule: kjRule });

            let kjCalcRule =
              filteredRules.length > 0
                ? filteredRules.map((x) => x.kjCalcRule)[0]
                : 1;
            this.setState({ kjCalcRule: kjCalcRule });

            let deltaRule =
              filteredRules.length > 0
                ? filteredRules.map((x) => x.deltaRule)[0]
                : 1;
            this.setState({ deltaRule: deltaRule });

            let tjRule =
              filteredRules.length > 0
                ? filteredRules.map((x) => x.tjRule)[0]
                : 1;
            this.setState({ tjRule: tjRule });

            let pjprRule =
              filteredRules.length > 0
                ? filteredRules.map((x) => x.pjprRule)[0]
                : 1;
            this.setState({ pjprRule: pjprRule });

            let vjRule =
              filteredRules.length > 0
                ? filteredRules.map((x) => x.vjRule)[0]
                : 1;
            this.setState({ vjRule: vjRule });

            let pjRule =
              filteredRules.length > 0
                ? filteredRules.map((x) => x.pjRule)[0]
                : 1;
            this.setState({ pjRule: pjRule });

            let valControlSiRule =
              filteredRules.length > 0
                ? filteredRules.map((x) => x.valControlSiRule)[0]
                : 1;
            this.setState({ valControlSiRule: valControlSiRule });

            let valStanSiRule =
              filteredRules.length > 0
                ? filteredRules.map((x) => x.valStanSiRule)[0]
                : 1;
            this.setState({ valStanSiRule: valStanSiRule });
          } else {
            this.setState({
              controlResultsSiTypeRules: result.data,
            });
          }
        });

    let resultControlResultsSiTypeRanges = () =>
      axios
        .get<Array<ControlResultsSiTypeRanges>>(
          `${apiBase}/ControlResultsSiTypeRanges`
        )
        .then((result) => {
          if (this.props.initial) {
            let filteredRanges = result.data.filter(
              (x) =>
                x.eventType == this.initialValues.eventTypeId &&
                x.siType == this.initialValues.siTypeId
            );

            let qjMinRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.qjMin)[0]
                : null;
            this.setState({ qjMin: qjMinRange });

            let qjMaxRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.qjMax)[0]
                : null;
            this.setState({ qjMax: qjMaxRange });

            let kjMinRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.kjMin)[0]
                : null;
            this.setState({ kjMin: kjMinRange });

            let kjMaxRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.kjMax)[0]
                : null;
            this.setState({ kjMax: kjMaxRange });

            let kjCalcMinRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.kjCalcMin)[0]
                : null;
            this.setState({ kjCalcMin: kjCalcMinRange });

            let kjCalcMaxRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.kjCalcMax)[0]
                : null;
            this.setState({ kjCalcMax: kjCalcMaxRange });

            let deltaMinRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.deltaMin)[0]
                : null;
            this.setState({ deltaMin: deltaMinRange });

            let deltaMaxRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.deltaMax)[0]
                : null;
            this.setState({ deltaMax: deltaMaxRange });

            let tjMinRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.tjMin)[0]
                : null;
            this.setState({ tjMin: tjMinRange });

            let tjMaxRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.tjMax)[0]
                : null;
            this.setState({ tjMax: tjMaxRange });

            let pjprMinRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.pjprMin)[0]
                : null;
            this.setState({ pjprMin: pjprMinRange });

            let pjprMaxRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.pjprMax)[0]
                : null;
            this.setState({ pjprMax: pjprMaxRange });

            let vjMinRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.vjMin)[0]
                : null;
            this.setState({ vjMin: vjMinRange });

            let vjMaxRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.vjMax)[0]
                : null;
            this.setState({ vjMax: vjMaxRange });

            let pjMinRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.pjMin)[0]
                : null;
            this.setState({ pjMin: pjMinRange });

            let pjMaxRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.pjMax)[0]
                : null;
            this.setState({ pjMax: pjMaxRange });

            let qjTypeRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.qjType)[0]
                : null;
            this.setState({ qjType: qjTypeRange });

            let kjTypeRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.kjType)[0]
                : null;
            this.setState({ kjType: kjTypeRange });

            let kjCalcTypeRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.kjCalcType)[0]
                : null;
            this.setState({ kjCalcType: kjCalcTypeRange });

            let deltaTypeRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.deltaType)[0]
                : null;
            this.setState({ deltaType: deltaTypeRange });

            let tjTypeRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.tjType)[0]
                : null;
            this.setState({ tjType: tjTypeRange });

            let pjprTypeRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.pjprType)[0]
                : null;
            this.setState({ pjprType: pjprTypeRange });

            let vjTypeRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.vjType)[0]
                : null;
            this.setState({ vjType: vjTypeRange });

            let pjTypeRange =
              filteredRanges.length > 0
                ? filteredRanges.map((x) => x.pjType)[0]
                : null;
            this.setState({ pjType: pjTypeRange });
          } else {
            this.setState({
              controlResultsSiTypeRanges: result.data,
            });
          }
        });

    let resultPsps = () =>
      axios.get<Array<PspItem>>(`${apiBase}/psps`).then((result) =>
        this.setState({
          psps: result.data,
        })
      );
    let techPosInfo = () =>
      axios
        .get<TechPositions>(
          `${apiBase}/TechPositions/${this.props.node.nodeId}`
        )
        .then((result) => {
          this.initialValues.siknFullName = result.data.siknFullName;
          this.initialValues.pspName = result.data.pspName;
          this.initialValues.techPositionText = result.data.shortName;
          this.initialValues.ostId = result.data.ostId;
          this.initialValues.ostName = result.data.ostName;
          this.initialValues.siId = result.data.siEquipment
            ? result.data.siEquipment.id
            : zeroGuid;
          this.initialValues.siTypeText = result.data.siEquipment
            ? result.data.siEquipment.siTypeName
            : "н/д";
          this.initialValues.siModelName = result.data.siEquipment
            ? result.data.siEquipment.siModelName
            : "н/д";
          this.initialValues.manufNumber = result.data.siEquipment
            ? result.data.siEquipment.manufNumber
            : "н/д";
          this.initialValues.siTypeId = result.data.siEquipment.siTypeId;
        });

    if (!this.props.initial) {
      Promise.all([
        resultControlMaintEventTypes(),
        resultPsps(),
        techPosInfo(),
        resultControlResultsSiTypeRules(),
        resultControlResultsSiTypeRanges(),
      ]).then(() => {
        this.setState({
          loading: false,
        });
      });
    } else {
      Promise.all([
        resultControlMaintEventTypes(),
        resultPsps(),
        resultControlResultsSiTypeRules(),
        resultControlResultsSiTypeRanges(),
      ]).then(() => {
        this.setState({
          loading: false,
        });
      });
    }
  }
}
