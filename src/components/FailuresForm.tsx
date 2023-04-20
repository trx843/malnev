import { Formik, FormikHelpers } from "formik";
import { Component } from "react";
import {
  Form,
  FormItem,
  DatePicker,
  Checkbox,
  Input,
  Select,
  SubmitButton,
  Switch,
} from "formik-antd";
import { apiBase, dateToString, zeroGuid } from "../utils";
import axios from "axios";
import {
  Button,
  message,
  Row,
  Col,
  Space,
  Skeleton,
  Steps,
  DatePicker as AntDatePicker,
  Alert,
} from "antd";
import { SelectedNode } from "../interfaces";
import Title from "antd/lib/typography/Title";
import locale from "antd/es/date-picker/locale/ru_RU";
import * as Yup from "yup";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import {
  Failures,
  SiEquipment,
  SiModel,
  TechPositions,
  MssFailureTypes,
  FailureReportCodes,
  FailureConsequences,
  FailureResponsibilityArea,
  Sequence,
} from "../classes";
import styled from "styled-components";
import { Moment } from "moment";
import { IdType, Nullable } from "../types";
import {
  TextDarkStyled as DarkStyled,
  TextGrayStyled as GrayStyled,
} from "../styles/commonStyledComponents";
import moment from "moment";
import { ActionsEnum, Can } from "../casl";
import { elementId, FailuresElements } from "../pages/Failures/constant";

interface IFailuresFormProps {
  initial?: Failures;
  submitCallback: (item: Failures) => Promise<Failures>;
  node: SelectedNode;
  isSiTypeTree: boolean;
}

interface IFailuresFormState {
  step: number;
  loading: boolean;
  useInReports: boolean;
  isAcknowledged: boolean;
  mssFailureTypes: Array<MssFailureTypes>;
  failureReportCodes: Array<FailureReportCodes>;
  failureResponsibilityArea: Array<FailureResponsibilityArea>;
  failureConsequences: Array<FailureConsequences>;
  sequence: Array<Sequence>;
  siModels: Array<SiModel>;
  endDate: Nullable<Date>;
  startDate: Date;
  failureMsg: string;
  isWarnHidden: boolean;
  siknFullName: string;
  techPositionName: Nullable<string>;
  udSiknFullName: string;
  udTechPositionName: Nullable<string>;
  siCompName: Nullable<string>;
  isWarnSiHidden: boolean;
  isNotEqualSiHidden: boolean;
  initialSiId: Nullable<IdType>;
  isCommentRequired: boolean;
  initialFailureId: Nullable<IdType>;
  siId: Nullable<IdType>;
}

const { Step } = Steps;

const startDateConst = new Date(new Date().setDate(new Date().getDate() - 7));

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

const validationSchema = Yup.object({
  mssFailureTypeId: Yup.number().required("Поле обязательно к заполнению!"),
  startDateTime: Yup.date().required("Поле обязательно к заполнению!"),
  failureReportCodeId: Yup.number().nullable().required("Поле обязательно к заполнению!"),
  isAcknowledged: Yup.boolean(),
  comment: Yup.string()
    .nullable()
    .when("isAcknowledged", {
      is: true,
      then: Yup.string().nullable().required("Поле обязательно к заполнению!"),
    }),

  useInReports: Yup.boolean(),

  shortInfo: Yup.string()
    .nullable()
    .when("useInReports", {
      is: true,
      then: Yup.string().nullable().required("Поле обязательно к заполнению!"),
    }),

  responsibilityAreaId: Yup.number()
    .nullable()
    .when("useInReports", {
      is: true,
      then: Yup.number().nullable().required("Поле обязательно к заполнению!"),
    }),

  failureConsequencesIdList: Yup.string()
    .nullable()
    .when("useInReports", {
      is: true,
      then: Yup.string().nullable().required("Поле обязательно к заполнению!"),
    }),

  sequenceId: Yup.number()
    .nullable()
    .when("useInReports", {
      is: true,
      then: Yup.number().nullable().required("Поле обязательно к заполнению!"),
    }),

  dontUseInReportsComment: Yup.string()
    .nullable()
    .when("useInReports", {
      is: false,
      then: Yup.string().nullable().required("Поле обязательно к заполнению!"),
    }),
  shortMeasuresTaken: Yup.string()
    .nullable()
    .when("isCommentRequired", {
      is: true,
      then: Yup.string().nullable().required("Поле обязательно к заполнению!"),
    }),
  measuresTaken: Yup.string()
    .nullable()
    .when("isCommentRequired", {
      is: true,
      then: Yup.string().nullable().required("Поле обязательно к заполнению!"),
    }),
});

export class FailuresForm extends Component<
  IFailuresFormProps,
  IFailuresFormState
> {
  constructor(props: IFailuresFormProps) {
    super(props);
    this.state = {
      step: 0,
      loading: true,
      useInReports:
        props.initial === undefined
          ? true
          : props.initial.useInReports === null
          ? true
          : props.initial.useInReports,
      isAcknowledged:
        props.initial === undefined
          ? true
          : props.initial.isAcknowledged === null
          ? true
          : props.initial.isAcknowledged,
      mssFailureTypes: [],
      failureReportCodes: [],
      failureResponsibilityArea: [],
      failureConsequences: [],
      sequence: [],
      siModels: [],
      startDate: props.initial?.startDateTime || new Date(),
      endDate: props.initial?.endDateTime || null,
      failureMsg: "",
      isWarnHidden: true,
      siknFullName: "н/д",
      techPositionName: "н/д",
      udSiknFullName: "н/д",
      udTechPositionName: "н/д",
      siCompName: "н/д",
      isWarnSiHidden: true,
      isNotEqualSiHidden: true,
      initialSiId: null,
      isCommentRequired: false,
      initialFailureId: null,
      siId: props.initial?.siId || null,
    };
  }

  dateChangeHandler = (techPosId: number, startTime: Date) => {
    axios
      .get<SiEquipment>(
        `${apiBase}/techpositions/${techPosId}/siquipments?startTime=${moment(
          startTime
        ).format("YYYY-MM-DD HH:mm")}`
      )
      .then((result) => {
        if (result.data) {
          if (result.data.id !== this.state.initialSiId) {
            this.setState({
              isNotEqualSiHidden: false,
            });
          } else {
            this.setState({ isNotEqualSiHidden: true });
          }
          this.setState({
            siId: result.data.id,
            siCompName: result.data.siCompName,
          });
          this.initialValues.siId = result.data.id;
          this.setState({ isWarnSiHidden: true });
        } else {
          this.initialValues.siId = null;
          this.setState({ isWarnSiHidden: false });
        }
      });
  };

  checkFailureHandler = (
    siId: IdType,
    sTime: string,
    eTime: string,
    failureId: Nullable<IdType> | undefined
  ) => {
    axios
      .get<string>(
        `${apiBase}/siquipments/${siId}/failure?appearDateTime=${sTime}&fixDateTime=${eTime}&failureId=${failureId}`
      )
      .then((result) => {
        this.setState({
          failureMsg: result.data,
          isWarnHidden: !result.data,
        });
      });
  };

  disabledDateNow = (current: moment.Moment) => {
    return current > moment();
  };

  disabledStartDate = (current: moment.Moment) => {
    return current > moment(new Date(this.state.endDate ?? new Date()));
  };

  disabledEndDate = (current: moment.Moment) => {
    return current < moment(new Date(this.state.startDate));
  };

  private steps = (setFieldValue: any, values: Failures): Step[] => [
    {
      title: "Идентификация",
      content: (
        <>
          <Row gutter={[16, 24]}>
            <Col span={8}>
              <FormItem name="sikn" label={<GrayStyled>СИКН</GrayStyled>}>
                <DarkStyled>
                  <span>
                    {!this.props.initial
                      ? this.state.siknFullName
                      : this.state.udSiknFullName}
                  </span>
                </DarkStyled>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem name="sikn" label={<GrayStyled>ТП</GrayStyled>}>
                <DarkStyled>
                  <span>
                    {!this.props.initial
                      ? this.state.techPositionName
                      : this.state.udTechPositionName}
                  </span>
                </DarkStyled>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={[16, 24]}>
            <Col span={8}>
              <FormItem
                required
                name="startDateTime"
                label={<GrayStyled>Дата обнаружения</GrayStyled>}
              >
                <DatePicker
                  format="DD.MM.YYYY HH:mm"
                  allowClear={false}
                  name={"startDateTime"}
                  locale={locale}
                  showTime
                  disabledDate={this.disabledDateNow}
                  onChange={(date: Moment) => {
                    if (date) {
                      let startTime = date.toDate();
                      if (values.techPositionId !== null) {
                        this.dateChangeHandler(
                          values.techPositionId,
                          startTime
                        );
                      } else
                        message.error(
                          "Ошибка получения контекста технологической позиции"
                        );

                      let x = 1 * 60 * 1000;
                      let time = startTime.getTime();
                      let sTime = moment(Math.floor(time / x) * x).format(
                        "YYYY-MM-DD HH:mm"
                      );

                      this.setState({ startDate: startTime });

                      let time2 =
                        this.state.endDate !== null
                          ? this.state.endDate.getTime()
                          : null;
                      let eTime =
                        time2 !== null
                          ? moment(Math.ceil(time2 / x) * x).format(
                              "YYYY-MM-DD HH:mm"
                            )
                          : "";
                      if (values.useInReports && values.siId != null) {
                        this.checkFailureHandler(
                          values.siId,
                          sTime,
                          eTime,
                          this.props.initial?.id
                        );
                      }
                    }
                  }}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                name="endDateTime"
                label={<GrayStyled>Дата устранения</GrayStyled>}
              >
                <DatePicker
                  format="DD.MM.YYYY HH:mm"
                  name={"endDateTime"}
                  locale={locale}
                  showTime
                  onChange={(date: Moment) => {
                    let seconds = 1 * 60 * 1000;
                    let time2 =
                      this.state.startDate !== null
                        ? this.state.startDate.getTime()
                        : null;
                    let sTime =
                      time2 !== null
                        ? moment(Math.floor(time2 / seconds) * seconds).format(
                            "YYYY-MM-DD HH:mm"
                          )
                        : "";

                    let eTime: string = "";
                    if (date) {
                      let endTime = date.toDate();

                      let time = endTime.getTime();
                      eTime = moment(
                        Math.ceil(time / seconds) * seconds
                      ).format("YYYY-MM-DD HH:mm");

                      this.setState({
                        endDate: endTime,
                        isCommentRequired: true,
                      });
                      setFieldValue("isCommentRequired", true);
                    } else {
                      this.setState({
                        endDate: date,
                        isCommentRequired: false,
                      });
                    }
                    if (values.useInReports && values.siId != null) {
                      this.checkFailureHandler(
                        values.siId,
                        sTime,
                        eTime,
                        this.props.initial?.id
                      );
                    }
                  }}
                />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem name="siId" label={<GrayStyled>Имя СИ</GrayStyled>}>
                <DarkStyled>
                  <span>
                    {this.state.siCompName ? (
                      this.state.siCompName
                    ) : (
                      <div>Нет привязанного СИ за выбранный период времени</div>
                    )}
                  </span>
                </DarkStyled>
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem required name="mssFailureTypeId" label="Тип отказа">
                <Select
                  name="mssFailureTypeId"
                  placeholder="Выберите тип отказа"
                  showSearch
                  optionFilterProp={"label"}
                  allowClear
                  options={this.state.mssFailureTypes.map((x) => ({
                    label: x.shortName,
                    value: x.id,
                    key: x.id,
                  }))}
                />
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem required name="failureReportCodeId" label="Код отказа">
                <Select
                  name="failureReportCodeId"
                  placeholder="Выберите код отказа"
                  showSearch
                  optionFilterProp={"label"}
                  allowClear
                  options={this.state.failureReportCodes.map((x) => ({
                    label: `${x.id <= 9 ? "0" + x.id : x.id} - ${
                      x.description
                    }`,
                    value: x.id,
                    key: x.id,
                  }))}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16} hidden={this.state.isWarnHidden}>
            <Alert message={this.state.failureMsg} type="error" showIcon />
          </Row>
          <Row gutter={16} hidden={this.state.isWarnSiHidden}>
            <Alert
              message={"Требуется привязать СИ к выбранной тех.позиции"}
              type="error"
              showIcon
            />
          </Row>
          <Row gutter={16} hidden={this.state.isNotEqualSiHidden}>
            <Alert
              message={"Произшла смена привязки СИ к ТП!"}
              type="warning"
              showIcon
            />
          </Row>
          <Row gutter={16} hidden={this.state.siId != null}>
            <Alert
              message={"Данное СИ, пока не привязанно ни к одной тех.позиции!"}
              type="warning"
              showIcon
            />
          </Row>
        </>
      ),
    },
    {
      title: "Сведения",
      content: (
        <>
          <Row>
            <FormItem name="useInReports">
              <Space>
                <Switch
                  name="useInReports"
                  onClick={() => {
                    this.setState({
                      useInReports: !this.state.useInReports,
                    });
                  }}
                  checked={this.state.useInReports}
                />
                <div>Учитывать в отчетах</div>
              </Space>
            </FormItem>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem
                required={!this.state.useInReports}
                hidden={this.state.useInReports}
                name="dontUseInReportsComment"
                label="Не учитывать по причине"
              >
                <Input
                  name="dontUseInReportsComment"
                  disabled={this.state.useInReports}
                />
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem
                required={this.state.useInReports}
                name="shortInfo"
                label="Краткие сведения об отказе"
              >
                <Input name="shortInfo" disabled={!this.state.useInReports} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem name="fullInfo" label="Сведения об отказе">
                <Input.TextArea
                  rows={4}
                  name="fullInfo"
                  disabled={!this.state.useInReports}
                />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem
                required={this.state.useInReports}
                name="responsibilityAreaId"
                label="Зона ответственности"
              >
                <Select
                  name="responsibilityAreaId"
                  disabled={!this.state.useInReports}
                  placeholder="Выберите зону ответственности"
                  showSearch
                  optionFilterProp={"label"}
                  allowClear
                  options={this.state.failureResponsibilityArea
                    .filter((x) =>
                      this.initialValues.owned ? x.forOwned : !x.forOwned
                    )
                    .map((x) => ({
                      label: x.shortName,
                      value: x.id,
                      key: x.id,
                    }))}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                required={this.state.useInReports}
                name="failureConsequencesIdList"
                label="Последствия отказа"
              >
                <Select
                  mode="multiple"
                  name="failureConsequencesIdList"
                  disabled={!this.state.useInReports}
                  placeholder="Выберите последствия отказа"
                  showSearch
                  optionFilterProp={"label"}
                  allowClear
                  options={this.state.failureConsequences.map((x) => ({
                    label: x.shortName,
                    value: x.id,
                    key: x.id,
                  }))}
                />
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem
                required={this.state.useInReports}
                name="sequenceId"
                label="Этап работ, на котором обнаружен отказ"
              >
                <Select
                  name="sequenceId"
                  disabled={!this.state.useInReports}
                  placeholder="Выберите этап"
                  showSearch
                  optionFilterProp={"label"}
                  allowClear
                  options={this.state.sequence.map((x) => ({
                    label: x.shortName,
                    value: x.id,
                    key: x.id,
                  }))}
                />
              </FormItem>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Меры",
      content: (
        <>
          <Row>
            <FormItem name="isCommentRequired" hidden>
              <Checkbox
                name="isCommentRequired"
                value={this.state.isCommentRequired}
              ></Checkbox>
            </FormItem>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                name="shortMeasuresTaken"
                label="Краткое описание принятых мер"
                required={this.state.isCommentRequired}
              >
                <Input name="shortMeasuresTaken"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                name="measuresTaken"
                label="Принятые меры"
                required={this.state.isCommentRequired}
              >
                <Input.TextArea rows={4} name="measuresTaken" />
              </FormItem>
            </Col>
          </Row>
          <TitleStyled hidden={!this.state.isCommentRequired}>
            <span style={{ color: "#ff4d4f" }}>*</span> При выборе даты
            устранения ОБЯЗАТЕЛЬНО заполнение принятых мер (краткое, и полное)
          </TitleStyled>
        </>
      ),
    },
    {
      title: "Квитирование",
      content: (
        <>
          <Row>
            <Space align="baseline" size="middle">
              <FormItem name="isAcknowledged">
                <Checkbox
                  name="isAcknowledged"
                  onClick={() => {
                    this.setState({
                      isAcknowledged: !this.state.isAcknowledged,
                    });
                  }}
                  checked={this.state.isAcknowledged}
                  value={this.state.isAcknowledged}
                >
                  Признак квитирования
                </Checkbox>
              </FormItem>
            </Space>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem
                required={this.state.isAcknowledged}
                name="comment"
                label="Комментарий при квитировании"
              >
                <Input.TextArea
                  rows={4}
                  name="comment"
                  disabled={!this.state.isAcknowledged}
                />
              </FormItem>
            </Col>
          </Row>

          <Row>
            <TitleStyled>
              При добавлении признака квитирования ОБЯЗАТЕЛЬНО заполнить поле
              отмеченное <span style={{ color: "#ff4d4f" }}>*</span>
            </TitleStyled>
          </Row>
        </>
      ),
    },
  ];

  initialValues: Failures =
    this.props.initial ?? Failures.InitTechPos(this.props.node.nodeId);

  next() {
    this.setState({ step: this.state.step + 1 });
  }

  prev() {
    this.setState({ step: this.state.step - 1 });
  }

  onChange = (step: any) => {
    this.setState({ step });
  };

  render(): JSX.Element {
    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <Formik
          initialValues={this.initialValues}
          onSubmit={(data: Failures, helpers: FormikHelpers<Failures>) => {
            this.props
              .submitCallback(data)
              .then(() => helpers.setSubmitting(false))
              .catch((err) => {
                helpers.setSubmitting(false);
                message.error(err);
              });
          }}
          validationSchema={validationSchema}
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
                        <Header
                          style={{
                            background: "#FFFFFF",
                            padding: "0px",
                          }}
                        >
                          <Row>
                            <Col span={24}>
                              <Title level={4}>
                                {!this.props.initial
                                  ? this.state.techPositionName
                                  : this.state.udTechPositionName}
                              </Title>
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
                                  disabled={
                                    !this.initialValues.siId ||
                                    !this.state.isWarnHidden ||
                                    !this.state.isWarnSiHidden
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
                                      FailuresElements[
                                        FailuresElements.FailureAdd
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
      .get<Array<MssFailureTypes>>(`${apiBase}/mssfailuretypes/`)
      .then((result) => {
        this.setState({
          mssFailureTypes: result.data,
          loading: false,
        });
      });
    axios
      .get<Array<FailureResponsibilityArea>>(
        `${apiBase}/FailureResponsibilityArea/`
      )
      .then((result) => {
        this.setState({
          failureResponsibilityArea: result.data,
          loading: false,
        });
      });
    axios
      .get<Array<FailureConsequences>>(`${apiBase}/FailureConsequences/`)
      .then((result) => {
        this.setState({
          failureConsequences: result.data,
          loading: false,
        });
      });
    axios.get<Array<Sequence>>(`${apiBase}/Sequence/`).then((result) => {
      this.setState({
        sequence: result.data,
        loading: false,
      });
    });
    axios.get<Array<SiModel>>(`${apiBase}/SiModels/`).then((result) => {
      this.setState({
        siModels: result.data,
        loading: false,
      });
    });

    if (!this.props.initial) {
      if (this.props.isSiTypeTree) {
        axios
          .get<SiEquipment>(
            `${apiBase}/SiEquipments/tree/${this.props.node.nodeId}`
          )
          .then((result) => {
            if (result.data) {
              this.initialValues.siknFullName = result.data.siknFullName;
              this.setState({
                siknFullName: result.data.siknFullName,
                techPositionName: result.data.techPositionName,
                siId: result.data.id,
                initialSiId: result.data.id,
                siCompName: result.data.siCompName,
              });
              this.initialValues.techPositionId = result.data.techPositionId;
              this.initialValues.techPositionName =
                result.data.techPositionName;
              this.initialValues.siknId = result.data.siknId;
              this.initialValues.owned = result.data.owned;
              this.initialValues.siId = result.data.id;
              axios
                .get<string>(
                  `${apiBase}/siquipments/${
                    result.data.id
                  }/failure?appearDateTime=${moment(
                    this.state.startDate
                  ).format("YYYY-MM-DD HH:mm")}&fixDateTime=${moment(
                    this.state.endDate
                  ).format("YYYY-MM-DD HH:mm")}&failureId=${undefined}`
                )
                .then((result) => {
                  this.setState({
                    failureMsg: result.data,
                    isWarnHidden: !result.data,
                  });
                });
            }
          });
      } else {
        axios
          .get<TechPositions>(
            `${apiBase}/TechPositions/${this.props.node.nodeId}`
          )
          .then((result) => {
            this.initialValues.siknFullName = result.data.siknFullName;
            this.setState({
              siknFullName: result.data.siknFullName,
              techPositionName: result.data.shortName,
              siId: result.data.siEquipment.id,
            });
            this.initialValues.techPositionName = result.data.shortName;
            this.initialValues.siknId = result.data.siknId;
            this.initialValues.owned = result.data.owned;
            this.initialValues.siId = result.data.siEquipment.id;
            axios
              .get<string>(
                `${apiBase}/siquipments/${
                  result.data.siEquipment.id
                }/failure?appearDateTime=${moment(this.state.startDate).format(
                  "YYYY-MM-DD HH:mm"
                )}&fixDateTime=${moment(this.state.endDate).format(
                  "YYYY-MM-DD HH:mm"
                )}&failureId=${undefined}`
              )
              .then((result) => {
                this.setState({
                  failureMsg: result.data,
                  isWarnHidden: !result.data,
                });
              });
          });

        if (this.props.node.type === "techpositions") {
          axios
            .get<SiEquipment>(
              `${apiBase}/techpositions/${
                this.props.node.nodeId
              }/siquipments?startTime=${dateToString(startDateConst)}`
            )
            .then((result) => {
              if (result.data) {
                this.setState({
                  loading: false,
                  initialSiId: result.data.id,
                  siId: result.data.id,
                  siCompName: result.data.siCompName,
                });
                this.initialValues.siId = result.data.id;
              } else this.initialValues.siId = null;
            });
        }
      }
    }

    axios
      .get<Array<FailureReportCodes>>(`${apiBase}/failurereportcodes/`)
      .then((result) => {
        this.setState({
          failureReportCodes: result.data,
          loading: false,
        });
      });

    if (this.props.initial) {
      axios
        .get<Failures>(`${apiBase}/failures/${this.initialValues.id}`)
        .then((result) => {
          this.setState({
            udSiknFullName: result.data.siknFullName,
            udTechPositionName: result.data.techPositionName,
            siCompName: result.data.siCompName,
            initialSiId: result.data.siId,
            endDate: result.data.endDateTime,
            loading: false,
            siId: result.data.siId,
          });
          this.initialValues.startDateTime = result.data.startDateTime;
          this.initialValues.siId = result.data.siId;

          axios
            .get<string>(
              `${apiBase}/siquipments/${
                result.data.siId
              }/failure?appearDateTime=${moment(
                result.data.startDateTime
              ).format("YYYY-MM-DD HH:mm")}&fixDateTime=${moment(
                result.data.endDateTime
              ).format("YYYY-MM-DD HH:mm")}&failureId=${this.props.initial?.id}`
            )
            .then((result) => {
              this.setState({
                failureMsg: result.data,
                isWarnHidden: !result.data,
              });
            });
        });
    }
  }
}
