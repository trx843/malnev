import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { ThunkApi } from "../types";
import { apiBase } from "../../utils";
import { ApiRoutes } from "../../api/api-routes.enum";
import {
  InfoRequestModel,
  IOstRnuInfoModel,
} from "../../slices/ostRnuInfo/types";
import { mapOstRnuInfo } from "./utils";
import { setIsOstRnuInfoLoading, setOstRnuInfo } from "../../slices/ostRnuInfo";

export const getOstRnuInfoThunk = createAsyncThunk<
  void,
  InfoRequestModel,
  ThunkApi
>("ostRnuInfo/getOstRnuInfoThunk", async (params, thunkApi) => {
  const { dispatch } = thunkApi;

  try {
    const url = `${apiBase}${ApiRoutes.CheckingObjects}/info`;

    dispatch(setIsOstRnuInfoLoading(true));
    const response = await axios.post<IOstRnuInfoModel>(url, params);
    dispatch(setIsOstRnuInfoLoading(false));

    if (response.data) {
      const data = mapOstRnuInfo(response.data);
      dispatch(setOstRnuInfo(data));
    }
  } catch (error) {
    dispatch(setIsOstRnuInfoLoading(false));

    message.error({
      content: error?.response?.data?.message ?? "Неизвестная ошибка",
      duration: 2,
    });
  }
});
