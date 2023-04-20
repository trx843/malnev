import { OsuTypes } from "enums";
import _ from "lodash";
import isEmpty from "lodash/isEmpty";
import maxBy from "lodash/maxBy";
import { IViolationListModel } from "slices/verificationActs/verificationAct/types";
import * as Yup from "yup";
import { IdentifiedVItem } from "../../../../classes";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export const transformEmptyValues = (
  value: IViolationListModel,
  items: IViolationListModel[],
) => {
  const prepared = {
    ...value
  };
  return Object.keys(prepared).reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        (prepared[key as keyof typeof value] as any) === EMPTY_GUID
          ? null
          : prepared[key as keyof typeof value]
    }),
    {}
  );
};

export const validationSchema = Yup.object({
  areaOfResponsibility: Yup.string()
    .required("Поле обязательно к заполнению!")
    .nullable(),
  siknLabRsuId: Yup.string()
    .required("Поле обязательно к заполнению!")
    .nullable(),
  typicalViolationNumber: Yup.string().nullable(),
  isDuplicate: Yup.bool().nullable(),
  classifficationTypeId: Yup.string().nullable(),
  specialOpinion: Yup.string()
    .trim()
    .nullable(),
  sourceRemarkId: Yup.string()
    .required("Поле обязательно к заполнению!")
    .nullable(),
  violations: Yup.array().of(
    Yup.object().shape({
      violationText: Yup.string()
        .required("Поле обязательно к заполнению!")
        .trim(),
      pointNormativeDocuments: Yup.string()
        .required("Поле обязательно к заполнению!")
        .trim()
    })
  )
});

// кастомный валидатор поля Система учета/ИЛ(Добавлять одновременно ОСУ/РСУ и ИЛ нельзя; Добавлять одновременно ОСУ и РСУ можно)
export const getSiknLabRsuValidator = (checkingObjectViolationsOptions: any[]) => ({
  validator(rule, siknLabRsuIds) {
    const selectedOptions = _.intersectionWith(checkingObjectViolationsOptions, siknLabRsuIds, (arrValue, othArrValue) => arrValue.value === othArrValue)

    const isAllIlObjects = selectedOptions.every(so => so.data.osuTypeId === OsuTypes.il)

    if (isAllIlObjects) return Promise.resolve();

    const isAllOsuOrRsuObjects = selectedOptions.every(so => so.data.osuTypeId !== OsuTypes.il)

    if (isAllOsuOrRsuObjects) return Promise.resolve();

    return Promise.reject(new Error('Добавлять одновременно РСУ/ОСУ и ИЛ нельзя'));
  }
})
