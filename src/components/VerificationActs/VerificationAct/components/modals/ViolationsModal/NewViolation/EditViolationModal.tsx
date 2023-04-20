import { FC, useCallback, useEffect, useState } from "react";
import { Button, Form, Modal } from "antd";
import { useSelector } from "react-redux";
import { NewViolationsForm } from "./NewViolationsForm";
import { StateType } from "types";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import { transformEmptyValues } from "./helpers";
import { TypicalViolationsModal } from "./TypicalViolationsModal";
import { ActionsEnum, Can } from "../../../../../../../casl";
import {
  elementId,
  VerificationActsElements,
} from "pages/VerificationActs/constant";
import { IFormViolation } from "slices/pspControl/actionPlanTypicalViolations/types";
import { useActStatusPermission } from "components/VerificationActs/VerificationAct/hooks/useActStatusPermission";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  id: string;
  area: string;
  visibleTypicalButton?: boolean;
}

export const EditViolationModal: FC<ModalProps> = ({
  visible,
  onClose,
  id,
  onSubmit,
  area,
  visibleTypicalButton = true,
}) => {
  const [disabledFieldsState, setDisabledFields] = useState({});
  const [typicalViolationModal, setOpenTypicalViolation] = useState(false);
  const [targetObject, setTargetObject] = useState<any>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [form] = Form.useForm();

  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const actId = state.act?.id;
  const identifiedViolationsOrRecommendations =
    state.identifiedViolationsOrRecommendations;

  const setInitialValues = useCallback(async () => {
    if (actId && id && visible && identifiedViolationsOrRecommendations) {
      const group = identifiedViolationsOrRecommendations?.find(
        (item) => item.areaOfResponsibility === area
      );
      if (!group) {
        return;
      }
      const target = group.violations.find((item) => item.id === id);
      if (target) {
        const updated = transformEmptyValues(target, group.violations);
        const siknLabRsu = target.siknLabRsu.map((i) => i.id);
        setTargetObject({
          ...updated,
          siknLabRsu: siknLabRsu,
        });
        form.setFieldsValue({
          ...updated,
          siknLabRsu: siknLabRsu,
        });
      }
    }
  }, [id, area, actId, identifiedViolationsOrRecommendations, visible]);

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setTargetObject(null);
    }
  }, [visible]);

  const handleOnClose = () => {
    form.resetFields();
    setTargetObject(null);
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

  const handleSelectTypicalViolation = (
    number: string,
    id: string,
    violations: Array<IFormViolation>
  ) => {
    let currentViolations = form.getFieldValue("violations");
    let isCurrentViolationsEmpty = true;
    currentViolations.forEach((violation) => {
      if (
        violation.pointNormativeDocuments.length ||
        violation.violationText.length
      ) {
        isCurrentViolationsEmpty = false;
      }
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
  };

  const isDisabled = useActStatusPermission();

  useEffect(() => {
    if (visible) {
      if (isDisabled.disabled) {
        setDisabledFields({
          violations: true,
          areaOfResponsibility: true,
          typicalViolationNumber: true,
          identifiedTypicalViolationId: true,
          sourceRemarkId: true,
          isDuplicate: true,
          specialOpinion: true,
          selectButton: true,
          resetButton: true,
        });
      }
    }
  }, [visible]);

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
    setIsFormSubmitting(true);
    await onSubmit({ ...targetObject, ...values });
    setIsFormSubmitting(false);
  };

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
        <Can
          I={ActionsEnum.Edit}
          a={elementId(
            VerificationActsElements[VerificationActsElements.EditDefect]
          )}
        >
          <Button
            loading={isFormSubmitting}
            disabled={isFormSubmitting}
            type="primary"
            onClick={() => form.submit()}
          >
            Сохранить
          </Button>
        </Can>
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
        }}
      >
        <NewViolationsForm
          siknLabRsu={targetObject?.siknLabRsu}
          onAddViolation={handleAddViolation}
          resetClassif={handleResetClassif}
          disabledFields={disabledFieldsState}
          onOpenTypicalViolations={() => setOpenTypicalViolation(true)}
          visibleTypicalButton={visibleTypicalButton}
          resetNumberOfTypicalViolation={handleResetNumberOfTypicalViolation}
        />
      </Form>
      <TypicalViolationsModal
        visible={typicalViolationModal}
        onClose={() => setOpenTypicalViolation(false)}
        onSelect={handleSelectTypicalViolation}
      />
    </Modal>
  );
};
