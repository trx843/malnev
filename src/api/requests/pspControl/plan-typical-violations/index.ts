import axios from "axios";
import {
  AddActionPlanDtoType,
  IIdentifiedViolation,
  TypicalPlanCardDtoType,
  TypicalPlanCardFilterDto,
  TypicalPlanCardFilterEntitiesDto,
  TypicalPlanFilterParamsDto,
} from "./dto-types";
import { apiBase, asciiToUint8Array, getErrorMessage } from "../../../../utils";
import { ApiRoutes } from "../../../api-routes.enum";
import { TypicalActionPlanParams } from "./contracts";
import {
  IIdentifiedViolationsListModel,
  ITypicalViolationSortedModel,
  IViolationListModel,
  TypicalPlanListFilter,
} from "slices/pspControl/actionPlanTypicalViolations/types";
import { message } from "antd";
import { ICustomAttrFilterConfig, PagedModel } from "types";

export const getViolationsRequest = async (
  planId: string | undefined,
  listFilter: TypicalPlanListFilter
): Promise<TypicalPlanCardFilterDto> => {
  const { data } = await axios.put(
    `${apiBase}${ApiRoutes.TypicalPlan}/typicalPlanCard/${planId}/filter`,
    listFilter
  );

  return data;
};

export const getTypicalPlanPageRequest =
  async (): Promise<TypicalPlanCardDtoType> => {
    const { data } = await axios.get(`${apiBase}${ApiRoutes.TypicalPlan}/typicalPlanCard`);

    return data;
  };

export const addActionPlanRequest = async (
  {
    planId,
    ...params
  }: AddActionPlanDtoType & {
    planId: string;
  },
  id: string
): Promise<TypicalActionPlanParams> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.Plan}/${planId}/actionPlan/${id}/typicalViolation`,
    params
  );

  return data;
};

export const updateActionPlanRequest = async ({
  ...params
}: AddActionPlanDtoType): Promise<string> => {
  const { data } = await axios.put(
    `${apiBase}${ApiRoutes.Plan}/actionPlan/${params.id}`,
    params
  );

  return data;
};

export const removeActionPlanRequest = async (id: string) => {
  const response = await axios.delete(
    `${apiBase}${ApiRoutes.Plan}/actionPlan/${id}`
  );

  return response;
};

export const setMainAttachmentRequest = async (id: string): Promise<void> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.Plan}/file/${id}/main`
  );

  return data;
};

// сортировка
export const sortTypicalViolationsRequest = async (
  serials: {
    id: string;
    newSerial: number;
    violationText: string;
    pointNormativeDocuments: string;
  }[],
  id: string
): Promise<TypicalPlanCardDtoType> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.Plan}/${id}/typicalViolation/sort`,
    serials
  );

  return data;
};

// получить журнал нарушений в модалке с фильтрацией
export const getIdentifiedViolations = async (listFilter) => {
  try {
    const url = `${apiBase}/pspcontrol/filters/identifiedViolations/filter`;

    const response = await axios.put<
      PagedModel<IIdentifiedViolationsListModel>
    >(url, listFilter);
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

export const sortTypicalViolations = async (
  orderedTypicalViolations: ITypicalViolationSortedModel[],
  typicalPlanId: string
): Promise<void> => {
  try {
    const response = await axios.post(
      `${apiBase}${ApiRoutes.TypicalPlan}/${typicalPlanId}/typicalViolation/sort`,
      orderedTypicalViolations
    );

    if (response.status === 200) {
      message.success({
        content: "Порядок успешно изменен",
        duration: 2,
      });
    }
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

export const typicalPlanEditing = async (planId: string, planName: string) => {
  try {
    await axios.put(
      `${apiBase}${ApiRoutes.TypicalPlan}/${planId}/editing`,
      planName,
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

export const typicalPlanChangeName = async (
  planId: string,
  planName: string
) => {
  try {
    await axios.put(
      `${apiBase}${ApiRoutes.TypicalPlan}/${planId}/planName`,
      planName,
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

// получить журнал нарушений в модалке с фильтрацией
export const getViolations = async (listFilter) => {
  try {
    const url = `${apiBase}/pspcontrol/filters/identifiedViolations/filter`;

    const response = await axios.put<
      PagedModel<IIdentifiedViolationsListModel>
    >(url, listFilter);

    const entities = response.data.entities;

    return entities;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// получить модель фильтра модалки нарушений
export const getFilterDescriptionSchedule = async () => {
  try {
    const url = `${apiBase}${ApiRoutes.VerificationActs}${ApiRoutes.GetFilter}/identifiedViolation`;

    const response = await axios.get<ICustomAttrFilterConfig>(url);

    const filterList = response.data.filterList;

    return filterList;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// получить модель фильтра модалки нарушений
export const getIdentifiedViolation = async (violationId: string) => {
  try {
    const url = `${apiBase}/pspcontrol/filters/typicalViolations/${violationId}`;

    const response = await axios.get<IIdentifiedViolation>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return null;
  }
};

export const createIdentifiedTypicalViolation = async (
  planId: string,
  identifiedTypicalViolation
) => {
  try {
    const url = `${apiBase}${ApiRoutes.TypicalPlan}/${planId}/identifiedTypicalViolation`;

    const response = await axios.post(url, identifiedTypicalViolation);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

export const editIdentifiedTypicalViolation = async (
  id: string,
  identifiedTypicalViolation
) => {
  try {
    const url = `${apiBase}${ApiRoutes.TypicalPlan}/identifiedTypicalViolation/${id}`;

    const response = await axios.put(url, identifiedTypicalViolation);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

export const removeIdentifiedTypicalViolation = async (
  id: string,
) => {
  try {
    const url = `${apiBase}${ApiRoutes.TypicalPlan}/identifiedTypicalViolation/${id}`;

    const response = await axios.delete(url);
    console.log(response.data)
    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

export const exportToExcelTypical = async (
  name: string
) => {
  // if (!id) return;

  const url = `${apiBase}${ApiRoutes.TypicalPlan}/typicalPlanCard/exportToExcel?name=${name}&isOriginalFormat=${true}`;
  let fileName: string = "download.xls";
  let error: string = "Ошибка серверной части";
  // Запрос
  let response = await fetch(url, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Формирование имени файла
  if (response.ok) {
    let fileNameHeader = response.headers.get("FileName");
    if (fileNameHeader !== null && fileNameHeader !== undefined) {
      let headerSplit = fileNameHeader.split(";");
      if (headerSplit.length > 0) {
        let asciiFile = headerSplit[0];
        let code = asciiToUint8Array(asciiFile);
        fileName = new TextDecoder().decode(code);
      }
    }

    // Выгрузка файла
    let blob = await response.blob();
    const href = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  } else {
    let errorHeader = response.headers.get("Error");
    if (errorHeader !== null && errorHeader !== undefined) {
      let headerSplit = errorHeader.split(";");
      if (headerSplit.length > 0) {
        let asciiFile = headerSplit[0];
        let code = asciiToUint8Array(asciiFile);
        error = new TextDecoder().decode(code);
      }
    }
    return message.error({
      content: error,
      duration: 4,
    });
  }
};


// Получние максимального номера типовых нарушений
export const getMaxViolationsSerial = async (isIL : boolean) => {
  try {
    const url = `${apiBase}${ApiRoutes.TypicalPlan}/typicalPlanCard/maxViolationsSerial?isIL=${isIL}`;

    const response = await axios.get<number>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};