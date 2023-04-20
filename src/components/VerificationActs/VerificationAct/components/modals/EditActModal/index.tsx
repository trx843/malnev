import { FC, useState } from "react";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import {
  ActSchedule,
  EditVerificationActModal,
} from "./EditVerificationActModal";
import { ApiRoutes } from "api/api-routes.enum";
import { apiBase, getErrorMessage } from "utils";
import { VerificationItem } from "components/VerificationActs/classes";
import { useDispatch } from "react-redux";
import { getVerificationActsPage } from "thunks/verificationActs";

interface EditActModalProps {
  visible: boolean;
  onClose: () => void;
  data: VerificationItem;
}

export const EditActModal: FC<EditActModalProps> = ({
  visible,
  onClose,
  data,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleCreateScheduledAct = async (values: ActSchedule) => {
    try {
      setLoading(true);
      const preparedValues = {
        verificationPlace: values.verificationPlace,
        ostRnuPspId: data.ostRnuPspId,
        preparedOn: values.preparedOn.format(
          moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
        ), // дата подготовки
        verificationSchedulesId: data.verificationSchedulesId,
        verificatedOn: values.verificatedOn.format(
          moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
        ), // дата проведения
      };
      await axios.put(
        `${apiBase}${ApiRoutes.VerificationActs}/${data.id}`,
        preparedValues
      );
      await dispatch(getVerificationActsPage());
      setLoading(false);
      onClose();
    } catch (e) {
      message.error({
        content: getErrorMessage(e, undefined, "response.data.message"),
        duration: 2,
      });
      setLoading(false);
    }
  };

  return (
    <EditVerificationActModal
      visible={visible}
      onClose={onClose}
      onEdit={handleCreateScheduledAct}
      initialValues={data}
      loading={loading}
    />
  );
};
