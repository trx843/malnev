import { ApiRoutes } from "api/api-routes.enum";
import axios from "axios";
import { apiBase } from "../../../../utils";
import { KsPspOptions } from "./type";

export const getProgramKsPspTypeOptionsRequest = async (): Promise<KsPspOptions> => {
  const url = `${apiBase}${ApiRoutes.ProgramKspp}/programKsPspType`;
  const { data } = await axios.get<KsPspOptions>(url);

  return data;
};
