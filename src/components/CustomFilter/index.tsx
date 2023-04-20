import { Formik } from "formik";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilter } from "../../actions/customfilter";
import {
  ICustomFilterState,
  setCustomFilterConfig,
} from "../../slices/customFilter";
import {
  FilterCollapse,
  FilterWrapper,
} from "../../styles/commonStyledComponents";
import { StateType } from "../../types";
import { FilterForm } from "./filterForm";

interface ICustomFilterProps {
  isSubmitting: boolean;
  changeFilterCallback: (filter: any) => Promise<void>;
  applyFilterCallback: (filter: any) => Promise<void>;
}
export const CustomFilter: FC<ICustomFilterProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const customFilterStore = useSelector<StateType, ICustomFilterState>(
    (state) => state.customFilter
  );
  useEffect(() => {
    try {
      Promise.resolve().then(async () => {
        setIsLoading(true);
        const response = await getFilter(customFilterStore.baseUrl);
        if (response) {
          dispatch(setCustomFilterConfig(response));
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <FilterWrapper>
      <FilterCollapse defaultActiveKey={["filter"]} ghost>
        <FilterCollapse.Panel header="Фильтр" key="filter">
          <Formik
            initialValues={{}}
            onSubmit={async (data: any) => {
              await props.changeFilterCallback(data);
            }}
          >
            {({ submitForm, values, setFieldValue }) => {
              return (
                <FilterForm
                  setFieldValue={setFieldValue}
                  isSubmitting={props.isSubmitting}
                  submitForm={submitForm}
                  values={values}
                  changeFilterCallback={props.changeFilterCallback}
                  applyFilterCallback={props.applyFilterCallback}
                />
              );
            }}
          </Formik>
        </FilterCollapse.Panel>
      </FilterCollapse>
    </FilterWrapper>
  );
};
