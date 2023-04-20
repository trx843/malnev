import { Modal } from "antd";
import {
  getNotification,
  postNotification,
} from "api/requests/notificationMessage";
import { Formik, FormikProps } from "formik";
import { Form, FormItem, Input, Checkbox } from "formik-antd";
import { FC, useEffect, useRef, useState } from "react";
import { NotificationMessageModalProps, NotificationModel } from "./types";

export const NotificationMessageModal: FC<NotificationMessageModalProps> = ({
  isNotificatonModalOpened,
  onCloseCallback,
  initialValues,
}) => {
  const formikRef = useRef<FormikProps<NotificationModel>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const [isLoading, setisLoading] = useState(false);

  const postData = async (data: NotificationModel) => {
    setisLoading(true);
    const response = await postNotification(data);
    setisLoading(false);
    if (response.success) {
      onCloseCallback();
    }
  };

  const changeMessage = () => {
    const submitForm = formikRef.current?.submitForm;
    if (submitForm) submitForm();
  };
  return (
    <Modal
      visible={isNotificatonModalOpened}
      title={`Уведомление`}
      destroyOnClose
      onCancel={() => onCloseCallback()}
      onOk={changeMessage}
      okText="Сохранить"
      cancelText="Отменить"
      okButtonProps={{ loading: isLoading }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={postData}
        innerRef={formikRef}
      >
        {(data) => {
          return (
            <Form>
              <FormItem name={"message"}>
                <Input.TextArea
                  placeholder={"Введите сообщение"}
                  name={"message"}
                />
              </FormItem>
              <FormItem name={"show"}>
                <Checkbox
                  checked={
                    data.values.message.length === 0 ? false : data.values.show
                  }
                  disabled={data.values.message.length === 0}
                  name={"show"}
                >
                  Показать на портале
                </Checkbox>
              </FormItem>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
