import React, { Component } from "react";
import axios from "axios";
import { Button, Row, Col, Skeleton, Steps } from "antd";
import Title from "antd/lib/typography/Title";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { DataSiInfo } from "../classes/DataSi";
import { IdType } from "../types";
import CheckCircleOutlined from "@ant-design/icons/lib/icons/CheckCircleOutlined";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import { format } from "date-fns";
import { SiLimits, TechPosLimits } from "../classes/SiEquipmentLimits";
import { apiBase } from "../utils";
import {
  TextDarkStyled,
  TextGrayStyled,
  TdStyled,
  ThStyled,
} from "../styles/commonStyledComponents";
import { history } from "../history/history";
import { ControlMaintEvents, Failures, SiEquipment } from "../classes";
import { CoefChangeEventSigns } from "../classes/CoefChangeEventSigns";
import { EventsChartsButton } from "./EventsChartsButton";

interface IDataSiFormProps {
  siId: IdType;
}

interface IDataSiFormState {
  step: number;
  loading: boolean;
  DataSiInfo: DataSiInfo;
  siEq: SiEquipment[];
  failures: Failures[];
  tokmh: ControlMaintEvents[];
  coef: CoefChangeEventSigns[];
}

const { Step } = Steps;

type Step = {
  title: string;
  content: JSX.Element | string;
};

const limitsRender = (x: SiLimits | TechPosLimits): JSX.Element => {
  return (
    <>
      <Row>
        <Col>
          <TextGrayStyled>{x.siLimitTypeName}</TextGrayStyled>
        </Col>
      </Row>
      <Row gutter={[130, 24]}>
        <Col span={12}>
          <TextGrayStyled>От</TextGrayStyled>
          <TextDarkStyled>
            <span>
              {x.lowerLimit} {x.siTypeMeasurement}
            </span>
          </TextDarkStyled>
        </Col>
        <Col span={12}>
          <TextGrayStyled>До</TextGrayStyled>
          <TextDarkStyled>
            <span>
              {x.upperLimit} {x.siTypeMeasurement}
            </span>
          </TextDarkStyled>
        </Col>
      </Row>
    </>
  );
};

export class DataSiForm extends Component<IDataSiFormProps, IDataSiFormState> {
  constructor(props: IDataSiFormProps) {
    super(props);
    this.state = {
      step: 0,
      loading: true,
      DataSiInfo: new DataSiInfo(),
      siEq: [],
      failures: [],
      tokmh: [],
      coef: [],
    };
  }

  private steps = (): Step[] => [
    {
      title: "Идентификация",
      content: (
        <>
          <Header
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <Row>
              <Col span={24}>
                <Title level={4}>{"Идентификация"}</Title>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <TextGrayStyled>Заводской номер</TextGrayStyled>
                <TextDarkStyled>
                  <span>
                    {this.state.DataSiInfo.siManufactureNumber
                      ? this.state.DataSiInfo.siManufactureNumber
                      : "н/д"}
                  </span>
                </TextDarkStyled>
              </Col>
              <Col span={12}>
                <TextGrayStyled>Год выпуска</TextGrayStyled>
                <TextDarkStyled>
                  <span>
                    {this.state.DataSiInfo.siManufactureYear
                      ? this.state.DataSiInfo.siManufactureYear
                      : "н/д"}
                  </span>
                </TextDarkStyled>
              </Col>
            </Row>
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <TextGrayStyled>Тип СИ</TextGrayStyled>
                <TextDarkStyled>
                  <span>
                    {this.state.DataSiInfo.siTypeName
                      ? this.state.DataSiInfo.siTypeName
                      : "н/д"}
                  </span>
                </TextDarkStyled>
              </Col>
              <Col span={12}>
                <TextGrayStyled>Дата ввода в эксплуатацию</TextGrayStyled>
                <TextDarkStyled>
                  <span>
                    {this.state.DataSiInfo.installDate
                      ? format(
                          this.state.DataSiInfo.installDate.getTime(),
                          "dd.MM.yyyy"
                        )
                      : "н/д"}
                  </span>
                </TextDarkStyled>
              </Col>
            </Row>
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <TextGrayStyled>Модель СИ</TextGrayStyled>
                <TextDarkStyled>
                  <span>
                    {this.state.DataSiInfo.siModel
                      ? this.state.DataSiInfo.siModel
                      : "н/д"}
                  </span>
                </TextDarkStyled>
              </Col>
              <Col span={12}>
                <TextGrayStyled>Идентификатор СИ в ПиКТС</TextGrayStyled>
                <TextDarkStyled>
                  <span>
                    {this.state.DataSiInfo.piKTSRef
                      ? this.state.DataSiInfo.piKTSRef
                      : "н/д"}
                  </span>
                </TextDarkStyled>
              </Col>
            </Row>
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <TextGrayStyled>Код по ОР-17.120.00-КТН-159-16</TextGrayStyled>
                <TextDarkStyled>
                  <span>{this.state.DataSiInfo.reglamentCode ?? "н/д"}</span>
                </TextDarkStyled>
              </Col>
              <Col span={12}></Col>
            </Row>
          </Content>
          <Footer style={{ background: "#FFFFFF" }}>
            <Row justify="end" align="bottom">
              <Col>
                <Button
                  disabled={this.state.siEq.length == 0}
                  onClick={() => {
                    history.push("/editorsi", this.state.siEq);
                  }}
                  type="link"
                >
                  Переход на страницу Редактор СИ
                </Button>
              </Col>
            </Row>
          </Footer>
        </>
      ),
    },
    {
      title: "Данные о последних КМХ, поверке и ТО-3",
      content: (
        <>
          <Header
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <Row>
              <Col span={24}>
                <Title level={4}>
                  {"Данные о последних КМХ, поверке и ТО-3"}
                </Title>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <table
              style={{
                tableLayout: "fixed",
                border: "1px solid #DDE8F0",
                width: "100%",
              }}
            >
              <tr style={{ borderBottom: "1px solid #DDE8F0" }}>
                <ThStyled></ThStyled>
                <ThStyled>КМХ</ThStyled>
                <ThStyled>Поверка</ThStyled>
                <ThStyled>ТО-3</ThStyled>
              </tr>
              <tr style={{ borderBottom: "1px solid #DDE8F0" }}>
                <TdStyled>Факт</TdStyled>
                <TdStyled
                  style={{
                    color:
                      this.state.DataSiInfo.factDateKmh ===
                      this.state.DataSiInfo.planDateKmh
                        ? "#219653"
                        : "#FF4D4F",
                  }}
                >
                  {this.state.DataSiInfo.factDateKmh
                    ? format(
                        this.state.DataSiInfo.factDateKmh.getTime(),
                        "dd.MM.yyyy"
                      )
                    : "н/д"}
                </TdStyled>
                <TdStyled
                  style={{
                    color:
                      this.state.DataSiInfo.factDateValid ===
                      this.state.DataSiInfo.planDateValid
                        ? "#219653"
                        : "#FF4D4F",
                  }}
                >
                  {this.state.DataSiInfo.factDateValid
                    ? format(
                        this.state.DataSiInfo.factDateValid.getTime(),
                        "dd.MM.yyyy"
                      )
                    : "н/д"}
                </TdStyled>
                <TdStyled
                  style={{
                    color:
                      this.state.DataSiInfo.factDateTo3 ===
                      this.state.DataSiInfo.planDateTo3
                        ? "#219653"
                        : "#FF4D4F",
                  }}
                >
                  {this.state.DataSiInfo.factDateTo3
                    ? format(
                        this.state.DataSiInfo.factDateTo3.getTime(),
                        "dd.MM.yyyy"
                      )
                    : "н/д"}
                </TdStyled>
              </tr>
              <tr>
                <TdStyled>План</TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.planDateKmh
                    ? format(
                        this.state.DataSiInfo.planDateKmh.getTime(),
                        "dd.MM.yyyy"
                      )
                    : "н/д"}
                </TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.planDateValid
                    ? format(
                        this.state.DataSiInfo.planDateValid.getTime(),
                        "dd.MM.yyyy"
                      )
                    : "н/д"}
                </TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.planDateTo3
                    ? format(
                        this.state.DataSiInfo.planDateTo3.getTime(),
                        "dd.MM.yyyy"
                      )
                    : "н/д"}
                </TdStyled>
              </tr>
            </table>

            {this.state.siEq.length != 0
              ? this.state.siEq[0].showMH && (
                  <EventsChartsButton dataSiInfo={this.state.DataSiInfo} />
                )
              : ""}
          </Content>
          <Footer style={{ background: "#FFFFFF" }}>
            <Row justify="end" align="bottom">
              <Col>
                <Button
                  disabled={this.state.tokmh.length == 0}
                  onClick={() => {
                    history.push("/tokmh", this.state.tokmh);
                  }}
                  type="link"
                >
                  Переход на страницу ТО КМХ
                </Button>
              </Col>
            </Row>
          </Footer>
        </>
      ),
    },
    {
      title: "Последний зафиксированный отказ",
      content: (
        <>
          <Header
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <Row>
              <Col span={24}>
                <Title level={4}>{"Последний зафиксированный отказ"}</Title>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <table
              style={{
                tableLayout: "fixed",
                border: "1px solid #DDE8F0",
                width: "100%",
              }}
            >
              <tr style={{ borderBottom: "1px solid #DDE8F0" }}>
                <ThStyled>СИКН</ThStyled>
                <ThStyled>Время начала</ThStyled>
                <ThStyled>МСС</ThStyled>
                <ThStyled>Тип признака отказа</ThStyled>
              </tr>
              <tr style={{ borderBottom: "1px solid #DDE8F0" }}>
                <TdStyled>
                  {this.state.DataSiInfo.siknFullName
                    ? this.state.DataSiInfo.siknFullName
                    : "н/д"}
                </TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.failuresStartDateTime
                    ? format(
                        this.state.DataSiInfo.failuresStartDateTime.getTime(),
                        "dd.MM.yyyy kk:mm:ss"
                      )
                    : "н/д"}
                </TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.eventFrameExist ? (
                    <CheckCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#219653",
                      }}
                    />
                  ) : (
                    <CloseCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#FF4D4F",
                      }}
                    />
                  )}
                </TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.typeRefuseText
                    ? this.state.DataSiInfo.typeRefuseText
                    : "н/д"}
                </TdStyled>
              </tr>
            </table>
            <div style={{ marginBottom: 16 }}></div>
            <table
              style={{
                tableLayout: "fixed",
                border: "1px solid #DDE8F0",
                width: "100%",
              }}
            >
              <tr style={{ borderBottom: "1px solid #DDE8F0" }}>
                <ThStyled>ТП</ThStyled>
                <ThStyled>Время окончания</ThStyled>
                <ThStyled>Учитывать в отчетах</ThStyled>
                <ThStyled>Признаки квитирования</ThStyled>
              </tr>
              <tr style={{ borderBottom: "1px solid #DDE8F0" }}>
                <TdStyled>
                  {this.state.DataSiInfo.techPos
                    ? this.state.DataSiInfo.techPos
                    : "н/д"}
                </TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.failuresEndDateTime
                    ? format(
                        this.state.DataSiInfo.failuresEndDateTime.getTime(),
                        "dd.MM.yyyy  kk:mm:ss"
                      )
                    : "н/д"}
                </TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.useInReports ? (
                    <CheckCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#219653",
                      }}
                    />
                  ) : (
                    <CloseCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#FF4D4F",
                      }}
                    />
                  )}
                </TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.isAcknowledged ? (
                    <CheckCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#219653",
                      }}
                    />
                  ) : (
                    <CloseCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#FF4D4F",
                      }}
                    />
                  )}
                </TdStyled>
              </tr>
            </table>
          </Content>
          <Footer style={{ background: "#FFFFFF" }}>
            <Row justify="end" align="bottom">
              <Col>
                <Button
                  disabled={this.state.failures.length == 0}
                  onClick={() => {
                    history.push("/failures", this.state.failures);
                  }}
                  type="link"
                >
                  Переход на страницу Отказы
                </Button>
              </Col>
            </Row>
          </Footer>
        </>
      ),
    },
    {
      title: "Данные о последнем изменении коэффициентов",
      content: (
        <>
          <Header
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <Row>
              <Col span={24}>
                <Title level={4}>
                  {"Данные о последнем изменении коэффициентов"}
                </Title>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <table
              style={{
                tableLayout: "fixed",
                border: "1px solid #DDE8F0",
                width: "100%",
              }}
            >
              <tr style={{ borderBottom: "1px solid #DDE8F0" }}>
                <ThStyled>СИКН</ThStyled>
                <ThStyled>ТП</ThStyled>
                <ThStyled>СИ</ThStyled>
                <ThStyled>Дата</ThStyled>
                <ThStyled>В графике</ThStyled>
                <ThStyled>Признак поверки</ThStyled>
              </tr>
              <tr style={{ borderBottom: "1px solid #DDE8F0" }}>
                <TdStyled>
                  {this.state.DataSiInfo.siknFullName
                    ? this.state.DataSiInfo.siknFullName
                    : "н/д"}
                </TdStyled>
                <TdStyled>{this.state.DataSiInfo.techPos}</TdStyled>
                <TdStyled>{this.state.DataSiInfo.siFullName}</TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.koefDateChange
                    ? format(
                        this.state.DataSiInfo.koefDateChange.getTime(),
                        "dd.MM.yyyy"
                      )
                    : "Изменений коэффициентов не было"}
                </TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.graphOk ? (
                    <CheckCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#219653",
                      }}
                    />
                  ) : (
                    <CloseCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#FF4D4F",
                      }}
                    />
                  )}
                </TdStyled>
                <TdStyled>
                  {this.state.DataSiInfo.controlMaintExits ? (
                    <CheckCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#219653",
                      }}
                    />
                  ) : (
                    <CloseCircleOutlined
                      style={{
                        alignContent: "center",
                        fontSize: "20px",
                        color: "#FF4D4F",
                      }}
                    />
                  )}
                </TdStyled>
              </tr>
            </table>
          </Content>
          <Footer style={{ background: "#FFFFFF" }}>
            <Row justify="end" align="bottom">
              <Col>
                <Button
                  disabled={this.state.coef.length == 0}
                  onClick={() => {
                    history.push("/coefs", this.state.coef);
                  }}
                  type="link"
                >
                  Переход на страницу История изменения коэффициентов
                </Button>
              </Col>
            </Row>
          </Footer>
        </>
      ),
    },
    {
      title: "Текущая наработка",
      content: (
        <>
          <Header
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <Row>
              <Col span={24}>
                <Title level={4}>{"Текущая наработка"}</Title>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <TextGrayStyled>Дата фиксации</TextGrayStyled>
                <TextDarkStyled>
                  <span>
                    {this.state.DataSiInfo.fixedDate
                      ? format(
                          this.state.DataSiInfo.fixedDate.getTime(),
                          "dd.MM.yyyy"
                        )
                      : "н/д"}
                  </span>
                </TextDarkStyled>
              </Col>
              <Col span={12}></Col>
            </Row>
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <TextGrayStyled>Время фиксации</TextGrayStyled>
                <TextDarkStyled>
                  <span>
                    {this.state.DataSiInfo.fixedDate
                      ? format(
                          this.state.DataSiInfo.fixedDate.getTime(),
                          "kk:mm:ss"
                        )
                      : "н/д"}
                  </span>
                </TextDarkStyled>
              </Col>
              <Col span={12}></Col>
            </Row>
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <TextGrayStyled>Наработка</TextGrayStyled>
                <TextDarkStyled>
                  <span>{this.state.DataSiInfo.worktime}</span>
                </TextDarkStyled>
              </Col>
              <Col span={12}></Col>
            </Row>
          </Content>
          <Footer style={{ background: "#FFFFFF" }}>
            <Row justify="end" align="bottom">
              <Col></Col>
            </Row>
          </Footer>
        </>
      ),
    },
    {
      title: "Диапазоны",
      content: (
        <>
          <Header
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <Row>
              <Col span={24}>
                <Title level={4}>{"Диапазоны"}</Title>
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              background: "#FFFFFF",
              paddingLeft: "24px",
            }}
          >
            <Row>
              <Col span={12}>
                {this.state.DataSiInfo.techLimits.length === 0 &&
                this.state.DataSiInfo.siEqLimits.length === 0 ? (
                  <>Диапазоны для данного СИ не заданы</>
                ) : (
                  <>
                    {this.state.DataSiInfo.techLimits.map((x) =>
                      limitsRender(x)
                    )}
                    {this.state.DataSiInfo.siEqLimits.map((x) =>
                      limitsRender(x)
                    )}
                  </>
                )}
              </Col>
            </Row>
          </Content>
          <Footer style={{ background: "#FFFFFF" }}>
            <Row justify="end" align="bottom">
              <Col>
                <Button
                  disabled={this.state.DataSiInfo.siEqLimits.length == 0}
                  onClick={() => {
                    history.push(
                      "/measrange",
                      this.state.DataSiInfo.siEqLimits
                    );
                  }}
                  type="link"
                >
                  Переход на страницу Диапазоны
                </Button>
              </Col>
            </Row>
          </Footer>
        </>
      ),
    },
  ];

  onChange = (step: any) => {
    console.log("onChange:", step);
    this.setState({ step });
  };

  render() {
    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <div>
          <>
            {this.state.loading ? (
              <div className="mx-auto my-auto">
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
              </div>
            ) : (
              <Layout>
                <Sider
                  theme="light"
                  width={240}
                  style={{ borderRight: "1px solid #DDE8F0" }}
                >
                  <Steps
                    onChange={this.onChange}
                    progressDot
                    direction="vertical"
                    current={this.state.step}
                    size="small"
                  >
                    {this.steps().map((s) => (
                      <Step
                        key={s.title}
                        title={s.title}
                        style={{ paddingBottom: "30px" }}
                      />
                    ))}
                  </Steps>
                </Sider>
                <Layout>{this.steps()[this.state.step].content}</Layout>
              </Layout>
            )}
          </>
        </div>
      </div>
    );
  }

  componentDidMount() {
    console.log(this.props.siId);
    axios
      .get<any>(`${apiBase}/siequipments/${this.props.siId}/information`)
      .then((result) => {
        this.setState({
          DataSiInfo: result.data,
          loading: false,
        });
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get<SiEquipment>(`${apiBase}/siequipments/${this.props.siId}/bound`)
      .then((result) => {
        this.setState({
          siEq: [result.data].filter((x) => x != null),
        });
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get<ControlMaintEvents[]>(
        `${apiBase}/siequipments/${this.props.siId}/bound/tokmh`
      )
      .then((result) => {
        this.setState({
          tokmh: result.data.filter((x) => x != null),
        });
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get<Failures[]>(
        `${apiBase}/siequipments/${this.props.siId}/bound/failures`
      )
      .then((result) => {
        this.setState({
          failures: result.data.filter((x) => x != null),
        });
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get<CoefChangeEventSigns>(
        `${apiBase}/siequipments/${this.props.siId}/bound/coef`
      )
      .then((result) => {
        this.setState({
          coef: [result.data].filter((x) => x != null),
        });
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
