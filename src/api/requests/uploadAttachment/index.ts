import axios from "axios";
import { message } from "antd";
import { RcFile } from "antd/lib/upload";
import { getErrorMessage } from "utils";

// Добавление вложения
export const uploadAttachment = async (url: string, file: RcFile) => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const response = await axios.post(url, formData);

    if (response.status === 200) {
      message.success({
        content: "Файл добавлен успешно",
        duration: 2,
      });

      return true;
    }

    return false;
  } catch (error) {
    message.error({
      content: getErrorMessage(error, "Произошла ошибка при добавлении файла"),
      duration: 2,
    });

    return false;
  }
};
