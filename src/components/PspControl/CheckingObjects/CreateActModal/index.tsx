import React, { FC } from "react";
import { message } from "antd";
import axios from "axios";
import moment from "moment";

import { apiBase, getErrorMessage } from "../../../../utils";
import { ApiRoutes } from "../../../../api/api-routes.enum";
import {
  ActSchedule,
  ActUnSchedule,
  CreateVerificationActModal as Modal
} from "./CreateVerificationActModal";
import { IdType } from "../../../../types";
import { history } from "../../../../history/history";

interface CreateActModalProps {
  visible: boolean;
  onClose: () => void;
  pspId: IdType;
  ownType: number;
}

export const CreateVerificationActModal: FC<CreateActModalProps> = ({
  visible,
  onClose,
  pspId,
  ownType
}) => {
  const handleCreateUnScheduledAct = async (values: ActUnSchedule) => {
    try {
      const preparedValues = {
        verificationPlace: values.verificationPlace,
        inspectedTypeId: values.inspectedTypeId,
        ostRnuPspId: pspId,
        preparedOn: values.preparedOn.format(
          moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
        ), // дата подготовки
        verificationLevelId: values.verificationLevelId,
        checkTypeId: values.checkTypeId,
        verificatedOn: values.verificatedOn.format(
          moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
        ) // дата проведения
      };
      const response = await axios.post(
        `${apiBase}${ApiRoutes.VerificationActs}/notinplan/psp/${pspId}`,
        preparedValues
      );
      history.push(`/pspcontrol/verification-acts/${response.data.id}`);
    } catch (e) {
      message.error(e.message);
      console.error(e.message);
    }
  };

  const handleCreateScheduledAct = async (values: ActSchedule) => {
    try {
      const preparedValues = {
        verificationPlace: values.verificationPlace,
        inspectedTypeId: values.inspectedTypeId,
        ostRnuPspId: pspId,
        preparedOn: values.preparedOn.format(
          moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
        ), // дата подготовки
        verificationSchedulesId: values.scheduleId,
        verificatedOn: values.verificatedOn.format(
          moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
        ) // дата проведения
      };
      const response = await axios.post(
        `${apiBase}${ApiRoutes.VerificationActs}`,
        preparedValues
      );
      history.push(`/pspcontrol/verification-acts/${response.data}`);
    } catch (e) {
      message.error({
        content: getErrorMessage(e, undefined, 'response.data.message'),
        duration: 2,
      });
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      pspId={pspId}
      ownType={ownType}
      onCreateScheduled={handleCreateScheduledAct}
      onCreateUnScheduled={handleCreateUnScheduledAct}
    />
  );
};
