import { createAsyncThunk } from "@reduxjs/toolkit";
import update from "immutability-helper";
import { message } from "antd";
import axios from "axios";
import { history } from "../../history/history";
import { PagedModel } from "../../types";
import { VerificationItem } from "../../components/VerificationActs/classes";
import { ThunkApi } from "../types";
import {
  seIisCreatingPlan,
  setAppliedFilter,
  setCustomFilterConfig,
  setSelectedTreeNode,
  setVerificationActsPending,
  setVerificationPage,
} from "../../slices/verificationActs/verificationActs";
import { ListFilterBase, SelectedNode } from "../../interfaces";
import { IGenericFilterConfig } from "../../components/CustomFilter/interfaces";
import { partiallyReset } from "../../components/ModalCustomFilter/helpers";
import { apiRoutes } from "../../api/api-routes";
import { deleteVerificationActRequest } from "../../api/requests/verificationActs";
import { ApiRoutes } from "../../api/api-routes.enum";
import { apiBase, getErrorMessage } from "../../utils";

export const getVerificationActsPage = createAsyncThunk<
  PagedModel<VerificationItem> | void,
  { page?: number } | undefined,
  ThunkApi
>("verificationActs/getVerificationActsItems", async (params, thunkApi) => {
  const { getState, dispatch } = thunkApi;

  try {
    const url = apiRoutes.verificationActs.pageByFilter();
    const filter = getState().verificationActs.appliedFilter;

    const response = await axios.put<PagedModel<VerificationItem>>(url, filter);
    if (response.data) {
      dispatch(setVerificationPage(response.data));
    }
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });
  }
});

export const getVerificationActBySelectedTreeThunk = createAsyncThunk<
  PagedModel<VerificationItem>[] | void,
  SelectedNode,
  ThunkApi
>(
  "verificationActs/getVerificationActBySelectedTreeThunk",
  async (selectedNode, thunkApi) => {
    const { getState, dispatch } = thunkApi;

    dispatch(setVerificationActsPending(true));
    dispatch(setSelectedTreeNode(selectedNode));

    const baseFilter: ListFilterBase =
      getState().verificationActs.appliedFilter;
    const newFilter = partiallyReset(
      getState().verificationActs.filterConfig,
      baseFilter,
      "isDependsTree"
    );
    const filter = update(baseFilter, {
      filter: (values) =>
        update(values, {
          $set: {
            ...newFilter,
            filterModel: baseFilter.filter.filterModel ?? {},
            treeFilter: {
              nodePath: selectedNode.key,
              isOwn: values.treeFilter.isOwn,
            },
            hasNotClassified: baseFilter.filter.hasNotClassified,
          },
        }),
      pageIndex: { $set: 1 },
    });
    dispatch(setAppliedFilter(filter));
  }
);

export const getVerificationActsFilter = createAsyncThunk<
  IGenericFilterConfig | void,
  void,
  ThunkApi
>("verificationActs/getVerificationActsFilter", async (_, thunkApi) => {
  const { dispatch } = thunkApi;

  try {
    const url = apiRoutes.verificationActs.filterDescription();
    const response = await axios.get<IGenericFilterConfig>(url);
    if (response.data) {
      dispatch(setCustomFilterConfig(response.data));
    }
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });
  }
});

export const getFilterValues = async (
  filterName: string,
  controller: string,
  filterData: ListFilterBase
): Promise<any> => {
  try {
    const url = apiRoutes.verificationActs.filteredValues({
      controller,
      filterName,
    });
    const response = await axios.put<Array<string>>(url, filterData);
    return response.data;
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });
  }
};

export const deleteVerificationActThunk = createAsyncThunk<
  string,
  string,
  ThunkApi
>("verificationActs/deleteVerificationActThunk", async (id, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    await deleteVerificationActRequest({ id });
    return id;
  } catch (error) {
    return rejectWithValue({ id });
  }
});

// создание нового плана
export const createPlan = createAsyncThunk<void, string, ThunkApi>(
  "verificationActs/createPlanThunk",
  async (actId, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.Plan}`;

      dispatch(seIisCreatingPlan(true));
      const response = await axios.post(url, {
        VerificationActId: actId,
        Status: 1,
      });
      dispatch(seIisCreatingPlan(false));

      if (response.data) {
        message.success({
          content: "План успешно создан",
          duration: 2,
        });

        history.push(`/pspcontrol/action-plans/cards/${response.data}`);
      }
    } catch (error) {
      dispatch(seIisCreatingPlan(false));

      message.error({
        content: getErrorMessage(error),
        duration: 2,
      });
    }
  }
);
