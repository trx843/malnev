export const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export const urlsValidator = (rule, value: string[]) => {
  if (value.length) return Promise.resolve();

  return Promise.reject(new Error("Поле обязательно к заполнению!"));
};
