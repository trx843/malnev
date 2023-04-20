import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment, { Moment } from "moment";
import update from "immutability-helper";
import qs from "qs";
import {
  // getViolationsBySectionThunk,
  addActionPlanPageThunk,
  editActionPlanPageThunk,
  removeActionPlanPageThunk
} from "../../../thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { StateType } from "../../../types";
import {
  ActionTypicalPlanSectionBody,
  TypicalPlanSections
} from "../../../slices/pspControl/actionPlanTypicalViolations/types";
import { TypicalActionPlanParams } from "../../../api/requests/pspControl/plan-typical-violations/contracts";
import { useLocation } from "react-router-dom";
import { history } from "../../../history/history";
import {
  VERIFICATED_DATE_FROM,
  VERIFICATED_DATE_TO
} from "../../../slices/pspControl/actionPlanTypicalViolations/constants";

export const useTypicalPlanSectionFetch = (section: TypicalPlanSections) => {
  const location = useLocation();
  const sectionPending = useSelector<StateType, boolean>(state => {
    const planId = state.actionPlanTypicalViolations.currentId;

    return (
      state.actionPlanTypicalViolations.sectionPending[planId || ""]?.[
        section
      ] || false
    );
  });
  const sectionPage = useSelector<
    StateType,
    ActionTypicalPlanSectionBody | null
  >(state => {
    const planId = state.actionPlanTypicalViolations.currentId;

    return (
      state.actionPlanTypicalViolations.memoizePages[planId || ""]?.[section] ||
      null
    );
  });

  const dispatch = useDispatch();

  const getViolationsBySectionData = useCallback(async () => {
    const { search } = location;
    const parsed = qs.parse(search.replace("?", "")) as {
      section?: string;
      from?: string;
      to?: string;
    };

    if (!sectionPage) {
      return;
    }
    const filter = sectionPage.filter;
    const dates = {
      verificatedDateFrom: parsed?.from
        ? moment(parsed.from)
        : VERIFICATED_DATE_FROM,
      verificatedDateTo: parsed?.to ? moment(parsed.to) : VERIFICATED_DATE_TO
    };
    if (!filter) {
      return;
    }
    const updatedFilter = update(filter, {
      verificatedDateFrom: { $set: dates.verificatedDateFrom },
      verificatedDateTo: { $set: dates.verificatedDateTo }
    });
    // await dispatch(
    //   getViolationsBySectionThunk({ section, filter: updatedFilter })
    // );
  }, []);

  const addActionPlan = useCallback(
    async (values: TypicalActionPlanParams, id: string) => {
      await dispatch(addActionPlanPageThunk({ values, section, id }));
    },
    []
  );

  const editActionPlan = useCallback(
    async (values: TypicalActionPlanParams, violationsId: string) => {
      await dispatch(
        editActionPlanPageThunk({ values, violationsId, section })
      );
    },
    []
  );

  const removeActionPlan = useCallback(
    async ({ id, violationsId }: { id: string; violationsId: string }) => {
      // await dispatch(removeActionPlanPageThunk({ id, violationsId, section }));
    },
    []
  );

  const getViolationsByFilterData = useCallback(
    async (values: { to: Moment; from: Moment }) => {
      if (!sectionPage) {
        return;
      }
      const filter = sectionPage.filter;
      if (!filter) {
        return;
      }
      const updatedFilter = update(filter, {
        verificatedDateFrom: { $set: values.from },
        verificatedDateTo: { $set: values.to }
      });
      const { search, pathname } = location;
      const parsed = qs.parse(search.replace("?", ""));

      const formatedTo = values.to.format(
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
      );
      const formatedFrom = values.from.format(
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
      );

      history.push({
        pathname,
        search: qs.stringify({ ...parsed, from: formatedFrom, to: formatedTo })
      });

      // await dispatch(
      //   getViolationsBySectionThunk({ section, filter: updatedFilter })
      // );
    },
    []
  );

  const changePageViolations = useCallback(async (page: number) => {
    if (!sectionPage) {
      return;
    }
    const pageInfo = sectionPage.pageInfo;
    const filter = sectionPage.filter;
    if (!pageInfo || !filter) {
      return;
    }
    const updatedPageInfo = update(pageInfo, {
      pageNumber: { $set: page }
    });
    const updatedFilter = update(filter, {
      pageIndex: { $set: page }
    });
    // await dispatch(
    //   getViolationsBySectionThunk({
    //     section,
    //     pageInfo: updatedPageInfo,
    //     filter: updatedFilter
    //   })
    // );
  }, []);

  useEffect(() => {
    getViolationsBySectionData();
  }, [getViolationsBySectionData]);

  return {
    sectionPending,
    sectionPage,
    getViolationsByFilterData,
    addActionPlan,
    editActionPlan,
    removeActionPlan,
    changePageViolations,
    getViolationsBySectionData
  };
};
