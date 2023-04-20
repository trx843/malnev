import { FieldArray, Formik, FormikHelpers } from "formik";
import React, { Component } from "react";
import {
  Form,
  FormItem,
  DatePicker,
  InputNumber,
  Checkbox,
  Input,
  Select,
  Radio,
  SubmitButton,
  Switch,
} from "formik-antd";
import { CalcMethod, Rsu, SiknOffItem, StopReason } from "../classes";
import { apiBase, zeroGuid } from "../utils";
import axios from "axios";
import {
  Button,
  message,
  Row,
  Col,
  Space,
  Divider,
  Input as AntInput,
  Skeleton,
  Steps,
  Tooltip,
  Alert,
} from "antd";
import { SelectedNode } from "../interfaces";
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import Title from "antd/lib/typography/Title";
import { SiknOffActInfo } from "../classes/SiknOffItem";
import { SiknOffGroupsEnum } from "../enums";
import locale from "antd/es/date-picker/locale/ru_RU";
import * as Yup from "yup";
import moment from "moment";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import PlusCircleFilled from "@ant-design/icons/lib/icons/PlusCircleFilled";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import styled from "styled-components";
import { InPlan } from "../classes/StopReason";
import { IdType, Nullable } from "../types";
import { TextRedStyled as RedStyled } from "../styles/commonStyledComponents";
import { ActionsEnum, Can } from "../casl";
import { elementId, SiknOffElements } from "../pages/SiknOff/constants";
import { xor } from "lodash";

interface ISiknOffFormProps {
  initial?: SiknOffItem;
  submitCallback: (item: SiknOffItem) => Promise<SiknOffItem>;
  downloadFileCallback: (item: SiknOffItem) => Promise<SiknOffItem>;
  node: SelectedNode;
  isEditForm: boolean;
}

interface ISiknOffFormState {
  step: number;
  stopReasons: Array<StopReason>;
  rsus: Array<Rsu>;
  calcMethods: Array<CalcMethod>;
  offType: number;
  inPlanSiknOff: boolean;
  useInReports: boolean;
  siknOffActInfo: SiknOffActInfo;
  loading: boolean;
  newPostName: string;
  startDateTimeInSec: number;
  startDateTime: Date;
  endDateTimeInSec: number;
  endDateTime: Date;
  durationHour: number;
  durationMinute: number;
  durationTime: number;
  rsuDurationHours: number;
  rsuDurationMinutes: number;
  rsuDurationTime: number;
  inPlan: number;
  isDiffSoiData: boolean;
  massState: Nullable<number>;
  volumeState: Nullable<number>;
  isDiffPeople: boolean;
  withFile: boolean;
  isRsuCheck: boolean;
  siknoffMsg: string;
  isWarnHidden: boolean;
}

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};

const peopleConfPost = {
  post: Yup.string().required("Поле обязательно к заполнению!"),
};

const peopleConfFio = {
  fio: Yup.string()
    .trim()
    .matches(
      /[аА-яЯ\-./s]+$/,
      "Разрешено использовать только буквы кириллического алфавита"
    )
    .required("Поле обязательно к заполнению!"),
};

const peopleConfFioWithoutFile = {
  fio: Yup.string()
    .trim()
    .matches(
      /[аА-яЯ\-./s]+$/,
      "Разрешено использовать только буквы кириллического алфавита"
    )
    .notRequired(),
};

const offPeopleConf = {
  offSendPeople: Yup.array()
    .of(Yup.object().shape({ ...peopleConfFioWithoutFile, ...peopleConfPost }))
    .min(1, ""),
  offReceivePeople: Yup.array()
    .of(Yup.object().shape({ ...peopleConfFioWithoutFile, ...peopleConfPost }))
    .min(1, ""),
  offToPeople: Yup.array()
    .of(Yup.object().shape({ ...peopleConfFioWithoutFile, ...peopleConfPost }))
    .min(1, ""),
};

const onPeopleConf = {
  onSendPeople: Yup.array()
    .of(Yup.object().shape({ ...peopleConfFioWithoutFile, ...peopleConfPost }))
    .min(1, ""),
  onReceivePeople: Yup.array()
    .of(Yup.object().shape({ ...peopleConfFioWithoutFile, ...peopleConfPost }))
    .min(1, ""),
  onToPeople: Yup.array()
    .of(Yup.object().shape({ ...peopleConfFioWithoutFile, ...peopleConfPost }))
    .min(1, ""),
};

const defaultValidationConf = {
  startDateTime: Yup.date()
    .required("Поле обязательно к заполнению!")
    .default(() => new Date())
    .typeError("Введите дату отключения!"),
  siknOffAct: Yup.object({
    ...offPeopleConf,
  }),
  differenceReason: Yup.string()
    .nullable()
    .when("isDiffSoiData", {
      is: true,
      then: Yup.string().nullable().required("Поле обязательно к заполнению!"),
    }),
  stopReasonId: Yup.string().nullable().required("Поле обязательно к заполнению!"),
};

const rsuIdValidationConf = {
  rsuId: Yup.string().required("Поле обязательно к заполнению!"),
};

const calcMethodIdValidationConf = {
  calcMethodId: Yup.string().required("Поле обязательно к заполнению!"),
};

const returnValidationSchema = (
  withFile: boolean,
  isDiffPeople: boolean,
  offType: number
) => {
  let validationSchema: any = defaultValidationConf;

  if (offType === 2)
    validationSchema = {
      ...validationSchema,
      ...rsuIdValidationConf,
    };

  if (offType === 3)
    validationSchema = { ...validationSchema, ...calcMethodIdValidationConf };

  if (withFile)
    validationSchema = {
      ...validationSchema,
      siknOffAct: Yup.object({
        offSendPeople: Yup.array()
          .of(Yup.object().shape({ ...peopleConfFio, ...peopleConfPost }))
          .min(1, ""),
        offReceivePeople: Yup.array()
          .of(Yup.object().shape({ ...peopleConfFio, ...peopleConfPost }))
          .min(1, ""),
        offToPeople: Yup.array()
          .of(Yup.object().shape({ ...peopleConfFio, ...peopleConfPost }))
          .min(1, ""),
      }),
    };

  if (isDiffPeople && !withFile)
    validationSchema = {
      ...validationSchema,
      siknOffAct: Yup.object({
        ...offPeopleConf,
        ...onPeopleConf,
      }),
    };

  if (isDiffPeople && withFile)
    validationSchema = {
      ...validationSchema,
      siknOffAct: Yup.object({
        onSendPeople: Yup.array()
          .of(Yup.object().shape({ ...peopleConfFio, ...peopleConfPost }))
          .min(1, ""),
        onReceivePeople: Yup.array()
          .of(Yup.object().shape({ ...peopleConfFio, ...peopleConfPost }))
          .min(1, ""),
        onToPeople: Yup.array()
          .of(Yup.object().shape({ ...peopleConfFio, ...peopleConfPost }))
          .min(1, ""),
        offSendPeople: Yup.array()
          .of(Yup.object().shape({ ...peopleConfFio, ...peopleConfPost }))
          .min(1, ""),
        offReceivePeople: Yup.array()
          .of(Yup.object().shape({ ...peopleConfFio, ...peopleConfPost }))
          .min(1, ""),
        offToPeople: Yup.array()
          .of(Yup.object().shape({ ...peopleConfFio, ...peopleConfPost }))
          .min(1, ""),
      }),
    };

  if (!isDiffPeople && !withFile)
    validationSchema = { ...validationSchema, ...offPeopleConf };

  return Yup.object({ ...validationSchema }).required();
};

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

export class SiknOffForm extends Component<
  ISiknOffFormProps,
  ISiknOffFormState
> {
  constructor(props: ISiknOffFormProps) {
    super(props);
    this.state = {
      step: 0,
      stopReasons: [],
      rsus: [],
      calcMethods: [],
      offType: this.getOffType(props.initial),
      inPlanSiknOff:
        props.initial === undefined
          ? false
          : props.initial.inPlanSiknOff === null
            ? false
            : props.initial.inPlanSiknOff,
      useInReports:
        props.initial === undefined
          ? true
          : props.initial.useInReports === null
            ? true
            : props.initial.useInReports,
      siknOffActInfo: {
        sendPosts: [],
        receivePosts: [],
        toPosts: [],
        offSendPeople: [{ fio: "", post: "" }],
        offReceivePeople: [{ fio: "", post: "" }],
        offToPeople: [{ fio: "", post: "" }],
        onSendPeople: [{ fio: "", post: "" }],
        onReceivePeople: [{ fio: "", post: "" }],
        onToPeople: [{ fio: "", post: "" }],
      },
      loading: true,
      newPostName: "",
      startDateTimeInSec: props.initial
        ? props.initial.startDateTime.getTime()
        : SiknOffItem.Default(this.props.node.nodeId).startDateTime.getTime(),
      startDateTime: props.initial
        ? props.initial.startDateTime
        : SiknOffItem.Default(this.props.node.nodeId).startDateTime,
      endDateTimeInSec: props.initial
        ? props.initial.endDateTime
          ? props.initial.endDateTime?.getTime()
          : props.initial.startDateTime.getTime()
        : SiknOffItem.Default(this.props.node.nodeId).startDateTime.getTime(),
      endDateTime: props.initial
        ? props.initial.endDateTime
          ? props.initial.endDateTime
          : props.initial.startDateTime
        : SiknOffItem.Default(this.props.node.nodeId).startDateTime,
      durationHour: props.initial
        ? props.initial.durationHour
          ? props.initial.durationHour
          : 0
        : 0,
      durationMinute: props.initial
        ? props.initial.durationMinute
          ? props.initial.durationMinute
          : 0
        : 0,

      rsuDurationHours: props.initial
        ? props.initial.rsuDurationHours
          ? props.initial.rsuDurationHours
          : 0
        : 0,
      rsuDurationMinutes: props.initial
        ? props.initial.rsuDurationMinutes
          ? props.initial.rsuDurationMinutes
          : 0
        : 0,
      durationTime: props.initial
        ? (props.initial.durationHour ? props.initial.durationHour * 60 : 0) +
        (props.initial.durationMinute ? props.initial.durationMinute : 0)
        : 0,
      rsuDurationTime: props.initial
        ? (props.initial.rsuDurationHours
          ? props.initial.rsuDurationHours * 60
          : 0) +
        (props.initial.rsuDurationMinutes
          ? props.initial.rsuDurationMinutes
          : 0)
        : 0,
      inPlan: InPlan.Both,
      isDiffSoiData: props.initial
        ? props.initial.mass !== props.initial.massStart ||
        props.initial.volume !== props.initial.volumeStart
        : false,
      massState: props.initial ? props.initial.mass : 0,
      volumeState: props.initial ? props.initial.volume : 0,
      isDiffPeople: false,
      withFile: false,
      isRsuCheck: true,
      siknoffMsg: "",
      isWarnHidden: true,
    };
  }

  checkPeople = (act: SiknOffActInfo) => {
    let retValue: boolean = false;
    if (
      JSON.stringify(act.onSendPeople) === JSON.stringify(act.offSendPeople)
    ) {
      retValue = false;
    } else {
      retValue = true;
    }
    return retValue;
  };

  disabledStartDate = (current: moment.Moment) => {
    // Can not select days before today and today
    return current > moment(new Date(this.state.endDateTimeInSec));
  };

  disabledEndDate = (current: moment.Moment) => {
    // Can not select days before today and today
    return current < moment(new Date(this.state.startDateTimeInSec));
  };

  disabledDateNow = (current: moment.Moment) => {
    // Can not select days before today and today
    return current > moment();
  };

  checkFailureHandler = (
    controlDirId: number,
    sTime: string,
    eTime: string,
    siknOffId: Nullable<IdType> | undefined
  ) => {
    axios
      .get<string>(
        `${apiBase}/siknoff/${controlDirId}/siknoff?startDateTime=${sTime}&endDateTime=${eTime}&siknOffId=${siknOffId}`
      )
      .then((result) => {
        this.setState({
          siknoffMsg: result.data,
          isWarnHidden: !result.data,
        });
      });
  };

  private steps = (setFieldValue: any, values: SiknOffItem): Step[] => [
    {
      title: "Отключение оборудования",
      content: (
        <>
          <Row>
            <Col span={8}>
              <Space size={"small"} align="baseline">
                <FormItem name="useInReports">
                  <Checkbox
                    onClick={() => {
                      this.setState({
                        useInReports: !this.state.useInReports,
                      });
                    }}
                    checked={this.state.useInReports}
                    name="useInReports"
                  >
                    Учитывать в отчётах
                  </Checkbox>
                </FormItem>

                <Tooltip
                  title="При выборе данного поля ввод данных доступен
                                  только в поля информации о дате и времени
                                  отключения или в поле примечания"
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            </Col>

            <Col span={16}>
              <FormItem name="comment" label="Комментарий">
                <Input.TextArea name="comment" />
              </FormItem>
            </Col>
          </Row>

          <Row style={{ marginBottom: "8px" }}>
            <span>Продолжительность отключения:</span>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem name="startDateTime" label="Дата отключения" required>
                <DatePicker
                  locale={locale}
                  disabledDate={this.disabledDateNow}
                  style={{ width: "100%" }}
                  name="startDateTime"
                  value={moment(this.state.startDateTime)}
                  inputReadOnly
                  onChange={(value: moment.Moment) => {
                    const startDateTime = value.toDate();
                    const startDateTimeInSec = startDateTime.getTime();

                    if (this.state.endDateTimeInSec <= startDateTimeInSec) {
                      this.setState({
                        endDateTime: startDateTime,
                        endDateTimeInSec: startDateTimeInSec,
                        durationHour: 0,
                        durationMinute: 0,
                        durationTime: 0
                      });
                      setFieldValue("endDateTime", startDateTime);
                      setFieldValue("durationHour", 0);
                      setFieldValue("durationTime", 0);
                      setFieldValue("durationMinute", 0);
                    } else {
                      const dH = Math.floor(
                        (this.state.endDateTimeInSec - startDateTimeInSec) /
                        3600 /
                        1000
                      );

                      const dM =
                        (((this.state.endDateTimeInSec - startDateTimeInSec) /
                          1000) %
                          3600) /
                          60 <
                          60 &&
                          (((this.state.endDateTimeInSec - startDateTimeInSec) /
                            1000) %
                            3600) /
                          60 >
                          59
                          ? 0
                          : Math.floor(
                            (((this.state.endDateTimeInSec -
                              startDateTimeInSec) /
                              1000) %
                              3600) /
                            60
                          );

                      const totalDuration = dH * 60 + dM;

                      this.setState({
                        startDateTime: startDateTime,
                        startDateTimeInSec: startDateTimeInSec,
                        durationHour: dH,
                        durationMinute: dM,
                        durationTime: totalDuration,
                      });
                      setFieldValue("startDateTime", startDateTime);
                      setFieldValue("durationHour", dH);
                      setFieldValue("durationTime", totalDuration);
                      setFieldValue("durationMinute", dM);

                      // Проверка на пересечение

                      const x = 1 * 60 * 1000;

                      const startTime = moment(
                        Math.floor(startDateTimeInSec / x) * x
                      ).format("YYYY-MM-DD HH:mm");

                      let endTime = moment(
                        Math.floor(this.state.endDateTimeInSec / x) * x
                      ).format("YYYY-MM-DD HH:mm");

                      if (values.useInReports && values.controlDirId != null) {
                        this.checkFailureHandler(
                          values.controlDirId,
                          startTime,
                          endTime,
                          this.props.initial?.id
                        );
                      }
                    }
                  }}
                  showTime
                  format="DD.MM.YYYY HH:mm"
                />
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem name="endDateTime" label="Дата включения">
                <DatePicker
                  locale={locale}
                  disabledDate={this.disabledEndDate}
                  style={{ width: "100%" }}
                  name="endDateTime"
                  value={moment(this.state.endDateTime)}
                  inputReadOnly
                  onChange={(value: moment.Moment) => {
                    const endDateTime = value.toDate();
                    const endDateTimeInSec = endDateTime.getTime();

                    const dH = Math.floor(
                      (endDateTimeInSec - this.state.startDateTimeInSec) /
                      3600 /
                      1000
                    );

                    const dM =
                      (((endDateTimeInSec - this.state.startDateTimeInSec) /
                        1000) %
                        3600) /
                        60 <
                        60 &&
                        (((endDateTimeInSec - this.state.startDateTimeInSec) /
                          1000) %
                          3600) /
                        60 >
                        59
                        ? 0
                        : Math.round(
                          (((endDateTimeInSec -
                            this.state.startDateTimeInSec) /
                            1000) %
                            3600) /
                          60
                        );

                    const totalDuration = dH * 60 + dM;
                    console.log(dH);
                    this.setState({
                      endDateTime: endDateTime,
                      endDateTimeInSec: endDateTimeInSec,
                      durationHour: dH,
                      durationTime: totalDuration,
                      durationMinute: dM,
                    });
                    setFieldValue("endDateTime", endDateTime);
                    setFieldValue("durationHour", dH);
                    setFieldValue("durationTime", totalDuration);
                    setFieldValue("durationMinute", dM);
                    // Проверка на пересечение
                    const x = 1 * 60 * 1000;
                    const endTime = moment(
                      Math.floor(endDateTimeInSec / x) * x
                    ).format("YYYY-MM-DD HH:mm");

                    const startTime = moment(
                      Math.floor(this.state.startDateTimeInSec / x) * x
                    ).format("YYYY-MM-DD HH:mm");

                    if (values.useInReports && values.controlDirId != null) {
                      this.checkFailureHandler(
                        values.controlDirId,
                        startTime,
                        endTime,
                        this.props.initial?.id
                      );
                    }
                  }}
                  showTime
                  format="DD.MM.YYYY HH:mm"
                />
              </FormItem>
            </Col>

            <Col span={8}>
              <Row>
                <Col span={8}>
                  <FormItem name="durationHour" label={"часов"}>
                    <InputNumber
                      min={0}
                      placeholder={"00чч"}
                      name="durationHour"
                      value={this.state.durationHour}
                      onChange={(value: number) => {
                        if (
                          Number.isNaN(value) ||
                          value < 0 ||
                          value === undefined ||
                          typeof value === "string"
                        ) {
                          return;
                        }
                        const ts = this.state.startDateTimeInSec;
                        const h = value * 60 * 60 * 1000;
                        const m = this.state.durationMinute * 60 * 1000;
                        const res = ts + h + m;
                        const date = new Date(res);

                        const durationTime =
                          value * 60 + this.state.durationMinute;
                        this.setState({
                          durationHour: value,
                          durationTime: durationTime,
                          endDateTime: date,
                          endDateTimeInSec: res,
                        });

                        setFieldValue("durationHour", value);
                        setFieldValue("durationTime", durationTime);
                        setFieldValue("endDateTime", date);

                        // Проверка на пересечение
                        const x = 1 * 60 * 1000;

                        const startTime = moment(
                          Math.floor(this.state.startDateTimeInSec / x) * x
                        ).format("YYYY-MM-DD HH:mm");

                        const endTime = moment(Math.floor(res / x) * x).format(
                          "YYYY-MM-DD HH:mm"
                        );

                        if (
                          values.useInReports &&
                          values.controlDirId != null
                        ) {
                          this.checkFailureHandler(
                            values.controlDirId,
                            startTime,
                            endTime,
                            this.props.initial?.id
                          );
                        }
                      }}
                    ></InputNumber>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem name="durationMinute" label={"минут"}>
                    <InputNumber
                      min={0}
                      max={59}
                      placeholder={"00мин"}
                      value={this.state.durationMinute}
                      name="durationMinute"
                      onChange={(value: number) => {
                        if (
                          Number.isNaN(value) ||
                          value < 0 ||
                          value === undefined ||
                          typeof value === "string"
                        ) {
                          return;
                        }
                        const startDateTimeInSec =
                          this.state.startDateTimeInSec;
                        const m = value * 60 * 1000;
                        const h = this.state.durationHour * 60 * 60 * 1000;
                        const res = startDateTimeInSec + h + m;
                        const date = new Date(res);
                        const durationTime =
                          this.state.durationHour * 60 + value;
                        this.setState({
                          durationMinute: value,
                          durationTime: durationTime,
                          endDateTimeInSec: res,
                          endDateTime: date,
                        });
                        setFieldValue("durationMinute", value);
                        setFieldValue("durationTime", durationTime);
                        setFieldValue("endDateTime", date);

                        // Проверка на пересечение с другими отключениями
                        const startTime = moment(
                          this.state.startDateTime
                        ).format("YYYY-MM-DD HH:mm");

                        const endTime = moment(date).format("YYYY-MM-DD HH:mm");

                        if (
                          values.useInReports &&
                          values.controlDirId != null
                        ) {
                          this.checkFailureHandler(
                            values.controlDirId,
                            startTime,
                            endTime,
                            this.props.initial?.id
                          );
                        }
                      }}
                    ></InputNumber>
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem name="durationTotal" label={"total"} hidden>
                    <InputNumber
                      name="durationTotal"
                      value={this.state.durationTime}
                      min={0}
                    ></InputNumber>
                  </FormItem>
                </Col>
              </Row>
              <RedStyled hidden={this.state.durationTime === 0 ? false : true}>
                Время отключения должно быть больше 0
              </RedStyled>
            </Col>
          </Row>
          <Row gutter={16} hidden={this.state.isWarnHidden}>
            <Alert message={this.state.siknoffMsg} type="error" showIcon />
          </Row>
          <Row>
            <Col span={16}>
              <FormItem name="stopReasonId" required label="Код причины отключения">
                <Select
                  name="stopReasonId"
                  disabled={!this.state.useInReports}
                  onChange={(value) => {
                    if (value !== null) {
                      let stopReason = this.state.stopReasons.find(
                        (x) => x.id === value
                      );
                      if (stopReason) {
                        setFieldValue("stopReasonText", stopReason.reason);
                        switch (stopReason.inPlan) {
                          case InPlan.InPlan:
                            setFieldValue("inPlanSiknOff", true);
                            break;
                          case InPlan.NotInPlan:
                            setFieldValue("inPlanSiknOff", false);
                            break;
                          default:
                            setFieldValue("inPlanSiknOff", true);
                            break;
                        }
                        this.setState({ inPlan: stopReason.inPlan });
                      }
                    }
                  }}
                  allowClear
                >
                  {this.state.stopReasons.map((x) => (
                    <Select.Option value={x.id}>
                      {x.code}) {x.reason}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <FormItem name="stopReasonText" label="Текст причины отключения">
                <Input.TextArea
                  disabled={!this.state.useInReports}
                  name="stopReasonText"
                />
              </FormItem>
            </Col>
          </Row>
          <Row></Row>
          <Row gutter={8}>
            <Col span={8}>
              <FormItem
                colon
                style={{ display: "-webkit-box" }}
                required
                name="inPlanSiknOff"
                label="Тип отключения"
              >
                <Radio.Group
                  disabled={!this.state.useInReports}
                  name="inPlanSiknOff"
                  defaultValue={this.state.inPlanSiknOff}
                  onChange={(ev) =>
                    this.setState({
                      inPlanSiknOff: ev.target.value as boolean,
                    })
                  }
                >
                  <Radio
                    disabled={this.state.inPlan === InPlan.NotInPlan}
                    style={radioStyle}
                    name="inPlanSiknOff"
                    value={true}
                  >
                    В графике отключений
                  </Radio>
                  <Radio
                    disabled={this.state.inPlan === InPlan.InPlan}
                    style={radioStyle}
                    name="inPlanSiknOff"
                    value={false}
                  >
                    Не входит в график отключений
                  </Radio>
                </Radio.Group>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                colon
                style={{ display: "-webkit-box" }}
                name="rsus"
                label="Вид отключения"
              >
                <Radio.Group
                  disabled={!this.state.useInReports}
                  name="types"
                  defaultValue={this.state.offType}
                  onChange={(ev) => {
                    this.setState({
                      offType: ev.target.value as number,
                    });
                    setFieldValue("rsuId", "");
                    setFieldValue("calcMethodId", "");
                    setFieldValue("rsuDurationHours", 0);
                    setFieldValue("rsuDurationMinutes", 0);
                  }}
                >
                  <Radio style={radioStyle} name="types" value={1}>
                    Без перехода на РСУ
                  </Radio>
                  <Radio style={radioStyle} name="types" value={2}>
                    С переходом на РСУ
                  </Radio>
                  <Radio style={radioStyle} name="types" value={3}>
                    Расчётный метод
                  </Radio>
                </Radio.Group>
              </FormItem>
            </Col>

            <Col span={8}>{this.getRsuMethodSelect()}</Col>
          </Row>
          <Row>
            <Col span={16}>
              <FormItem colon name="actInfoSource" label="Источник информации">
                <Input
                  disabled={!this.state.useInReports}
                  name="actInfoSource"
                />
              </FormItem>
            </Col>
          </Row>

          <Row>
            <FormItem
              colon
              name="actInfoDate"
              label="Дата предоставления информации"
            >
              <DatePicker
                locale={locale}
                disabled={!this.state.useInReports}
                name="actInfoDate"
                onChange={(value) => {
                  if (value !== null) {
                    setFieldValue("actInfoDate", value.toDate());
                  }
                }}
              />
            </FormItem>
          </Row>
          <TitleStyled>
            Поля отмеченные <span style={{ color: "#ff4d4f" }}>*</span>{" "}
            обязательны для заполнения
          </TitleStyled>
        </>
      ),
    },
    {
      title: "Показания СОИ СИКН",
      content: (
        <>
          <Row>
            <Col span={24}>
              <FormItem labelCol={{ span: 8 }} name="isDiffSoiData">
                <Checkbox
                  onChange={() => {
                    this.setState({ isDiffSoiData: !this.state.isDiffSoiData });
                    setFieldValue("massStart", this.state.massState);
                    setFieldValue("volumeStart", this.state.volumeState);
                  }}
                  checked={this.state.isDiffSoiData}
                  value={this.state.isDiffSoiData}
                  name="isDiffSoiData"
                >
                  Данные на момент включения/отключения отличаются
                </Checkbox>
              </FormItem>
              <TitleStyled>На момент отключения СИКН</TitleStyled>
              <Col span={8}>
                <FormItem
                  labelCol={{ span: 8 }}
                  name="volume"
                  label="Объем, м³:"
                >
                  <InputNumber
                    min={0}
                    onChange={(value: number) => {
                      this.setState({ volumeState: value });
                      if (!this.state.isDiffSoiData)
                        setFieldValue("volumeStart", value);
                    }}
                    disabled={!this.state.useInReports}
                    style={{ width: "100%" }}
                    name="volume"
                  ></InputNumber>
                </FormItem>
                <FormItem labelCol={{ span: 8 }} name="mass" label="Масса, т:">
                  <InputNumber
                    min={0}
                    onChange={(value: number) => {
                      this.setState({ massState: value });
                      if (!this.state.isDiffSoiData)
                        setFieldValue("massStart", value);
                    }}
                    disabled={!this.state.useInReports}
                    style={{ width: "100%" }}
                    name="mass"
                  ></InputNumber>
                </FormItem>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {this.state.isDiffSoiData === true ? (
                <TitleStyled>На момент включения СИКН</TitleStyled>
              ) : (
                <></>
              )}
              <Col span={8}>
                <FormItem
                  hidden={!this.state.isDiffSoiData}
                  labelCol={{ span: 8 }}
                  name="volumeStart"
                  label="Объем, м³:"
                >
                  <InputNumber
                    min={0}
                    disabled={!this.state.useInReports}
                    style={{ width: "100%" }}
                    name="volumeStart"
                  ></InputNumber>
                </FormItem>
                <FormItem
                  hidden={!this.state.isDiffSoiData}
                  labelCol={{ span: 8 }}
                  name="massStart"
                  label="Масса, т:"
                >
                  <InputNumber
                    min={0}
                    disabled={!this.state.useInReports}
                    style={{ width: "100%" }}
                    name="massStart"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span={16}>
                <FormItem
                  required={this.state.isDiffSoiData}
                  hidden={!this.state.isDiffSoiData}
                  labelCol={{ span: 8 }}
                  name="differenceReason"
                  label="Причина отклонений"
                >
                  <Input.TextArea
                    disabled={!this.state.useInReports}
                    name="differenceReason"
                  />
                </FormItem>
              </Col>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Представители организации",
      content: (
        <>
          <Row>
            <Col span={16}>
              <>
                {this.props.isEditForm === true ? (
                  <>
                    <FormItem
                      name="send"
                      label={<strong>Предприятие принимающей стороны</strong>}
                    >
                      {values.send ? values.send : "Нет данных"}
                    </FormItem>
                    <FormItem
                      name="receive"
                      label={<strong>Предприятие сдающей стороны</strong>}
                    >
                      {values.receive ? values.receive : "Нет данных"}
                    </FormItem>
                    <FormItem
                      name="toInspection"
                      label={<strong>Предприятие, проводящее ТО СИКН</strong>}
                    >
                      <Input name="toInspection" />
                    </FormItem>
                  </>
                ) : (
                  <div></div>
                )}
              </>
            </Col>
          </Row>

          <Divider />

          <Row>
            <Col span={24}>
              <Row>
                <Col span={24}>
                  <FormItem labelCol={{ span: 8 }} name="isDiffPeople">
                    <Checkbox
                      onChange={() => {
                        this.setState({
                          isDiffPeople: !this.state.isDiffPeople,
                        });
                      }}
                      checked={this.state.isDiffPeople}
                      value={this.state.isDiffPeople}
                      name="isDiffPeople"
                    >
                      Представители организация на момент включения/отключения
                      отличаются
                    </Checkbox>
                  </FormItem>
                  <Row>
                    <TitleStyled>При отключении СИКН</TitleStyled>
                  </Row>
                  <Row>
                    <Title level={5}>Сдающая сторона:</Title>
                  </Row>
                  <FieldArray
                    name="siknOffAct.offSendPeople"
                    render={(arrayHelpers) => (
                      <div>
                        {values.siknOffAct.offSendPeople &&
                          values.siknOffAct.offSendPeople.length > 0 ? (
                          values.siknOffAct.offSendPeople.map(
                            (people, index) => (
                              <>
                                <Row gutter={16} align="middle">
                                  <Col span={8}>
                                    <FormItem
                                      required
                                      name={`siknOffAct.offSendPeople.${index}.post`}
                                      label="Должность:"
                                    >
                                      <Select
                                        name={`siknOffAct.offSendPeople.${index}.post`}
                                        dropdownRender={(menu) => (
                                          <div>
                                            {menu}
                                            <Divider
                                              style={{
                                                margin: "4px 0",
                                              }}
                                            />
                                            <div
                                              style={{
                                                display: "flex",
                                                flexWrap: "nowrap",
                                                padding: 8,
                                              }}
                                            >
                                              <AntInput
                                                style={{
                                                  flex: "auto",
                                                }}
                                                value={this.state.newPostName}
                                                onChange={this.onNameChange}
                                              />
                                              <a
                                                style={{
                                                  flex: "none",
                                                  padding: "8px",
                                                  display: "block",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  this.addPost(
                                                    SiknOffGroupsEnum.SendPeople
                                                  )
                                                }
                                              >
                                                <PlusOutlined /> Добавить
                                              </a>
                                            </div>
                                          </div>
                                        )}
                                      >
                                        {this.state.siknOffActInfo.sendPosts.map(
                                          (post) => (
                                            <Select.Option value={post.id}>
                                              {post.name}
                                            </Select.Option>
                                          )
                                        )}
                                      </Select>
                                    </FormItem>
                                  </Col>
                                  <Col span={8}>
                                    <FormItem
                                      required={this.state.withFile}
                                      name={`siknOffAct.offSendPeople.${index}.fio`}
                                      label="ФИО:"
                                    >
                                      <Input
                                        name={`siknOffAct.offSendPeople.${index}.fio`}
                                      />
                                    </FormItem>
                                  </Col>
                                  <Col>
                                    {values.siknOffAct.offSendPeople &&
                                      values.siknOffAct.offSendPeople.length >
                                      1 ? (
                                      <DeleteOutlined
                                        style={{ color: "red" }}
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      />
                                    ) : (
                                      <div></div>
                                    )}
                                  </Col>
                                </Row>
                              </>
                            )
                          )
                        ) : (
                          <div></div>
                        )}
                        <Button
                          type={"link"}
                          icon={<PlusCircleFilled />}
                          size="large"
                          onClick={() =>
                            arrayHelpers.push({
                              post: "",
                              fio: "",
                            })
                          }
                        >
                          Добавить
                        </Button>
                      </div>
                    )}
                  />

                  <Divider />
                  <Row>
                    <Title level={5}>Принимающая сторона:</Title>
                  </Row>
                  <FieldArray
                    name="siknOffAct.offReceivePeople"
                    render={(arrayHelpers) => (
                      <div>
                        {values.siknOffAct.offReceivePeople &&
                          values.siknOffAct.offReceivePeople.length > 0 ? (
                          values.siknOffAct.offReceivePeople.map(
                            (people, index) => (
                              <>
                                <Row gutter={16} align="middle">
                                  <Col span={8}>
                                    <FormItem
                                      required
                                      name={`siknOffAct.offReceivePeople.${index}.post`}
                                      label="Должность:"
                                    >
                                      <Select
                                        name={`siknOffAct.offReceivePeople.${index}.post`}
                                        dropdownRender={(menu) => (
                                          <div>
                                            {menu}
                                            <Divider
                                              style={{
                                                margin: "4px 0",
                                              }}
                                            />
                                            <div
                                              style={{
                                                display: "flex",
                                                flexWrap: "nowrap",
                                                padding: 8,
                                              }}
                                            >
                                              <AntInput
                                                style={{
                                                  flex: "auto",
                                                }}
                                                value={this.state.newPostName}
                                                onChange={this.onNameChange}
                                              />
                                              <a
                                                style={{
                                                  flex: "none",
                                                  padding: "8px",
                                                  display: "block",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                  this.addPost(
                                                    SiknOffGroupsEnum.ReceivePeople
                                                  )
                                                }
                                              >
                                                <PlusOutlined /> Добавить
                                              </a>
                                            </div>
                                          </div>
                                        )}
                                      >
                                        {this.state.siknOffActInfo.receivePosts.map(
                                          (post) => (
                                            <Select.Option value={post.id}>
                                              {post.name}
                                            </Select.Option>
                                          )
                                        )}
                                      </Select>
                                    </FormItem>
                                  </Col>
                                  <Col span={8}>
                                    <FormItem
                                      required={this.state.withFile}
                                      name={`siknOffAct.offReceivePeople.${index}.fio`}
                                      label="ФИО:"
                                    >
                                      <Input
                                        name={`siknOffAct.offReceivePeople.${index}.fio`}
                                      />
                                    </FormItem>
                                  </Col>
                                  <Col>
                                    {values.siknOffAct.offReceivePeople &&
                                      values.siknOffAct.offReceivePeople.length >
                                      1 ? (
                                      <DeleteOutlined
                                        style={{ color: "red" }}
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      />
                                    ) : (
                                      <div></div>
                                    )}
                                  </Col>
                                </Row>
                              </>
                            )
                          )
                        ) : (
                          <div></div>
                        )}
                        <Button
                          type={"link"}
                          icon={<PlusCircleFilled />}
                          size="large"
                          onClick={() =>
                            arrayHelpers.push({
                              post: "",
                              fio: "",
                            })
                          }
                        >
                          Добавить
                        </Button>
                      </div>
                    )}
                  />

                  <Divider />

                  <Row>
                    <Title level={5}>Выполняющая ТО сторона:</Title>
                  </Row>
                  <FieldArray
                    name="siknOffAct.offToPeople"
                    render={(arrayHelpers) => (
                      <div>
                        {values.siknOffAct.offToPeople &&
                          values.siknOffAct.offToPeople.length > 0 ? (
                          values.siknOffAct.offToPeople.map((people, index) => (
                            <>
                              <Row gutter={16} align="middle">
                                <Col span={8}>
                                  <FormItem
                                    required
                                    name={`siknOffAct.offToPeople.${index}.post`}
                                    label="Должность:"
                                  >
                                    <Select
                                      name={`siknOffAct.offToPeople.${index}.post`}
                                      dropdownRender={(menu) => (
                                        <div>
                                          {menu}
                                          <Divider
                                            style={{
                                              margin: "4px 0",
                                            }}
                                          />
                                          <div
                                            style={{
                                              display: "flex",
                                              flexWrap: "nowrap",
                                              padding: 8,
                                            }}
                                          >
                                            <AntInput
                                              style={{
                                                flex: "auto",
                                              }}
                                              value={this.state.newPostName}
                                              onChange={this.onNameChange}
                                            />
                                            <a
                                              style={{
                                                flex: "none",
                                                padding: "8px",
                                                display: "block",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                this.addPost(
                                                  SiknOffGroupsEnum.ToPeople
                                                )
                                              }
                                            >
                                              <PlusOutlined /> Добавить
                                            </a>
                                          </div>
                                        </div>
                                      )}
                                    >
                                      {this.state.siknOffActInfo.toPosts.map(
                                        (post) => (
                                          <Select.Option value={post.id}>
                                            {post.name}
                                          </Select.Option>
                                        )
                                      )}
                                    </Select>
                                  </FormItem>
                                </Col>
                                <Col span={8}>
                                  <FormItem
                                    required={this.state.withFile}
                                    name={`siknOffAct.offToPeople.${index}.fio`}
                                    label="ФИО:"
                                  >
                                    <Input
                                      name={`siknOffAct.offToPeople.${index}.fio`}
                                    />
                                  </FormItem>
                                </Col>
                                <Col>
                                  {values.siknOffAct.offToPeople &&
                                    values.siknOffAct.offToPeople.length > 1 ? (
                                    <DeleteOutlined
                                      style={{ color: "red" }}
                                      onClick={() => arrayHelpers.remove(index)}
                                    />
                                  ) : (
                                    <div></div>
                                  )}
                                </Col>
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
                          onClick={() =>
                            arrayHelpers.push({
                              post: "",
                              fio: "",
                            })
                          }
                        >
                          Добавить
                        </Button>
                      </div>
                    )}
                  />

                  <Divider />
                  {this.state.isDiffPeople ? (
                    <>
                      <Row>
                        <TitleStyled>При включении СИКН</TitleStyled>
                      </Row>
                      <Row>
                        <Title level={5}>Сдающая сторона:</Title>
                      </Row>
                      <FieldArray
                        name="siknOffAct.onSendPeople"
                        render={(arrayHelpers) => (
                          <div>
                            {values.siknOffAct.onSendPeople &&
                              values.siknOffAct.onSendPeople.length > 0 ? (
                              values.siknOffAct.onSendPeople.map(
                                (people, index) => (
                                  <>
                                    <Row gutter={16} align="middle">
                                      <Col span={8}>
                                        <FormItem
                                          required={this.state.isDiffPeople}
                                          name={`siknOffAct.onSendPeople.${index}.post`}
                                          label="Должность:"
                                        >
                                          <Select
                                            name={`siknOffAct.onSendPeople.${index}.post`}
                                            dropdownRender={(menu) => (
                                              <div>
                                                {menu}
                                                <Divider
                                                  style={{
                                                    margin: "4px 0",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    flexWrap: "nowrap",
                                                    padding: 8,
                                                  }}
                                                >
                                                  <AntInput
                                                    style={{
                                                      flex: "auto",
                                                    }}
                                                    value={
                                                      this.state.newPostName
                                                    }
                                                    onChange={this.onNameChange}
                                                  />
                                                  <a
                                                    style={{
                                                      flex: "none",
                                                      padding: "8px",
                                                      display: "block",
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                      this.addPost(
                                                        SiknOffGroupsEnum.SendPeople
                                                      )
                                                    }
                                                  >
                                                    <PlusOutlined /> Добавить
                                                  </a>
                                                </div>
                                              </div>
                                            )}
                                          >
                                            {this.state.siknOffActInfo.sendPosts.map(
                                              (post) => (
                                                <Select.Option value={post.id}>
                                                  {post.name}
                                                </Select.Option>
                                              )
                                            )}
                                          </Select>
                                        </FormItem>
                                      </Col>
                                      <Col span={8}>
                                        <FormItem
                                          required={this.state.withFile}
                                          name={`siknOffAct.onSendPeople.${index}.fio`}
                                          label="ФИО:"
                                        >
                                          <Input
                                            name={`siknOffAct.onSendPeople.${index}.fio`}
                                          />
                                        </FormItem>
                                      </Col>
                                      <Col>
                                        {values.siknOffAct.onSendPeople &&
                                          values.siknOffAct.onSendPeople.length >
                                          1 ? (
                                          <DeleteOutlined
                                            style={{ color: "red" }}
                                            onClick={() =>
                                              arrayHelpers.remove(index)
                                            }
                                          />
                                        ) : (
                                          <div></div>
                                        )}
                                      </Col>
                                    </Row>
                                  </>
                                )
                              )
                            ) : (
                              <div></div>
                            )}
                            <Button
                              type={"link"}
                              icon={<PlusCircleFilled />}
                              size="large"
                              onClick={() =>
                                arrayHelpers.push({
                                  post: "",
                                  fio: "",
                                })
                              }
                            >
                              Добавить
                            </Button>
                          </div>
                        )}
                      />

                      <Divider />

                      <Row>
                        <Title level={5}>Принимающая сторона:</Title>
                      </Row>
                      <FieldArray
                        name="siknOffAct.onReceivePeople"
                        render={(arrayHelpers) => (
                          <div>
                            {values.siknOffAct.onReceivePeople &&
                              values.siknOffAct.onReceivePeople.length > 0 ? (
                              values.siknOffAct.onReceivePeople.map(
                                (people, index) => (
                                  <>
                                    <Row gutter={16} align="middle">
                                      <Col span={8}>
                                        <FormItem
                                          required={this.state.isDiffPeople}
                                          name={`siknOffAct.onReceivePeople.${index}.post`}
                                          label="Должность:"
                                        >
                                          <Select
                                            name={`siknOffAct.onReceivePeople.${index}.post`}
                                            dropdownRender={(menu) => (
                                              <div>
                                                {menu}
                                                <Divider
                                                  style={{
                                                    margin: "4px 0",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    flexWrap: "nowrap",
                                                    padding: 8,
                                                  }}
                                                >
                                                  <AntInput
                                                    style={{
                                                      flex: "auto",
                                                    }}
                                                    value={
                                                      this.state.newPostName
                                                    }
                                                    onChange={this.onNameChange}
                                                  />
                                                  <a
                                                    style={{
                                                      flex: "none",
                                                      padding: "8px",
                                                      display: "block",
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                      this.addPost(
                                                        SiknOffGroupsEnum.ReceivePeople
                                                      )
                                                    }
                                                  >
                                                    <PlusOutlined /> Добавить
                                                  </a>
                                                </div>
                                              </div>
                                            )}
                                          >
                                            {this.state.siknOffActInfo.receivePosts.map(
                                              (post) => (
                                                <Select.Option value={post.id}>
                                                  {post.name}
                                                </Select.Option>
                                              )
                                            )}
                                          </Select>
                                        </FormItem>
                                      </Col>
                                      <Col span={8}>
                                        <FormItem
                                          required={this.state.withFile}
                                          name={`siknOffAct.onReceivePeople.${index}.fio`}
                                          label="ФИО:"
                                        >
                                          <Input
                                            name={`siknOffAct.onReceivePeople.${index}.fio`}
                                          />
                                        </FormItem>
                                      </Col>
                                      <Col>
                                        {values.siknOffAct.onReceivePeople &&
                                          values.siknOffAct.onReceivePeople
                                            .length > 1 ? (
                                          <DeleteOutlined
                                            style={{ color: "red" }}
                                            onClick={() =>
                                              arrayHelpers.remove(index)
                                            }
                                          />
                                        ) : (
                                          <div></div>
                                        )}
                                      </Col>
                                    </Row>
                                  </>
                                )
                              )
                            ) : (
                              <div></div>
                            )}
                            <Button
                              type={"link"}
                              icon={<PlusCircleFilled />}
                              size="large"
                              onClick={() =>
                                arrayHelpers.push({
                                  post: "",
                                  fio: "",
                                })
                              }
                            >
                              Добавить
                            </Button>
                          </div>
                        )}
                      />

                      <Divider />

                      <Row>
                        <Title level={5}>Выполняющая ТО сторона:</Title>
                      </Row>
                      <FieldArray
                        name="siknOffAct.onToPeople"
                        render={(arrayHelpers) => (
                          <div>
                            {values.siknOffAct.onToPeople &&
                              values.siknOffAct.onToPeople.length > 0 ? (
                              values.siknOffAct.onToPeople.map(
                                (people, index) => (
                                  <>
                                    <Row gutter={16} align="middle">
                                      <Col span={8}>
                                        <FormItem
                                          required={this.state.isDiffPeople}
                                          name={`siknOffAct.onToPeople.${index}.post`}
                                          label="Должность:"
                                        >
                                          <Select
                                            name={`siknOffAct.onToPeople.${index}.post`}
                                            dropdownRender={(menu) => (
                                              <div>
                                                {menu}
                                                <Divider
                                                  style={{
                                                    margin: "4px 0",
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    flexWrap: "nowrap",
                                                    padding: 8,
                                                  }}
                                                >
                                                  <AntInput
                                                    style={{
                                                      flex: "auto",
                                                    }}
                                                    value={
                                                      this.state.newPostName
                                                    }
                                                    onChange={this.onNameChange}
                                                  />
                                                  <a
                                                    style={{
                                                      flex: "none",
                                                      padding: "8px",
                                                      display: "block",
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                      this.addPost(
                                                        SiknOffGroupsEnum.ToPeople
                                                      )
                                                    }
                                                  >
                                                    <PlusOutlined /> Добавить
                                                  </a>
                                                </div>
                                              </div>
                                            )}
                                          >
                                            {this.state.siknOffActInfo.toPosts.map(
                                              (post) => (
                                                <Select.Option value={post.id}>
                                                  {post.name}
                                                </Select.Option>
                                              )
                                            )}
                                          </Select>
                                        </FormItem>
                                      </Col>
                                      <Col span={8}>
                                        <FormItem
                                          required={this.state.withFile}
                                          name={`siknOffAct.onToPeople.${index}.fio`}
                                          label="ФИО:"
                                        >
                                          <Input
                                            name={`siknOffAct.onToPeople.${index}.fio`}
                                          />
                                        </FormItem>
                                      </Col>
                                      <Col>
                                        {values.siknOffAct.onToPeople &&
                                          values.siknOffAct.onToPeople.length >
                                          1 ? (
                                          <DeleteOutlined
                                            style={{
                                              color: "red",
                                            }}
                                            onClick={() =>
                                              arrayHelpers.remove(index)
                                            }
                                          />
                                        ) : (
                                          <div></div>
                                        )}
                                      </Col>
                                    </Row>
                                  </>
                                )
                              )
                            ) : (
                              <div></div>
                            )}
                            <Button
                              type={"link"}
                              icon={<PlusCircleFilled />}
                              size="large"
                              onClick={() =>
                                arrayHelpers.push({
                                  post: "",
                                  fio: "",
                                })
                              }
                            >
                              Добавить
                            </Button>
                          </div>
                        )}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  private getOffType(item: SiknOffItem | undefined): number {
    if (item === undefined) {
      item = SiknOffItem.Default(this.props.node.nodeId);
    }
    // без перехода на РСУ
    if (item.rsuId === null && item.calcMethodId === null) {
      return 1;
    }
    // с переходом на РСУ
    if (item.rsuId !== null && item.calcMethodId === null) {
      return 2;
    }
    // расчётный метод
    if (item.rsuId === null && item.calcMethodId !== null) {
      return 3;
    }
    return 0;
  }

  private getRsuMethodSelect(): JSX.Element {
    switch (this.state.offType) {
      case 1:
        return (
          <FormItem
            name="exactRsuMethod"
            label="Уточнение РСУ/Расчётного метода"
          >
            <Select name="exactRsuMethod" disabled></Select>
          </FormItem>
        );
      case 2:
        return (
          <>
            <FormItem
              required
              name="rsuId"
              label="Уточнение РСУ/Расчётного метода"
            >
              <Select disabled={!this.state.useInReports} name="rsuId">
                {this.state.rsus.map((x) => (
                  <Select.Option value={x.id}>{x.fullName}</Select.Option>
                ))}
              </Select>
            </FormItem>
            <span>Продолжительность работы СИКН по РСУ</span>
            <Row>
              <Col span={8}>
                <FormItem name="rsuDurationHours" label="часов">
                  <InputNumber
                    min={0}
                    placeholder={"00чч"}
                    name="rsuDurationHours"
                    onChange={(value: number) => {
                      if (
                        Number.isNaN(value) ||
                        value < 0 ||
                        value === undefined ||
                        typeof value === "string"
                      ) {
                        return;
                      }
                      let h = value * 60 * 1000;

                      this.setState({
                        rsuDurationHours: h / 60 / 1000,
                      });

                      this.setState({
                        rsuDurationTime:
                          value * 60 + this.state.rsuDurationMinutes,
                      });
                    }}
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem name="rsuDurationMinutes" label="минут">
                  <InputNumber
                    min={0}
                    placeholder={"00мин"}
                    name="rsuDurationMinutes"
                    onChange={(value: number) => {
                      if (
                        Number.isNaN(value) ||
                        value < 0 ||
                        value === undefined ||
                        typeof value === "string"
                      ) {
                        return;
                      }
                      let m = value * 60 * 1000;

                      this.setState({
                        rsuDurationMinutes: m / 60 / 1000,
                      });

                      this.setState({
                        rsuDurationTime:
                          this.state.rsuDurationHours * 60 + value,
                      });
                    }}
                  ></InputNumber>
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem name="rsuDurationTotal" label={"rsuTotal"} hidden>
                  <InputNumber
                    name="rsuDurationTotal"
                    min={0}
                    value={this.state.rsuDurationTime}
                  ></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <RedStyled
                hidden={
                  this.state.rsuDurationTime > this.state.durationTime
                    ? false
                    : true
                }
              >
                Время работы по РСУ не может быть больше, чем длительность
                отключения {this.state.durationHour} ч.{" "}
                {this.state.durationMinute < 9
                  ? `0` + this.state.durationMinute
                  : this.state.durationMinute}{" "}
                мин!
              </RedStyled>
            </Row>
          </>
        );
      case 3:
        return (
          <FormItem
            required
            name="calcMethodId"
            label="Уточнение РСУ/Расчётного метода"
          >
            <Select disabled={!this.state.useInReports} name="calcMethodId">
              {this.state.calcMethods.map((x) => (
                <Select.Option value={x.id}>{x.name}</Select.Option>
              ))}
            </Select>
          </FormItem>
        );
    }
    return <></>;
  }

  onNameChange = (event: any) => {
    this.setState({
      newPostName: event.target.value,
    });
  };

  addPost = (group: SiknOffGroupsEnum) => {
    const { siknOffActInfo, newPostName } = this.state;
    if (newPostName === "" || /^\s*$/.test(newPostName)) {
      message.warn(
        "Введенная должность не может быть пустой или содержать пробелы"
      );
      return;
    }
    switch (group) {
      case SiknOffGroupsEnum.SendPeople:
        if (
          this.state.siknOffActInfo.sendPosts.filter(
            (x) =>
              x.name.toLowerCase().replace(/\s/g, "") ===
              newPostName.toLowerCase().replace(/\s/g, "")
          ).length > 0
        ) {
          message.warn("Введенная должность уже существует");
          return;
        }

        this.setState({
          siknOffActInfo: {
            ...this.state.siknOffActInfo,
            sendPosts: [
              ...siknOffActInfo.sendPosts,
              { id: newPostName, name: newPostName },
            ],
          },
          newPostName: "",
        });
        break;
      case SiknOffGroupsEnum.ReceivePeople:
        if (
          this.state.siknOffActInfo.receivePosts.filter(
            (x) =>
              x.name.toLowerCase().replace(/\s/g, "") ===
              newPostName.toLowerCase().replace(/\s/g, "")
          ).length > 0
        ) {
          message.warn("Введенная должность уже существует");
          return;
        }
        this.setState({
          siknOffActInfo: {
            ...this.state.siknOffActInfo,
            receivePosts: [
              ...siknOffActInfo.receivePosts,
              { id: newPostName, name: newPostName },
            ],
          },
          newPostName: "",
        });
        break;
      case SiknOffGroupsEnum.ToPeople:
        if (
          this.state.siknOffActInfo.toPosts.filter(
            (x) =>
              x.name.toLowerCase().replace(/\s/g, "") ===
              newPostName.toLowerCase().replace(/\s/g, "")
          ).length > 0
        ) {
          message.warn("Введенная должность уже существует");
          return;
        }
        this.setState({
          siknOffActInfo: {
            ...this.state.siknOffActInfo,
            toPosts: [
              ...siknOffActInfo.toPosts,
              { id: newPostName, name: newPostName },
            ],
          },
          newPostName: "",
        });
        break;
      default:
        break;
    }
  };

  initialValues: SiknOffItem =
    this.props.initial ?? SiknOffItem.Default(this.props.node.nodeId);

  next() {
    this.setState({ step: this.state.step + 1 });
  }

  prev() {
    this.setState({ step: this.state.step - 1 });
  }

  render(): JSX.Element {
    if (
      this.initialValues.siknOffAct === null ||
      this.initialValues.siknOffAct === undefined
    ) {
      this.initialValues.siknOffAct = {
        offSendPeople: [{ fio: "", post: "" }],
        offReceivePeople: [{ fio: "", post: "" }],
        offToPeople: [{ fio: "", post: "" }],
        onSendPeople: [{ fio: "", post: "" }],
        onReceivePeople: [{ fio: "", post: "" }],
        onToPeople: [{ fio: "", post: "" }],
      };
    }
    this.initialValues.siknOffAct.offSendPeople =
      this.state.siknOffActInfo.offSendPeople;
    this.initialValues.siknOffAct.offReceivePeople =
      this.state.siknOffActInfo.offReceivePeople;
    this.initialValues.siknOffAct.offToPeople =
      this.state.siknOffActInfo.offToPeople;
    this.initialValues.siknOffAct.onSendPeople =
      this.state.siknOffActInfo.onSendPeople;
    this.initialValues.siknOffAct.onReceivePeople =
      this.state.siknOffActInfo.onReceivePeople;
    this.initialValues.siknOffAct.onToPeople =
      this.state.siknOffActInfo.onToPeople;

    let title: string = "";
    switch (this.props.node.type) {
      case "siknrsus":
        title = this.props.node.title;
        break;
      case "osts":
        if (this.props.initial !== undefined) {
          title = this.props.initial.siknFullName;
        }
        break;
    }
    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <Formik
          initialValues={this.initialValues}
          onSubmit={async (
            data: SiknOffItem,
            helpers: FormikHelpers<SiknOffItem>
          ) => {
            if (
              this.state.step ===
              this.steps(helpers.setFieldValue, data).length - 1
            ) {
              console.log(data);
              let res = await this.props.submitCallback(data);
              if (data.withFile === true)
                await this.props.downloadFileCallback(res);
              helpers.setSubmitting(false);
            }
          }}
          validationSchema={returnValidationSchema(
            this.state.withFile,
            this.state.isDiffPeople,
            this.state.offType
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
                        <Header
                          style={{
                            background: "#FFFFFF",
                            padding: "0px",
                          }}
                        >
                          <Row>
                            <Col span={24}>
                              <Title level={4}>{title}</Title>
                            </Col>
                          </Row>
                        </Header>

                        <Form layout="vertical">
                          {
                            this.steps(setFieldValue, values)[this.state.step]
                              .content
                          }

                          <Footer style={{ background: "#FFFFFF" }}>
                            <Row justify="end" align="bottom">
                              {this.state.step ===
                                this.steps(setFieldValue, values).length -
                                1 && (
                                  <>
                                    <Row>
                                      <Space align="baseline" size="middle">
                                        <FormItem
                                          style={{
                                            margin: "0px",
                                            padding: "0px",
                                          }}
                                          name="withFile"
                                        >
                                          <Switch
                                            name="withFile"
                                            onChange={(val) => {
                                              this.setState({ withFile: val });
                                            }}
                                          />
                                        </FormItem>
                                        <span>Скачать акт</span>
                                      </Space>
                                    </Row>
                                  </>
                                )}
                              {this.state.step > 0 && (
                                <Button type="link" onClick={() => this.prev()}>
                                  Назад
                                </Button>
                              )}
                              {this.state.step <
                                this.steps(setFieldValue, values).length -
                                1 && (
                                  <Button
                                    disabled={
                                      this.state.rsuDurationTime >
                                      this.state.durationTime ||
                                      !this.state.isWarnHidden
                                    }
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
                                        SiknOffElements[
                                        SiknOffElements.SiknOffAdd
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

  componentDidMount() {
    axios
      .get<Array<StopReason>>(`${apiBase}/stopreasons`)
      .then((result) => {
        this.setState({ stopReasons: result.data })
        if (this.props.initial !== null && this.props.initial !== undefined) {
          let stopReason = result.data.find(
            (x) => x.id === this.props.initial?.stopReasonId
          );
          if (stopReason) {
            this.setState({ inPlan: stopReason.inPlan });
          }
        }
      });
    let id: number = -1;
    switch (this.props.node.type) {
      case "controldirs":
        id = this.props.node.nodeId;
        break;
      case "osts":
      case "all":
        if (this.props.initial !== undefined) {
          id = this.props.initial.controlDirId;
        }
        break;
    }
    axios
      .get<Array<Rsu>>(`${apiBase}/controldirs/${id}/rsus`)
      .then((result) => this.setState({ rsus: result.data }));
    axios
      .get<Array<CalcMethod>>(`${apiBase}/calcmethods`)
      .then((result) => this.setState({ calcMethods: result.data }));

    if (this.props.initial !== null && this.props.initial !== undefined) {



      axios
        .get<SiknOffActInfo>(
          `${apiBase}/siknoff/SiknOffActInfo/${this.props.initial.id}`
        )
        .then((result) => {
          this.setState({
            siknOffActInfo: result.data,
            isDiffPeople: this.checkPeople(result.data),
            loading: false,
          });
        });
    } else {
      axios
        .get<SiknOffActInfo>(`${apiBase}/siknoff/SiknOffActInfo/${zeroGuid}`)
        .then((result) => {
          this.setState({
            siknOffActInfo: result.data,
            loading: false,
          });
        });
    }
  }
}
