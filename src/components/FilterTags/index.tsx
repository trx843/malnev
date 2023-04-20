import React, { FC, memo, useMemo } from "react";
import { Tag } from "antd";
import "./style.css";
import { IFilter, IFilterGroup } from "../CustomFilter/interfaces";
import isEmpty from "lodash/isEmpty";
import _ from "lodash";

type FilterListObject = Record<string, IFilter>;

interface GroupObject extends Omit<IFilterGroup, "filterList"> {
  filterList: FilterListObject;
}

type FilterGroupObject = Record<string, GroupObject>;

export type FilterTag = {
  filter: IFilter;
  title: string;
  key: string;
  group: string;
};

function transformFilterListDataToObject(groups: IFilterGroup[]) {
  return groups.reduce((acc, group) => {
    return {
      ...acc,
      [group.propName]: { ...group }
    };
  }, {});
}

function normalizeTagsByAppliedFiltersAndConfigObject(
  appliedFilter: Record<string, Record<string, any>>,
  data: any
): FilterTag[] {
  return Object.keys(appliedFilter)
    .reduce((acc, key): FilterTag[] => {
      if (!isEmpty(appliedFilter[key]) && _.has(data, key)) {
        return [
          ...acc,
          {
            key,
            group: key,
            filter: data[key].name,
            title: `${data[key].name}`
          }
        ];
      }
      return acc;
    }, [])
    .flat(1);
}

interface FiltersTagsProps {
  filterValues: Record<string, any>;
  filterGroupList: IFilterGroup[];
  onDelete?: (field: FilterTag) => void;
}

export const FiltersTags: FC<FiltersTagsProps> = memo(
  ({ onDelete, filterValues, filterGroupList }) => {
    const serializedFilters = useMemo(() => {
      const data = transformFilterListDataToObject(filterGroupList);
      return normalizeTagsByAppliedFiltersAndConfigObject(
        filterValues as any,
        data as any
      );
    }, [filterValues]);

    return (
      <div className="filters-tag__container">
        {serializedFilters.map(value => (
          <Tag
            key={value.key}
            closable
            className="filters-tag"
            onClick={() => onDelete?.(value)}
            onClose={() => onDelete?.(value)}
          >
            {value.title}
          </Tag>
        ))}
      </div>
    );
  }
);
