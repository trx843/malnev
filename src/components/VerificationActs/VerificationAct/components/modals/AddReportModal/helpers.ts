import * as Yup from "yup";

export const validationSchema = Yup.object({
  name: Yup.string()
    .required("Поле обязательно к заполнению!")
    .trim(),
  pageCount: Yup.number().required("Поле обязательно к заполнению!")
});
