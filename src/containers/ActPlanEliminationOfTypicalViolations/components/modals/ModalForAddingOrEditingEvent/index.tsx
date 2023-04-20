import React, { useEffect } from "react";
import Modal from "antd/lib/modal/Modal";
import { Space, Spin, Form, Input, Radio, Checkbox, DatePicker, Button } from "antd";
import moment from "moment";

import {
  FormFields,
  InitialFormValues,
  ModalModes,
  RadioGroupValues,
  ValidationSchema
} from "./constants";
import { isNeedAction, isPermanent } from "./utils";
import { useAntdFormik } from "../../../../../customHooks/useAntdFormik";
import { TypicalActionPlanParams } from "../../../../../api/requests/pspControl/plan-typical-violations/contracts";
import "./styles.css";
import * as Yup from "yup";
import { ActionsEnum, Can } from "../../../../../casl";
import { ActionPlansElements, elementId } from "pages/PspControl/ActionPlans/constant";
import locale from "antd/lib/date-picker/locale/ru_RU";

const { TextArea } = Input;

export type FormTypicalActionPlanValues = Omit<
  TypicalActionPlanParams,
  "entityId" | "id"
>;

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  mode: ModalModes;
  data?: FormTypicalActionPlanValues;
  onSubmit: (values: FormTypicalActionPlanValues) => void;
}

const validationSchema = Yup.object({
  [FormFields.ActionText]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.IsNeedAction]: Yup.bool().nullable(),
  [FormFields.FullNameExecutor]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.PositionExecutor]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.FullNameController]: Yup.string().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.PositionController]: Yup.string().required(
    "Поле обязательно к заполнению!"
  )
});

export const ModalForAddingOrEditingEvent: React.FC<IProps> = ({
  isVisible,
  onCancel,
  mode,
  data,
  onSubmit,
  ...props
}) => {
  const formik = useAntdFormik<any>({
    validateOnChange: false,
    validationSchema,
    initialValues: {
      [FormFields.ActionText]: data?.actionText || "",
      [FormFields.IsNeedAction]: data?.isNeedAction || false,
      [FormFields.IsPermanent]: data?.isPermanent || false,
      [FormFields.IsDone]: data?.isDone || false,
      [FormFields.EliminatedOn]: data?.eliminatedOn || moment(),
      [FormFields.FullNameExecutor]: data?.fullNameExecutor || "",
      [FormFields.PositionExecutor]: data?.positionExecutor || "",
      [FormFields.FullNameController]: data?.fullNameController || "",
      [FormFields.PositionController]: data?.positionController || "",
      [FormFields.ViolationsId]: data?.violationsId || "",
      [FormFields.Serial]: data?.serial || 0,
      inspectedYear: 0
    },
    onSubmit: values => {
      const prepared = { ...values };
      if (!isNeedAction(prepared) || isPermanent(prepared)) {
        delete prepared[FormFields.EliminatedOn];
      }

      onSubmit(prepared);
    } 
  });

  useEffect(() => {
    if (data) {
      formik.setValues(data);
    }
  }, [data]);

  useEffect(() => {
    if (!isVisible) {
      formik.resetForm();
    }
  }, [isVisible]);

  const addOrEditEvent = async () => {
    await formik.submitForm();
  };

  return (
    <Modal
      maskClosable={false}
      width={562}
      visible={isVisible}
      title={
        mode === ModalModes.create
          ? "Добавление мероприятия"
          : "Редактирование мероприятия"
      }
      // onOk={addOrEditEvent}
      onCancel={onCancel}
      // okText="Сохранить"
      cancelButtonProps={{
        style: { display: "none" }
      }}
      destroyOnClose
      footer={
        mode === ModalModes.create
        ? <Button type="primary" onClick={addOrEditEvent}>Сохранить</Button>
        : <Can
            I={ActionsEnum.Edit}
            a={elementId(ActionPlansElements[ActionPlansElements.EditAction])}
          >
            <Button type="primary" onClick={addOrEditEvent}>Сохранить</Button>
          </Can>
      }
    >
      <Spin spinning={formik.isSubmitting}>
        <Form
          className="plan-card-page-modal-event__form"
          layout="vertical"
          onValuesChange={formik.setFieldAntdValue}
          onFieldsChange={changedFields =>
            formik.onFieldChange(changedFields[0])
          }
          onFinishFailed={formik.setErrorsAntd}
          fields={formik.fields}
        >
          <Form.Item name={FormFields.ActionText} label="Мероприятие">
            <TextArea
              name={FormFields.ActionText}
              className="plan-card-page-modal-event__event-field"
            />
          </Form.Item>
          <Form.Item name={FormFields.IsNeedAction} valuePropName="checked">
            <Checkbox name={FormFields.IsNeedAction}>
              Требуются действия по устранению
            </Checkbox>
          </Form.Item>

          {isNeedAction(formik.values) && (
            <>
              <Space
                className="plan-card-page-modal-event__radio-wrapper"
                size={180}
              >
                <Form.Item name={FormFields.IsPermanent} label="Постоянно">
                  <Radio.Group name={FormFields.IsPermanent}>
                    <Space direction="vertical">
                      <Radio
                        name={FormFields.IsPermanent}
                        value={RadioGroupValues.yes}
                      >
                        Да
                      </Radio>
                      <Radio
                        name={FormFields.IsPermanent}
                        value={RadioGroupValues.no}
                      >
                        Нет
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={FormFields.IsDone} label="Выполнено">
                  <Radio.Group name={FormFields.IsDone}>
                    <Space direction="vertical">
                      <Radio
                        name={FormFields.IsDone}
                        value={RadioGroupValues.yes}
                      >
                        Да
                      </Radio>
                      <Radio
                        name={FormFields.IsDone}
                        value={RadioGroupValues.no}
                      >
                        Нет
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Space>

              {!isPermanent(formik.values) && (
                <Form.Item
                  name={FormFields.EliminatedOn}
                  label="Срок устранения"
                >
                  <DatePicker
                    className="plan-card-page-modal-event__elimination-term-field"
                    name={FormFields.EliminatedOn}
                    placeholder="Выберите дату и время"
                    allowClear={false}
                    locale={locale}
                    showTime
                  />
                </Form.Item>
              )}
            </>
          )}

          <p className="plan-card-page-modal-event__marked-title">
            Ответственный за выполнение
          </p>

          <Form.Item name={FormFields.PositionExecutor} label="Должность">
            <Input name={FormFields.PositionExecutor} />
          </Form.Item>
          <Form.Item name={FormFields.FullNameExecutor} label="ФИО">
            <Input name={FormFields.FullNameExecutor} />
          </Form.Item>

          <p className="plan-card-page-modal-event__marked-title">
            Ответственный за контроль
          </p>

          <Form.Item name={FormFields.PositionController} label="Должность">
            <Input name={FormFields.PositionController} />
          </Form.Item>
          <Form.Item name={FormFields.FullNameController} label="ФИО">
            <Input name={FormFields.FullNameController} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
