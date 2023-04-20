import { message } from "antd";
import axios from "axios";
import { IGenericFilterConfig } from "../../components/CustomFilter/interfaces";
import { ListFilterBase } from "../../interfaces";
import { apiRoutes } from "../../api/api-routes";
import { getErrorMessage } from "../../utils";

export const getFilter = async (
  baseUrl: string
): Promise<IGenericFilterConfig | void> => {
  try {
    const url = apiRoutes.checkingObjects.filterDescription();
    const response = await axios.get<IGenericFilterConfig>(url);
    return response.data;
  } catch (error) {
    message.error({
      content: error,
      duration: 2
    });
  }
};

export const getFilterValues = async (
  filterName: string,
  controller: string,
  filterData: ListFilterBase
): Promise<any> => {
  try {
    const url = apiRoutes.checkingObjects.filteredValues({
      filterName,
      controller
    });
    const response = await axios.put<Array<string>>(url, filterData);
    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2
    });
  }
};
