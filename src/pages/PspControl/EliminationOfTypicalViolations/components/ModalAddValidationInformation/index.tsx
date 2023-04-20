import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import classNames from "classnames/bind";
import { Modal, Form, Spin, Row, Col, Input, DatePicker } from "antd";
import { FormFields } from "./constants";
import { IFormValues } from "./types";
import { Nullable, StateType } from "types";
import { IEliminationOfTypicalViolationsStore } from "slices/pspControl/eliminationOfTypicalViolations/types";
import { adjustValues, disabledDate, getFormValues } from "./utils";
import { eliminationTypicalFound } from "api/requests/eliminationOfTypicalViolations";
import { getTypicalViolationsThunk } from "thunks/pspControl/eliminationOfTypicalViolations";
import { getModalTitleWithViolationNumber } from "../../utils";
import styles from "./modalAddValidationInformation.module.css";
import locale from "antd/lib/date-picker/locale/ru_RU";
import { setSelectedIdentifiedTypicalViolations } from "slices/pspControl/eliminationOfTypicalViolations";

const { TextArea } = Input;

const cx = classNames.bind(styles);

interface IProps {
  typicalViolation: Nullable<any>;
  isVisible: boolean;
  onCancel: () => void;
}

export const ModalAddValidationInformation: React.FC<IProps> = ({
  typicalViolation,
  isVisible,
  onCancel,
}) => {
  const { pspId } = useParams<{ pspId: string }>();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const { settingsPsp, listFilter } = useSelector<
    StateType,
    IEliminationOfTypicalViolationsStore
  >((state) => state.eliminationOfTypicalViolations);

  React.useEffect(() => {
    if (isVisible && settingsPsp) {
      form.setFieldsValue(getFormValues(settingsPsp));
    }
  }, [isVisible, settingsPsp, form]);

  const handleSubmitForm = async (values: IFormValues) => {
    const adjustedValues = adjustValues(pspId, typicalViolation, values);

    setIsLoading(true);
    await eliminationTypicalFound(adjustedValues);
    setIsLoading(false);

    dispatch(getTypicalViolationsThunk(listFilter));
    dispatch(setSelectedIdentifiedTypicalViolations([]));
    onCancel();
  };

  return (
    <Modal
      width="34.2%"
      visible={isVisible}
      title={
        <p className={cx("modal-title")}>
          {getModalTitleWithViolationNumber(
            "Добавление информации о проверке по нарушению",
            typicalViolation
          )}
        </p>
      }
      onOk={() => form.submit()}
      onCancel={() => onCancel()}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      okText="Сохранить"
      okButtonProps={{
        loading: isLoading,
      }}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" form={form} onFinish={handleSubmitForm}>
          <Row>
            <Col span={9}>
              <Form.Item name={FormFields.Psp} label="ПСП">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col offset={2} span={9}>
              <Form.Item name={FormFields.Ost} label="ОСТ">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <Form.Item name={FormFields.Owned} label="Собственный/сторонний">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col offset={2} span={9}>
              <Form.Item
                name={FormFields.DateOfVerification}
                label="Дата проверки"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="ДД.ММ.ГГГГ"
                  format="DD.MM.YYYY"
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name={FormFields.PlannedEliminationTime}
            label="Планируемый срок устранения"
            wrapperCol={{ span: 9 }}
            rules={[
              { required: true, message: "Поле обязательно к заполнению!" },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="ДД.ММ.ГГГГ"
              format="DD.MM.YYYY"
              disabledDate={disabledDate}
              locale={locale}
            />
          </Form.Item>
          <Form.Item
            name={FormFields.ContentOfIdentifiedViolation}
            label="Содержание выявленного нарушения"
            rules={[
              { required: true, message: "Поле обязательно к заполнению!" },
            ]}
          >
            <TextArea className={cx("textArea")} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
