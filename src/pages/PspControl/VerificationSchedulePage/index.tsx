import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import update from "immutability-helper";
import { Button, Layout, PageHeader, Pagination, Spin, Typography } from "antd";
import { FilterFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { history } from "../../../history/history";
import { OwnedType, StateType } from "../../../types";
import {
  IVerificationScheduleStore,
  setAppliedFilter,
  setPageInfo,
  toggleSiderCollapse,
} from "../../../slices/pspControl/verificationSchedule";
import { SearchTree } from "../../../components/SearchTree";
import {
  getVerificationSchedulesListBySelectedTreeNodeThunk,
  getVerificationSchedulesListThunk,
} from "../../../thunks/pspControl/verificationSchedule";
import { SqlTree } from "../../../classes/SqlTree";
import { ModalFilters } from "./components/ModalFilters";
import { AppliedFilterTags } from "./components/AppliedFilterTags";
import { VerificationScheduleTable } from "./components/VerificationScheduleTable";
import {
  setInfoRequest,
  toggleOstRnuInfoModalVisibility,
} from "../../../slices/ostRnuInfo";
import styles from "./verificationSchedulePage.module.css";
import { CtrlBreadcrumb } from "components/CtrlBreadcrumb";

const { Title } = Typography;
const { Sider } = Layout;

const cx = classNames.bind(styles);

export const VerificationSchedulePage: React.FC = () => {
  const pageName = "Графики проверки";
  const dispatch = useDispatch();

  const {
    pageInfo,
    selectedTreeNode,
    appliedFilter,
    isVerificationScheduleListLoading,
    isDeletingVerificationSchedule,
    isSiderCollapsed,
  } = useSelector<StateType, IVerificationScheduleStore>(
    (state) => state.verificationSchedule
  );

  const [isModalFilterVisible, setModalFilterVisibility] =
    React.useState(false);

  React.useEffect(() => {
    dispatch(getVerificationSchedulesListThunk());
  }, [appliedFilter]);

  const toggleModalFilterVisibility = () =>
    setModalFilterVisibility(!isModalFilterVisible);

  const onSelectTreeNode = (selectedKeys: React.Key[], info: any) => {
    dispatch(getVerificationSchedulesListBySelectedTreeNodeThunk(info.node));
  };

  const handleOwnedFilterChangedCallback = (type: OwnedType) => {
    const updatedFilter = update(appliedFilter, {
      filter: {
        treeFilter: {
          isOwn: { $set: type },
        },
      },
    });

    dispatch(setAppliedFilter(updatedFilter));
  };

  const handleChangePagination = (page: number) => {
    const updatedFilter = update(appliedFilter, {
      pageIndex: { $set: page },
    });
    dispatch(setAppliedFilter(updatedFilter));
  };

  const handleOpenOstRnuInfoModal = (node: SqlTree) => {
    dispatch(toggleOstRnuInfoModalVisibility());
    dispatch(setInfoRequest(node));
  };

  return (
    <Spin
      wrapperClassName={cx("spin")}
      spinning={
        isVerificationScheduleListLoading || isDeletingVerificationSchedule
      }
    >
      <CtrlBreadcrumb pageName={pageName} />
      <PageHeader style={{ padding: "0 0 8px" }} title={pageName} />

      <div className={cx("content")}>
        <Sider className={cx("sider")} width={280} collapsed={isSiderCollapsed}>
          <div className={cx("filter")}>
            <div
              className={cx("filter-title", {
                "filter-title-sider-collapsed": isSiderCollapsed,
              })}
            >
              {!isSiderCollapsed && <Title level={4}>Фильтр</Title>}
              <Button
                style={{ color: "#d9d9d9" }}
                onClick={() => dispatch(toggleSiderCollapse())}
                icon={isSiderCollapsed ? <RightOutlined /> : <LeftOutlined />}
                type="link"
              />
            </div>

            <SearchTree
              className={cx("search-tree", {
                "search-tree-hidden": isSiderCollapsed,
              })}
              isSiEq={false}
              treeViewName="PspTree"
              onSelectCallback={onSelectTreeNode}
              ownedFilterChangedCallback={handleOwnedFilterChangedCallback}
              ownFilterValue={appliedFilter.filter.treeFilter.isOwn}
              currentNodeKey={selectedTreeNode.key}
              titleRenderConfig={{
                onClickIcon: handleOpenOstRnuInfoModal,
              }}
              isPspCtrl={true}
            />
          </div>
        </Sider>

        <div className={cx("right-bar")}>
          <div className={cx("modal-filters-control")}>
            <Button
              type="link"
              icon={<FilterFilled />}
              onClick={toggleModalFilterVisibility}
            >
              Раскрыть фильтр
            </Button>
            <AppliedFilterTags />
          </div>

          <VerificationScheduleTable />

          <Pagination
            className={cx("pagination")}
            current={pageInfo.pageNumber}
            pageSize={pageInfo.pageSize}
            total={pageInfo.totalItems}
            onChange={handleChangePagination}
            disabled={isVerificationScheduleListLoading}
            size="small"
            showSizeChanger={false}
          />
        </div>
      </div>

      <ModalFilters
        visible={isModalFilterVisible}
        onClose={toggleModalFilterVisibility}
      />
    </Spin>
  );
};
