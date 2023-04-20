import { ModalModes } from "components/ModalForAddingOrEditingEvent/constants";
import _ from "lodash";

export const isButtonEditAndDeleteVisible = (data: any) => {
  return !data._isFullWidthRow && !!data.actionPlan?.length;
};

export const isButtonCreateVisible = (data: any) => {
  return data.planIndex === data.subLength - 1;
};

export const isButtonSortVisible = (data: any) => {
  return data.isRowSpan;
};

export const getAdjustedValues = (data: any, mode: ModalModes) => {
  const maxSerial = _.maxBy(
    data.actionPlan,
    (item: any) => item.serial
  )?.serial;

  return {
    ...(mode === ModalModes.edit && { actionPlanId: data.plan.id }),
    serial: maxSerial ? maxSerial + 1 : 0,
    violationsId: data.violationsId,
    identifiedViolationsId: data.identifiedTypicalViolationId,
  };
};
