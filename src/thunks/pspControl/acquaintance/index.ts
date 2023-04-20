import { createAsyncThunk } from "@reduxjs/toolkit";
import update from "immutability-helper";
import { message } from "antd";
import moment, { isMoment } from "moment";

import { IdType } from "types";
import {
  AcquaintanceModelDto,
  AcquaintancePagedModel,
  AcquaintanceVerificationActResponse,
} from "api/requests/pspControl/acquaintance/types";
import { ThunkApi } from "../../types";
import * as API from "api/requests/pspControl/acquaintance";
import { ListFilterBase, SelectedNode } from "../../../interfaces";
import { IGenericFilterConfig } from "components/CustomFilter/interfaces";
import { AcquaintanceCreateModel } from "./contract";
import { partiallyReset } from "components/ModalCustomFilter/helpers";
import { setAppliedFilter } from "slices/pspControl/acquaintance";

export const getAcquaintanceItemsThunk = createAsyncThunk<
  { page: AcquaintancePagedModel; filter: ListFilterBase },
  ListFilterBase,
  ThunkApi
>("acquaintance/getAcquaintanceItemsThunk", async (appliedFilter, thunkApi) => {
  const { rejectWithValue } = thunkApi;
  try {
    const page = await API.getAcquaintanceItemsByFilter(appliedFilter);
    return { page, filter: appliedFilter };
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });

    return rejectWithValue(error.message);
  }
});

export const getAcquaintanceFilterDescriptionThunk = createAsyncThunk<
  IGenericFilterConfig,
  void,
  ThunkApi
>("acquaintance/getAcquaintanceFilterDescriptionThunk", async (_, thunkApi) => {
  const { rejectWithValue } = thunkApi;
  try {
    return await API.getAcquaintanceFilterDescription();
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });

    return rejectWithValue(error.message);
  }
});

export const getAcquaintanceItemsByAppliedFilterThunk = createAsyncThunk<
  { filter: ListFilterBase; page: AcquaintancePagedModel },
  ListFilterBase | undefined | void,
  ThunkApi
>(
  "acquaintance/getAcquaintanceItemsByAppliedFilterThunk",
  async (filter, thunkApi) => {
    const { getState, rejectWithValue } = thunkApi;

    try {
      const appliedFilter = filter || getState().acquaintance.appliedFilter;

      const page = await API.getAcquaintanceItemsByFilter(appliedFilter);

      return { page, filter: appliedFilter };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });

      return rejectWithValue(error.message);
    }
  }
);

export const getAcquaintanceItemsBySelectedTreeFilterItemThunk = createAsyncThunk<
  {
    selectedNode: SelectedNode;
  },
  SelectedNode,
  ThunkApi
>(
  "acquaintance/getAcquaintanceItemsBySelectedTreeFilterItemThunk",
  async (selectedNode, thunkApi) => {
    const { getState, rejectWithValue } = thunkApi;


    try {
      const baseFilter: ListFilterBase = getState().acquaintance.appliedFilter;

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
            },
          }),
        pageIndex: { $set: 1 },
      });

      thunkApi.dispatch(setAppliedFilter(filter))
      return { selectedNode };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });

      return rejectWithValue(error.message);
    }
  }
);

export const setAcquaintanceThunk = createAsyncThunk<
  AcquaintanceModelDto,
  AcquaintanceCreateModel,
  ThunkApi
>("acquaintance/setAcquaintanceThunk", async (model, thunkApi) => {
  const { rejectWithValue } = thunkApi;
  try {
    const prepared = {
      ...model,
      createdOn: isMoment(model.createdOn)
        ? model.createdOn.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)
        : model.createdOn,
    };
    return await API.setAcquaintance(prepared);
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });

    return rejectWithValue(error.message);
  }
});

export const getAcquaintanceVerificationActThunk = createAsyncThunk<
  AcquaintanceVerificationActResponse,
  IdType,
  ThunkApi
>("acquaintance/getAcquaintanceVerificationActThunk", async (id, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    return await API.getAcquaintanceVerificationActByActId(id);
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });

    return rejectWithValue(error.message);
  }
});
