import axios from "axios";
import { ApiRoutes } from "api/api-routes.enum";
import { apiBase, getErrorMessage } from "../../../../utils";
import { IDictionary } from "types";
import { message } from "antd";

//  Выборка всех организаций
export const getAllOrganizations = async (): Promise<any> => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/organizations`;
    const response = await axios.get<IDictionary[]>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};


//  Выборка всех ФИО
export const getFullNames = async (): Promise<IDictionary[]> => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/fullnames`;
    const response = await axios.get<IDictionary[]>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// Добавить ФИО
export const addFullName = async (fullName: string): Promise<void> => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/fullname?fullname=${fullName}`;
    const response = await axios.post(url);

    if (response.status === 200) {
      message.success({
        content: "ФИО добавлена успешно",
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

// Удалить ФИО
export const deleteFullName = async (id: string): Promise<void> => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/fullname/${id}`;
    const response = await axios.delete(url);

    if (response.status === 200) {
      message.success({
        content: "ФИО удалена успешно",
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

// Выборка всех должностей
export const getJobTitles = async (): Promise<IDictionary[]> => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/jobTitles`;
    const response = await axios.get<IDictionary[]>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// Добавить должность
export const addJobTitle = async (jobTitle: string): Promise<void> => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/jobTitle?jobTitle=${jobTitle}`;
    const response = await axios.post(url);

    if (response.status === 200) {
      message.success({
        content: "Должность добавлена успешно",
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

// Удалить должность
export const deleteJobTitle = async (id: string): Promise<void> => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/jobTitle/${id}`;
    const response = await axios.delete(url);

    if (response.status === 200) {
      message.success({
        content: "Должность удалена успешно",
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

// Справочник уровней проверки
export const getDictionaryVerificationLevels = async () => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/verificationLevel`;
    const response = await axios.get<IDictionary[]>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// Справочник годов проверки
export const getDictionaryVerificationYears = async () => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/verificationYear`;
    const response = await axios.get<IDictionary[]>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// Справочник ОСТ
export const getDictionaryOstList = async () => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/ostList`;
    const response = await axios.get<IDictionary[]>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

// Справочник ПСП
export const getDictionaryPspList = async (ostId: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.Dictionaries}/pspList`;
    const response = await axios.get<IDictionary[]>(url, { params: { ostId } });

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};
