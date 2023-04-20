import { message } from "antd";
import axios from "axios";
import { ApiRoutes } from "../../../api/api-routes.enum";
import { CheckingObjectsItem } from "../../../components/PspControl/CheckingObjects/classes";
import { ListFilterBase } from "../../../interfaces";
import { PagedModel } from "../../../types";
import { apiBase } from "../../../utils";

export const getCheckingObjects = async (
  filter: ListFilterBase
): Promise<PagedModel<CheckingObjectsItem> | void> => {
  try {
    const url = `${apiBase}${ApiRoutes.CheckingObjects}`;
    const response = await axios.post<PagedModel<CheckingObjectsItem>>(
      url,
      filter
    );
    return response.data;
  } catch (error) {
    message.error({
      content: error,
      duration: 2
    });
  }
};
