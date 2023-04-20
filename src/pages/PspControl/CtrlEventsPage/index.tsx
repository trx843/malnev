import React from "react";
import classNames from "classnames/bind";
import {  PageHeader, Pagination, Spin, Typography } from "antd";
import { history } from "../../../history/history";
import { SearchTree } from "../../../components/SearchTree";
import { CtrlEventsTable } from "./components/CtrlEventsTable";
import usePresenter from "./presenter";
import styles from "./ctrlEventsPage.module.css";
import { Filter } from "./components/Filter";

const { Title } = Typography;

const cx = classNames.bind(styles);

export const CtrlEventsPage: React.FC = () => {
  const {
    onSelectTreeNode,
    selectedTreeNode,
    pageInfo,
    handleChangePagination,
    isLoading,
    handleOwnedFilterChangedCallback,
    eventsList,
    handleSubmitFilterForm,
    eventTypesTree,
    appliedFilter,
    currentEventTypesKeys,
    dateRange
  } = usePresenter();
  return (
    <Spin wrapperClassName={cx("spin")} spinning={isLoading}>
      <PageHeader
        style={{ paddingTop: 0 }}
        title="События. Надзор."
        onBack={() => history.push("/")}
      />

      <div className={cx("content")}>
        <div className={cx("filter")}>
          <Title level={4}>Фильтр</Title>
          <Filter
            isLoading={isLoading}
            eventTypesTree={eventTypesTree}
            handleSubmitFilterForm={handleSubmitFilterForm}
            appliedFilter={appliedFilter}
            currentEventTypesKeys={currentEventTypesKeys}
            dateRange={dateRange}
          />
          <SearchTree
            className={cx("searchTree")}
            isSiEq={false}
            treeViewName="PspTree"
            onSelectCallback={onSelectTreeNode}
            ownedFilterChangedCallback={handleOwnedFilterChangedCallback}
            ownFilterValue={appliedFilter.filter.treeFilter.isOwn}
            currentNodeKey={selectedTreeNode.key}
            defaultExpandedKeys={["all"]}
          />
        </div>
        <div className={cx("right-bar")}>
          <CtrlEventsTable eventsList={eventsList} />
          <Pagination
            className={cx("pagination")}
            current={pageInfo.pageNumber}
            pageSize={pageInfo.pageSize}
            total={pageInfo.totalItems}
            onChange={handleChangePagination}
            disabled={isLoading}
            size="small"
          />
        </div>
      </div>
    </Spin>
  );
};
