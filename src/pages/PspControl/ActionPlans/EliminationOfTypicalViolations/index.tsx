import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import { Breadcrumb, Spin, Tabs } from "antd";
import { AreasOfResponsibility, TabPanes } from "./constants";
import {
  ActionPlanTypicalViolationsStore,
  ITypicalViolationsForPlanCardWithActionPlanModel,
} from "slices/pspControl/actionPlanTypicalViolations/types";
import {
  getTypicalPlanPageThunk,
  getViolationsByAreaOfResponsibilityThunk,
} from "thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { Nullable, StateType } from "types";
import { Operations } from "./components/Operations";
import { BasicInformation } from "./components/BasicInformation";
import { AcceptancePointsForOilAndOilProducts } from "./components/AcceptancePointsForOilAndOilProducts";
import { TestingLaboratoriesForOilAndOilProducts } from "./components/TestingLaboratoriesForOilAndOilProducts";
import { ModalPlanEditing } from "./components/ModalPlanEditing";
import {
  IModalForAddingOrEditingEventInfo,
  IModalPlanEditingInfo,
  ISortingViolationsModalInfo,
  IViolationEditingModalInfo,
} from "./types";


import { IFormValues } from "./components/ModalPlanEditing/types";
import { ViolationEditingModal } from "./components/ViolationEditingModal";
import { ModalForAddingViolation } from "./components/ModalForAddingViolation";
import { SortingViolationsModal } from "./components/SortingViolationsModal";
import { ITypicalViolationValues } from "components/ModalForAddingOrEditingEvent/types";
import { ModalForAddingOrEditingEvent } from "components/ModalForAddingOrEditingEvent";
import {
  TargetFormNames,
} from "components/ModalForAddingOrEditingEvent/constants";
import styles from "./eliminationOfTypicalViolations.module.css";
import { ModalModes } from "enums";
import { Matchings } from "./components/Matchings";
import { ModalProvider } from "components/ModalProvider";
import { AreaOfResponsibilityValues } from "./components/ViolationEditingModal/constants";
import { getMaxViolationsSerial } from "api/requests/pspControl/plan-typical-violations";

const { TabPane } = Tabs;

const cx = classNames.bind(styles);

const routes = [
  {
    path: "/pspcontrol/action-plans",
    name: "Планы мероприятий",
  },
];

const breadcrumbItems = routes.map((route) => {
  if (!route.path) {
    return <Breadcrumb.Item key={route.name}>{route.name}</Breadcrumb.Item>;
  }

  return (
    <Breadcrumb.Item key={route.name}>
      <Link to={route.path}>{route.name}</Link>
    </Breadcrumb.Item>
  );
});

export const EliminationOfTypicalViolations: React.FC = () => {
  const dispatch = useDispatch();

  const {
    typicalPlanCard,
    isViolationsByAreaOfResponsibilityLoading,
    isTypicalPlanCardLoading,
    isIL,
  } = useSelector<StateType, ActionPlanTypicalViolationsStore>(
    (state) => state.actionPlanTypicalViolations
  );

  const planId = typicalPlanCard?.id;

  React.useEffect(() => {
    dispatch(getTypicalPlanPageThunk());
  }, []);

  const [activeTabKey, setActiveTabKey] = React.useState<string>(
    AreasOfResponsibility.AcceptancePointsForOilAndPetroleumProducts
  );

  const [addViolationsModalVisible, setAddViolationsModalVisibility] =
    React.useState(false);

  const toggleAddViolationsModalVisibility = () =>
    setAddViolationsModalVisibility(!addViolationsModalVisible);

  const [modalPlanEditingInfo, setModalPlanEditingInfo] =
    React.useState<IModalPlanEditingInfo>({
      payload: null,
      visible: false,
      mode: ModalModes.none,
    });

  const handleChangeModalPlanEditingInfo = (
    payload: Nullable<IFormValues>,
    mode: ModalModes
  ) => {
    setModalPlanEditingInfo({
      payload,
      visible: !modalPlanEditingInfo.visible,
      mode,
    });
  };

  const [violationEditingModalInfo, setViolationEditingModalInfo] =
    React.useState<IViolationEditingModalInfo>({
      violationId: null,
      visible: false,
      mode: ModalModes.none,
      violationValues: null,
    });

  const violationIdHandler = useCallback(async () => {
    const id = await getMaxViolationsSerial(isIL);
    return id;
  }, [
    isIL,
  ]);

  const handleViolationEditingModalInfo = async (
    violationId: Nullable<string>,
    mode: ModalModes,
    violationValues
  ) => {
    setViolationEditingModalInfo({
      violationId,
      visible: !violationEditingModalInfo.visible,
      mode,
      violationValues: {
        ...violationValues,
        siknLabRsuTypeId: isIL
          ? AreaOfResponsibilityValues.TestingLaboratoriesOfOilAndPetroleumProducts
          : AreaOfResponsibilityValues.AcceptancePointsForOilAndPetroleumProducts,
        identifiedViolationSerial: await violationIdHandler(),
      },
    });
  };

  const [sortingViolationsModalInfo, setSortingViolationsModalInfo] =
    React.useState<ISortingViolationsModalInfo>({
      payload: [],
      visible: false,
    });

  const handleSetSortingViolationsModalInfo = (
    payload: ITypicalViolationsForPlanCardWithActionPlanModel[] = []
  ) => {
    setSortingViolationsModalInfo({
      payload,
      visible: !sortingViolationsModalInfo.visible,
    });
  };

  const [
    modalForAddingOrEditingEventInfo,
    setModalForAddingOrEditingEventInfo,
  ] = React.useState<IModalForAddingOrEditingEventInfo>({
    payload: null,
    visible: false,
    type: ModalModes.none,
  });

  const handleSetModalForAddingOrEditingEventInfo = (
    payload: Nullable<ITypicalViolationValues> = null,
    type: ModalModes = ModalModes.none
  ) => {
    setModalForAddingOrEditingEventInfo({
      payload,
      visible: !modalForAddingOrEditingEventInfo.visible,
      type,
    });
  };

  const fetchViolationsByAreaOfResponsibility = (
    areasOfResponsibility?: AreasOfResponsibility
  ) => {
    if (areasOfResponsibility) setActiveTabKey(areasOfResponsibility);
    dispatch(
      getViolationsByAreaOfResponsibilityThunk(
        areasOfResponsibility || activeTabKey
      )
    );
  };

  return (
    <Spin
      wrapperClassName={cx("spin")}
      spinning={
        isViolationsByAreaOfResponsibilityLoading || isTypicalPlanCardLoading
      }
    >
      <div className={cx("container")}>
        <Breadcrumb separator=">">{breadcrumbItems}</Breadcrumb>
        <div className={cx("title-wrapper")}>
          <h3 className={cx("title")}>{typicalPlanCard?.planName ?? "Н/д"}</h3>
          <h4 className={cx("title")}>
            {typicalPlanCard?.planStatus ?? "Н/д"}
          </h4>
        </div>

        <Tabs
          className={cx("tab")}
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
          tabBarExtraContent={
            <Operations handleEditPlan={handleChangeModalPlanEditingInfo} />
          }
          destroyInactiveTabPane
        >
          <BasicInformation
            handleChangePlanName={handleChangeModalPlanEditingInfo}
          />

          <TabPane
            tab={TabPanes.AcceptancePointsForOilAndOilProducts}
            key={
              AreasOfResponsibility.AcceptancePointsForOilAndPetroleumProducts
            }
          >
            <AcceptancePointsForOilAndOilProducts
              handleOpenAddViolationsModal={toggleAddViolationsModalVisibility}
              handleViolationEditing={handleViolationEditingModalInfo}
              handleSortingViolations={handleSetSortingViolationsModalInfo}
              handleAddingOrEditingEvent={
                handleSetModalForAddingOrEditingEventInfo
              }
            />
          </TabPane>
          <TabPane
            tab={TabPanes.TestingLaboratoriesForOilAndOilProducts}
            key={
              AreasOfResponsibility.TestingLaboratoriesOfOilAndPetroleumProducts
            }
          >
            <TestingLaboratoriesForOilAndOilProducts
              handleOpenAddViolationsModal={toggleAddViolationsModalVisibility}
              handleViolationEditing={handleViolationEditingModalInfo}
              handleSortingViolations={handleSetSortingViolationsModalInfo}
              handleAddingOrEditingEvent={
                handleSetModalForAddingOrEditingEventInfo
              }
            />
          </TabPane>
          <TabPane
            tab={TabPanes.Matchings}
            key={
              AreasOfResponsibility.Matchings
            }
          >
            <ModalProvider>
              <Matchings />
            </ModalProvider>
          </TabPane>
        </Tabs>
      </div>

      <ModalPlanEditing
        isVisible={modalPlanEditingInfo.visible}
        onCancel={handleChangeModalPlanEditingInfo}
        planId={planId}
        mode={modalPlanEditingInfo.mode}
        initialValues={modalPlanEditingInfo.payload}
      />

      <ModalForAddingViolation
        isVisible={addViolationsModalVisible}
        onCancel={toggleAddViolationsModalVisibility}
        onOk={handleViolationEditingModalInfo}
        isInnerCreateModalVisible={violationEditingModalInfo.visible}
      />

      <ViolationEditingModal
        isVisible={violationEditingModalInfo.visible}
        onCancel={handleViolationEditingModalInfo}
        violationId={violationEditingModalInfo.violationId}
        mode={violationEditingModalInfo.mode}
        initialValues={violationEditingModalInfo.violationValues}
        planId={planId}
        onSave={fetchViolationsByAreaOfResponsibility}
        isIL={isIL}
      />

      <SortingViolationsModal
        isVisible={sortingViolationsModalInfo.visible}
        onCancel={handleSetSortingViolationsModalInfo}
        items={sortingViolationsModalInfo.payload}
        areasOfResponsibility={activeTabKey as AreasOfResponsibility}
      />

      <ModalForAddingOrEditingEvent
        isVisible={modalForAddingOrEditingEventInfo.visible}
        onCancel={handleSetModalForAddingOrEditingEventInfo}
        mode={modalForAddingOrEditingEventInfo.type}
        planId={typicalPlanCard?.id as string}
        entityValues={modalForAddingOrEditingEventInfo.payload}
        onSubmitForm={fetchViolationsByAreaOfResponsibility}
        targetForm={TargetFormNames.EliminationOfTypicalViolations}
      />
    </Spin>
  );
};
