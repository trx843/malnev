import React from "react";
import { Formik, FormikProps } from "formik";
import { Spin, Modal, Row, Col } from "antd";
import { DatePicker, Form, FormItem, Input, Select } from "formik-antd";
import { FormFields, InitialFormValues } from "./constants";
import { IFormValues } from "./types";
import { IDictionary, Nullable, StateType } from "types";
import { useSelector } from "react-redux";
import { IVerificationScheduleCardStore } from "slices/pspControl/verificationScheduleCard";
import { getVerificationLevelsByOwned } from "thunks/pspControl/checkingObjects";
import {
  adjustValues,
  getInspectedTypeVisibilityValue,
  getValidationSchema,
  mapInspectionTypes,
} from "./utils";
import {
  createVerificationAct,
  getInspectionTypes,
} from "api/requests/pspControl/VerificationScheduleCard";
import { history } from "../../../../../history/history"
import styles from "./createActModal.module.css";
import locale from "antd/lib/date-picker/locale/ru_RU";
import axios from "axios";
import { apiBase, openNotification } from "utils";
import moment, { Moment } from "moment";

interface IProps {
  isVisible: boolean;
  ostRnuPspId: Nullable<string>;
  onCancel: () => void;
}

export const CreateActModal: React.FC<IProps> = ({
  isVisible,
  ostRnuPspId,
  onCancel,
}) => {
  const formikRef = React.useRef<FormikProps<IFormValues>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const { verificationScheduleCardInfo } = useSelector<
    StateType,
    IVerificationScheduleCardStore
  >((state) => state.verificationScheduleCard);

  const checkTypeId = verificationScheduleCardInfo?.checkTypeId;
  const ownType = verificationScheduleCardInfo?.ownType;

  const [isLoading, setIsLoading] = React.useState(false);
  const [inspectionTypes, setInspectionTypes] = React.useState<IDictionary[]>(
    []
  );
  const [isInspectedTypeVisible, setIsInspectedTypeVisible] =
    React.useState(false);

  React.useEffect(() => {
    if (isVisible && checkTypeId && ownType) init(checkTypeId, ownType);
  }, [isVisible, checkTypeId, ownType]);

  React.useEffect(() => {
    if (!formikRef.current?.values.verificatedOn) return;
    handlePreparedOnDate(moment(formikRef.current?.values.verificatedOn));
  }, []);

  const init = async (checkTypeId: string, ownType: number) => {
    setIsLoading(true);
    const verificationLevels = await getVerificationLevelsByOwned(ownType);
    const isVisible = getInspectedTypeVisibilityValue(
      checkTypeId,
      verificationLevels
    );

    if (isVisible) {
      const inspectionTypes = await getInspectionTypes();
      setInspectionTypes(inspectionTypes);
    }

    setIsInspectedTypeVisible(isVisible);
    setIsLoading(false);
  };

  const handleSubmitForm = async (values: IFormValues) => {
    const adjustedValues = adjustValues(values);
    const params = {
      ...adjustedValues,
      ostRnuPspId,
      verificationSchedulesId: verificationScheduleCardInfo?.id,
    };

    setIsLoading(true);
    const actId = await createVerificationAct(params);
    setIsLoading(false);
    if (actId) history.push(`/pspcontrol/verification-acts/${actId}`);
  };

  const handlePreparedOnDate = async (verificatedOnDate: Moment) => {

    const response = await axios.get(
      `${apiBase}/pspcontrol/act/plannedDate?date=${verificatedOnDate.format("YYYY-MM-DD")}`
    );
    if(response.data)
    {
      formikRef.current && formikRef.current.setFieldValue(FormFields.preparedOn, moment(response.data).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS));
    }else
    {
      formikRef.current && formikRef.current.setFieldValue(FormFields.preparedOn, verificatedOnDate);
      openNotification("Уведомление", "В МКО ТКО не заполнен производственный календарь. Обратитесь к администратору либо проставьте Дату подготовки плана самостоятельно");
    }
  };

  return (
    <Modal
      width={562}
      visible={isVisible}
      title="Создание акта проверки"
      onOk={() => formikRef.current?.submitForm()}
      onCancel={() => onCancel()}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ loading: isLoading }}
      okText="Далее"
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isLoading}>
        <Formik
          initialValues={InitialFormValues}
          onSubmit={handleSubmitForm}
          innerRef={formikRef}
          validationSchema={getValidationSchema(isInspectedTypeVisible)}
        >
          <Form
            layout="vertical"
          >
            <Row gutter={24}>
              <Col span={12}>
                <FormItem
                  name={FormFields.verificatedOn}
                  label="Дата проведения"
                  required
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    name={FormFields.verificatedOn}
                    format="DD.MM.YYYY"
                    placeholder="Введите дату"
                    locale={locale}
                    onChange={handlePreparedOnDate}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  name={FormFields.preparedOn}
                  label="Дата подготовки плана"
                  required
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    name="preparedOn"
                    format="DD.MM.YYYY"
                    placeholder="Введите дату"
                    locale={locale}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem
                  name={FormFields.verificationPlace}
                  label="Место проведения"
                  required
                >
                  <Input name={FormFields.verificationPlace} />
                </FormItem>
              </Col>
              {isInspectedTypeVisible && (
                <Col span={12}>
                  <FormItem
                    name={FormFields.inspectedTypeId}
                    label="Тип проверки"
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      name={FormFields.inspectedTypeId}
                      options={mapInspectionTypes(inspectionTypes)}
                    />
                  </FormItem>
                </Col>
              )}
            </Row>
          </Form>
        </Formik>
      </Spin>
    </Modal>
  );
};
