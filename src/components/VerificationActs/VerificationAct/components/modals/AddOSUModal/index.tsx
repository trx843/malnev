import React, { FC, useState } from "react";
import { Button, Form, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { AddOsuForm } from "./AddOsuForm";
import { IdType, StateType } from "../../../../../../types";
import { CheckingObject, VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import { getVerificationActPageThunk, getVerificationActSectionPageThunk, setVerificationOsuItemThunk } from "../../../../../../thunks/verificationActs/verificationAct";
import { VerificationActOptions, VerificationActSection } from "../../../../../../containers/VerificationActs/VerificationAct/types";
import { useVerificationActOptions } from "../../../hooks/useVerificationActOptions";
import { getCheckingObjectItemsByActIdRequest } from "api/requests/verificationActs";

interface AddOSUModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddOSUModal: FC<AddOSUModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [osuId, setId] = useState<IdType | null>(null);
  const [osusOptions, setOsusOptions] = useState<CheckingObject[]>([]);

  const [form] = Form.useForm();

  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const actId = state.act?.id;

  React.useEffect(() => {
    if (actId && visible) initOsusOptions(actId)
  }, [actId, visible])

  const initOsusOptions = async (actId: string) => {
    setLoading(true);
    const data = await getCheckingObjectItemsByActIdRequest(actId);
    setOsusOptions(data)
    setLoading(false);
  }

  const handleSelect = (value: IdType) => {
    setId(value);

    if (!actId) {
      return;
    }

    if (!osusOptions) {
      return;
    }
    const target = osusOptions.find((osu) => osu.id === value);

    if (target) {
      form.setFieldsValue(target);
    }
  };

  const handleSave = async (value: any) => {
    setLoading(true);
    try {
      if (!actId) {
        return;
      }

      if (!osusOptions) {
        return;
      }
      const target = osusOptions.find((osu) => osu.id === osuId);

      if (target) {
        await dispatch(
          setVerificationOsuItemThunk({
            actId,
            data: target,
          })
        );
        await dispatch(getVerificationActPageThunk(actId));
      }
      await handleClose();
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setId(null);
    form.resetFields();

    onClose?.();
  };

  const handleSubmitButton = () => {
    form.submit();
  };

  return (
    <Modal
      title="Сторона №1 (Владелец СИКН)"
      visible={visible}
      maskClosable={false}
      onCancel={handleClose}
      width={780}
      style={{ minWidth: 780 }}
      destroyOnClose
      footer={
        <Button loading={loading} type="primary" onClick={handleSubmitButton}>
          Сохранить
        </Button>
      }
    >
      <AddOsuForm
        form={form}
        options={osusOptions.map(osu => ({
          value: osu.id as string,
          label: osu.osuShortName
        }))}
        onSelectOsu={handleSelect}
        onFinish={handleSave}
      />
    </Modal>
  );
};
