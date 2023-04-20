import { Spin } from "antd";
import { Formik } from "formik";
import { Form, FormItem, DatePicker, Checkbox, TreeSelect } from "formik-antd";
import { FormFields, InitialFormValues } from "./constants";
import { FC, Key } from "react";
import moment, { Moment } from "moment";
import { SqlTree } from "classes/SqlTree";
import locale from "antd/lib/date-picker/locale/ru_RU";
import { ListFilterBase } from "interfaces";

const { RangePicker } = DatePicker;

interface FilterProps {
  isLoading: boolean;
  handleSubmitFilterForm: any;
  eventTypesTree: SqlTree[];
  appliedFilter: ListFilterBase;
  currentEventTypesKeys: Key[];
  dateRange:  [Moment, Moment]

}
export const Filter: FC<FilterProps> = ({
  isLoading,
  handleSubmitFilterForm,
  eventTypesTree,
  appliedFilter,
  currentEventTypesKeys,
  dateRange
}) => {
  return (
    <Spin spinning={isLoading}>
      <Formik
        initialValues={InitialFormValues}
        onSubmit={handleSubmitFilterForm}
      >
        {(props) => {
          const submitForm = props.submitForm;
          return (
            <Form layout="vertical">
              <FormItem name={FormFields.DateRange} label="Даты">
                <RangePicker
                  format={"DD.MM.YYYY"}
                  name={FormFields.DateRange}
                  onChange={submitForm}
                  locale={locale}
                  value={dateRange}
                />
              </FormItem>
              <FormItem name={FormFields.ForExecution}>
                <Checkbox name={FormFields.ForExecution} checked={appliedFilter.filter.forExecution} onChange={submitForm}>
                  К исполнению
                </Checkbox>
              </FormItem>
              <FormItem name={FormFields.OnlyUnread}>
                <Checkbox name={FormFields.OnlyUnread} checked={appliedFilter.filter.onlyUnread} onChange={submitForm}>
                  Только непрочитанные
                </Checkbox>
              </FormItem>
              <FormItem name={FormFields.EventTypes} label="Тип события">
                <TreeSelect
                  name={FormFields.EventTypes}
                  allowClear
                  showSearch
                  filterTreeNode
                  treeNodeFilterProp={"title"}
                  treeCheckable
                  style={{ width: "100%", maxHeight: "25px" }}
                  maxTagCount={1}
                  maxTagTextLength={14}
                  placeholder="Выберите тип события"
                  onChange={submitForm}
                  treeData={eventTypesTree}
                  notFoundContent={"Нет данных"}
                  value={currentEventTypesKeys}
                  defaultValue={currentEventTypesKeys}
                />
              </FormItem>
            </Form>
          );
        }}
      </Formik>
    </Spin>
  );
};
