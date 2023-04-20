import React from "react";
import _, { divide } from "lodash";
import classNames from "classnames/bind";
import { Spin, Tabs } from "antd";
import { Formik, FormikProps } from "formik";
import { Form } from "formik-antd";
import { FilterTabPane } from "./components/TabPane";
import { FilterList } from "./components/FilterList";
import { IFiltersDescription } from "../../types";
import { TabsFilterOptionsType } from "./types";
import {
  groupFilterListByGroup,
  serializeValuesForFetchSelectOptions
} from "./utils";
import styles from "./TabsFilter.module.css";

const cx = classNames.bind(styles);

interface IProps<T> {
  className?: string;
  filterList: IFiltersDescription[];
  isLoading?: boolean;
  handleFetchSelectOptions: (
    name: string,
    values: any,
    controller: string
  ) => Promise<TabsFilterOptionsType>;
  onSubmit: (values: T) => void;
}

export function TabsFilter<T extends object = any>(props: IProps<T>) {
  const {
    className,
    filterList,
    isLoading,
    handleFetchSelectOptions,
    onSubmit
  } = props;

  const formikRef = React.useRef<FormikProps<T>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const getSelectOptions = async (name: string, controller: string) => {
    const values = formikRef.current?.values;

    if (values) {
      const adjustedValues = serializeValuesForFetchSelectOptions<T>(
        name,
        values,
        filterList
      );

      const options = await handleFetchSelectOptions(
        name,
        adjustedValues,
        controller
      );

      return options;
    }

    return [];
  };

  const adjustedFilterList = groupFilterListByGroup(filterList);

  return (
    <Spin wrapperClassName={cx(className, "container")} spinning={isLoading}>
      <Formik innerRef={formikRef} initialValues={{}} onSubmit={onSubmit}>
        {props => {
          return (
            <Form layout="vertical">
              {Array.isArray(adjustedFilterList) ? (
                <FilterList
                  filterList={adjustedFilterList}
                  submitForm={props.submitForm}
                  getSelectOptions={getSelectOptions}
                />
              ) : (
                <Tabs>
                  {_.map(adjustedFilterList, (filterList, displayGroupName) => {
                    return (
                      <FilterTabPane
                        key={displayGroupName}
                        displayGroupName={displayGroupName}
                        filterList={filterList}
                        submitForm={props.submitForm}
                        getSelectOptions={getSelectOptions}
                      />
                    );
                  })}
                </Tabs>
              )}
            </Form>
          );
        }}
      </Formik>
    </Spin>
  );
}

TabsFilter.defaultProps = {
  isLoading: false
};
