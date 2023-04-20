import { useEffect, useMemo } from "react";
import { FormikConfig, useFormik } from "formik";
import update from "immutability-helper";

import { ErrorAntd, FieldData } from "../types";
import { getFieldsData, setErrorsFromAntd } from "../utils";

export const useAntdFormik = <T = any>(config: FormikConfig<T>) => {
  const formik = useFormik(config);

  const handleOnChange = (field: FieldData) => {
    const [key, value] = Object.entries(field)[0];
    formik.setFieldValue(key, value);
  };

  const handleError = ({
    errorFields
  }: {
    values: any;
    errorFields: ErrorAntd;
    outOfDate: boolean;
  }) => {
    formik.setErrors(setErrorsFromAntd(errorFields));
  };

  const handleChangeField = (
    field: FieldData,
    data?: any
  ): Record<string, any> | null => {
    if (!field) return null;

    if (Array.isArray(field.name) && field.name.length > 1) {
      const value = {
        listKey: field.name[0],
        listIndex: field.name[1] as number,
        value: String(field.name[2])
      };

      const list = formik.values[value.listKey as keyof typeof formik.values];

      if (Array.isArray(list)) {
        if (list[value.listIndex]) {
          const updatedList = update(list as any[], {
            [value.listIndex]: { [value.value]: { $set: field.value } }
          });

          formik.setFieldValue(String(value.listKey), updatedList);
          return { [String(value.listKey)]: updatedList };
        } else {
          const updatedList = update(list as any[], {
            [value.listIndex]: { $set: { [value.value]: field.value } }
          });

          formik.setFieldValue(String(value.listKey), updatedList);

          return { [String(value.listKey)]: updatedList };
        }
      }
    }

    if (Array.isArray(field.name) && field.name.length === 1) {
      const key = String(field.name[0]);
      formik.setFieldValue(key, field.value);
      return { [key]: field.value };
    }

    return null;
  };

  useEffect(() => {
    () => formik.resetForm();
  }, []);

  const fields = useMemo(
    () => getFieldsData({ values: formik.values, errors: formik.errors }),
    [formik.values, formik.errors]
  );

  return {
    ...formik,
    fields,
    setFieldAntdValue: handleOnChange,
    onFieldChange: handleChangeField,
    setErrorsAntd: handleError
  };
};
