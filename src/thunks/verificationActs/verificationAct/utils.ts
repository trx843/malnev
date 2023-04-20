import { notification } from "antd";

export const getVerificationActCompleteCreatingError = (ids: string[]) => {
  const idsString = ids.join(",");

  return `Невозможно подписать акт, так как нарушения ${idsString} имеют незаполненное поле "Номер и наименование классификации". Необходимо заполнить поле для указанных нарушений.`;
};


