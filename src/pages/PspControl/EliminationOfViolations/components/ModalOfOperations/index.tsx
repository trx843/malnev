import React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Modal, Form, DatePicker } from "antd";
import { Nullable, StateType } from "../../../../../types";
import { IEliminationOfViolationsStore } from "../../../../../slices/pspControl/eliminationOfViolations/types";
import { ObjectOperationForm } from "../ObjectOperationForm";
import { IEliminationViolationEvent } from "./types";
import { InitialFormValues, TypesOfOperations } from "./constants";
import { getFormData, getOperation, getTitle } from "./utils";
import { getViolationsThunk } from "../../../../../thunks/pspControl/eliminationOfViolations";
import { getEliminationTermPost } from "api/requests/pspControl/eliminationOfViolations";
import { FormFields } from "../../constants";
import styles from "./modalOfOperations.module.css";
import locale from "antd/es/date-picker/locale/ru_RU";

const cx = classNames.bind(styles);

interface IProps {
  typeOfOperation?: TypesOfOperations;
  actionPlanId?: string;
  termOfElimination?: any;
  isVisible: boolean;
  onCancel: () => void;
}

export const ModalOfOperations: React.FC<IProps> = ({
  typeOfOperation,
  actionPlanId,
  termOfElimination,
  isVisible,
  onCancel,
}) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const { appliedFilter } = useSelector<
    StateType,
    IEliminationOfViolationsStore
  >((state) => state.eliminationOfViolations);

  const [isPerformingOperation, setIsPerformingOperation] =
    React.useState(false);

  const [eliminationTermPost, setEliminationTermPost] =
    React.useState<Nullable<any>>(null);

  React.useEffect(() => {
    init(typeOfOperation, termOfElimination);
  }, [typeOfOperation, termOfElimination]);

  const init = (
    typeOfOperation: TypesOfOperations | undefined,
    termOfElimination: any
  ) => {
    if (typeOfOperation === TypesOfOperations.requestAnExtension) {
      if (!termOfElimination) return;

      const termOfEliminationMomentObj = moment(termOfElimination);

      if (termOfEliminationMomentObj.isValid()) {
        form.setFieldsValue({
          [FormFields.processedDate]: termOfEliminationMomentObj.add(1, "days"),
        });
      }
    }
  };

  React.useEffect(() => {
    initEliminationTermPost(typeOfOperation, actionPlanId);
  }, [typeOfOperation, actionPlanId]);

  const initEliminationTermPost = async (
    typeOfOperation: TypesOfOperations | undefined,
    actionPlanId: string | undefined
  ) => {
    if (
      actionPlanId &&
      (typeOfOperation === TypesOfOperations.extend ||
        typeOfOperation === TypesOfOperations.rejectExtension)
    ) {
      const date = await getEliminationTermPost(actionPlanId);
      if (date) setEliminationTermPost(date);
    }
  };

  const onFinish = async (values: IEliminationViolationEvent) => {
    const formData = getFormData(values);

    if (actionPlanId) {
      const operation = getOperation(typeOfOperation);

      if (operation) {
        setIsPerformingOperation(true);
        await operation(actionPlanId, formData);
        dispatch(getViolationsThunk(appliedFilter));
        setIsPerformingOperation(false);
        onCancel();
        form.resetFields();
        setEliminationTermPost(null);
      }
    }
  };

  const disabledDate = (current: moment.Moment) => {
    if (!termOfElimination) return false;

    const termOfEliminationMomentObj = moment(termOfElimination);

    if (termOfEliminationMomentObj.isValid()) {
      return current && current < termOfEliminationMomentObj.endOf("day");
    }

    return false;
  };

  const renderContent = () => {
    if (typeOfOperation === TypesOfOperations.requestAnExtension) {
      return (
        <Form.Item
          name={FormFields.processedDate}
          label="Дата продления"
          rules={[
            {
              required: true,
              message: "Поле обязательно к заполнению!",
            },
          ]}
        >
          <DatePicker
            style={{ width: 280 }}
            placeholder="ДД.ММ.ГГГГ"
            format="DD.MM.YYYY"
            allowClear={false}
            disabledDate={disabledDate}
            locale={locale}
          />
        </Form.Item>
      );
    }

    if (
      typeOfOperation === TypesOfOperations.extend ||
      typeOfOperation === TypesOfOperations.rejectExtension
    ) {
      const momentObj = moment(eliminationTermPost);
      return (
        <p>
          Дата продления:{" "}
          {momentObj.isValid() ? momentObj.format("DD.MM.YYYY") : null}
        </p>
      );
    }

    return null;
  };

  return (
    <Modal
      width="47%"
      visible={isVisible}
      title={getTitle(typeOfOperation)}
      onOk={form.submit}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      okText="Сохранить"
      okButtonProps={{
        loading: isPerformingOperation,
      }}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <ObjectOperationForm
        form={form}
        isLoading={isPerformingOperation}
        onFinish={onFinish}
        initialValues={InitialFormValues}
        typeOfOperation={typeOfOperation}
      >
        {renderContent()}
      </ObjectOperationForm>
    </Modal>
  );
};
