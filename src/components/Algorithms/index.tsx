import { Layout, Pagination } from "antd";
import Title from "antd/lib/typography/Title";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlgHistory } from "../../classes/AlgHistory";
import {
  AlgorithmModalsIds,
  AlgorithmsSlice,
  setPageIndex,
  setSelectedAlgorithmId,
} from "../../slices/algorithmStatus/algorithms";
import {
  getAlgorithmHistoryThunk,
  getAlgorithmTreeThunk,
} from "../../thunks/algorithmStatus/algorithms";
import { ObjectFields, StateType } from "../../types";
import { ItemsTable } from "../ItemsTable";
import { WithLoading } from "../shared/WithLoading";
import { ConfigurationModal } from "./ConfigurationModal";
import { AlgorithmHeader } from "./AlgorithmHeader";
import { OperandModal } from "./OperandModal";
import { returnRowClassRules } from "./utils";
import "./styles.css";
import { AlgorithmTree } from "../AlgorithmTree";

const { Content, Sider } = Layout;

export const Algorithms: FC = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const algorithms = useSelector<StateType, AlgorithmsSlice>(
    (state) => state.algorithms
  );

  const {
    treeData,
    selectedAlgorithmId,
    openedModal,
    filterParams,
    algorithmHistory,
    pagination,
  } = algorithms;

  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      await dispatch(getAlgorithmTreeThunk());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (selectedAlgorithmId) await dispatch(getAlgorithmHistoryThunk());
      setIsLoading(false);
    })();
  }, [selectedAlgorithmId, filterParams, page]);

  const onTreeSelect = (keys: string[]) => {
    const algorithmKey = keys[0].split("#")[1];
    if (algorithmKey) {
      dispatch(setSelectedAlgorithmId(algorithmKey));
    }
  };

  const tableData = algorithmHistory?.algHistory.entities;

  const onPageChange = (page: number) => {
    setPage(page);
    dispatch(setPageIndex(page));
  };

  return (
    <Layout style={{ height: "100%" }}>
      <Sider width={450} style={{ background: "white", overflowY: "scroll" }}>
        <div style={{ padding: 16 }}>
          <Title level={4}>Список алгоритмов</Title>
        </div>
        <div style={{ padding: "0 16px" }}>
          <AlgorithmTree
            onSelect={onTreeSelect}
            autoExpandParent={true}
            treeData={treeData ? treeData.servicesInfo : []}
            withStatus
          />
        </div>
      </Sider>

      <Content
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AlgorithmHeader />
        <WithLoading isLoading={isLoading} loaderStyles={{ height: "100%" }}>
          <ItemsTable<AlgHistory>
            items={tableData || []}
            fields={new ObjectFields(AlgHistory).getFields()}
            hiddenColumns={["id", "algorithm_ID", "recalculation"]}
            height="100%"
            rowClassRules={returnRowClassRules()}
          />
        </WithLoading>
        <Pagination
          current={pagination.pageNumber}
          total={pagination.totalItems}
          pageSize={pagination.pageSize}
          onChange={onPageChange}
          showSizeChanger={false}
          size={"small"}
        />
      </Content>

      <ConfigurationModal
        isOpen={openedModal === AlgorithmModalsIds.AlgConfiguration}
      />
      <OperandModal isOpen={openedModal === AlgorithmModalsIds.AlgOperands} />
    </Layout>
  );
};
