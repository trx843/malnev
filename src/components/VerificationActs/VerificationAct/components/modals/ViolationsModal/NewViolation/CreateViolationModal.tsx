import { FC, useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "antd";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { StateType } from "types";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import { NewViolationsForm } from "./NewViolationsForm";
import "./styles.css";
import { TypicalViolationsModal } from "./TypicalViolationsModal";
import { IFormViolation } from "slices/pspControl/actionPlanTypicalViolations/types";
import { transformEmptyValues } from "./helpers";

interface ModalProps {
  visible: boolean;
  data?: any;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  disabledFields?: {
    isDuplicate?: boolean;
    violations?: boolean;
  };
  visibleTypicalButton?: boolean;
}

export const ViolationsModal: FC<ModalProps> = ({
  visible,
  onClose,
  onSubmit,
  data,
  disabledFields,
  visibleTypicalButton = true,
}) => {
  const [disabledFieldsState, setDisabledFields] = useState(disabledFields);
  const [typicalViolationModal, setOpenTypicalViolation] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [form] = Form.useForm();

  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const actId = state.act?.id;

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      if (!isEmpty(data)) {
        form.setFieldsValue({ ...form.getFieldsValue(), ...data });
      }
    }
  }, [data]);

  useEffect(() => {
    if (visible) {
      setDisabledFields(disabledFields);
    } else {
      setDisabledFields({});
    }
  }, [disabledFields, visible]);

  const handleOnClose = () => {
    form.resetFields();
    setDisabledFields({});
    onClose?.();
  };

  const handleResetClassif = () => {
    form.setFieldsValue({ classifficationTypeId: null });
  };

  const handleAddViolation = () => {
    form.setFieldsValue({
      violations: [
        ...form.getFieldValue("violations"),
        { pointNormativeDocuments: "", violationText: "" },
      ],
    });
  };

  const handleSelectTypicalViolation = (number: string, id: string, violations: Array<IFormViolation>) => {
    let currentViolations = form.getFieldValue("violations");
    let isCurrentViolationsEmpty = true;
    currentViolations.forEach(violation => {
      if (violation.pointNormativeDocuments.length || violation.violationText.length) {
        isCurrentViolationsEmpty = false;
      };
    });

    if (isCurrentViolationsEmpty) {
      form.setFieldsValue({
        typicalViolationNumber: number,
        identifiedTypicalViolationId: id,
        isDuplicate: false,
        violations: violations,
      });
    } else {
      form.setFieldsValue({
        typicalViolationNumber: number,
        identifiedTypicalViolationId: id,
        isDuplicate: false,
      });
    }

    setDisabledFields((prev) => ({
      ...prev,
    }));
  };

  const handleResetNumberOfTypicalViolation = () => {
    form.setFieldsValue({
      typicalViolationNumber: null,
      identifiedTypicalViolationId: null,
      isDuplicate: null,
      violations: [
        {
          pointNormativeDocuments: "",
          violationText: "",
        },
      ],
    });

    setDisabledFields((prev) => ({
      ...prev,
      isDuplicate: undefined,
    }));
  };

  const handleSubmitForm = async (values) => {
    setIsFormSubmitting(true)
    await onSubmit({ ...data, ...values })
    setIsFormSubmitting(false)
  }

  if (!actId) {
    return null;
  }

  return (
    <Modal
      title="Выявленные нарушения"
      visible={visible}
      maskClosable={false}
      onCancel={handleOnClose}
      destroyOnClose
      width={1355}
      footer={
        <Button
          loading={isFormSubmitting}
          disabled={isFormSubmitting}
          type="primary"
          onClick={() => form.submit()}
        >
          Сохранить
        </Button>
      }
      forceRender
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmitForm}
        initialValues={{
          isDuplicate: false,
          specialOpinion: "",
          typicalViolationNumber: "",
          siknLabRsu: [],
          violations: [
            {
              pointNormativeDocuments: "",
              violationText: "",
            },
          ],
          sourceRemarkId: 1,
        }}
      >
        <NewViolationsForm
          siknLabRsu={data?.siknLabRsu}
          resetClassif={handleResetClassif}
          onAddViolation={handleAddViolation}
          disabledFields={disabledFieldsState}
          onOpenTypicalViolations={() => setOpenTypicalViolation(true)}
          visibleTypicalButton={visibleTypicalButton}
          resetNumberOfTypicalViolation={handleResetNumberOfTypicalViolation}
        />
        <TypicalViolationsModal
          visible={typicalViolationModal}
          onClose={() => setOpenTypicalViolation(false)}
          onSelect={handleSelectTypicalViolation}
        />
      </Form>
    </Modal>
  );
};
