import React from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { Nullable, StateType } from "../../../types";
import { Button, PageHeader, Pagination, Spin, Typography } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import { Filter } from "./components/Filter";
import { ProgramTable } from "./components/ProgramTable";
import { ModalForCreatingAndReplacingProgram } from "./components/ModalForCreatingAndReplacingProgram";
import {
  IKsPpILProgramsStore,
  setPageInfo,
} from "../../../slices/pspControl/ksPpILPrograms";
import { ModalTypes } from "./components/ModalForCreatingAndReplacingProgram/constants";
import { IModalConfig } from "./types";
import { InitModalConfig, KsPpILProgramsElements } from "./constants";
import { getKsPpILProgramsThunk } from "../../../thunks/pspControl/ksPpILPrograms";
import styles from "./ksPpILPrograms.module.css";
import { ActionsEnum, Can } from "../../../casl";
import { elementId } from "./constants";
import { CtrlBreadcrumb } from "components/CtrlBreadcrumb";

const { Title } = Typography;

const cx = classNames.bind(styles);

export const KsPpILProgramsPage = () => {

  const pageName = "Программы КС ПСП и ИЛ";

  const dispatch = useDispatch();

  const { listFilter, pageInfo, isKsPpILProgramListLoading } = useSelector<
    StateType,
    IKsPpILProgramsStore
  >((state) => state.ksPpILPrograms);

  const [
    modalForCreatingAndReplacingProgramConfig,
    setModalForCreatingAndReplacingProgramConfig,
  ] = React.useState<IModalConfig>(InitModalConfig);

  const handleOpenModalForCreatingAndReplacingProgram = (
    type: ModalTypes = ModalTypes.none,
    id: Nullable<string> = null
  ) => {
    setModalForCreatingAndReplacingProgramConfig({
      type,
      id: id,
      visible: !modalForCreatingAndReplacingProgramConfig.visible,
    });
  };

  const handleChangePagination = (page: number) => {
    dispatch(
      setPageInfo({
        ...pageInfo,
        pageNumber: page,
      })
    );

    dispatch(
      getKsPpILProgramsThunk({
        ...listFilter,
        pageIndex: page,
      })
    );
  };

  return (
    <Spin
      wrapperClassName={cx("spin-wrapper")}
      spinning={isKsPpILProgramListLoading}
    >
      <CtrlBreadcrumb pageName={pageName} />
      <PageHeader style={{ padding: "0 0 8px" }} title={pageName} />
      <div className={cx("content")}>
        <div className={cx("filter")}>
          <Title level={4}>Фильтр</Title>
          <Filter />
        </div>

        <div className={cx("right-bar")}>
          <Can
            I={ActionsEnum.View}
            a={elementId(KsPpILProgramsElements[KsPpILProgramsElements.CreateProgram])}
          >
            <Button
              className={cx("create-program-button")}
              onClick={() =>
                handleOpenModalForCreatingAndReplacingProgram(ModalTypes.creation)
              }
              icon={<PlusCircleFilled />}
              type="link"
            >
              Создать программу
            </Button>
          </Can>

          <ProgramTable
            openProgramReplacementModal={
              handleOpenModalForCreatingAndReplacingProgram
            }
          />

          <Pagination
            className={cx("pagination")}
            current={pageInfo.pageNumber}
            pageSize={pageInfo.pageSize}
            total={pageInfo.totalItems}
            onChange={handleChangePagination}
            disabled={isKsPpILProgramListLoading}
            size="small"
          />
        </div>
      </div>

      <ModalForCreatingAndReplacingProgram
        isVisible={modalForCreatingAndReplacingProgramConfig.visible}
        onCancel={handleOpenModalForCreatingAndReplacingProgram}
        modalType={modalForCreatingAndReplacingProgramConfig.type}
        programId={modalForCreatingAndReplacingProgramConfig.id}
      />
    </Spin>
  );
};
