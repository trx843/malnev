import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { Formik } from "formik";
import { Form, FormItem, DatePicker, Select } from "formik-antd";
import {
  IKsPpILProgramsStore,
  setListFilter,
} from "../../../../../slices/pspControl/ksPpILPrograms";
import {
  FormFields,
  OwnThirdPartyOptions,
  TransportedProductAllOptionValue,
  TransportedProductOptions,
} from "./constants";
import { IFormValues } from "./types";
import { StateType } from "../../../../../types";
import { getInitialFormValues, serializeValues } from "./utils";
import locale from "antd/lib/date-picker/locale/ru_RU";
import { OwnTypes } from "enums";

export const Filter: React.FC = () => {
  const dispatch = useDispatch();

  const { listFilter, isKsPpILProgramListLoading } = useSelector<
    StateType,
    IKsPpILProgramsStore
  >((state) => state.ksPpILPrograms);

  const handleSubmitForm = (values: IFormValues) => {
    const serializedValues = serializeValues(values);

    dispatch(
      setListFilter({
        ...listFilter,
        filter: {
          ...listFilter.filter,
          ...serializedValues,
        },
      })
    );
  };



  return (
    <Spin spinning={isKsPpILProgramListLoading}>
      <Formik initialValues={getInitialFormValues(listFilter)} onSubmit={handleSubmitForm}>
        {(props) => {
          const submitForm = props.submitForm;

          return (
            <Form layout="vertical">
              <FormItem
                name={FormFields.OwnThirdParty}
                label="Собственный/сторонний ПСП"
              >
                <Select
                  name={FormFields.OwnThirdParty}
                  options={OwnThirdPartyOptions}
                  onChange={submitForm}
                />
              </FormItem>
              <FormItem
                name={FormFields.DateOfIntroduction}
                label="Дата введения"
              >
                <DatePicker
                  name={FormFields.DateOfIntroduction}
                  onChange={submitForm}
                  style={{ width: "100%" }}
                  placeholder="ДД.ММ.ГГГГ"
                  format="DD.MM.YYYY"
                  locale={locale}
                />
              </FormItem>
              <FormItem
                name={FormFields.TransportedProduct}
                label="Транспортируемый продукт"
              >
                <Select
                  name={FormFields.TransportedProduct}
                  options={TransportedProductOptions}
                  onChange={submitForm}
                />
              </FormItem>
            </Form>
          );
        }}
      </Formik>
    </Spin>
  );
};
