import * as Yup from "yup";

export const validationSchema = Yup.object({
  jobTitle: Yup.string().required("Поле обязательно к заполнению!").trim(),
  organizationName: Yup.string()
    .required("Поле обязательно к заполнению!")
    .trim(),
  fullName: Yup.string().required("Поле обязательно к заполнению!").trim(),
  isInPresence: Yup.bool(),
});
