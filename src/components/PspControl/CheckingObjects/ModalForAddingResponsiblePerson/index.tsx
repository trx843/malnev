import React from "react";
import { Formik, FormikProps } from "formik";
import { Spin, Modal } from "antd";
import { Form, FormItem, Input } from "formik-antd";
import { history } from "../../../../history/history";
import { FormFields, InitialFormValues, ValidationSchema } from "./constants";
import { IFormValues } from "./types";
import { Nullable } from "types";
import {
  getSettingsPsp,
  saveSettingsPsp,
} from "api/requests/eliminationOfTypicalViolations";
import { FioSelect } from "components/DictionarySelects/FioSelect";
import { PositionSelect } from "components/DictionarySelects/PositionSelect";
import { DropdownSelectTypes } from "components/DropdownSelect/constants";

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  pspId: Nullable<string>;
}

export const ModalForAddingResponsiblePerson: React.FC<IProps> = ({
  isVisible,
  onCancel,
  pspId,
}) => {
  const formikRef = React.useRef<FormikProps<IFormValues>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (pspId) init(pspId);
  }, [pspId]);

  const init = async (pspId: string) => {
    setIsLoading(true);
    const settingsPsp = await getSettingsPsp(pspId as string);
    setIsLoading(false);

    if (settingsPsp) {
      history.push(
        `/pspcontrol/elimination-of-typical-violations/${settingsPsp.ostRnuPspId}`
      );
    }
  };

  const handleSubmitForm = async (values: IFormValues) => {
    setIsLoading(true);
    await saveSettingsPsp({ ostRnuPspId: pspId as string, ...values });
    setIsLoading(false);
  };

  return (
    <Modal
      width={562}
      visible={isVisible}
      title="Укажите ответственного за проверку"
      onOk={() => formikRef.current?.submitForm()}
      onCancel={() => onCancel()}
      cancelButtonProps={{ type: "text" }}
      okButtonProps={{ loading: isLoading, disabled: !pspId }}
      cancelText="Отмена"
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
          validationSchema={ValidationSchema}
        >
          {({ setFieldValue }) => {
            return (
              <Form layout="vertical">
                <FormItem name={FormFields.FullName} label="ФИО*" shouldUpdate>
                  <FioSelect
                    type={DropdownSelectTypes.formik}
                    name={FormFields.FullName}
                    placeholder="Введите ФИО"
                    onChange={(value: string) =>
                      setFieldValue(FormFields.FullName, value)
                    }
                  />
                </FormItem>
                <FormItem name={FormFields.Position} label="Должность*">
                  <PositionSelect
                    type={DropdownSelectTypes.formik}
                    name={FormFields.Position}
                    placeholder="Введите должность"
                    onChange={(value: string) =>
                      setFieldValue(FormFields.Position, value)
                    }
                  />
                </FormItem>
              </Form>
            );
          }}
        </Formik>
      </Spin>
    </Modal>
  );
};
