import { Component } from "react";
import { SiEquipment, SiModel, TechPositions } from "../classes";
import {
  Form,
  FormItem,
  DatePicker,
  InputNumber,
  Input,
  Select,
  SubmitButton,
  Switch,
} from "formik-antd";
import { Formik, FormikHelpers } from "formik";
import {
  Alert,
  Button,
  Col,
  Modal,
  Row,
  Skeleton,
  Space,
  Steps,
  Tooltip,
} from "antd";
import * as Yup from "yup";
import axios from "axios";
import { apiBase } from "../utils";
import { SiTypes } from "../classes/SiTypes";
import styled from "styled-components";
import locale from "antd/es/date-picker/locale/ru_RU";
import { IdType, Nullable } from "../types";
import { SiknRsu } from "../classes/SiknRsu";
import { ActionsEnum, Can } from "../casl";
import { EditorSiElements, elementId } from "../pages/EditorSiPage/constant";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { TdStyled, ThStyled } from "../styles/commonStyledComponents";
import { format } from "date-fns";
import moment, { Moment } from "moment";

const { confirm } = Modal;

interface IEditorSiEqFormProps {
  initial?: SiEquipment;
  submitCallback: (item: SiEquipment) => Promise<SiEquipment>;
  siId?: IdType;
}

interface IEditorSiEqFormState {
  step: number;
  loading: boolean;
  siTypes: Array<SiTypes>;
  siModels: Array<SiModel>;
  techPos: Array<TechPositions>;
  techPosition: Array<TechPositions>;
  sikn: Array<SiknRsu>;
  siEq: Nullable<SiEquipment>;
  siTypeName: string;
  siTypeModelName: string;
  fakeManufYear: Nullable<number>;
  fakeInstallYear: Nullable<number>;
}

const validationSchema = Yup.object({
  manufNumber: Yup.string().required("Поле обязательно к заполнению!"),
  siTypeId: Yup.number().required("Поле обязательно к заполнению!").nullable(),
  siknId: Yup.number().required("Поле обязательно к заполнению!").nullable(),
  manufYearDate: Yup.date()
    .required("Поле обязательно к заполнению!")
    .typeError("Выберете год выпуска.")
    .nullable(),
  installDate: Yup.date()
    .required("Поле обязательно к заполнению!")
    .typeError("Выберете дату ввода в эксплуатацию."),
  intervalKmh: Yup.number()
    .min(0, "Количество дней не может быть отрицательным")
    .integer("Число дней должно быть целым значением!")
    .nullable(),
  intervalTo3: Yup.number()
    .min(1, "Количество дней должно быть больше 0")
    .integer("Число дней должно быть целым значением!")
    .nullable(),
  intervalPov: Yup.number()
    .min(1, "Количество дней должно быть больше 0")
    .integer("Число дней должно быть целым значением!")
    .nullable(),
  toirId: Yup.string()
    .uuid("Идентификатор в ТОиР должен иметь вид GUID")
    .nullable(),
  piKtsRef: Yup.string().nullable(),
});

function showConfirm() {
  confirm({
    title: "Вы уверены, что хотите архивировать средство измерения?",
    content: "ВНИМАНИЕ! Отменить архивацию может только администратор!",
    okText: "Архивировать",
    cancelText: "Отменить",
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
  });
}

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

const { Step } = Steps;

type Step = {
  title: string;
  content: JSX.Element | string;
};

export class EditorSiEqForm extends Component<
  IEditorSiEqFormProps,
  IEditorSiEqFormState
> {
  constructor(props: IEditorSiEqFormProps) {
    super(props);
    this.state = {
      step: 0,
      loading: false,
      siTypes: [],
      siModels: [],
      techPos: [],
      techPosition: [],
      sikn: [],
      siEq: null,
      siTypeName: "",
      siTypeModelName: "",
      fakeManufYear: this.initialValues.manufYearDate?.getFullYear() ?? null,
      fakeInstallYear: this.initialValues.installDate?.getFullYear() ?? null,
    };
  }

  private steps = (
    setFieldValue: any,
    values: SiEquipment,
    isDateValid: boolean
  ): Step[] => [
    {
      title: "Идентификация",
      content: (
        <>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem required name="siTypeId" label="Тип СИ">
                <Select
                  showSearch
                  placeholder={"Выберите тип СИ"}
                  optionFilterProp={"label"}
                  name="siTypeId"
                  options={this.state.siTypes.map((x) => ({
                    label: x.shortName + " (" + x.fullName + ")",
                    value: x.id,
                    key: x.id,
                  }))}
                  onSelect={(value: number) => {
                    setFieldValue("siModelId", "");
                    setFieldValue(
                      "siTypeName",
                      this.state.siTypes
                        .filter((y) => y.id == value)
                        .map((x) => x.shortName)[0]
                    );
                    setFieldValue("intervalKmh", value === 1 ? 10 : 30);
                  }}
                />
              </FormItem>
              <FormItem hidden name="siTypeName">
                <Input name="siTypeName"></Input>
              </FormItem>
              <FormItem required name="manufNumber" label="Заводской номер СИ">
                <Input
                  name="manufNumber"
                  placeholder={"Поле для ввода номера"}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem name="siModelId" label="Модель СИ">
                <Select
                  disabled={values.siTypeId === null}
                  name="siModelId"
                  placeholder={"Выберите модель СИ"}
                  showSearch
                  optionFilterProp={"label"}
                  allowClear
                  options={this.state.siModels
                    .filter(
                      (y) => values.siTypeId && y.siTypeId == values.siTypeId
                    )
                    .map((x) => ({
                      label: `${x.shortName} ${x.grNumber}`,
                      value: x.id,
                      key: x.id,
                    }))}
                  onSelect={(value: number) => {
                    setFieldValue(
                      "siModelName",
                      this.state.siModels
                        .filter((y) => y.id == value)
                        .map((x) => x.shortName)[0]
                    );
                  }}
                />
              </FormItem>
              <FormItem hidden name="siModelName">
                <Input name="siModelName"></Input>
              </FormItem>
              <FormItem name="piKtsRef" label="Идентификатор СИ в ПиКТС">
                <Input
                  name="piKtsRef"
                  placeholder={"Поле для ввода идентификатора"}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <FormItem name="toirId" label="Идентификатор в ТОиР">
                <Input
                  name="toirId"
                  placeholder={
                    "Поле для ввода идентификатора (00000000-0000-0000-0000-000000000000)"
                  }
                />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem required name="siknId" label="СИКН">
                <Select
                  placeholder={"Выберите СИКН"}
                  showSearch
                  optionFilterProp={"label"}
                  name="siknId"
                  allowClear
                  options={this.state.sikn.map((y) => ({
                    label: y.fullName,
                    value: y.id,
                    key: y.id,
                  }))}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <TitleStyled>
              Поля отмеченные <span style={{ color: "#ff4d4f" }}>*</span>{" "}
              обязательны для заполнения
            </TitleStyled>
          </Row>
        </>
      ),
    },
    {
      title: "Даты",
      content: (
        <>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem required name="manufYearDate" label="Год выпуска">
                <DatePicker
                  name="manufYearDate"
                  placeholder="Выберите год"
                  locale={locale}
                  picker={"year"}
                  onChange={(value: moment.Moment) => {
                    let fakeManufYear = value.toDate().getFullYear();
                    this.setState({
                      fakeManufYear: fakeManufYear,
                    });
                  }}
                />
              </FormItem>
              <FormItem hidden name="fakeManufYear">
                <InputNumber
                  value={this.state.fakeManufYear ?? undefined}
                  name="fakeManufYear"
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                required
                name="installDate"
                label="Дата ввода в эксплуатацию"
              >
                <DatePicker
                  name="installDate"
                  locale={locale}
                  placeholder="Введите дату"
                  onChange={(value: moment.Moment) => {
                    let fakeInstallYear = value.toDate().getFullYear();
                    this.setState({
                      fakeInstallYear: fakeInstallYear,
                    });
                  }}
                />
              </FormItem>
              <FormItem hidden name="fakeInstallYear">
                <InputNumber
                  value={this.state.fakeInstallYear ?? undefined}
                  name="fakeInstallYear"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <TitleStyled>
              Поля отмеченные <span style={{ color: "#ff4d4f" }}>*</span>{" "}
              обязательны для заполнения
            </TitleStyled>
          </Row>

          <Row gutter={16} hidden={isDateValid}>
            <Alert
              message={
                "Дата выпуска не может быть позже даты ввода в эксплуатацию!"
              }
              type="error"
              showIcon
            />
          </Row>
        </>
      ),
    },
    {
      title: "Интервалы проверок",
      content: (
        <>
          <Row>
            <Col span={8}>
              <FormItem
                required
                name="intervalKmh"
                label="Интервал между КМХ (дни)"
              >
                <InputNumber
                  name="intervalKmh"
                  defaultValue={30}
                  placeholder="Поле для ввода интервала"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                required
                name="intervalTo3"
                label="Интервал между ТО-3 (дни)"
              >
                <InputNumber
                  name="intervalTo3"
                  defaultValue={365}
                  placeholder="Поле для ввода интервала"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                required
                name="intervalPov"
                label="Интервал между поверками (дни)"
              >
                <InputNumber
                  name="intervalPov"
                  defaultValue={365}
                  placeholder="Поле для ввода интервала"
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <TitleStyled>
              <span style={{ color: "#ff4d4f" }}>*</span> Интервалы поверок
              должны быть больше 0 и обязательны для заполнения
            </TitleStyled>
          </Row>
        </>
      ),
    },
    {
      title: "Данные о последних КМХ, поверке и ТО-3",
      content: (
        <>
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
                    this.state.siEq?.factDateKmh ===
                    this.state.siEq?.planDateKmh
                      ? "#219653"
                      : "#FF4D4F",
                }}
              >
                {this.state.siEq?.factDateKmh
                  ? format(this.state.siEq.factDateKmh.getTime(), "dd.MM.yyyy")
                  : "н/д"}
              </TdStyled>
              <TdStyled
                style={{
                  color:
                    this.state.siEq?.factDateValid ===
                    this.state.siEq?.planDateValid
                      ? "#219653"
                      : "#FF4D4F",
                }}
              >
                {this.state.siEq?.factDateValid
                  ? format(
                      this.state.siEq.factDateValid.getTime(),
                      "dd.MM.yyyy"
                    )
                  : "н/д"}
              </TdStyled>
              <TdStyled
                style={{
                  color:
                    this.state.siEq?.factDateTo3 ===
                    this.state.siEq?.planDateTo3
                      ? "#219653"
                      : "#FF4D4F",
                }}
              >
                {this.state.siEq?.factDateTo3
                  ? format(this.state.siEq.factDateTo3.getTime(), "dd.MM.yyyy")
                  : "н/д"}
              </TdStyled>
            </tr>
            <tr>
              <TdStyled>План</TdStyled>
              <TdStyled>
                {this.state.siEq?.planDateKmh
                  ? format(this.state.siEq.planDateKmh.getTime(), "dd.MM.yyyy")
                  : "н/д"}
              </TdStyled>
              <TdStyled>
                {this.state.siEq?.planDateValid
                  ? format(
                      this.state.siEq.planDateValid.getTime(),
                      "dd.MM.yyyy"
                    )
                  : "н/д"}
              </TdStyled>
              <TdStyled>
                {this.state.siEq?.planDateTo3
                  ? format(this.state.siEq.planDateTo3.getTime(), "dd.MM.yyyy")
                  : "н/д"}
              </TdStyled>
            </tr>
          </table>
        </>
      ),
    },
  ];

  initialValues: SiEquipment = this.props.initial ?? new SiEquipment();

  next() {
    this.setState({ step: this.state.step + 1 });
  }

  prev() {
    this.setState({ step: this.state.step - 1 });
  }

  render() {
    const isDateValid =
      !this.state.fakeInstallYear ||
      !this.state.fakeManufYear ||
      this.state.fakeInstallYear >= this.state.fakeManufYear;
    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <Formik
          initialValues={this.initialValues}
          onSubmit={async (
            data: SiEquipment,
            helpers: FormikHelpers<SiEquipment>
          ) => {
            if (
              this.state.step ===
              this.steps(helpers.setFieldValue, data, isDateValid).length - 1
            ) {
              await this.props.submitCallback(data);
              helpers.setSubmitting(false);
            }
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
                        {this.steps(setFieldValue, values, isDateValid).map(
                          (s) => (
                            <Step key={s.title} title={s.title} />
                          )
                        )}
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
                            this.steps(setFieldValue, values, isDateValid)[
                              this.state.step
                            ].content
                          }

                          <Footer style={{ background: "#FFFFFF" }}>
                            <Row justify="end" align="bottom">
                              <Space size={"large"} align="baseline">
                                {this.state.step > 0 && (
                                  <Button
                                    type="link"
                                    onClick={() => this.prev()}
                                  >
                                    Назад
                                  </Button>
                                )}
                                {this.state.step <
                                  this.steps(setFieldValue, values, isDateValid)
                                    .length -
                                    1 && (
                                  <Button
                                    type="primary"
                                    style={{
                                      background: "#1890FF",
                                      color: "#FFFFFF",
                                    }}
                                    disabled={
                                      this.state.step === 1 && !isDateValid
                                    }
                                    onClick={() => this.next()}
                                  >
                                    Далее
                                  </Button>
                                )}
                                {this.state.step ===
                                  this.steps(setFieldValue, values, isDateValid)
                                    .length -
                                    1 && (
                                  <Space size={"large"} align="baseline">
                                    <Can
                                      I={ActionsEnum.Edit}
                                      a={elementId(
                                        EditorSiElements[EditorSiElements.SiAdd]
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
                                    {this.props.initial !== undefined && (
                                      <Tooltip
                                        title={
                                          values.lastSiEquipmentBinding != null
                                            ? "Данное средство измерения недоступно для архивации, так как имеет привязку к технологической позиции"
                                            : "Добавить средство измерения в архив. Отменить архивацию может только администратор!"
                                        }
                                      >
                                        <FormItem
                                          style={{
                                            alignItems: "baseline",
                                            display: "flex",
                                            flexDirection: "row",
                                          }}
                                          name="isArchival"
                                          label="Архивировать"
                                        >
                                          <Switch
                                            disabled={
                                              values.lastSiEquipmentBinding !=
                                              null
                                            }
                                            style={{ marginLeft: 10 }}
                                            name="isArchival"
                                            onChange={(checked: boolean) => {
                                              if (checked) showConfirm();
                                            }}
                                          ></Switch>
                                        </FormItem>
                                      </Tooltip>
                                    )}
                                  </Space>
                                )}
                              </Space>
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
    axios.get<Array<SiknRsu>>(`${apiBase}/siknrsus`).then((result) => {
      this.setState({
        sikn: result.data,
      });
    });

    axios.get<Array<SiTypes>>(`${apiBase}/SiTypes`).then((result) => {
      this.setState({ siTypes: result.data.filter((x) => x.isSiType) });
    });

    axios.get<Array<SiModel>>(`${apiBase}/SiModels`).then((result) => {
      this.setState({ siModels: result.data });
    });

    if (this.props.initial) {
      axios
        .get<SiEquipment>(`${apiBase}/siequipments/${this.props.siId}/bound`)
        .then((result) => {
          this.initialValues.manufYear = result.data.manufYear;
          this.initialValues.installYear = result.data.installYear;
          this.initialValues.intervalKmh =
            result.data.intervalKmh ?? result.data.siTypeId == 1 ? 10 : 30;
          this.initialValues.intervalPov = result.data.intervalPov ?? 365;
          this.initialValues.intervalTo3 = result.data.intervalTo3 ?? 365;
          this.setState({
            siEq: result.data,
          });
        });
    }
  }
}
