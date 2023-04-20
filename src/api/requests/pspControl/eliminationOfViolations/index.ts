import axios from "axios";
import { message } from "antd";
import { ApiRoutes } from "api/api-routes.enum";
import { apiBase, getErrorMessage } from "../../../../utils";

// Получение даты
export const getEliminationTermPost = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.Elimination}/${id}/eliminationTermPost`;
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return null;
  }
};
