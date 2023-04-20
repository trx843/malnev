import { Col, message, Row } from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import axios from "axios";
import { Formik, FormikHelpers } from "formik";
import {
  DatePicker,
  Form,
  FormItem,
  ResetButton,
  Select,
  SubmitButton,
} from "formik-antd";
import moment from "moment";
import { Moment } from "moment";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { operMonitFiltered } from "../../actions/operativemonotoring/creators";
import { SiknRsu } from "../../classes/SiknRsu";
import { AcknowledgedStatus } from "../../enums";
import { IOperMonitState } from "../../interfaces";
import {
  FilterCollapse,
  FilterContainer,
  FilterTextParagraph,
} from "../../styles/commonStyledComponents";
import { Nullable, StateType } from "../../types";
import { apiBase } from "../../utils";
const { RangePicker } = DatePicker;

export class OperativeMonitoringFilter {
  siknIdList: Array<number> = [];
  status: Nullable<number> = null;
  period: Array<Moment> = [];
  startTime: string;
  endTime: string;
  acknowledgedStatus: Nullable<AcknowledgedStatus> = null;
}

interface IOperativeMonitoringFilterPanelProps {}
export const OperativeMonitoringFilterPanel: FunctionComponent<IOperativeMonitoringFilterPanelProps> =
  (props) => {
    const dispatch = useDispatch();
    const operMonitState = useSelector<StateType, IOperMonitState>(
      (state) => state.operMonit
    );

    const [siknRsus, setSiknRsus] = useState<Array<SiknRsu>>([]);
    const [osts, setOsts] = useState<Array<string>>([]);

    const disabledDateNow = (current: moment.Moment) => {
      // Can not select days before today and today
      return current > moment();
    };

    useEffect(() => {
      axios
        .get<Array<SiknRsu>>(`${apiBase}/SiknRsus`)
        .then((result) => {
          let siknrsu = result.data.filter((x) => x.fullName.includes("СИКН"));
          setSiknRsus(siknrsu);
          let osts = siknrsu
            .map((item) => item.ostName)
            .filter((value, index, self) => self.indexOf(value) === index);
          setOsts(osts);
        })
        .catch(() => {
          message.error("Ошибка загрузки данных");
        });
    }, []);

    return (
      <FilterCollapse defaultActiveKey={["1"]} ghost>
        <FilterCollapse.Panel header="Фильтр" key="1">
          <Formik
            initialValues={operMonitState.filter}
            onSubmit={(
              data: OperativeMonitoringFilter,
              helpers: FormikHelpers<OperativeMonitoringFilter>
            ) => {
              dispatch(operMonitFiltered(data));
              helpers.setSubmitting(false);
            }}
          >
            {({ setFieldValue }) => {
              return (
                <Form layout={"vertical"}>
                  <FilterContainer>
                    <Row gutter={12} align={"middle"}>
                      <Col span={5}>
                        <FormItem name={"siknIdList"}>
                          <FilterTextParagraph>СИКН</FilterTextParagraph>
                          <Select
                            name={"siknIdList"}
                            mode="multiple"
                            allowClear
                            style={{ marginTop: 4, width: "100%" }}
                            placeholder="Все"
                            notFoundContent="Нет данных"
                            maxTagCount={1}
                            showSearch
                            optionFilterProp="children"
                          >
                            {osts.map((ost) => {
                              return (
                                <Select.OptGroup label={ost}>
                                  {siknRsus
                                    .filter((x) => x.ostName === ost)
                                    .map((sikn) => {
                                      return (
                                        <Select.Option value={sikn.id}>
                                          {sikn.fullName}
                                        </Select.Option>
                                      );
                                    })}
                                </Select.OptGroup>
                              );
                            })}
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem name={"status"}>
                          <FilterTextParagraph>Статус</FilterTextParagraph>
                          <Select
                            name={"status"}
                            allowClear
                            style={{ marginTop: 4, width: "100%" }}
                            placeholder="Все"
                          >
                            <Select.Option value={1}>Остановлен</Select.Option>
                            <Select.Option value={2}>В работе</Select.Option>
                            <Select.Option value={-1}>
                              Недостоверно
                            </Select.Option>
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem name={"period"}>
                          <FilterTextParagraph>Период</FilterTextParagraph>
                          <RangePicker
                            name={"period"}
                            style={{ marginTop: 4, width: "100%" }}
                            locale={locale}
                            disabledDate={disabledDateNow}
                            onChange={(
                              dates: [Moment, Moment],
                              formatString: [string, string]
                            ) => {
                              if (dates != undefined) {
                                const format = "YYYY-MM-DD";
                                let start = dates[0].startOf("day").format(format)
                                let end = dates[1].endOf("day").format();
                                setFieldValue("startTime", start);
                                setFieldValue("endTime", end);
                              }
                            }}
                          />
                        </FormItem>

                        <FormItem hidden name={"startTime"}>
                          <DatePicker name={"startTime"} />
                        </FormItem>

                        <FormItem hidden name={"endTime"}>
                          <DatePicker name={"endTime"} />
                        </FormItem>
                      </Col>

                      <Col span={3}>
                        <FormItem name={"acknowledgedStatus"}>
                          <FilterTextParagraph>Квитирован</FilterTextParagraph>
                          <Select
                            name={"acknowledgedStatus"}
                            allowClear
                            style={{ marginTop: 4, width: "100%" }}
                            placeholder="Все"
                          >
                            <Select.Option value={0}>
                              Не квитирован
                            </Select.Option>
                            <Select.Option value={1}>Квитирован</Select.Option>
                            <Select.Option value={2}>Переоткрыт</Select.Option>
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={5}>
                        <ResetButton type={"text"}>Сбросить</ResetButton>
                        <SubmitButton onClick={() => {}} type={"link"}>
                          Применить
                        </SubmitButton>
                      </Col>
                    </Row>
                  </FilterContainer>
                </Form>
              );
            }}
          </Formik>
        </FilterCollapse.Panel>
      </FilterCollapse>
    );
  };
