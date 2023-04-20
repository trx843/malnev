import React from "react";
import { Col, Modal, Row, Spin } from "antd";
import ruLocale from "antd/lib/date-picker/locale/ru_RU";
import { FormItem, Select, DatePicker, Form } from "formik-antd";
import { useExportOptions } from "containers/AcquaintanceContainer/Modals/ExportForm/useExportOptions";
import { Formik, FormikProps } from "formik";
import { FormFields, InitialFormValues, ValidationSchema } from "./constants";
import { IFormValues } from "./types";
import { exportAcquaintanceToExcel } from "api/requests/pspControl/acquaintance";
import { adjustValues } from "./utils";

const { RangePicker } = DatePicker;

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ExportFormModal: React.FC<ModalProps> = ({ visible, onClose }) => {
  const {
    verificationLevels,
    verificationYears,
    ostList,
    pspList,
    isLoadingOptions,
    fetchPspList,
  } = useExportOptions();

  const [isExporting, setIsExporting] = React.useState(false);

  const formikRef = React.useRef<FormikProps<IFormValues>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const handleSubmitForm = async (values: IFormValues) => {
    const { name, ...restValues } = adjustValues(values);
    setIsExporting(true);
    await exportAcquaintanceToExcel(name, restValues);
    setIsExporting(false);
    onClose();
  };

  const handleChangeOst = (ostId: string | undefined) => {
    if (ostId) fetchPspList(ostId);
    formikRef.current?.setFieldValue(FormFields.pspId, null);
  };

  const isLoading = isLoadingOptions || isExporting;

  return (
    <Modal
      width={678}
      visible={visible}
      title="Параметры построения отчета"
      onOk={() => formikRef.current?.submitForm()}
      onCancel={onClose}
      cancelText="Назад"
      cancelButtonProps={{
        loading: isLoading,
        type: "link",
      }}
      okText="Создать"
      okButtonProps={{
        loading: isLoading,
      }}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isLoading}>
        <Formik
          initialValues={InitialFormValues}
          onSubmit={handleSubmitForm}
          innerRef={formikRef}
          validationSchema={ValidationSchema}
        >
          {(props) => {
            const values = props.values;

            return (
              <Form layout="vertical">
                <Row>
                  <Col span={11}>
                    <FormItem
                      name={FormFields.verificationLevelId}
                      label="Уровень проверки"
                    >
                      <Select
                        name={FormFields.verificationLevelId}
                        options={verificationLevels}
                        optionFilterProp="label"
                        showSearch
                      />
                    </FormItem>
                  </Col>
                  <Col span={11} offset={2}>
                    <FormItem
                      name={FormFields.acquaintanceDateInterval}
                      label="Дата ознакомления"
                    >
                      <RangePicker
                        style={{ width: "100%" }}
                        name={FormFields.acquaintanceDateInterval}
                        placeholder={["", ""]}
                        format="DD.MM.YYYY"
                        locale={ruLocale}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <FormItem
                      name={FormFields.inspectionYear}
                      label="Год проверки"
                    >
                      <Select
                        name={FormFields.inspectionYear}
                        options={verificationYears}
                        showSearch
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  <Col span={11} offset={2}>
                    <FormItem name={FormFields.ostId} label="ОСТ">
                      <Select
                        name={FormFields.ostId}
                        options={ostList}
                        onChange={handleChangeOst}
                        optionFilterProp="label"
                        allowClear
                        showSearch
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <FormItem name={FormFields.pspId} label="ПСП">
                      <Select
                        name={FormFields.pspId}
                        options={pspList}
                        disabled={!values[FormFields.ostId]}
                        optionFilterProp="label"
                        allowClear
                        showSearch
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Spin>
    </Modal>
  );
};
