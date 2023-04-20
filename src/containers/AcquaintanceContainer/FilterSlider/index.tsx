import { FC } from "react";
import {
  Typography,
  DatePicker,
  Checkbox,
  Layout,
  Space,
  Row,
  Col,
  Spin,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import ruLocale from "antd/es/date-picker/locale/ru_RU";
import update from "immutability-helper";

import { SearchTree } from "components/SearchTree";
import { AcquaintanceStore } from "slices/pspControl/acquaintance/types";
import { getAcquaintanceItemsBySelectedTreeFilterItemThunk } from "thunks/pspControl/acquaintance";
import { OwnedType, StateType } from "../../../types";
import {
  setInfoRequest,
  toggleOstRnuInfoModalVisibility,
} from "slices/ostRnuInfo";
import { SqlTree } from "classes/SqlTree";
import { setAppliedFilter } from "slices/pspControl/acquaintance";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import "../styles.css";

const { Sider } = Layout;
const { Title } = Typography;

export const FilterSider: FC = () => {
  const dispatch = useDispatch();
  const { appliedFilter, selectedTreeNode, loading } = useSelector<
    StateType,
    AcquaintanceStore
  >((state) => state.acquaintance);

  const handleOwnedFilterChangedCallback = (type: OwnedType) => {
    const filter = update(appliedFilter, {
      filter: {
        treeFilter: {
          isOwn: { $set: type },
        },
      },
      pageIndex: { $set: 1 },
    });

    dispatch(setAppliedFilter(filter));
  };

  const onSelectTreeNode = (_: React.Key[], info: any) => {
    const node = info.node;

    dispatch(getAcquaintanceItemsBySelectedTreeFilterItemThunk(node));
  };

  const handleOpenOstRnuInfoModal = (node: SqlTree) => {
    dispatch(toggleOstRnuInfoModalVisibility());
    dispatch(setInfoRequest(node));
  };

  const handleAcqForUserCheck = (e: CheckboxChangeEvent) => {
    const adjustedFilter = {
      ...appliedFilter,
      filter: {
        ...appliedFilter.filter,
        acquaintanceMark: e.target.checked,
      },
    };
    dispatch(setAppliedFilter(adjustedFilter));
  };

  return (
    <Sider className="acquaintance__sider ">
      <div className="filter-search-tree">
        <Title level={4}>Фильтр</Title>
        <Checkbox style={{ marginBottom: 8 }} disabled={loading} onChange={handleAcqForUserCheck}>
          Отметка об ознакомлении
        </Checkbox>
        <Spin spinning={loading} wrapperClassName={"spinnerStyled"}>
          <SearchTree
            isSiEq={false}
            className="filter-search-tree__search-tree"
            treeViewName="PspTreeAll"
            onSelectCallback={onSelectTreeNode}
            ownedFilterChangedCallback={handleOwnedFilterChangedCallback}
            ownFilterValue={appliedFilter.filter.treeFilter.isOwn}
            currentNodeKey={selectedTreeNode.key}
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
