import { ApiRoutes } from "./api-routes.enum";
import { apiBase } from "../utils";

class ApiRoutesPageByFilter {
  baseUrl: string;
  private apiBase: string;

  constructor(baseUrl: string) {
    this.baseUrl = `${apiBase}${baseUrl}`;
    this.apiBase = apiBase;
  }

  pageByFilter() {
    return `${this.baseUrl}/filter/`;
  }

  filterDescription() {
    return `${this.baseUrl}/${ApiRoutes.GetFilter}`;
  }

  filteredValues({
    controller,
    filterName
  }: {
    filterName: string;
    controller: string;
  }) {
    return `${this.apiBase}/${controller}${ApiRoutes.GetFilteredValues}?filterName=${filterName}`;
  }
}

export const apiRoutes = {
  verificationActs: new ApiRoutesPageByFilter(ApiRoutes.VerificationActs),
  checkingObjects: new ApiRoutesPageByFilter(ApiRoutes.CheckingObjects)
};
