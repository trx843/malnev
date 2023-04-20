import { FC, useEffect } from "react";
import { Form, Row } from "antd";
import { FieldData, IFiltersDescription } from "../../../../../../../../types";
import { useAntdFormik } from "../../../../../../../../customHooks/useAntdFormik";
import { validationSchema } from "../../NewViolation/helpers";
import { serializeValuesForFetchSelectOptions } from "../../../../../../../TabsFilter/utils";
import { TabsFilterOptionsType } from "../../../../../../../TabsFilter/types";
import { FilterField } from "./Field";
import { TypeFields } from "../../../../../../../TabsFilter/constants";

interface FilterFieldsProps {
  filterConfig: IFiltersDescription[];
  getOptions: (
    name: string,
    values: any,
    controller: string
  ) => Promise<TabsFilterOptionsType>;
  onChangeField: any;
}

const transformValues = (config: IFiltersDescription[]) =>
  config.reduce(
    (acc, field) => ({
      ...acc,
      [field.propName]: field.typeField === TypeFields.Select ? [] : ""
    }),
    {}
  );

export const FilterFields: FC<FilterFieldsProps> = ({
  filterConfig,
  onChangeField,
  getOptions
}) => {
  const formik = useAntdFormik({
    validateOnChange: false,
    initialValues: {},
    validationSchema,
    onSubmit: values => {
      console.log(values);
    }
  });

  useEffect(() => {
    formik.setValues(transformValues(filterConfig));
  }, [filterConfig]);

  const handleChange = (changedFields: FieldData[]) => {
    const value = formik.onFieldChange(changedFields[0]);
    onChangeField({ ...formik.values, ...value });
  };

  const handleGetOptions = async (name: string, controller: string) => {
    const adjustedValues = serializeValuesForFetchSelectOptions(
      name,
      formik.values,
      filterConfig
    );

    const options = await getOptions(name, adjustedValues, controller);

    await formik.setFieldValue(name, options);
  };

  return (
    <Form
      fields={formik.fields}
      layout="vertical"
      onFieldsChange={handleChange}
      onFinishFailed={formik.setErrorsAntd}
    >
      <Row gutter={[16, 1]}>
        {filterConfig.map(field => (
          <FilterField
            {...field}
            key={field.name}
            formik={formik}
            getSelectOptions={handleGetOptions}
          />
        ))}
      </Row>
    </Form>
  );
};
