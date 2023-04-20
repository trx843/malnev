import React from "react";
import { Tabs } from "antd";
import { FilterList } from "../FilterList";
import { IFiltersDescription } from "../../../../types";
import { TabsFilterOptionsType } from "../../types";

const { TabPane } = Tabs;

interface IProps {
  displayGroupName: string;
  filterList: IFiltersDescription[];
  submitForm: () => Promise<void>;
  getSelectOptions: (
    filterName: string,
    controller: string
  ) => Promise<TabsFilterOptionsType>;
}

export const FilterTabPane: React.FC<IProps> = ({
  displayGroupName,
  filterList,
  submitForm,
  getSelectOptions,
  ...tabPaneProps
}) => {
  return (
    <TabPane tab={displayGroupName} key={displayGroupName} {...tabPaneProps}>
      <FilterList
        filterList={filterList}
        submitForm={submitForm}
        getSelectOptions={getSelectOptions}
      />
    </TabPane>
  );
};
