import * as Yup from "yup";

export const ALLOW_VALUES = ["АО “Транснефть - Метрология”"];

export const validationSchema = Yup.object({
  partyName: Yup.string()
    .when("ctoName", {
      is: (ctoName) => !ALLOW_VALUES.includes(ctoName),
      then: Yup.string().required("Поле обязательно к заполнению!"),
    })
    .trim(),
  ctoName: Yup.string().required("Поле обязательно к заполнению!").trim(),
});
