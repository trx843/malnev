import moment from "moment";
import * as Yup from "yup";

export const RadioGroupValues = {
  add: "add",
  create: "create",
};

export enum FormFields {
  radioGroup = "radioGroup", // поле радио-группа
  verificationScheduleId = "verificationScheduleId", // поле график проверки
  verificationLevelId = "verificationLevelId", // Поле Уровень проверки
  checkTypeId = "checkTypeId", // Поле Тип проверки
  inspectionYear = "inspectionYear", // Поле Год проверки
}

export const InitialFormValues = {
  [FormFields.radioGroup]: RadioGroupValues.add,
  [FormFields.verificationScheduleId]: "",
  [FormFields.verificationLevelId]: null as unknown as number,
  [FormFields.checkTypeId]: "",
  [FormFields.inspectionYear]: moment().format(
    moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
  ),
};

export const ValidationSchema = Yup.object({
  [FormFields.verificationScheduleId]: Yup.string().when(
    [FormFields.radioGroup],
    {
      is: RadioGroupValues.add,
      then: Yup.string().required("Поле обязательно к заполнению!"),
    }
  ),
  [FormFields.verificationLevelId]: Yup.number()
    .nullable()
    .when([FormFields.radioGroup], {
      is: RadioGroupValues.create,
      then: Yup.number().nullable().required("Поле обязательно к заполнению!"),
    }),
  [FormFields.checkTypeId]: Yup.string().when([FormFields.radioGroup], {
    is: RadioGroupValues.create,
    then: Yup.string().required("Поле обязательно к заполнению!"),
  }),
});

export enum DictionariesNames {
  verificationSchedules = "verificationSchedules",
  verificationLevels = "verificationLevels",
}

export const InitDictionaries = {
  [DictionariesNames.verificationSchedules]: [],
  [DictionariesNames.verificationLevels]: [],
};
