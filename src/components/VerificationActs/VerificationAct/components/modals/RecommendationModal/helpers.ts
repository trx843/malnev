import * as Yup from "yup";

export const validationSchema = Yup.object({
  recommendationsText: Yup.string()
    .required("Поле обязательно к заполнению!")
    .trim()
});
