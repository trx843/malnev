import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Spin, DatePicker } from "antd";
import { FormFields } from "./constants";
import { IFormValues } from "./types";
import { IdType, Nullable, StateType } from "types";
import { EliminationViolationSaveModel, IEliminationOfTypicalViolationsStore } from "slices/pspControl/eliminationOfTypicalViolations/types";
import { getTypicalViolationsThunk } from "thunks/pspControl/eliminationOfTypicalViolations";
import { getFormValues } from "./utils";
import { eliminationTypicalComplited } from "api/requests/eliminationOfTypicalViolations";
import { useParams } from "react-router";
import { User } from "classes";
import { setEliminationTypicalViolationInfo } from "slices/pspControl/eliminationOfTypicalViolations";
import locale from "antd/es/date-picker/locale/ru_RU";



interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  violationId: Nullable<IdType>;
}

export const ModalForEliminateViolation: React.FC<IProps> = ({
  isVisible,
  onCancel,
  violationId,
}) => {

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const { listFilter, eliminationTypicalViolationInfo } = useSelector<
    StateType,
    IEliminationOfTypicalViolationsStore
  >((state) => state.eliminationOfTypicalViolations);

  React.useEffect(() => {
    if (isVisible) {
      form.setFieldsValue(getFormValues());
    }
  }, [isVisible, form]);

  const handleSubmitForm = async (values: IFormValues) => {
    setIsLoading(true);
    if (violationId) {
      const user = JSON.parse(
        localStorage.getItem("userContext") as string
      ) as User;
      const adjustedValues: EliminationViolationSaveModel = {
        violationId,
        factDate: values.factDate,
        userId: user.id,
      }


      const result = await eliminationTypicalComplited(adjustedValues);
      setIsLoading(false);

      dispatch(getTypicalViolationsThunk(listFilter));


      const index = eliminationTypicalViolationInfo.map(i => i.id).indexOf(result.id);
      debugger
      if (index != -1) {
        // все элементы до обновлённого
        const data = eliminationTypicalViolationInfo.slice(0, index);
        // обновлённый элемент
        data.push(result);
        // все элементы после обновлённого элемента
        data.push(
          ...eliminationTypicalViolationInfo.slice(
            index + 1,
            eliminationTypicalViolationInfo.length
          )
        );
        dispatch(setEliminationTypicalViolationInfo(data));
      }
      onCancel();
    }
  };

  return (
    <Modal
      visible={isVisible}
      title={"Добавление информации о проверке по нарушению"}
      onOk={() => form.submit()}
      onCancel={() => onCancel()}
      okText="Сохранить"
      cancelText="Отменить"
      okButtonProps={{
        loading: isLoading,
      }}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" form={form} onFinish={handleSubmitForm}>
          <Form.Item
            name={FormFields.FactDate}
            label="Срок устранения (факт)"
            rules={[
              { required: true, message: "Поле обязательно к заполнению!" },
            ]}
          >
            <DatePicker locale={locale}/>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
