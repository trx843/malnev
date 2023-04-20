import React, { FC } from "react";
import { Checkbox, Layout, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import { useDispatch, useSelector } from "react-redux";

import { SearchTree } from "../../SearchTree";
import { Nullable, OwnedType, StateType } from "../../../types";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import { getVerificationActBySelectedTreeThunk } from "../../../thunks/verificationActs";
import { SqlTree } from "../../../classes/SqlTree";
import {
  setInfoRequest,
  toggleOstRnuInfoModalVisibility,
} from "../../../slices/ostRnuInfo";
import styles from "../styles.module.css";
import update from "immutability-helper";
import { setAppliedFilter } from "slices/verificationActs/verificationActs";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const { Sider } = Layout;

export const FilterSider: FC = () => {
  const dispatch = useDispatch();

  const data = useSelector<
    StateType,
    {
      pending: boolean;
      ownFilterValue: Nullable<boolean>;
      currentNodeKey: string;
      appliedFilter: ListFilterBase;
    }
  >((state) => ({
    pending: state.verificationActs.pending,
    ownFilterValue: state.verificationActs.selectedTreeNode.owned,
    currentNodeKey: state.verificationActs.selectedTreeNode.key,
    appliedFilter: state.verificationActs.appliedFilter,
  }));

  const onSelectTreeNode = (
    selectedKeys: React.Key[],
    info: { node: SelectedNode }
  ) => {
    const change = info.node;

    dispatch(getVerificationActBySelectedTreeThunk(change));
  };

  const handleOpenOstRnuInfoModal = (node: SqlTree) => {
    dispatch(toggleOstRnuInfoModalVisibility());
    dispatch(setInfoRequest(node));
  };

  const handleOwnedFilterChangedCallback = async (type: OwnedType) => {
    const updatedFilter = update(data.appliedFilter, {
      filter: {
        treeFilter: {
          isOwn: { $set: type },
        },
      },
    });

    await dispatch(setAppliedFilter(updatedFilter));
  };

  const setFilterOnNotClassifiedActsHandler = async (e) => {
    const updatedFilter = update(data.appliedFilter, {
      filter: {
        hasNotClassified: { $set: e.target.checked },
      },
    });

    await dispatch(setAppliedFilter(updatedFilter));
  };

  return (
    <Sider className={cx("verification-acts__sider")}>
      <div className={cx("filter-search-tree")}>
        <Title level={4}>Фильтр</Title>
        <Checkbox
          checked={data.appliedFilter.filter.hasNotClassified}
          onChange={setFilterOnNotClassifiedActsHandler}
          disabled={data.pending}
          style={{ marginBottom: 8 }}
        >
          Неклассифицированные акты
        </Checkbox>

        <Spin spinning={data.pending} wrapperClassName={styles.spinnerStyled}>
          <SearchTree
            isSiEq={false}
            className={cx("filter-search-tree__search-tree")}
            treeViewName={"PspTree"}
            onSelectCallback={onSelectTreeNode}
            ownedFilterChangedCallback={handleOwnedFilterChangedCallback}
            ownFilterValue={data.appliedFilter.filter.treeFilter.isOwn}
            currentNodeKey={data.currentNodeKey}
            titleRenderConfig={{
              onClickIcon: handleOpenOstRnuInfoModal,
            }}
            isPspCtrl={true}
          />
        </Spin>
      </div>
    </Sider>
  );
};
